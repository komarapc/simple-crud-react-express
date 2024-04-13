import { stringBoolean } from "@/lib/utils";
import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 8000;
export const DEBUG = stringBoolean(process.env.DEBUG);
