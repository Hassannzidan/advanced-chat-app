import UserModel from "../modles/user.model";

export const findByIdService = async (userId: string) => {
    return await UserModel.findById(userId);
}