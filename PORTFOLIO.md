![工作坊完成徽章](https://img.shields.io/badge/GitHub_Copilot_實戰工作坊-已完成-1F883D?style=for-the-badge&logo=githubcopilot&logoColor=white)

# GitHub Copilot 實戰工作坊待辦清單 Web App

這是一個在 GitHub Copilot 實戰工作坊中完成的離線待辦清單 Web App。專案以簡潔的介面協助使用者新增、整理與完成每日待辦事項，並練習將需求拆解、實作、驗證與版本控制串成完整的開發流程。

## 線上展示

[GitHub Pages](https://seditor.github.io/copilot-workshop-agent-mode-mcp-v1/)

> 請將上方網址中的佔位文字替換成實際的 GitHub 帳號與 repository 名稱。

## 功能

- 新增待辦事項，並限制內容不可為空白。
- 將待辦事項標記為已完成或取消完成。
- 刪除單筆待辦事項。
- 依「全部」、「未完成」或「已完成」篩選待辦事項。
- 顯示目前未完成的事項數量。
- 一次清除所有已完成事項，操作前會顯示確認對話框。
- 沒有已完成事項時，隱藏「清除已完成」按鈕。
- 使用深色模式與淺色模式切換，初始狀態會參考系統的色彩偏好。
- 將待辦事項與主題偏好儲存在瀏覽器的 `localStorage`。
- 支援鍵盤 focus 樣式、ARIA 標籤與減少動畫偏好。
- 使用響應式版面，支援桌面與較小螢幕瀏覽。

## 技術

- 使用純 HTML、CSS 與原生 JavaScript。
- 不使用任何前端框架或套件。
- 不引用外部 CDN，可在離線環境中運作。
- 使用 CSS 變數管理主題色彩與介面樣式。
- 使用瀏覽器 `localStorage` 儲存待辦資料與主題偏好。
- 透過 `textContent`、`createElement` 與事件委派產生及管理 DOM 內容。

## 開發方式

這個專案是在 GitHub Copilot 實戰工作坊中，透過 GitHub Copilot Agent Mode 逐步完成。開發過程包含從需求建立待辦清單介面、加入深色模式與篩選功能，再依 GitHub Issue 進行修正與功能擴充。

專案使用 MCP 連接 Microsoft Learn 與 GitHub，查詢官方文件、讀取 repository 的 issue，並將 issue 內容納入實作與驗證流程。`.github/prompts` 中的 `fix-issue.prompt.md` 則定義了處理 issue 的 agentic workflow，要求依序讀取 issue、提出計畫並等待確認、建立分支、修改、驗證、提交推送，以及建立 Pull Request。

## 我學到什麼

- 如何使用 Agent Mode 將自然語言需求拆解成可執行的開發步驟。
- 如何透過 MCP 查詢 Microsoft Learn 文件與 GitHub repository 資訊。
- 如何以 GitHub Issue、分支與 Pull Request 管理小型功能與 bug 修復。
- 如何使用瀏覽器操作流程驗證功能，而不只依賴程式碼檢查。
- 如何在純原生 JavaScript 專案中處理狀態、`localStorage`、篩選與主題切換。
