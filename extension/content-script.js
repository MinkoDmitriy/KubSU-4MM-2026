const MAX_TEXT_LENGTH = 1_000;

function parseTextContent(maxLen = MAX_TEXT_LENGTH) {
  if (!document.body) {
    return "";
  }

  // Исключаем скрытые служебные элементы, чтобы уменьшить шум [web:4]
  const HIDDEN_SELECTORS = [
    "script", "style", "noscript", "iframe", "canvas",
    "[hidden]", "[aria-hidden='true']", ".hidden", ".visually-hidden"
  ];
  const IGNORE_TAGS = ["SCRIPT", "STYLE", "NOSCRIPT", "CANVAS"];
  const IGNORE_CLASSES = ["ads", "ad-banner", "cookie", "popup", "sidebar"];

  let textParts = [];
  const walker = document.createNodeIterator(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        // Пропускаем скрытые или служебные элементы [web:7]
        if (
          IGNORE_TAGS.includes(parent.tagName) ||
          HIDDEN_SELECTORS.some(sel => parent.matches?.(sel)) ||
          IGNORE_CLASSES.some(cls => parent.classList?.contains(cls))
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        return parent.offsetParent !== null && parent.offsetHeight > 0 ?
          NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    }
  );

  // Собираем видимые текстовые узлы [web:2]
  let node;
  while (node = walker.nextNode()) {
    textParts.push(node.textContent.trim());
  }

  // Объединяем и нормализуем текст [web:5]
  let text = textParts.join(" ").replace(/\s+/g, " ").trim();
  if (text.length > maxLen) {
    text = text.slice(0, maxLen).replace(/\s+\S*$/, ""); // Обрезаем до границы слова
  }
  return text;
}

window.addEventListener('load', (event) => {
  const payload = {
    type: "view",
    url: location.href,
    title: document.title || "",
    lang: document.documentElement?.lang || "",
    text: parseTextContent(MAX_TEXT_LENGTH)
  };

  chrome.runtime.sendMessage(payload);
});
