# 🔍 Аналіз Проблеми з Обрахунками

## ❌ ПРОБЛЕМА ВИЯВЛЕНА

### Що не так:

Кошик показує **тільки фінальну ціну** (`paidTotal`) без деталізації знижки.

**Приклад проблеми:**

```
Замовлення: 10 × Американо (30 грн)

Очікування користувача:
├─ 10 × 30 грн = 300 грн
└─ "Чому тільки 270 грн?!" 😕

Що бачить користувач:
└─ "10 позицій · 1 у подарунок" — 270 грн

Що відбувається насправді:
├─ Subtotal: 10 × 30 = 300 грн
├─ Знижка (10-та кава): -30 грн
└─ До сплати: 270 грн ✓
```

### Код з script.js (рядки 2695-2703):

```javascript
if (pricing.freeDrinks > 0) {
    cartCount.textContent = `${cupLabel} · ${pricing.freeDrinks} у подарунок`;
    cartTotal.textContent = `${pricing.paidTotal} грн`;  // ❌ Тільки фінальна ціна!
    cartPay.textContent = 'Оплатити';
} else {
    cartCount.textContent = cupLabel;
    cartTotal.textContent = `${pricing.paidTotal} грн`;
    cartPay.textContent = 'Оплатити';
}
```

**Проблема:** Немає окремого рядка зі знижкою!

---

## 📊 Розрахунки в Коді - ВСЕ ПРАВИЛЬНО! ✅

### Backend (order-pricing.js):

```javascript
// ✅ Правильно
const subtotal = lines.reduce((sum, line) => sum + line.amount * line.qty, 0);
const freeValue = lines.reduce((sum, line) => sum + line.freeQty * line.amount, 0);
const paidTotal = Math.max(0, subtotal - freeValue);
```

### Frontend (script.js):

```javascript
// ✅ Правильно
const subtotal = list.reduce((sum, item) => sum + item.amount * item.qty, 0);
freeValue += freeQty * item.amount;
paidTotal: Math.max(0, subtotal - freeValue)
```

**Висновок:** Математика правильна, але відображення неповне!

---

## 💡 РІШЕННЯ

### Варіант 1: Показати деталізацію в кошику

**Було:**
```
10 позицій · 1 у подарунок
270 грн
[Оплатити]
```

**Стане:**
```
10 позицій

Сума: 300 грн
Знижка: -30 грн (1 кава)
───────────────
До сплати: 270 грн

[Оплатити]
```

### Варіант 2: Показати в модальному вікні оплати

Додати breakdown перед оплатою:

```
╔════════════════════════╗
║  Деталі замовлення     ║
╠════════════════════════╣
║ 10 × Американо         ║
║   10 × 30 грн = 300 грн║
║                        ║
║ Знижка:                ║
║   1 кава · -30 грн     ║
║                        ║
║ ━━━━━━━━━━━━━━━━━━━━━━║
║ До сплати: 270 грн     ║
╚════════════════════════╝
```

### Варіант 3: Tooltip при наведенні

При наведенні на ціну показувати спливаючу підказку:
```
270 грн
   ↓
[Сума: 300 грн]
[Знижка: -30 грн]
[До сплати: 270 грн]
```

---

## 🔧 Код для Варіанту 1 (Рекомендую)

### Зміни в HTML:

```html
<div id="cart" class="cart" hidden>
  <div class="cart-info">
    <span id="cart-count" class="cart-count"></span>
    
    <!-- ДОДАТИ: -->
    <div id="cart-breakdown" class="cart-breakdown" hidden>
      <div class="cart-subtotal">
        <span>Сума:</span>
        <span id="cart-subtotal-amount"></span>
      </div>
      <div class="cart-discount">
        <span id="cart-discount-label"></span>
        <span id="cart-discount-amount"></span>
      </div>
      <div class="cart-divider"></div>
    </div>
    
    <span id="cart-total" class="cart-total"></span>
  </div>
  <button id="cart-pay" class="cart-pay" type="button">Оплатити</button>
</div>
```

### Зміни в CSS:

```css
.cart-breakdown {
  font-size: 14px;
  color: #666;
  margin: 8px 0;
  padding: 8px 0;
}

.cart-subtotal,
.cart-discount {
  display: flex;
  justify-content: space-between;
  margin: 4px 0;
}

.cart-discount {
  color: #22c55e;
  font-weight: 500;
}

.cart-divider {
  border-top: 1px solid #e5e7eb;
  margin: 8px 0;
}
```

### Зміни в script.js:

```javascript
const cartBreakdown = document.getElementById('cart-breakdown');
const cartSubtotalAmount = document.getElementById('cart-subtotal-amount');
const cartDiscountLabel = document.getElementById('cart-discount-label');
const cartDiscountAmount = document.getElementById('cart-discount-amount');

function renderCart(totalQty, pricing) {
  // ... existing code ...
  
  // ДОДАТИ:
  if (pricing.freeDrinks > 0 && pricing.subtotal !== pricing.paidTotal) {
    cartBreakdown.hidden = false;
    cartSubtotalAmount.textContent = `${pricing.subtotal} грн`;
    cartDiscountLabel.textContent = `Знижка (${pricing.freeDrinks} кава безкоштовно):`;
    cartDiscountAmount.textContent = `-${pricing.freeValue} грн`;
  } else {
    cartBreakdown.hidden = true;
  }
  
  // ... existing code ...
}
```

---

## 📝 Додаткові Покращення

### 1. Абонемент - додати пояснення

```
Абонемент на місяць — 999 грн
💡 33 кави (еквівалент американо з молоком)
```

### 2. Telegram повідомлення - додати breakdown

**Було:**
```
Нове замовлення

Американо ×10 — 270 грн

💰 До сплати: 270 грн
```

**Стане:**
```
Нове замовлення

Американо ×10 — 300 грн
🎁 Знижка: −30 грн (1 безкоштовна)

💰 До сплати: 270 грн
```

---

## 🎯 Висновок

### ✅ Що працює правильно:
- Математика обрахунків (backend & frontend)
- Логіка безкоштовної 10-ї кави
- Абонемент на місяць
- Збереження в базі даних

### ❌ Що потрібно покращити:
- **Відображення знижки** в кошику (головна проблема!)
- Деталізація в Telegram повідомленнях
- Пояснення для абонементу

### 🔧 Пріоритет виправлень:
1. **ВИСОКИЙ:** Додати breakdown в кошику (Варіант 1)
2. СЕРЕДНІЙ: Покращити Telegram повідомлення
3. НИЗЬКИЙ: Додати tooltips та пояснення

---

**Створено:** 8 вересня 2026
**Аналіз:** Cloud Agent
**Статус:** ✅ Проблему виявлено та описано рішення
