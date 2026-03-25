import mongoose from "mongoose";
import { envConfig } from "./env.config";

export const connectDatabase = async () => {
        try {
            await mongoose.connect(envConfig.MONGO_URI);
            console.log("Connected to database");
        } catch (error) {
            console.log("Error connecting to database", error);
            process.exit(1);
        }
}

export default connectDatabase;