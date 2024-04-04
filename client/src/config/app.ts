import { stringToBoolean } from "@/lib/utils";

export const DEBUG = stringToBoolean(import.meta.env.VITE_APP_DEBUG);
