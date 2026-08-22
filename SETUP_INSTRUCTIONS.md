# ⚡ Швидке Налаштування Telegram Bot - Покрокова Інструкція

## ✅ Новий токен підтверджено!

**Токен:** `8994978328:AAF-ORLZ804iPFMLc7PWJOEDW_MHkaQgzyA`  
**Бот:** @barigacofe_bot (Кавове меню)  
**Статус:** Перевірено та працює ✓

---

## 🚀 OPTION 1: Швидке Налаштування (5 хвилин)

### Крок 1: Відкрийте Vercel Project Settings

1. Перейдіть на: **https://vercel.com/dashboard**
2. Знайдіть проект **kava-menu** або відкрийте: **https://vercel.com/wayzeman/kava-menu/settings/environment-variables**
3. Клікніть на проект → **Settings** (у верхньому меню)
4. Виберіть **Environment Variables** (ліворуч)

### Крок 2: Додайте TELEGRAM_BOT_TOKEN

1. Натисніть **"Add New"** (або "Add Variable")
2. Заповніть форму:

   **Key (Name):**
   ```
   TELEGRAM_BOT_TOKEN
   ```

   **Value:**
   ```
   8994978328:AAF-ORLZ804iPFMLc7PWJOEDW_MHkaQgzyA
   ```

   **Environments:** ✅ Виберіть ВСІ ТРИ:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development

3. Натисніть **"Save"**

### Крок 3: Перезапустіть Deployment

1. Перейдіть на вкладку **"Deployments"** (у верхньому меню)
2. Знайдіть ОСТАННІЙ deployment (перший у списку)
3. Клікніть на **три крапки (...)**  або кнопку справа
4. Виберіть **"Redeploy"**
5. Підтвердіть **"Redeploy"**

⏱️ Deployment займе ~1-2 хвилини

### Крок 4: Перевірте Роботу

1. Відкрийте ваш сайт: **https://kava-menu.vercel.app**
2. Зробіть тестове замовлення
3. Перевірте, що повідомлення прийшло в Telegram
4. **Підозрілих повідомлень більше бути не повинно!**

---

## 🤖 OPTION 2: Автоматичне Налаштування (з Vercel CLI)

Якщо у вас встановлено Vercel CLI:

```bash
# 1. Встановіть змінну (буде запитано вибір environments)
vercel env add TELEGRAM_BOT_TOKEN

# Коли запитає Value, вставте:
8994978328:AAF-ORLZ804iPFMLc7PWJOEDW_MHkaQgzyA

# Виберіть: Production, Preview, Development (усі три)

# 2. Перезапустіть production
vercel --prod
```

---

## 📋 OPTION 3: Автоматичний Скрипт (через API)

Якщо ви маєте Vercel API Token:

```bash
# 1. Експортуйте ваш Vercel Token
export VERCEL_TOKEN="your_vercel_token_here"

# 2. Запустіть автоматичний скрипт
bash scripts/setup-vercel-env.sh
```

**Як отримати Vercel Token:**
1. Відкрийте: https://vercel.com/account/tokens
2. Натисніть **"Create Token"**
3. Назва: `Cloud Agent Setup`
4. Expiration: `No Expiration` або `90 days`
5. Scope: **Full Account**
6. Натисніть **"Create Token"**
7. **Скопіюйте token** (його можна побачити тільки один раз!)

---

## ✅ Перевірка Після Налаштування

### 1. Перевірте Environment Variables
```bash
# В Vercel Dashboard:
Settings → Environment Variables → 
Повинна бути змінна: TELEGRAM_BOT_TOKEN (з маскованим значенням)
```

### 2. Перевірте Deployment Status
```bash
# В Vercel Dashboard:
Deployments → Останній deployment повинен бути:
✅ Ready (зелена галочка)
```

### 3. Перевірте Logs
```bash
# В Vercel Dashboard:
Deployments → Останній → View Function Logs
# Не повинно бути помилок типу "TELEGRAM_BOT_TOKEN is not set"
```

### 4. Тестове Замовлення
1. Відкрийте https://kava-menu.vercel.app
2. Додайте будь-яку каву до кошика
3. Оформіть замовлення
4. **Перевірте Telegram** - має прийти повідомлення з деталями замовлення

---

## 🔍 Troubleshooting

### Проблема: "Environment variable not found"
**Рішення:** Переконайтеся, що ви вибрали ВСІ ТРИ environments (Production, Preview, Development)

### Проблема: Повідомлення не приходять
**Рішення:** 
1. Перевірте, що deployment завершився успішно (✅ Ready)
2. Перегляньте Function Logs на наявність помилок
3. Перевірте, що токен скопійовано без пробілів
4. Спробуйте ще раз Redeploy

### Проблема: Старі підозрілі повідомлення все ще приходять
**Рішення:**
1. Переконайтеся, що ви **СКАСУВАЛИ СТАРИЙ ТОКЕН** через @BotFather
2. Якщо ні - зробіть це ЗАРАЗ:
   - Telegram → @BotFather → /mybots → @barigacofe_bot
   - API Token → Revoke current token

---

## 📞 Контакти для Підтримки

- **Vercel Docs:** https://vercel.com/docs/environment-variables
- **Telegram Bot API:** https://core.telegram.org/bots/api
- **Репозиторій:** https://github.com/WayZeman/kava-menu

---

## 🎯 Що Було Зроблено

✅ Перевірено новий токен (працює)  
✅ Видалено старий токен з коду  
✅ Додано підтримку environment variables  
✅ Створено документацію та інструкції  
✅ Створено автоматичні скрипти  
✅ Запушено зміни в репозиторій  

### ⏳ Залишилося Зробити (Ви):

1. ⬜ Додати TELEGRAM_BOT_TOKEN в Vercel (5 хв)
2. ⬜ Redeploy application (2 хв)
3. ⬜ Перевірити роботу бота (3 хв)

---

**Загальний час: ~10 хвилин**

Після виконання цих кроків:
- ✅ Бот працюватиме з новим токеном
- ✅ Підозрілі повідомлення припиняться
- ✅ Система буде захищена від майбутніх атак

---

*Створено Cloud Agent*  
*Дата: 22 серпня 2026*  
*Проект: https://kava-menu.vercel.app*
