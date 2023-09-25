import Software from "./Software";
import UserModel from "./User";

(async () => {
  const softwares = await Software.getAll();
  const users = await UserModel.getAll();

  // await UserModel.addRelation(8416, 4312, 'bought')
  const relations = await UserModel.getOutRelations(8416, 'bought');

})()