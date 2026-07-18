/**
 * 平台适配层
 * 支持: Tauri v2 (桌面端) / JSBridge (Android) / Web (浏览器)
 *
 * Tauri 模式使用 withGlobalTauri，通过 window.__TAURI__ 访问 API，
 * 无需 npm 依赖 @tauri-apps/plugin-fs / @tauri-apps/plugin-dialog。
 */
export const Platform = {
  type: 'web', // 'tauri' | 'jsbridge' | 'web'
  jsbridge: null, // JSBridge 对象引用

  async init() {
    // 检测 Tauri v2 (withGlobalTauri)
    if (window.__TAURI__) {
      this.type = 'tauri';
      return;
    }
    // 检测 JSBridge (Android WebView)
    if (window.android && window.android.readFile) {
      this.type = 'jsbridge';
      this.jsbridge = window.android;
      return;
    }
    this.type = 'web';
  },

  // ========== Tauri 辅助 ==========

  /** 获取 Tauri FS API */
  _fs() { return window.__TAURI__.fs; },
  /** 获取 Tauri Dialog API */
  _dialog() { return window.__TAURI__.dialog; },
  /** 获取 Tauri Path API */
  _path() { return window.__TAURI__.path; },

  /** 获取 Deltarune 存档目录路径 */
  async _getSaveDir() {
    const p = this._path();
    // Deltarune 存档位置:
    // Windows: %LOCALAPPDATA%/DELTARUNE/
    // Linux:   ~/.local/share/DELTARUNE/
    // macOS:   ~/Library/Application Support/DELTARUNE/
    const platform = await this._getPlatform();
    if (platform === 'windows') {
      const localData = await p.localDataDir();
      return await p.join(localData, 'DELTARUNE');
    }
    if (platform === 'macos') {
      const home = await p.homeDir();
      return await p.join(home, 'Library', 'Application Support', 'DELTARUNE');
    }
    // Linux
    const home = await p.homeDir();
    return await p.join(home, '.local', 'share', 'DELTARUNE');
  },

  async _getPlatform() {
    try {
      return await this._path().platform();
    } catch {
      return navigator.platform.toLowerCase().includes('win') ? 'windows' :
             navigator.platform.toLowerCase().includes('mac') ? 'macos' : 'linux';
    }
  },

  // ========== 公共 API ==========

  /**
   * 读取文件内容
   * @param {string} path - 文件绝对路径或相对路径
   * @returns {Promise<string>}
   */
  async readFile(path) {
    if (this.type === 'jsbridge') {
      return this.jsbridge.savepathSandboxRead(path);
    }
    if (this.type === 'tauri') {
      const fs = this._fs();
      // 如果是相对路径（不含 / 或 \），尝试在存档目录下查找
      if (!path.includes('/') && !path.includes('\\')) {
        try {
          const saveDir = await this._getSaveDir();
          const p = this._path();
          const fullPath = await p.join(saveDir, path);
          return await fs.readTextFile(fullPath);
        } catch {
          // 回退：直接读取路径
        }
      }
      return await fs.readTextFile(path);
    }
    throw new Error('Web platform requires file upload');
  },

  /**
   * 写入文件内容
   * @param {string} path - 文件绝对路径或相对路径
   * @param {string} content - 文件内容
   * @returns {Promise<boolean>}
   */
  async writeFile(path, content) {
    if (this.type === 'jsbridge') {
      return this.jsbridge.savepathSandboxWrite(path, content);
    }
    if (this.type === 'tauri') {
      const fs = this._fs();
      // 如果是相对路径，写入存档目录
      if (!path.includes('/') && !path.includes('\\')) {
        try {
          const saveDir = await this._getSaveDir();
          const p = this._path();
          const fullPath = await p.join(saveDir, path);
          await fs.writeTextFile(fullPath, content);
          return true;
        } catch {
          // 回退：直接写入路径
        }
      }
      await fs.writeTextFile(path, content);
      return true;
    }
    // Web: 下载文件
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = path.split(/[\\/]/).pop() || 'save';
    a.click();
    URL.revokeObjectURL(url);
    return true;
  },

  /**
   * 列出存档目录的文件
   * @param {string} relPath - 相对路径（对 Tauri 模式无意义，自动扫描存档目录）
   * @returns {Promise<string[]>}
   */
  async listFiles(relPath) {
    if (this.type === 'jsbridge') {
      const json = this.jsbridge.savepathSandboxFileList(relPath || '.');
      try { return JSON.parse(json); } catch { return []; }
    }
    if (this.type === 'tauri') {
      const fs = this._fs();
      try {
        const saveDir = await this._getSaveDir();
        const entries = await fs.readDir(saveDir);
        // 只返回文件名，过滤掉目录
        return entries
          .filter(e => !e.isDirectory)
          .map(e => e.name);
      } catch {
        return [];
      }
    }
    return [];
  },

  /**
   * 检查文件是否存在
   * @param {string} relPath
   * @returns {Promise<boolean>}
   */
  async exists(relPath) {
    if (this.type === 'jsbridge') {
      return this.jsbridge.savepathSandboxExists(relPath);
    }
    if (this.type === 'tauri') {
      const fs = this._fs();
      try {
        if (!relPath.includes('/') && !relPath.includes('\\')) {
          const saveDir = await this._getSaveDir();
          const p = this._path();
          const fullPath = await p.join(saveDir, relPath);
          return await fs.exists(fullPath);
        }
        return await fs.exists(relPath);
      } catch {
        return false;
      }
    }
    return false;
  },

  /**
   * 关闭编辑器（JSBridge 模式下返回调用方）
   */
  close() {
    if (this.type === 'jsbridge' && this.jsbridge) {
      this.jsbridge.close();
    }
  },

  /**
   * JSBridge 专用：写入并同步存档（备份+写+提示）
   */
  writeSync(content) {
    if (this.type === 'jsbridge' && this.jsbridge && this.jsbridge.writeSyncT) {
      this.jsbridge.writeSyncT(content);
      return true;
    }
    return false;
  },

  /**
   * 选择文件（Tauri 使用系统对话框，Web 使用 file input）
   * @returns {Promise<{name: string, content: string, path?: string}|null>}
   */
  async pickFile() {
    if (this.type === 'tauri') {
      const dialog = this._dialog();
      const result = await dialog.open({
        multiple: false,
        filters: [{ name: 'Save Files', extensions: ['*'] }],
      });
      if (!result) return null;
      // dialog.open 返回字符串路径（single）或字符串数组（multiple）
      const filePath = typeof result === 'string' ? result : (Array.isArray(result) ? result[0] : null);
      if (!filePath) return null;
      const content = await this.readFile(filePath);
      const name = filePath.split(/[\\/]/).pop();
      return { name, content, path: filePath };
    }
    // Web / JSBridge: 使用 file input
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '*';
      input.onchange = async () => {
        const file = input.files[0];
        if (!file) { resolve(null); return; }
        const content = await file.text();
        resolve({ name: file.name, content });
      };
      input.click();
    });
  },
};
