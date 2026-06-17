const MONO_JAR = 'https://send.monobank.ua/jar/4znkD4kdM5';
const PRIVAT_ENVELOPE = 'https://www.privat24.ua/send/jzbnv';
const MONO_ANDROID = 'com.ftband.mono';
const PAYMENT_KEY = 'kava-pending-payment';
const RELOAD_KEY = 'kava-payment-reload';

const sheet = document.getElementById('sheet');
const confirmSheet = document.getElementById('confirm-sheet');
const sheetTitle = document.getElementById('sheet-title');
const sheetItems = document.getElementById('sheet-items');
const confirmItems = document.getElementById('confirm-items');
const loader = document.getElementById('loader');
const loaderText = document.querySelector('.loader-text');
const cart = document.getElementById('cart');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const cartPay = document.getElementById('cart-pay');
const fxLayer = document.getElementById('fx-layer');
const receiptDate = document.getElementById('receipt-date');
const thanksForm = document.getElementById('thanks-form');
const thanksFeedback = document.getElementById('thanks-feedback');
const thanksSend = document.getElementById('thanks-send');
const thanksSkip = document.getElementById('thanks-skip');
const thanksStatus = document.getElementById('thanks-status');
const rows = document.querySelectorAll('.row');
const payActions = document.querySelectorAll('#sheet [data-provider]');
const confirmYes = document.getElementById('confirm-yes');
const confirmNo = document.getElementById('confirm-no');
const thanks = document.getElementById('thanks');
const carWashSheet = document.getElementById('car-wash-sheet');
const carWashRow = document.querySelector('[data-picker="car-wash"]');
const heroIcon = document.querySelector('.hero-icon');
const statsPanel = document.getElementById('stats');
const statsIncome = document.getElementById('stats-income');
const statsExpensesTotal = document.getElementById('stats-expenses-total');
const statsRoiMain = document.getElementById('stats-roi-main');
const statsRoiSub = document.getElementById('stats-roi-sub');
const statsIncomes = document.getElementById('stats-incomes');
const statsIncomesMore = document.getElementById('stats-incomes-more');
const statsExpenseList = document.getElementById('stats-expense-list');
const statsExpensesMore = document.getElementById('stats-expenses-more');
const statsExpenseForm = document.getElementById('stats-expense-form');
const statsExpenseLabel = document.getElementById('stats-expense-label');
const statsExpenseAmount = document.getElementById('stats-expense-amount');
const statsIncomeForm = document.getElementById('stats-income-form');
const statsIncomeLabel = document.getElementById('stats-income-label');
const statsIncomeAmount = document.getElementById('stats-income-amount');
const statsEditForm = document.getElementById('stats-edit-form');
const statsEditLabel = document.getElementById('stats-edit-label');
const statsEditAmount = document.getElementById('stats-edit-amount');
const statsGate = document.getElementById('stats-gate');
const statsGateForm = document.getElementById('stats-gate-form');
const statsGatePassword = document.getElementById('stats-gate-password');
const statsGateError = document.getElementById('stats-gate-error');

const STATS_LOCAL_KEY = 'kava-business-stats';
const STATS_AUTH_KEY = 'kava-stats-auth';
const STATS_PASSWORD = '1111';
const STATS_LIST_PREVIEW = 5;
let incomesListExpanded = false;
let expensesListExpanded = false;
let currentStatsData = { incomes: [], expenses: [] };
let editingTransactionId = null;

const CAR_WASH_ENABLED = false;

const CAR_WASH_LEVELS = [
  {
    id: 'car-wash-light',
    name: 'Помивка машини · слабо забруднена',
    amount: 300,
  },
  {
    id: 'car-wash-medium',
    name: 'Помивка машини · середньо забруднена',
    amount: 400,
  },
  {
    id: 'car-wash-heavy',
    name: 'Помивка машини · сильно забруднена',
    amount: 600,
  },
];

const CAR_WASH_IDS = CAR_WASH_LEVELS.map((level) => level.id);

const cartItems = new Map();
let paymentTotal = 0;
let recoverTimer = null;
let thanksTimer = null;
let receiptBuildTimer = null;
let pendingOrder = null;
let awaitingPayment = false;
let cartWasHidden = true;

function isMobile() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

function monoUrl(amount) {
  return `${MONO_JAR}?a=${amount}`;
}

function androidIntent(httpsUrl, packageName) {
  const path = httpsUrl.replace(/^https:\/\//, '');
  return `intent://${path}#Intent;scheme=https;package=${packageName};end`;
}

function getPaymentUrl(provider, amount) {
  if (provider === 'mono') {
    const url = monoUrl(amount);
    if (isMobile() && isAndroid()) {
      return androidIntent(url, MONO_ANDROID);
    }
    return url;
  }
  return PRIVAT_ENVELOPE;
}

function formatQtyLabel(qty) {
  if (qty === 1) return '1 позиція';
  if (qty >= 2 && qty <= 4) return `${qty} позиції`;
  return `${qty} позицій`;
}

function getCartSummary() {
  const items = [...cartItems.values()].filter((item) => item.qty > 0);
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
  const total = items.reduce((sum, item) => sum + item.amount * item.qty, 0);

  return { items, totalQty, total };
}

function savePendingPayment(order) {
  sessionStorage.setItem(PAYMENT_KEY, JSON.stringify({
    order,
    savedAt: Date.now(),
  }));
}

function loadPendingPayment() {
  try {
    const raw = sessionStorage.getItem(PAYMENT_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw);
    if (Date.now() - data.savedAt > 2 * 60 * 60 * 1000) {
      sessionStorage.removeItem(PAYMENT_KEY);
      return null;
    }

    return data.order;
  } catch {
    sessionStorage.removeItem(PAYMENT_KEY);
    return null;
  }
}

function clearPendingPayment() {
  sessionStorage.removeItem(PAYMENT_KEY);
}

function restoreCartFromOrder(order) {
  order.items.forEach((item) => {
    if (CAR_WASH_IDS.includes(item.id)) {
      cartItems.set(item.id, { ...item });
      return;
    }

    const row = document.querySelector(`.row[data-id="${item.id}"]`);
    if (row) setRowQty(row, item.qty);
  });

  syncCarWashRow();
  updateCart();
}

function reloadAfterPaymentReturn() {
  if (sessionStorage.getItem(RELOAD_KEY)) return;

  sessionStorage.setItem(RELOAD_KEY, '1');
  location.reload();
}

function formatOrderList(items) {
  return items.map((item) => `${item.name} × ${item.qty}`).join(', ');
}

function formatReceiptDate() {
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
}

function renderReceiptLines(items) {
  sheetItems.innerHTML = '';

  items.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'receipt-line';

    const name = document.createElement('span');
    name.className = 'receipt-line-name';
    name.textContent = item.name;

    const meta = document.createElement('span');
    meta.className = 'receipt-line-meta';

    const qty = document.createElement('span');
    qty.className = 'receipt-line-qty';
    qty.textContent = `×${item.qty}`;

    const sum = document.createElement('span');
    sum.className = 'receipt-line-sum';
    sum.textContent = `${item.amount * item.qty} грн`;

    meta.append(qty, sum);
    li.append(name, meta);
    sheetItems.appendChild(li);
  });
}

const pulseTimers = new WeakMap();

function pulseClass(element, className, duration = 220) {
  if (!element) return;

  element.classList.add(className);

  const prev = pulseTimers.get(element);
  if (prev) clearTimeout(prev);

  const timer = setTimeout(() => {
    element.classList.remove(className);
    pulseTimers.delete(element);
  }, duration);

  pulseTimers.set(element, timer);
}

function spawnBurst(x, y, emoji = '✨', count = 3) {
  if (!fxLayer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  for (let i = 0; i < count; i += 1) {
    const particle = document.createElement('span');
    particle.className = 'fx-particle';
    particle.textContent = emoji;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.setProperty('--dx', `${(Math.random() - 0.5) * 90}px`);
    particle.style.setProperty('--dy', `${-40 - Math.random() * 70}px`);
    particle.style.setProperty('--rot', `${(Math.random() - 0.5) * 180}deg`);
    fxLayer.appendChild(particle);
    particle.addEventListener('animationend', () => particle.remove(), { once: true });
  }
}

function animateAdd(row, button) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  pulseClass(row.querySelector('.qty-value'), 'qty-pop');
  pulseClass(row.querySelector('.drink-icon'), 'icon-tap');

  if (!button) return;

  requestAnimationFrame(() => {
    const rect = button.getBoundingClientRect();
    spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, '☕');
  });
}

function animateRemove(row) {
  pulseClass(row.querySelector('.qty-value'), 'qty-pop', 180);
}

function getCarWashTotalQty() {
  return CAR_WASH_IDS.reduce((sum, id) => sum + (cartItems.get(id)?.qty || 0), 0);
}

function syncCarWashRow() {
  if (!carWashRow) return;

  const qty = getCarWashTotalQty();
  carWashRow.querySelector('.qty-value').textContent = String(qty);
  carWashRow.classList.toggle('has-qty', qty > 0);
}

function openCarWashSheet() {
  if (!carWashSheet) return;
  carWashSheet.hidden = false;
  document.body.classList.add('sheet-open');
}

function closeCarWashSheet() {
  if (!carWashSheet) return;
  carWashSheet.hidden = true;
  if (sheet.hidden && confirmSheet.hidden) {
    document.body.classList.remove('sheet-open');
  }
}

function addCarWashLevel(levelId, button) {
  const level = CAR_WASH_LEVELS.find((item) => item.id === levelId);
  if (!level) return;

  const current = cartItems.get(level.id)?.qty || 0;
  cartItems.set(level.id, {
    id: level.id,
    name: level.name,
    amount: level.amount,
    qty: current + 1,
  });

  syncCarWashRow();
  updateCart();
  closeCarWashSheet();

  if (carWashRow) {
    requestAnimationFrame(() => {
      animateAdd(carWashRow, button);
    });
  }
}

function decreaseCarWash() {
  for (let i = CAR_WASH_IDS.length - 1; i >= 0; i -= 1) {
    const id = CAR_WASH_IDS[i];
    const item = cartItems.get(id);
    if (!item?.qty) continue;

    if (item.qty <= 1) cartItems.delete(id);
    else cartItems.set(id, { ...item, qty: item.qty - 1 });

    syncCarWashRow();
    updateCart();

    if (carWashRow) animateRemove(carWashRow);
    return;
  }
}

function setRowQty(row, qty) {
  const id = row.dataset.id;

  if (qty <= 0) {
    cartItems.delete(id);
    row.classList.remove('has-qty');
    row.querySelector('.qty-value').textContent = '0';
    return;
  }

  cartItems.set(id, {
    id,
    name: row.dataset.name,
    amount: Number(row.dataset.amount),
    qty,
  });

  row.classList.add('has-qty');
  row.querySelector('.qty-value').textContent = String(qty);
}

function changeQty(row, delta, button) {
  if (row.dataset.picker === 'car-wash') {
    if (!CAR_WASH_ENABLED) return;
    if (delta > 0) openCarWashSheet();
    else decreaseCarWash();
    return;
  }

  const current = cartItems.get(row.dataset.id)?.qty || 0;
  const next = Math.max(0, current + delta);

  if (next === current) return;

  setRowQty(row, next);
  updateCart();

  requestAnimationFrame(() => {
    if (delta > 0) {
      animateAdd(row, button);
    } else {
      animateRemove(row);
    }
  });
}

function clearCart() {
  cartItems.clear();
  rows.forEach((row) => {
    row.classList.remove('has-qty');
    const qtyEl = row.querySelector('.qty-value');
    if (qtyEl) qtyEl.textContent = '0';
  });
  syncCarWashRow();
  updateCart();
}

function updateCart() {
  const { items, totalQty, total } = getCartSummary();

  if (!items.length) {
    cart.hidden = true;
    cart.classList.remove('cart-enter');
    document.body.classList.remove('has-cart');
    cartWasHidden = true;
    return;
  }

  const isNewCart = cartWasHidden;
  cart.hidden = false;
  document.body.classList.add('has-cart');

  const cupLabel = formatQtyLabel(totalQty);
  cartCount.textContent = cupLabel;
  cartTotal.textContent = `${total} грн`;

  if (isNewCart) {
    cart.classList.add('cart-enter');
    cartWasHidden = false;
  } else {
    pulseClass(cartTotal, 'total-pop');
  }
}

function dismissOverlays() {
  if (receiptBuildTimer) {
    clearTimeout(receiptBuildTimer);
    receiptBuildTimer = null;
  }

  loader.hidden = true;
  sheet.hidden = true;
  if (carWashSheet) carWashSheet.hidden = true;
  document.body.classList.remove('sheet-open');
  loaderText.textContent = 'Відкриваємо застосунок…';
  paymentTotal = 0;

  if (recoverTimer) {
    clearTimeout(recoverTimer);
    recoverTimer = null;
  }

  payActions.forEach((action) => {
    action.disabled = false;
  });
}

function openSheet() {
  const { items, total } = getCartSummary();
  if (!items.length) return;

  paymentTotal = total;
  sheetTitle.textContent = `${total} грн`;
  if (receiptDate) receiptDate.textContent = formatReceiptDate();
  renderReceiptLines(items);
  sheet.hidden = false;
  document.body.classList.add('sheet-open');
}

function closeSheet() {
  sheet.hidden = true;
  if (confirmSheet.hidden && (!carWashSheet || carWashSheet.hidden)) {
    document.body.classList.remove('sheet-open');
  }
  paymentTotal = 0;
}

function openConfirmSheet() {
  if (!pendingOrder) return;

  confirmItems.textContent = formatOrderList(pendingOrder.items);
  confirmSheet.hidden = false;
  document.body.classList.add('sheet-open');
}

function closeConfirmSheet() {
  confirmSheet.hidden = true;
  document.body.classList.remove('sheet-open');
}

function openPaymentUrl(url) {
  const link = document.createElement('a');
  link.href = url;
  link.rel = 'noopener noreferrer';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function snapshotOrder() {
  const { items, total } = getCartSummary();
  return {
    items: items.map((item) => ({ ...item })),
    total,
  };
}

function notifyOrder(order, provider) {
  const payload = JSON.stringify({
    items: order.items,
    total: order.total,
    provider,
  });

  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: 'application/json' });
    const queued = navigator.sendBeacon('/api/order', blob);
    if (queued) {
      queueLocalOrder(order, provider);
      return;
    }
  }

  fetch('/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true,
  }).catch(() => {
    // payment flow should continue even if notification fails
  });

  queueLocalOrder(order, provider);
}

function goToPayment(provider) {
  const order = snapshotOrder();
  if (!order.items.length) return;

  pendingOrder = order;
  awaitingPayment = true;
  savePendingPayment(order);

  const url = getPaymentUrl(provider, order.total);

  payActions.forEach((action) => {
    action.disabled = true;
  });

  closeSheet();
  loader.hidden = false;
  loaderText.textContent = provider === 'privat'
    ? `Відкриваємо конверт… Введіть ${order.total} грн`
    : 'Відкриваємо Monobank…';

  notifyOrder(order, provider);
  openPaymentUrl(url);

  recoverTimer = setTimeout(() => {
    loader.hidden = true;
  }, 1500);
}

function handleReturnFromPayment() {
  if (sessionStorage.getItem(RELOAD_KEY)) return;
  if (!awaitingPayment || !pendingOrder) return;

  savePendingPayment(pendingOrder);
  reloadAfterPaymentReturn();
}

function initPaymentReturn() {
  sessionStorage.removeItem(RELOAD_KEY);

  const order = loadPendingPayment();
  if (!order) return;

  pendingOrder = order;
  dismissOverlays();
  restoreCartFromOrder(order);
  openConfirmSheet();
}

function closeThanks() {
  if (!thanks) return;

  thanks.hidden = true;
  document.body.classList.remove('thanks-open');

  if (thanksTimer) {
    clearTimeout(thanksTimer);
    thanksTimer = null;
  }

  if (thanksFeedback) thanksFeedback.value = '';
  if (thanksStatus) {
    thanksStatus.hidden = true;
    thanksStatus.textContent = '';
  }
  if (thanksSend) {
    thanksSend.disabled = false;
    thanksSend.textContent = 'Надіслати';
  }
}

function showThanks() {
  if (!thanks) return;

  thanks.hidden = false;
  document.body.classList.add('thanks-open');

  if (thanksFeedback) thanksFeedback.value = '';
  if (thanksStatus) thanksStatus.hidden = true;
  if (thanksSend) {
    thanksSend.disabled = false;
    thanksSend.textContent = 'Надіслати';
  }
}

async function sendFeedback(message) {
  const response = await fetch('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  if (response.ok) return { sent: true, via: 'api' };

  const text = `Відгук з кавового меню:\n\n${message}`;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // clipboard may be unavailable
  }

  window.open('https://t.me/bohdan2306', '_blank', 'noopener,noreferrer');
  return { sent: false, via: 'telegram' };
}

async function handleThanksSubmit(event) {
  event.preventDefault();

  const message = thanksFeedback?.value.trim();
  if (!message) {
    thanksFeedback?.focus();
    return;
  }

  thanksSend.disabled = true;
  thanksSend.textContent = '…';

  try {
    const result = await sendFeedback(message);
    thanksStatus.hidden = false;
    thanksStatus.textContent = result.sent
      ? 'Надіслано!'
      : 'Відкрито Telegram — вставте текст';
    thanksTimer = setTimeout(closeThanks, result.sent ? 1200 : 2500);
  } catch {
    thanksStatus.hidden = false;
    thanksStatus.textContent = 'Не вдалося надіслати';
    thanksSend.disabled = false;
    thanksSend.textContent = 'Надіслати';
  }
}

function confirmPaymentSuccess() {
  clearPendingPayment();
  pendingOrder = null;
  awaitingPayment = false;
  closeConfirmSheet();
  clearCart();
  showThanks();
}

function cancelPendingPayment() {
  clearPendingPayment();
  pendingOrder = null;
  awaitingPayment = false;
  closeConfirmSheet();
  clearCart();
}

rows.forEach((row) => {
  row.classList.add('is-entering');
  row.addEventListener('animationend', (event) => {
    if (event.animationName === 'row-in') {
      row.classList.remove('is-entering');
    }
  });

  row.querySelectorAll('.qty-btn').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const delta = button.dataset.action === 'plus' ? 1 : -1;
      changeQty(row, delta, button);
    });
  });
});

carWashSheet?.querySelectorAll('[data-car-wash-level]').forEach((button) => {
  button.addEventListener('click', () => {
    addCarWashLevel(button.dataset.carWashLevel, button);
  });
});

carWashSheet?.querySelectorAll('[data-car-wash-close]').forEach((el) => {
  el.addEventListener('click', closeCarWashSheet);
});

let cartPayTapLock = false;

function handleCartPayTap(event) {
  if (event.cancelable) event.preventDefault();
  if (cart.hidden || cartPayTapLock) return;

  cartPayTapLock = true;
  pulseClass(cartPay, 'btn-squish', 180);
  loader.hidden = false;
  loaderText.textContent = 'Формуємо чек…';

  if (receiptBuildTimer) clearTimeout(receiptBuildTimer);
  receiptBuildTimer = setTimeout(() => {
    receiptBuildTimer = null;
    loader.hidden = true;
    openSheet();
  }, 550);

  setTimeout(() => {
    cartPayTapLock = false;
  }, 700);
}

cartPay.addEventListener('pointerup', handleCartPayTap);
cartPay.addEventListener('touchend', handleCartPayTap, { passive: false });
cartPay.addEventListener('click', handleCartPayTap);

payActions.forEach((action) => {
  action.addEventListener('click', () => {
    goToPayment(action.dataset.provider);
  });
});

sheet.querySelectorAll('[data-close]').forEach((el) => {
  el.addEventListener('click', closeSheet);
});

thanksForm?.addEventListener('submit', handleThanksSubmit);
thanksSkip?.addEventListener('click', closeThanks);

confirmYes.addEventListener('click', confirmPaymentSuccess);
confirmNo.addEventListener('click', cancelPendingPayment);

confirmSheet.querySelector('[data-confirm-close]')?.addEventListener('click', cancelPendingPayment);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (statsGate && !statsGate.hidden) closeStatsGate();
    else if (statsPanel && !statsPanel.hidden) closeStats();
    else if (carWashSheet && !carWashSheet.hidden) closeCarWashSheet();
    else if (!confirmSheet.hidden) cancelPendingPayment();
    else if (!sheet.hidden) closeSheet();
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    handleReturnFromPayment();
  }
});

window.addEventListener('pageshow', (event) => {
  if (event.persisted && loadPendingPayment()) {
    reloadAfterPaymentReturn();
    return;
  }

  if (sessionStorage.getItem(RELOAD_KEY)) {
    sessionStorage.removeItem(RELOAD_KEY);
    return;
  }

  if (loadPendingPayment()) return;

  dismissOverlays();
});

initPaymentReturn();
updateCart();

function loadLocalStats() {
  try {
    const raw = localStorage.getItem(STATS_LOCAL_KEY);
    if (!raw) return { incomes: [], expenses: [] };
    const data = JSON.parse(raw);
    if (Array.isArray(data.incomes) || Array.isArray(data.expenses)) {
      return {
        incomes: Array.isArray(data.incomes) ? data.incomes : [],
        expenses: Array.isArray(data.expenses) ? data.expenses : [],
      };
    }
    const incomes = Array.isArray(data.orders)
      ? data.orders.map((order) => ({
          id: order.id,
          label: formatOrderSummary(order.items || []),
          amount: Number(order.total || 0),
          source: 'order',
          provider: order.provider || 'bank',
          items: order.items || [],
          createdAt: order.createdAt,
        }))
      : [];
    return {
      incomes,
      expenses: Array.isArray(data.expenses) ? data.expenses : [],
    };
  } catch {
    return { incomes: [], expenses: [] };
  }
}

function saveLocalStats(data) {
  localStorage.setItem(STATS_LOCAL_KEY, JSON.stringify(data));
}

function mergeStats(localData, remoteData) {
  const incomes = [...remoteData.incomes, ...localData.incomes];
  const expenses = [...remoteData.expenses, ...localData.expenses];
  const seenIncomes = new Set();
  const seenExpenses = new Set();

  const uniqueIncomes = incomes.filter((item) => {
    const key = item.id || `${item.createdAt}-${item.amount}-${item.label}`;
    if (seenIncomes.has(key)) return false;
    seenIncomes.add(key);
    return true;
  });

  const uniqueExpenses = expenses.filter((item) => {
    const key = item.id || `${item.createdAt}-${item.amount}-${item.label}`;
    if (seenExpenses.has(key)) return false;
    seenExpenses.add(key);
    return true;
  });

  uniqueIncomes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  uniqueExpenses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return {
    incomes: uniqueIncomes.slice(0, 500),
    expenses: uniqueExpenses.slice(0, 500),
  };
}

function formatStatsMoney(value) {
  return `${Math.round(value).toLocaleString('uk-UA')} грн`;
}

function formatStatsDate(value) {
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function formatOrderSummary(items) {
  return items.map((item) => `${item.name} × ${item.qty}`).join(', ');
}

function renderRoi(income, expenses) {
  if (!statsRoiMain || !statsRoiSub) return;

  if (expenses <= 0) {
    statsRoiMain.textContent = '—';
    statsRoiSub.hidden = true;
    statsRoiSub.textContent = '';
    return;
  }

  if (income >= expenses) {
    const profit = income - expenses;
    statsRoiMain.textContent = '100%';
    statsRoiSub.textContent = profit > 0 ? `+${formatStatsMoney(profit)}` : formatStatsMoney(0);
    statsRoiSub.hidden = false;
    return;
  }

  const percent = Math.round((income / expenses) * 100);
  const left = expenses - income;
  statsRoiMain.textContent = `${percent}%`;
  statsRoiSub.textContent = `ще ${formatStatsMoney(left)}`;
  statsRoiSub.hidden = false;
}

function queueLocalOrder(order, provider) {
  const data = loadLocalStats();
  data.incomes.unshift({
    id: `income-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label: formatOrderSummary(order.items || []),
    amount: order.total,
    source: 'order',
    provider,
    items: order.items.map((item) => ({ ...item })),
    createdAt: new Date().toISOString(),
  });
  data.incomes = data.incomes.slice(0, 500);
  saveLocalStats(data);
}

function incomeTitle(item) {
  if (item.source === 'order' && Array.isArray(item.items) && item.items.length) {
    return formatOrderSummary(item.items);
  }
  return item.label || 'Дохід';
}

function incomeMeta(item) {
  const date = formatStatsDate(item.createdAt);
  if (item.provider === 'cash' || item.source === 'cash') {
    return `${date} · готівка`;
  }
  if (item.source === 'order') {
    const provider = item.provider === 'mono'
      ? 'Monobank'
      : item.provider === 'privat'
        ? 'Приват24'
        : 'банк';
    return `${date} · ${provider}`;
  }
  return date;
}

function createTransactionActions(item, kind) {
  const actions = document.createElement('div');
  actions.className = 'stats-list-actions';

  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.className = 'stats-edit-btn';
  editBtn.textContent = '✎';
  editBtn.setAttribute('aria-label', 'Редагувати');
  editBtn.addEventListener('click', () => {
    openEditTransaction(item);
  });

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'stats-delete-btn';
  removeBtn.textContent = '×';
  removeBtn.setAttribute('aria-label', kind === 'income' ? 'Видалити дохід' : 'Видалити витрату');
  removeBtn.addEventListener('click', () => {
    deleteTransaction(item.id);
  });

  actions.append(editBtn, removeBtn);
  return actions;
}

async function fetchRemoteStats() {
  try {
    const response = await fetch('/api/stats');
    if (!response.ok) return { incomes: [], expenses: [] };
    const data = await response.json();
    return {
      incomes: Array.isArray(data.incomes) ? data.incomes : [],
      expenses: Array.isArray(data.expenses) ? data.expenses : [],
    };
  } catch {
    return { incomes: [], expenses: [] };
  }
}

function renderIncomeItem(item) {
  const li = document.createElement('li');
  li.className = 'stats-list-item';

  const main = document.createElement('div');
  main.className = 'stats-list-main';

  const title = document.createElement('span');
  title.className = 'stats-list-title';
  title.textContent = incomeTitle(item);

  const meta = document.createElement('span');
  meta.className = 'stats-list-meta';
  meta.textContent = incomeMeta(item);

  const sum = document.createElement('span');
  sum.className = 'stats-list-sum';
  sum.textContent = `+${formatStatsMoney(item.amount)}`;

  main.append(title, meta);
  li.append(main, sum, createTransactionActions(item, 'income'));
  return li;
}

function renderExpenseItem(expense) {
  const li = document.createElement('li');
  li.className = 'stats-list-item';

  const main = document.createElement('div');
  main.className = 'stats-list-main';

  const title = document.createElement('span');
  title.className = 'stats-list-title';
  title.textContent = expense.label;

  const meta = document.createElement('span');
  meta.className = 'stats-list-meta';
  meta.textContent = formatStatsDate(expense.createdAt);

  const sum = document.createElement('span');
  sum.className = 'stats-list-sum';
  sum.textContent = `-${formatStatsMoney(expense.amount)}`;

  main.append(title, meta);
  li.append(main, sum, createTransactionActions(expense, 'expense'));
  return li;
}

function renderTransactionSection({
  listEl,
  moreBtn,
  items,
  expanded,
  emptyText,
  renderItem,
}) {
  if (!listEl) return;

  listEl.innerHTML = '';

  if (!items.length) {
    const empty = document.createElement('li');
    empty.className = 'stats-empty';
    empty.textContent = emptyText;
    listEl.appendChild(empty);
    if (moreBtn) moreBtn.hidden = true;
    return;
  }

  const visibleItems = expanded ? items : items.slice(0, STATS_LIST_PREVIEW);
  visibleItems.forEach((item) => {
    listEl.appendChild(renderItem(item));
  });

  if (!moreBtn) return;

  if (items.length > STATS_LIST_PREVIEW) {
    const hiddenCount = items.length - STATS_LIST_PREVIEW;
    moreBtn.hidden = false;
    moreBtn.textContent = expanded ? 'Згорнути' : `Переглянути ще (${hiddenCount})`;
  } else {
    moreBtn.hidden = true;
  }
}

function renderStatsView(data) {
  const income = data.incomes.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const expenses = data.expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  statsIncome.textContent = formatStatsMoney(income);
  statsExpensesTotal.textContent = formatStatsMoney(expenses);
  renderRoi(income, expenses);

  renderTransactionSection({
    listEl: statsIncomes,
    moreBtn: statsIncomesMore,
    items: data.incomes,
    expanded: incomesListExpanded,
    emptyText: 'Доходів ще немає',
    renderItem: renderIncomeItem,
  });

  renderTransactionSection({
    listEl: statsExpenseList,
    moreBtn: statsExpensesMore,
    items: data.expenses,
    expanded: expensesListExpanded,
    emptyText: 'Витрат ще немає',
    renderItem: renderExpenseItem,
  });
}

async function syncLocalToRemote(localData, remoteData) {
  const remoteIncomeIds = new Set(remoteData.incomes.map((item) => item.id).filter(Boolean));
  const remoteExpenseIds = new Set(remoteData.expenses.map((item) => item.id).filter(Boolean));

  const incomes = localData.incomes.filter((item) => item.id && !remoteIncomeIds.has(item.id));
  const expenses = localData.expenses.filter((item) => item.id && !remoteExpenseIds.has(item.id));

  if (!incomes.length && !expenses.length) return remoteData;

  try {
    const response = await fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'sync',
        incomes,
        expenses,
      }),
    });

    if (!response.ok) return remoteData;
    return await fetchRemoteStats();
  } catch {
    return remoteData;
  }
}

async function refreshStats() {
  const local = loadLocalStats();
  let remote = await fetchRemoteStats();
  remote = await syncLocalToRemote(local, remote);
  const merged = mergeStats(local, remote);
  saveLocalStats(merged);
  currentStatsData = merged;
  renderStatsView(merged);
}

function isStatsAuthenticated() {
  return sessionStorage.getItem(STATS_AUTH_KEY) === '1';
}

function openStatsGate() {
  if (!statsGate) return;
  statsGate.hidden = false;
  document.body.classList.add('stats-gate-open');
  statsGateError.hidden = true;
  statsGateForm?.reset();
  statsGatePassword?.focus();
}

function closeStatsGate() {
  if (!statsGate) return;
  statsGate.hidden = true;
  document.body.classList.remove('stats-gate-open');
  statsGateError.hidden = true;
  statsGateForm?.reset();
}

function requestStatsAccess() {
  if (isStatsAuthenticated()) {
    openStats();
    return;
  }
  openStatsGate();
}

function openStats() {
  if (!statsPanel) return;
  statsPanel.hidden = false;
  document.body.classList.add('stats-open');
  refreshStats();
}

function closeStats() {
  if (!statsPanel) return;
  statsPanel.hidden = true;
  document.body.classList.remove('stats-open');
  incomesListExpanded = false;
  expensesListExpanded = false;
  closeEditTransaction();
}

async function addCashIncome(label, amount) {
  const income = {
    id: `income-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label,
    amount,
    source: 'cash',
    provider: 'cash',
    createdAt: new Date().toISOString(),
  };

  const local = loadLocalStats();
  local.incomes.unshift(income);
  saveLocalStats(local);

  try {
    await fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'income',
        label,
        amount,
      }),
    });
  } catch {
    // keep local copy even if sync fails
  }

  await refreshStats();
}

async function addExpense(label, amount) {
  const expense = {
    id: `expense-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label,
    amount,
    createdAt: new Date().toISOString(),
  };

  const local = loadLocalStats();
  local.expenses.unshift(expense);
  saveLocalStats(local);

  try {
    await fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'expense',
        label,
        amount,
      }),
    });
  } catch {
    // keep local copy even if sync fails
  }

  await refreshStats();
}

async function deleteTransaction(id) {
  const local = loadLocalStats();
  local.incomes = local.incomes.filter((item) => item.id !== id);
  local.expenses = local.expenses.filter((item) => item.id !== id);
  saveLocalStats(local);

  try {
    await fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'delete',
        id,
      }),
    });
  } catch {
    // keep local copy even if sync fails
  }

  if (editingTransactionId === id) closeEditTransaction();
  await refreshStats();
}

function openEditTransaction(item) {
  if (!statsEditForm) return;
  editingTransactionId = item.id;
  statsEditLabel.value = item.label || incomeTitle(item);
  statsEditAmount.value = String(item.amount || '');
  statsEditForm.hidden = false;
  statsEditLabel.focus();
}

function closeEditTransaction() {
  editingTransactionId = null;
  if (statsEditForm) {
    statsEditForm.hidden = true;
    statsEditForm.reset();
  }
}

async function saveEditedTransaction(label, amount) {
  if (!editingTransactionId) return;

  const local = loadLocalStats();
  const income = local.incomes.find((item) => item.id === editingTransactionId);
  const expense = local.expenses.find((item) => item.id === editingTransactionId);

  if (income) {
    income.label = label;
    income.amount = amount;
  }
  if (expense) {
    expense.label = label;
    expense.amount = amount;
  }
  saveLocalStats(local);

  try {
    await fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'update',
        id: editingTransactionId,
        label,
        amount,
      }),
    });
  } catch {
    // keep local copy even if sync fails
  }

  closeEditTransaction();
  await refreshStats();
}

heroIcon?.addEventListener('click', requestStatsAccess);
statsGate?.querySelector('[data-stats-gate-close]')?.addEventListener('click', closeStatsGate);

statsGateForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const password = statsGatePassword?.value.trim();
  if (password !== STATS_PASSWORD) {
    statsGateError.hidden = false;
    statsGatePassword?.focus();
    statsGatePassword?.select();
    return;
  }

  sessionStorage.setItem(STATS_AUTH_KEY, '1');
  closeStatsGate();
  openStats();
});

statsPanel?.querySelector('[data-stats-close]')?.addEventListener('click', closeStats);

statsIncomesMore?.addEventListener('click', () => {
  incomesListExpanded = !incomesListExpanded;
  renderStatsView(currentStatsData);
});

statsExpensesMore?.addEventListener('click', () => {
  expensesListExpanded = !expensesListExpanded;
  renderStatsView(currentStatsData);
});

statsIncomeForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const label = statsIncomeLabel?.value.trim();
  const amount = Number(statsIncomeAmount?.value);

  if (!label || !Number.isFinite(amount) || amount <= 0) return;

  await addCashIncome(label, amount);
  statsIncomeForm.reset();
});

statsExpenseForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const label = statsExpenseLabel?.value.trim();
  const amount = Number(statsExpenseAmount?.value);

  if (!label || !Number.isFinite(amount) || amount <= 0) return;

  await addExpense(label, amount);
  statsExpenseForm.reset();
});

statsEditForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const label = statsEditLabel?.value.trim();
  const amount = Number(statsEditAmount?.value);

  if (!label || !Number.isFinite(amount) || amount <= 0) return;

  await saveEditedTransaction(label, amount);
});

statsEditForm?.querySelector('[data-edit-cancel]')?.addEventListener('click', closeEditTransaction);
