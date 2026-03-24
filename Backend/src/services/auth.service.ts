import UserModel from "../modles/user.model";
import { NotFoundException, UnauthorizedException } from "../utils/app-error";
import { LoginSchema, RegisterSchema } from "../vaildators/auth.vaildator";


export const registerService = async (body: RegisterSchema) => {
    const { name, email, password, avatar } = body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) throw new UnauthorizedException("User already exists");

    const newUser = new UserModel({...body});
    await newUser.save();
    return newUser;
}

export const loginService = async (body: LoginSchema) => {
    const { email, password } = body;
    const user = await UserModel.findOne({ email });
    if (!user) throw new NotFoundException("Email or password is incorrect");

    const isPasswordVaild = await user.comparePassword(password);
    if (!isPasswordVaild) throw new UnauthorizedException("Email or password is incorrect");

    return user;
}