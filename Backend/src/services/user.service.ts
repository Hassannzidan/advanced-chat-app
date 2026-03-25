import UserModel from "../modles/user.model";

export const findByIdService = async (userId: string) => {
    return await UserModel.findById(userId);
}

export const getUsersService = async (userId: string) => {
  const users = await UserModel.find({ _id: { $ne: userId } })
  .select("-password");
  
  return users;
}