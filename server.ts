import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("i18n.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS languages (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    status INTEGER DEFAULT 0,
    key_count INTEGER DEFAULT 0,
    version TEXT DEFAULT '1.0.0',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lang_code TEXT NOT NULL,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    version INTEGER DEFAULT 1,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lang_code) REFERENCES languages(code)
  );

  CREATE TABLE IF NOT EXISTS version_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lang_code TEXT NOT NULL,
    operator TEXT,
    update_type TEXT, -- 'full' or 'incremental'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lang_code) REFERENCES languages(code)
  );
`);

// Seed initial data if empty
const langCount = db.prepare("SELECT COUNT(*) as count FROM languages").get().count;
const transCount = db.prepare("SELECT COUNT(*) as count FROM translations").get().count;

if (langCount === 0 || transCount === 0) {
  if (langCount === 0) {
    db.prepare("INSERT INTO languages (code, name, status, version) VALUES (?, ?, ?, ?)").run("zh-CN", "简体中文", 1, "1.0.0");
    db.prepare("INSERT INTO languages (code, name, status, version) VALUES (?, ?, ?, ?)").run("en-US", "English", 0, "1.0.0");
  }

  const cnData = {
    'sidebar.title': 'APEX 安全防护',
    'header.title': '语言包管理',
    'menu.monitoring': '安全监控',
    'menu.threat_analysis': '威胁分析',
    'menu.threat_response': '威胁响应',
    'menu.risk_management': '风险管理',
    'menu.asset_center': '资产中心',
    'menu.cloud_security': '云安全中心',
    'menu.config_management': '配置管理',
    'menu.app_center': '应用中心',
    'table.header.info': '语言信息',
    'table.header.code': '编码',
    'table.header.keys': 'Key 总数',
    'table.header.version': '版本',
    'table.header.updated': '更新时间',
    'table.header.status': '状态',
    'table.header.actions': '操作',
    'search.placeholder': '搜索语言名称或编码...',
    'button.refresh': '刷新列表',
    'button.upload': '上传语言包',
    'empty.no_results': '未找到匹配的语言包',
    'user.admin': '管理员',
    'user.profile': '个人中心',
    'user.logout': '退出登录',
    'status.active': '当前已激活',
    'status.inactive': '点击激活',
    'button.edit': '编辑',
    'button.delete': '删除',
    'button.save': '保存',
    'button.cancel': '取消',
    'button.confirm': '确定',
    'button.confirm_upload': '确认上传',
    'delete.disabled': '激活状态无法删除',
    'modal.delete.title': '确认删除',
    'modal.delete.content': '确定要删除语言包 {name} 吗？此操作不可撤销。',
    'modal.edit.title': '编辑语言包',
    'form.label.name': '语言名称',
    'form.error.name': '请输入语言名称',
    'form.placeholder.name': '例如：简体中文',
    'form.label.version': '版本号',
    'form.error.version': '请输入版本号',
    'form.placeholder.version': '例如：1.0.0',
    'upload.title': '上传语言包',
    'upload.label.code': '语言编码 (Code)',
    'upload.label.name': '语言名称 (Name)',
    'upload.label.mode': '更新模式',
    'upload.mode.incremental': '增量更新',
    'upload.mode.full': '全量覆盖',
    'upload.dropzone.hint': '点击或拖拽文件到此处',
    'upload.dropzone.support': '支持 .json, .xlsx 格式',
    'upload.status.uploading': '上传中...',
    'upload.success': '上传成功',
    'upload.error.no_file': '请先选择文件',
    'upload.error.invalid_json': '无效的 JSON 格式',
    'upload.error.no_keys': '文件中未找到有效的翻译键值',
    'upload.error.failed': '上传失败',
    'message.update_success': '更新成功',
    'message.delete_success': '删除成功',
    'message.switch_success': '语言已切换至 {code}',
  };

  const enData = {
    'sidebar.title': 'APEX Security',
    'header.title': 'I18n Management',
    'menu.monitoring': 'Security Monitoring',
    'menu.threat_analysis': 'Threat Analysis',
    'menu.threat_response': 'Threat Response',
    'menu.risk_management': 'Risk Management',
    'menu.asset_center': 'Asset Center',
    'menu.cloud_security': 'Cloud Security',
    'menu.config_management': 'Configuration',
    'menu.app_center': 'App Center',
    'table.header.info': 'Language Info',
    'table.header.code': 'Code',
    'table.header.keys': 'Total Keys',
    'table.header.version': 'Version',
    'table.header.updated': 'Updated At',
    'table.header.status': 'Status',
    'table.header.actions': 'Actions',
    'search.placeholder': 'Search name or code...',
    'button.refresh': 'Refresh',
    'button.upload': 'Upload Pack',
    'empty.no_results': 'No matching language packs found',
    'user.admin': 'Admin',
    'user.profile': 'Profile',
    'user.logout': 'Logout',
    'status.active': 'Active',
    'status.inactive': 'Click to activate',
    'button.edit': 'Edit',
    'button.delete': 'Delete',
    'button.save': 'Save',
    'button.cancel': 'Cancel',
    'button.confirm': 'Confirm',
    'button.confirm_upload': 'Confirm Upload',
    'delete.disabled': 'Active pack cannot be deleted',
    'modal.delete.title': 'Confirm Delete',
    'modal.delete.content': 'Are you sure you want to delete {name}? This cannot be undone.',
    'modal.edit.title': 'Edit Language Pack',
    'form.label.name': 'Language Name',
    'form.error.name': 'Please enter language name',
    'form.placeholder.name': 'e.g. English',
    'form.label.version': 'Version',
    'form.error.version': 'Please enter version',
    'form.placeholder.version': 'e.g. 1.0.0',
    'upload.title': 'Upload Language Pack',
    'upload.label.code': 'Language Code',
    'upload.label.name': 'Language Name',
    'upload.label.mode': 'Update Mode',
    'upload.mode.incremental': 'Incremental',
    'upload.mode.full': 'Full Overwrite',
    'upload.dropzone.hint': 'Click or drag file to this area to upload',
    'upload.dropzone.support': 'Support for .json, .xlsx',
    'upload.status.uploading': 'Uploading...',
    'upload.success': 'Upload successful',
    'upload.error.no_file': 'Please select a file first',
    'upload.error.invalid_json': 'Invalid JSON format',
    'upload.error.no_keys': 'No valid translation keys found in file',
    'upload.error.failed': 'Upload failed',
    'message.update_success': 'Update successful',
    'message.delete_success': 'Delete successful',
    'message.switch_success': 'Language switched to {code}',
  };

  const insertTranslation = db.prepare("INSERT INTO translations (lang_code, key, value) VALUES (?, ?, ?)");
  Object.entries(cnData).forEach(([key, val]) => insertTranslation.run("zh-CN", key, val));
  Object.entries(enData).forEach(([key, val]) => insertTranslation.run("en-US", key, val));

  db.prepare("UPDATE languages SET key_count = ? WHERE code = ?").run(Object.keys(cnData).length, "zh-CN");
  db.prepare("UPDATE languages SET key_count = ? WHERE code = ?").run(Object.keys(enData).length, "en-US");
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));
  const PORT = 3000;

  // API Routes
  app.get("/api/languages", (req, res) => {
    const languages = db.prepare("SELECT * FROM languages ORDER BY updated_at DESC").all();
    res.json(languages);
  });

  app.post("/api/languages/toggle", (req, res) => {
    const { code } = req.body;
    const transaction = db.transaction(() => {
      // Deactivate all
      db.prepare("UPDATE languages SET status = 0").run();
      // Activate selected
      db.prepare("UPDATE languages SET status = 1 WHERE code = ?").run(code);
    });
    transaction();
    res.json({ success: true });
  });

  app.post("/api/languages/update", (req, res) => {
    const { code, name, version } = req.body;
    db.prepare("UPDATE languages SET name = ?, version = ?, updated_at = CURRENT_TIMESTAMP WHERE code = ?").run(name, version, code);
    res.json({ success: true });
  });

  app.delete("/api/languages/:code", (req, res) => {
    const { code } = req.params;
    const transaction = db.transaction(() => {
      db.prepare("DELETE FROM version_history WHERE lang_code = ?").run(code);
      db.prepare("DELETE FROM translations WHERE lang_code = ?").run(code);
      db.prepare("DELETE FROM languages WHERE code = ?").run(code);
    });
    transaction();
    res.json({ success: true });
  });

  app.get("/api/translations/:code", (req, res) => {
    const { code } = req.params;
    const translations = db.prepare("SELECT key, value FROM translations WHERE lang_code = ?").all(code);
    const result = {};
    translations.forEach(t => {
      result[t.key] = t.value;
    });
    res.json(result);
  });

  app.post("/api/languages/upload", (req, res) => {
    const { code, name, data, updateType } = req.body; // updateType: 'full' or 'incremental'
    
    const transaction = db.transaction(() => {
      // Ensure language exists
      const langExists = db.prepare("SELECT code FROM languages WHERE code = ?").get(code);
      if (!langExists) {
        db.prepare("INSERT INTO languages (code, name, status, version) VALUES (?, ?, ?, ?)").run(code, name || code, 0, '1.0.0');
      }

      if (updateType === 'full') {
        db.prepare("DELETE FROM translations WHERE lang_code = ?").run(code);
      }

      // Note: We need a unique constraint for lang_code + key for ON CONFLICT to work
      // Let's ensure it exists. (Adding it via exec if not already there is tricky in SQLite without recreation, 
      // but for this demo we'll just handle it manually if needed or recreate the table)
      
      const keys = Object.keys(data);
      for (const key of keys) {
        // Manual upsert if unique index isn't there
        const existing = db.prepare("SELECT id FROM translations WHERE lang_code = ? AND key = ?").get(code, key);
        if (existing) {
          db.prepare("UPDATE translations SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(data[key], existing.id);
        } else {
          db.prepare("INSERT INTO translations (lang_code, key, value) VALUES (?, ?, ?)").run(code, key, data[key]);
        }
      }

      // Update language metadata
      const count = db.prepare("SELECT COUNT(*) as count FROM translations WHERE lang_code = ?").get(code).count;
      db.prepare("UPDATE languages SET key_count = ?, updated_at = CURRENT_TIMESTAMP WHERE code = ?").run(count, code);

      // Record history
      db.prepare("INSERT INTO version_history (lang_code, operator, update_type) VALUES (?, ?, ?)").run(code, 'Admin', updateType);
    });

    try {
      transaction();
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to upload language pack" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
