import { Types } from "mongoose";
import { UserDocument } from "../modles/user.model";

declare global {
    namespace Express {
        interface User extends UserDocument {
            _id: Types.ObjectId;
        }
    }
}

export {};