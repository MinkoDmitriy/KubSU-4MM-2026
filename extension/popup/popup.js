const API_URL = "http://127.0.0.1:8000";

const queryInput = document.getElementById("queryInput");
const sendButton = document.getElementById("sendButton");
const historyButton = document.getElementById("historyButton");
const responseDiv = document.getElementById("response");
const responseContent = document.getElementById("responseContent");
const clearButton = document.getElementById("clearButton");

// События кнопок
sendButton.addEventListener("click", () => sendRequest());
historyButton.addEventListener("click", () => loadHistory());
queryInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendRequest();
  }
});
clearButton.addEventListener("click", () => hideResponse());

// Отправка запроса к LLM
async function sendRequest() {
  const text = queryInput.value.trim();
  if (!text) {
    queryInput.focus();
    return;
  }

  setLoading(sendButton, "Отправка...");
  showResponse("Загрузка ответа от LLM...");

  try {
    const res = await fetch(`${API_URL}/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: text }),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.text(); // Получаем как текст, т.к. API возвращает строку
    showResponse(data || "Пустой ответ от сервера");

  } catch (err) {
    showError(`Ошибка запроса: ${err.message}`);
  } finally {
    sendButton.disabled = false;
    sendButton.textContent = "🚀 Отправить запрос";
  }
}

// Загрузка истории
async function loadHistory() {
  setLoading(historyButton, "Анализ...");
  showResponse("Получение и анализ истории посещений...");

  try {
    const res = await fetch(`${API_URL}/history`);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.text();
    showResponse(data || "История пуста или произошла ошибка анализа");

  } catch (err) {
    showError(`Ошибка истории: ${err.message}`);
  } finally {
    historyButton.disabled = false;
    historyButton.textContent = "📊 Анализ истории";
  }
}

// Вспомогательные функции
function setLoading(button, text) {
  button.disabled = true;
  button.textContent = text;
}

function showResponse(text) {
  responseContent.textContent = text;
  responseDiv.classList.remove("hidden", "error");
  responseDiv.scrollIntoView({ behavior: "smooth" });
}

function showError(text) {
  responseContent.textContent = text;
  responseDiv.classList.add("error");
  responseDiv.classList.remove("hidden");
  responseDiv.scrollIntoView({ behavior: "smooth" });
}

function hideResponse() {
  responseDiv.classList.add("hidden");
  responseContent.textContent = "";
  queryInput.focus();
}

// Фокус на ввод при открытии
queryInput.focus();
