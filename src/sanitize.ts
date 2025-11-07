import { isArray } from "@thi.ng/checks";
import { readJSON, writeJSON } from "@thi.ng/file-io";
import { DB_PATH, LOGGER, type Post } from "./api.js";

const db = <Post[]>readJSON(DB_PATH, LOGGER);

db.forEach((x) => {
    delete x["colors"];
    if (isArray(x.date)) x.date = x.date[0];
    x.tags.sort();
});

writeJSON(DB_PATH, db, null, "\t", LOGGER);
