const { Client } = require("@notionhq/client");

const notion = new Client({
    auth: "secret_test_key", // Dummy key only for structure check
});

console.log("Notion Client Type:", typeof notion);
console.log("Notion Keys:", Object.keys(notion));
if (notion.databases) {
    console.log("Notion Databases Keys:", Object.keys(notion.databases));
    console.log("Is query a function?", typeof notion.databases.query === 'function');
} else {
    console.log("notion.databases is undefined");
}
