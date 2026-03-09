import Database from "better-sqlite3";

const db = new Database("i18n.db");
const languages = db.prepare("SELECT * FROM languages").all();
console.log(JSON.stringify(languages, null, 2));
