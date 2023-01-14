import { isString } from "@thi.ng/checks";
import { compare, compareByKey } from "@thi.ng/compare";
import { readJSON, writeText } from "@thi.ng/file-io";
import { ConsoleLogger } from "@thi.ng/logger";
import { table } from "@thi.ng/markdown-table";
import { updateIn } from "@thi.ng/paths";
import {
    compactEmptyLines,
    tabsToSpaces,
    transcludeFile,
} from "@thi.ng/transclude";

interface Post {
    date: string;
    title: string;
    body: string;
    tags: string[];
}

export const LOGGER = new ConsoleLogger("tools");

const allPosts = () => {
    const db = <Post[]>readJSON("assets/_db.json", LOGGER);

    const posts = db
        .filter((p) => p.tags.includes("post"))
        .map((p) =>
            updateIn(p, ["date"], (d) =>
                (isString(d) ? d : d[0]).substring(0, 10)
            )
        )
        .sort(compareByKey("date", (a, b) => -compare(a, b)))
        .map((p) => [p.date, `[${p.title}](${p.body})`]);

    return table(["Date", "Title"], posts);
};

const readme = transcludeFile("tpl.readme.md", {
    user: null,
    logger: LOGGER,
    templates: { allPosts },
    post: [tabsToSpaces(), compactEmptyLines],
}).src;

writeText("./README.md", readme, LOGGER);
