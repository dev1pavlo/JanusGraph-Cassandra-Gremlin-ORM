import gremlin from "gremlin";
const traversal = gremlin.process.AnonymousTraversalSource.traversal;
const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;

interface BaseModel {
    id: number;
    label: string;
}

class GremlinModel<AttributesModel extends Record<string, any>, Model = AttributesModel & BaseModel> {
    // To run queries
    protected g = traversal().withRemote(
        new DriverRemoteConnection("ws://localhost:8182/gremlin")
    );

    // Label to be replaces in extended models
    protected label: string = '';

    // Receives an id of entity and returns in attributes
    private async getAttributesById(id: number): Promise<AttributesModel> {
        const values = await this.g.V(id).hasLabel(this.label).valueMap().next();
        const value = values.value as Map<keyof AttributesModel, any>;
        return this.extractAttributes(value);
    }

    // Data from gremlin is Map<>. This function transorms it into object
    private extractAttributes(value: Map<keyof AttributesModel, any>) {
        return Array.from(value.entries()).reduce(
            (prev, curr) => {
                const [key, value] = curr;
                return { ...prev, [key]: value }
            },
            {}
        ) as AttributesModel;
    }

    // Get all entities by label from DB
    public async getAll(): Promise<Model[]> {
        const query = this.g.V().hasLabel(this.label);
        const ids = await query.id().toList() as number[];

        const result: Model[] = [];
        for (let i = 0; i < ids.length; i++) {
            const base: BaseModel = {
                id: ids[i],
                label: this.label
            }
            const attributes: AttributesModel = await this.getAttributesById(ids[i]);
            result.push({
                ...base,
                ...attributes
            } as any);
        }

        return result;
    }

    // Get entity by id from DB
    public async getById(id: number): Promise<Model> {
        const data = await this.g.V(id).hasLabel(this.label).valueMap().next();

        return {
            id,
            label: this.label,
            ...this.extractAttributes(data.value)
        } as any
    }

    // Creates new entity to DB
    // Attention: Objects and Arrays are not allowed, so we have to use JSON.stringify before using it
    public async create(properties: AttributesModel): Promise<void> {
        const entity = this.g.addV(this.label);

        for (let key in properties) {
            entity.property(key, properties[key]);
        }

        entity.next();
    }

    // Creates a relation between 2 vertexes in DB
    public async addRelation(fromId: number, toId: number, relation: string): Promise<void> {
        await this.g
            .V(fromId)
            .as('a')
            .V(toId)
            .as('b')
            .addE(relation)
            .from_('a')
            .to('b')
            .next();
    }

    // Get all OUT relations from vertex in DB by id and (optional) relation name
    async getOutRelations(id: number, relation?: string) {
        const query = this.g.V(id).outE();

        if (relation) {
            query.hasLabel(relation);
        }

        return query.toList();
    }
}

export default GremlinModel;