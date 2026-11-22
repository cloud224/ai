# 萬用離線 AI 工作台

手機、平板、電腦都能用的離線 AI 工作台，可以安裝成 App（PWA）。

- 網址：https://cloud224.github.io/ai/
- 功能：偵測硬體並推薦模型、搜尋 Hugging Face 並下載模型、多組參數設定檔（可匯出、匯入）、查看模型存放路徑與備份
- 支援的 AI 引擎：瀏覽器內建（WebGPU / WebLLM 0.2.87）、Ollama、llama.cpp / LM Studio 等 OpenAI 相容 API

## 安裝
- Android（Chrome）：打開網址後，按右上角「安裝 App」。
- iPhone / iPad（Safari，iOS 26 以上）：點「分享 › 加入主畫面」，之後都從主畫面圖示開啟。

## 更新
修改檔案後，請把 `sw.js` 裡的 `VERSION` 改成新號碼，使用者重新開啟 App 後就會套用新版。
