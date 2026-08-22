# Важливі Вказівки Безпеки / Security Instructions

## 🔒 Захист Telegram Bot Token

### Проблема
Ваш Telegram bot token був скомпрометований, оскільки він знаходився безпосередньо в коді. Це дозволяє будь-кому:
- Відправляти повідомлення від імені вашого бота
- Отримувати повідомлення, які надсилаються боту
- Потенційно викрасти дані клієнтів

### Що потрібно зробити НЕГАЙНО:

#### 1. Скасуйте старий токен
1. Відкрийте [@BotFather](https://t.me/BotFather) в Telegram
2. Надішліть команду `/mybots`
3. Виберіть ваш бот `@barigacofe_bot`
4. Виберіть "API Token"
5. Виберіть "Revoke current token" (Скасувати поточний токен)
6. Підтвердіть скасування

#### 2. Отримайте новий токен
1. У тому ж меню виберіть "Generate new token"
2. Скопіюйте новий токен (формат: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

#### 3. Налаштуйте змінні середовища

**Для локальної розробки:**
1. Створіть файл `.env` в корені проекту
2. Додайте ваш новий токен:
```
TELEGRAM_BOT_TOKEN=ваш_новий_токен_тут
TELEGRAM_CHAT_ID=ваш_chat_id
```

**Для Vercel (production):**
1. Відкрийте ваш проект на [vercel.com](https://vercel.com)
2. Перейдіть в Settings → Environment Variables
3. Додайте змінну `TELEGRAM_BOT_TOKEN` з вашим новим токеном
4. Додайте змінну `TELEGRAM_CHAT_ID` (якщо потрібно)
5. Перезапустіть deployment

#### 4. Перевірте, хто має доступ
1. У [@BotFather](https://t.me/BotFather) перевірте налаштування бота
2. Переконайтеся, що тільки ви маєте адміністративний доступ
3. Видаліть всі підозрілі webhook'и: `/deleteWebhook` у вашому боті

### Як уникнути цього в майбутньому:

✅ **НІКОЛИ** не додавайте токени, паролі або ключі безпосередньо в код  
✅ Використовуйте змінні середовища (`.env` файли)  
✅ Переконайтеся, що `.env` додано до `.gitignore`  
✅ Використовуйте `.env.example` для документування необхідних змінних  
✅ Регулярно перевіряйте логи на підозрілу активність  

---

## 🔍 Як визначити скомпрометований бот

Ознаки, що ваш бот скомпрометовано:
- Повідомлення, які ви не надсилали (як "ПОВЕСЕЛИТЬСЯ?" з вашого скріншоту)
- Несподівані взаємодії з користувачами
- Зміни в налаштуваннях бота без вашого відома
- Спам-повідомлення від вашого бота

---

## 📞 Підтримка

Якщо ви бачите підозрілу активність:
1. Негайно скасуйте токен (див. вище)
2. Перевірте логи Vercel на незвичайні запити
3. Повідомте користувачів, якщо їхні дані могли бути скомпрометовані

---

# English Version

## 🔒 Telegram Bot Token Security

### The Problem
Your Telegram bot token was compromised because it was stored directly in the code. This allows anyone to:
- Send messages as your bot
- Receive messages sent to your bot
- Potentially steal customer data

### Immediate Actions Required:

#### 1. Revoke the old token
1. Open [@BotFather](https://t.me/BotFather) in Telegram
2. Send `/mybots`
3. Select your bot `@barigacofe_bot`
4. Select "API Token"
5. Choose "Revoke current token"
6. Confirm revocation

#### 2. Get a new token
1. In the same menu, select "Generate new token"
2. Copy the new token (format: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

#### 3. Set up environment variables

**For local development:**
1. Create a `.env` file in the project root
2. Add your new token:
```
TELEGRAM_BOT_TOKEN=your_new_token_here
TELEGRAM_CHAT_ID=your_chat_id
```

**For Vercel (production):**
1. Open your project on [vercel.com](https://vercel.com)
2. Go to Settings → Environment Variables
3. Add `TELEGRAM_BOT_TOKEN` with your new token
4. Add `TELEGRAM_CHAT_ID` (if needed)
5. Redeploy

#### 4. Verify access
1. In [@BotFather](https://t.me/BotFather), check bot settings
2. Ensure only you have admin access
3. Delete any suspicious webhooks: `/deleteWebhook` in your bot

### Prevention:

✅ **NEVER** put tokens, passwords, or keys directly in code  
✅ Use environment variables (`.env` files)  
✅ Ensure `.env` is in `.gitignore`  
✅ Use `.env.example` to document required variables  
✅ Regularly check logs for suspicious activity
