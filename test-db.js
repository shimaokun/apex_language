import Database from "better-sqlite3";

const db = new Database("i18n.db");
const translations = db.prepare("SELECT key, value FROM translations WHERE lang_code = 'ja-JP' LIMIT 20").all();
console.log(JSON.stringify(translations, null, 2));
