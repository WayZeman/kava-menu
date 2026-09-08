# 🎯 Покрокова Інструкція: Як Отримати YouTube API Key

## ❌ Що ви надаєте зараз (НЕПРАВИЛЬНО):

```
144306681060-gi1a4t8o4a3037pq20ocbfddie99rhki.apps.googleusercontent.com
805270349108-qnjjkfch2nsdun3l4p53dfgk1iqv7d2d.apps.googleusercontent.com
```

**Це OAuth Client IDs** - НЕ те що потрібно!

---

## ✅ Що потрібно (ПРАВИЛЬНО):

**API Key** у форматі:
```
AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 📋 Покрокова Інструкція:

### Крок 1: Відкрийте Google Cloud Console

🔗 https://console.cloud.google.com/

### Крок 2: Виберіть проект

- У верхньому меню клікніть на назву проекту
- Або створіть новий проект

### Крок 3: Enable YouTube Data API v3

1. Перейдіть: **APIs & Services** → **Library**
   
   🔗 Або: https://console.cloud.google.com/apis/library

2. У пошуку введіть: `YouTube Data API v3`

3. Клікніть на "**YouTube Data API v3**"

4. Натисніть синю кнопку "**ENABLE**"

### Крок 4: Створіть API Key

1. Перейдіть: **APIs & Services** → **Credentials**
   
   🔗 Або: https://console.cloud.google.com/apis/credentials

2. Натисніть "**+ CREATE CREDENTIALS**" (зверху)

3. Виберіть: "**API key**" (НЕ OAuth!)
   ```
   ┌─────────────────────┐
   │ + CREATE CREDENTIALS│
   ├─────────────────────┤
   │ ✓ API key          │  ← ОЦЕ!
   │   OAuth client ID   │  ← НЕ ЦЕ!
   │   Service account   │
   └─────────────────────┘
   ```

4. З'явиться вікно з ключем:
   ```
   ┌──────────────────────────────────┐
   │ API key created                  │
   ├──────────────────────────────────┤
   │ Your API key:                    │
   │ AIzaSyDxxxxxxxxxxxxxxxxxxxxxxx   │  ← СКОПІЮЙТЕ ЦЕ!
   │                                  │
   │ [Copy] [Restrict key]   [Close]  │
   └──────────────────────────────────┘
   ```

5. **СКОПІЮЙТЕ** цей ключ!

### Крок 5: (Опціонально) Обмежте ключ

Для безпеки можна обмежити ключ тільки YouTube API:

1. Клікніть "**Restrict key**"
2. API restrictions → Restrict key
3. Виберіть тільки: "**YouTube Data API v3**"
4. Save

---

## 🎯 Що Має Вийти:

**Правильний API Key:**
```
AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Характеристики:**
- ✅ Починається з `AIzaSy`
- ✅ Довжина ~39 символів
- ✅ Тільки літери, цифри, дефіси
- ✅ БЕЗ `.apps.googleusercontent.com`

---

## 🚫 НЕПРАВИЛЬНІ Приклади:

❌ `144306681060-gi1a4t8o4a3037pq20ocbfddie99rhki.apps.googleusercontent.com`
   → Це OAuth Client ID

❌ `805270349108-qnjjkfch2nsdun3l4p53dfgk1iqv7d2d.apps.googleusercontent.com`
   → Це теж OAuth Client ID

❌ `1234567890`
   → Це project number

---

## 📸 Візуальна Підказка:

### В Google Cloud Console ви повинні бачити:

```
APIs & Services > Credentials

┌─────────────────────────────────────────┐
│ + CREATE CREDENTIALS                    │
├─────────────────────────────────────────┤
│                                         │
│ API Keys                                │
│ ┌─────────────────────────────────────┐ │
│ │ Key name: API key 1                 │ │
│ │ Created: Sep 8, 2026                │ │
│ │ Key: AIzaSyD...xxxxxx               │ │  ← ЦЕ!
│ └─────────────────────────────────────┘ │
│                                         │
│ OAuth 2.0 Client IDs                    │
│ ┌─────────────────────────────────────┐ │
│ │ Client ID: 144306681060...          │ │  ← НЕ ЦЕ!
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## ⚡ Швидкі Посилання:

1. **Enable API:**
   https://console.cloud.google.com/apis/library/youtube.googleapis.com

2. **Create Credentials:**
   https://console.cloud.google.com/apis/credentials

3. **Натисніть:**
   `+ CREATE CREDENTIALS` → `API key`

---

## 🎯 Коли Знайдете Правильний Ключ:

**Надішліть мені:**
```
AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Я автоматично:**
1. Додам в Vercel ✅
2. Redeploy ✅
3. Протестую ✅
4. YouTube статистика запрацює! 🎉

---

**Потрібна допомога?** Опишіть що ви бачите в Google Cloud Console!
