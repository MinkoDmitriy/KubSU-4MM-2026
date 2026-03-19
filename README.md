# KubSU-4MM-2026

Hello, world!

## Установка браузерного расширения

1. Откройте Google Chrome и перейдите в `chrome://extensions/`.
2. Включите **Режим разработчика**.
3. Нажмите **Загрузить распакованное расширение** и выберите папку `extension`.
4. Нажмите `Отладка страниц service worker` для просмотра логов и отладки расширения.

## To run

```bash
docker compose -f postgres.yml up -d
```

## To stop

```bash
docker compose -f postgres.yml down
```
