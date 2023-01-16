import { ConsoleLogger } from "@thi.ng/logger";

export interface Post {
    date: string;
    title: string;
    body: string;
    tags: string[];
    colors?: string[];
}

export const DB_PATH = "assets/_db.json";

export const LOGGER = new ConsoleLogger("tools");
