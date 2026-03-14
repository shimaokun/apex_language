import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "data");
const LANGUAGES_FILE = path.join(DATA_DIR, "languages.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper functions for file-based storage
const readLanguages = () => {
  if (!fs.existsSync(LANGUAGES_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(LANGUAGES_FILE, "utf-8"));
  } catch (e) {
    return [];
  }
};

const writeLanguages = (languages: any[]) => {
  fs.writeFileSync(LANGUAGES_FILE, JSON.stringify(languages, null, 2));
};

const getTranslationsPath = (code: string) => path.join(DATA_DIR, `${code}.json`);

const readTranslations = (code: string) => {
  const filePath = getTranslationsPath(code);
  if (!fs.existsSync(filePath)) return {};
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (e) {
    return {};
  }
};

const writeTranslations = (code: string, data: any) => {
  fs.writeFileSync(getTranslationsPath(code), JSON.stringify(data, null, 2));
};

// Initialize default data if empty
const initData = () => {
  const languages = readLanguages();
  if (languages.length === 0) {
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

    const initialLanguages = [
      {
        code: "zh-CN",
        name: "简体中文",
        status: 1,
        key_count: Object.keys(cnData).length,
        version: "1.0.0",
        updated_at: new Date().toISOString(),
      },
      {
        code: "en-US",
        name: "English",
        status: 0,
        key_count: Object.keys(enData).length,
        version: "1.0.0",
        updated_at: new Date().toISOString(),
      },
    ];

    writeLanguages(initialLanguages);
    writeTranslations("zh-CN", cnData);
    writeTranslations("en-US", enData);
  }
};

initData();

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "10mb" }));
  const PORT = 3000;

  // API Routes
  app.get("/api/languages", (req, res) => {
    try {
      const languages = readLanguages();
      res.json(languages);
    } catch (error) {
      console.error("Get languages error:", error);
      res.status(500).json({ error: "Failed to get languages" });
    }
  });

  app.post("/api/languages/toggle", (req, res) => {
    try {
      const { code } = req.body;
      const languages = readLanguages();
      const updatedLanguages = languages.map((lang: any) => ({
        ...lang,
        status: lang.code === code ? 1 : 0,
      }));
      writeLanguages(updatedLanguages);
      res.json({ success: true });
    } catch (error) {
      console.error("Toggle error:", error);
      res.status(500).json({ error: "Failed to toggle language" });
    }
  });

  app.post("/api/languages/update", (req, res) => {
    try {
      const { code, name, version } = req.body;
      const languages = readLanguages();
      const updatedLanguages = languages.map((lang: any) =>
        lang.code === code
          ? { ...lang, name, version, updated_at: new Date().toISOString() }
          : lang
      );
      writeLanguages(updatedLanguages);
      res.json({ success: true });
    } catch (error) {
      console.error("Update language error:", error);
      res.status(500).json({ error: "Failed to update language" });
    }
  });

  app.delete("/api/languages/:code", (req, res) => {
    try {
      const { code } = req.params;
      const languages = readLanguages();
      const updatedLanguages = languages.filter((lang: any) => lang.code !== code);
      writeLanguages(updatedLanguages);

      // Delete from /data
      const dataFilePath = getTranslationsPath(code);
      if (fs.existsSync(dataFilePath)) {
        fs.unlinkSync(dataFilePath);
      }

      // Delete from /public (if exists)
      const publicFilePath = path.join(__dirname, "public", `${code}.json`);
      if (fs.existsSync(publicFilePath)) {
        fs.unlinkSync(publicFilePath);
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Delete language error:", error);
      res.status(500).json({ error: "Failed to delete language" });
    }
  });

  app.get("/api/translations/:code", (req, res) => {
    try {
      const { code } = req.params;
      const translations = readTranslations(code);
      res.json(translations);
    } catch (error) {
      console.error("Get translations error:", error);
      res.status(500).json({ error: "Failed to get translations" });
    }
  });

  app.post("/api/languages/upload", (req, res) => {
    try {
      const { code, name, data, updateType } = req.body;

      let languages = readLanguages();
      let lang = languages.find((l: any) => l.code === code);

      if (!lang) {
        lang = {
          code,
          name: name || code,
          status: 0,
          version: "1.0.0",
          updated_at: new Date().toISOString(),
          key_count: 0,
        };
        languages.push(lang);
      }

      let translations = updateType === "full" ? {} : readTranslations(code);
      translations = { ...translations, ...data };

      lang.key_count = Object.keys(translations).length;
      lang.updated_at = new Date().toISOString();

      writeLanguages(languages);
      writeTranslations(code, translations);

      res.json({ success: true });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload language pack" });
    }
  });

  // Asset Management API Routes
  app.get("/api/assets", (req, res) => {
    try {
      const assets = fs.existsSync(path.join(DATA_DIR, "assets.json"))
        ? JSON.parse(fs.readFileSync(path.join(DATA_DIR, "assets.json"), "utf-8"))
        : [];
      res.json(assets);
    } catch (error) {
      res.status(500).json({ error: "Failed to get assets" });
    }
  });

  app.post("/api/assets", (req, res) => {
    try {
      const assets = fs.existsSync(path.join(DATA_DIR, "assets.json"))
        ? JSON.parse(fs.readFileSync(path.join(DATA_DIR, "assets.json"), "utf-8"))
        : [];
      const newAsset = { 
        ...req.body, 
        id: req.body.id || (Date.now().toString() + Math.random().toString(36).substring(2, 9)), 
        updated_at: new Date().toISOString() 
      };
      assets.push(newAsset);
      fs.writeFileSync(path.join(DATA_DIR, "assets.json"), JSON.stringify(assets, null, 2));
      res.json(newAsset);
    } catch (error) {
      res.status(500).json({ error: "Failed to create asset" });
    }
  });

  app.put("/api/assets/:id", (req, res) => {
    try {
      const { id } = req.params;
      let assets = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "assets.json"), "utf-8"));
      assets = assets.map((a: any) => a.id === id ? { ...a, ...req.body, updated_at: new Date().toISOString() } : a);
      fs.writeFileSync(path.join(DATA_DIR, "assets.json"), JSON.stringify(assets, null, 2));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update asset" });
    }
  });

  app.delete("/api/assets/:id", (req, res) => {
    try {
      const { id } = req.params;
      let assets = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "assets.json"), "utf-8"));
      assets = assets.filter((a: any) => a.id !== id);
      fs.writeFileSync(path.join(DATA_DIR, "assets.json"), JSON.stringify(assets, null, 2));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete asset" });
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

  // Global API error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Global error:", err);
    if (req.path.startsWith("/api/")) {
      res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
    } else {
      next(err);
    }
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

