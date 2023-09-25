import GremlinModel from "./Gremlin";

interface IUserAttributes {
    name: string;
    age: number;
    height: number;
    isStudent: boolean
    birthdate: Date;
    languages: string
    address: string
}

export class UserModel extends GremlinModel<IUserAttributes> {
    label = 'person'
}

export default new UserModel();