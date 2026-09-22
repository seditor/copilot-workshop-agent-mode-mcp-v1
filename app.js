// ===== 我的待辦清單 =====
// 使用原生 JavaScript，並將資料保存到瀏覽器的 localStorage。

const STORAGE_KEY = "offline-todos";
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const emptyState = document.getElementById("empty-state");
const remainingCount = document.getElementById("remaining-count");
const clearCompletedButton = document.getElementById("clear-completed-button");
const themeToggle = document.getElementById("theme-toggle");
const filterButtons = document.querySelectorAll(".filter-button");

const THEME_STORAGE_KEY = "todo-theme";
const FILTER_STORAGE_KEY = "todo-filter";
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
let currentFilter = "all";

let todos = loadTodos();

// 套用使用者選擇；沒有手動選擇時就使用系統主題。
function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.dataset.theme = isDark ? "dark" : "light";
  themeToggle.textContent = isDark ? "☀️ 淺色模式" : "🌙 深色模式";
  themeToggle.setAttribute("aria-pressed", String(isDark));
}

function getInitialTheme() {
  return localStorage.getItem(THEME_STORAGE_KEY) || (systemTheme.matches ? "dark" : "light");
}

function getInitialFilter() {
  const savedFilter = localStorage.getItem(FILTER_STORAGE_KEY);
  const validFilters = ["all", "active", "completed"];
  return validFilters.includes(savedFilter) ? savedFilter : "all";
}

function applyFilter(filter) {
  currentFilter = filter;
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === currentFilter;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

// 從 localStorage 讀取資料；資料格式不正確時使用空清單。
function loadTodos() {
  try {
    const savedTodos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(savedTodos) ? savedTodos : [];
  } catch (error) {
    return [];
  }
}

// 將目前的待辦清單寫回 localStorage。
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 依目前篩選條件取得要顯示的待辦事項。
function getVisibleTodos() {
  if (currentFilter === "active") return todos.filter((todo) => !todo.completed);
  if (currentFilter === "completed") return todos.filter((todo) => todo.completed);
  return todos;
}

// 產生待辦事項識別碼。
function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// 重新繪製待辦清單與統計數字。
function render() {
  list.replaceChildren();

  const visibleTodos = getVisibleTodos();
  visibleTodos.forEach((todo) => {
    const item = document.createElement("li");
    item.className = todo.completed ? "todo-item completed" : "todo-item";
    item.dataset.id = todo.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", `完成「${todo.text}」`);

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "刪除";
    deleteButton.setAttribute("aria-label", `刪除「${todo.text}」`);

    item.append(checkbox, text, deleteButton);
    list.append(item);
  });

  emptyState.hidden = visibleTodos.length > 0;
  if (todos.length === 0) {
    emptyState.textContent = "還沒有任何待辦事項,新增一個吧!";
  } else if (currentFilter === "active") {
    emptyState.textContent = "目前沒有未完成的事項。";
  } else if (currentFilter === "completed") {
    emptyState.textContent = "目前沒有符合條件的已完成事項，其他項目可能只是被篩選掉了。";
  }
  remainingCount.textContent = `未完成:${todos.filter((todo) => !todo.completed).length} 項`;
  clearCompletedButton.hidden = !todos.some((todo) => todo.completed);
}

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  applyTheme(nextTheme);
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyFilter(button.dataset.filter);
    localStorage.setItem(FILTER_STORAGE_KEY, currentFilter);
    render();
  });
});

systemTheme.addEventListener("change", (event) => {
  if (!localStorage.getItem(THEME_STORAGE_KEY)) {
    applyTheme(event.matches ? "dark" : "light");
  }
});

clearCompletedButton.addEventListener("click", () => {
  const completedCount = todos.filter((todo) => todo.completed).length;
  if (completedCount === 0) return;

  const shouldClear = confirm(`確定要清除 ${completedCount} 個已完成事項嗎？`);
  if (!shouldClear) return;

  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  render();
});

// 新增一筆非空白的待辦事項。
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();

  if (!text) {
    input.focus();
    return;
  }

  todos.push({ id: createId(), text, completed: false });
  saveTodos();
  render();
  input.value = "";
  input.focus();
});

// 用事件委派處理勾選與刪除，避免逐筆綁定事件。
list.addEventListener("click", (event) => {
  const item = event.target.closest(".todo-item");
  if (!item) return;

  const todo = todos.find((currentTodo) => currentTodo.id === item.dataset.id);
  if (!todo) return;

  if (event.target.matches("input[type=checkbox]")) {
    todo.completed = event.target.checked;
  } else if (event.target.matches(".delete-button")) {
    todos = todos.filter((currentTodo) => currentTodo.id !== todo.id);
  } else {
    return;
  }

  saveTodos();
  render();
});

applyTheme(getInitialTheme());
applyFilter(getInitialFilter());
render();
