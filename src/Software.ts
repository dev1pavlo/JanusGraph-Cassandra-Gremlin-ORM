import GremlinModel from "./Gremlin";

interface IUserAttributes {
    name: string;
}

export class SoftwareModel extends GremlinModel<IUserAttributes> {
    label = 'software'
}

export default new SoftwareModel();