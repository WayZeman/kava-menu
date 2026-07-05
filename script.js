const MONO_JAR = 'https://send.monobank.ua/jar/4znkD4kdM5';
const PRIVAT_ENVELOPE = 'https://www.privat24.ua/send/jzbnv';
const MONO_ANDROID = 'com.ftband.mono';
const OTHER_BANK_CARD = '4874100025126965';
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
const rows = document.querySelectorAll('.menu--services .row');
const drinksMenu = document.getElementById('drinks-menu');
const menuEditor = document.getElementById('menu-editor');
const menuEditorIconPicker = document.getElementById('menu-editor-icon-picker');
const menuEditorIconHint = document.getElementById('menu-editor-icon-hint');
const menuEditorList = document.getElementById('menu-editor-list');
const menuEditorEmpty = document.getElementById('menu-editor-empty');
const menuSettingsBtn = document.getElementById('stats-menu-settings');
const statsMenuEntryMeta = document.getElementById('stats-menu-entry-meta');
const menuAddForm = document.getElementById('menu-add-form');
const menuAddName = document.getElementById('menu-add-name');
const menuAddAmount = document.getElementById('menu-add-amount');
const payActions = document.querySelectorAll('#sheet [data-provider]');
const confirmYes = document.getElementById('confirm-yes');
const confirmNo = document.getElementById('confirm-no');
const thanks = document.getElementById('thanks');
const carWashSheet = document.getElementById('car-wash-sheet');
const cardPaySheet = document.getElementById('card-pay-sheet');
const cardPayAmount = document.getElementById('card-pay-amount');
const cardPayCopy = document.getElementById('card-pay-copy');
const carWashRow = document.querySelector('[data-picker="car-wash"]');
const heroIcon = document.querySelector('.hero-icon');
const statsPanel = document.getElementById('stats');
const statsIncome = document.getElementById('stats-income');
const statsExpensesTotal = document.getElementById('stats-expenses-total');
const statsRoiMain = document.getElementById('stats-roi-main');
const statsRoiSub = document.getElementById('stats-roi-sub');
const statsRoiFill = document.getElementById('stats-roi-fill');
const statsRoiCard = document.querySelector('.stats-card--roi');
const statsTabIncome = document.getElementById('stats-tab-income');
const statsTabExpense = document.getElementById('stats-tab-expense');
const statsPanelIncome = document.getElementById('stats-panel-income');
const statsPanelExpense = document.getElementById('stats-panel-expense');
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
const statsCoffeeTotal = document.getElementById('stats-coffee-total');
const statsCoffeeMeta = document.getElementById('stats-coffee-meta');
const statsHaircutTotal = document.getElementById('stats-haircut-total');
const statsHaircutMeta = document.getElementById('stats-haircut-meta');
const statsDailyChart = document.getElementById('stats-daily-chart');
const statsChartHeading = document.getElementById('stats-chart-heading');
const statsChartPeriodButtons = document.querySelectorAll('[data-chart-period]');
const statsTotalIncome = document.getElementById('stats-total-income');
const statsTotalExpenses = document.getElementById('stats-total-expenses');
const statsBalanceTotal = document.getElementById('stats-balance-total');

const STATS_AUTH_KEY = 'kava-stats-auth';
const STATS_PASSWORD = '1111';
const STATS_LIST_PREVIEW = 5;
const MENU_KEY = 'kava-menu-drinks';
const MENU_UPDATED_KEY = 'kava-menu-updated-at';
const APP_VERSION = '47';
const HAIRCUT_ID = 'haircut';
const CHART_PERIOD_CONFIG = {
  week: {
    className: 'stats-daily-chart--week',
    heading: 'Замовлення кави по днях',
  },
  month: {
    className: 'stats-daily-chart--month',
    heading: 'Замовлення кави по днях',
  },
  year: {
    className: 'stats-daily-chart--year',
    heading: 'Замовлення кави по місяцях',
  },
};
let statsChartPeriod = 'week';
let incomesListExpanded = false;
let expensesListExpanded = false;
let statsActiveTab = 'income';
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

const DEFAULT_DRINKS = [
  { id: 'espresso', name: 'Еспресо', amount: 20, icon: 'espresso' },
  { id: 'double-espresso', name: 'Подвійний еспресо', amount: 30, icon: 'double-espresso' },
  { id: 'americano', name: 'Американо', amount: 20, icon: 'americano' },
  { id: 'cappuccino', name: 'Капучино', amount: 35, icon: 'cappuccino' },
  { id: 'latte', name: 'Лате Макіато', amount: 40, icon: 'latte' },
  { id: 'iced-latte', name: 'Айс Лате', amount: 40, icon: 'iced-latte' },
];

const LEGACY_DEFAULT_DRINKS = [
  { id: 'espresso', name: 'Еспресо', amount: 20, icon: 'espresso' },
  { id: 'americano', name: 'Американо', amount: 20, icon: 'americano' },
  { id: 'americano-milk', name: 'Американо з молоком', amount: 30, icon: 'americano-milk' },
  { id: 'cappuccino', name: 'Капучино', amount: 35, icon: 'cappuccino' },
  { id: 'latte', name: 'Лате Макіато', amount: 40, icon: 'latte' },
];

const DRINK_ICON_OPTIONS = [
  { id: 'espresso', label: 'Еспресо' },
  { id: 'double-espresso', label: '2× еспресо' },
  { id: 'americano', label: 'Американо' },
  { id: 'americano-milk', label: 'З молоком' },
  { id: 'cappuccino', label: 'Капучино' },
  { id: 'latte', label: 'Лате' },
  { id: 'iced-latte', label: 'Айс Лате' },
  { id: 'hot-water', label: 'Гаряча вода' },
  { id: 'generic', label: 'Чашка' },
];

const DRINK_ICONS = {
  espresso: '<rect x="14" y="18" width="20" height="22" rx="3" fill="#2f1a0f"/><path d="M34 24h4a3 3 0 0 1 0 6h-4" fill="none" stroke="#2f1a0f" stroke-width="2"/><ellipse cx="24" cy="18" rx="10" ry="3" fill="#d4a853"/>',
  'double-espresso': '<rect x="9" y="20" width="13" height="18" rx="2.5" fill="#2f1a0f"/><ellipse cx="15.5" cy="20" rx="6.5" ry="2" fill="#d4a853"/><rect x="26" y="20" width="13" height="18" rx="2.5" fill="#2f1a0f"/><ellipse cx="32.5" cy="20" rx="6.5" ry="2" fill="#d4a853"/><path d="M22 28h4" stroke="#d4a853" stroke-width="2" stroke-linecap="round"/>',
  americano: '<path d="M16 10h16l-2 28a4 4 0 0 1-4 3.5H22a4 4 0 0 1-4-3.5L16 10z" fill="#f5f0e8" stroke="#2f1a0f" stroke-width="2"/><path d="M18 16h12v18H18z" fill="#5c3a28"/><ellipse cx="24" cy="16" rx="6" ry="2" fill="#d4a853"/>',
  'americano-milk': '<path d="M16 10h16l-2 28a4 4 0 0 1-4 3.5H22a4 4 0 0 1-4-3.5L16 10z" fill="#f5f0e8" stroke="#2f1a0f" stroke-width="2"/><path d="M18 20h12v14H18z" fill="#5c3a28"/><path d="M18 16h12v6H18z" fill="#f5f0e8"/><ellipse cx="24" cy="16" rx="6" ry="2" fill="#d4a853"/>',
  cappuccino: '<path d="M14 20h20v18a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V20z" fill="#f5f0e8" stroke="#2f1a0f" stroke-width="2"/><rect x="14" y="30" width="20" height="8" fill="#5c3a28"/><ellipse cx="24" cy="20" rx="10" ry="3" fill="#f5f0e8"/>',
  latte: '<path d="M17 8h14l3 32a3 3 0 0 1-3 2.5H17a3 3 0 0 1-3-2.5L17 8z" fill="#f5f0e8" stroke="#2f1a0f" stroke-width="2"/><rect x="19" y="28" width="10" height="10" fill="#5c3a28"/><rect x="19" y="18" width="10" height="8" fill="#d4a853"/><rect x="19" y="12" width="10" height="5" fill="#f5f0e8"/>',
  'iced-latte': '<path d="M17 10h14l-2.5 30a2.5 2.5 0 0 1-2.5 2H22a2.5 2.5 0 0 1-2.5-2L17 10z" fill="#f5f0e8" stroke="#2f1a0f" stroke-width="2"/><rect x="19" y="30" width="10" height="9" fill="#5c3a28"/><rect x="19" y="22" width="10" height="8" fill="#f5f0e8"/><rect x="20" y="24" width="4" height="4" rx="0.8" fill="#b8dff0" stroke="#7eb8d4" stroke-width="1"/><rect x="26" y="27" width="3.5" height="3.5" rx="0.8" fill="#b8dff0" stroke="#7eb8d4" stroke-width="1"/><path d="M31 8v16" stroke="#d4a853" stroke-width="2" stroke-linecap="round"/>',
  'hot-water': '<path d="M15 20h18v18a3 3 0 0 1-3 3H18a3 3 0 0 1-3-3V20z" fill="#f5f0e8" stroke="#2f1a0f" stroke-width="2"/><rect x="17" y="24" width="14" height="12" fill="#c5e3f6"/><ellipse cx="24" cy="24" rx="7" ry="2" fill="#dceefb"/><path d="M20 16c1-2 2-3 2-5" stroke="#b8b0a8" stroke-width="1.6" stroke-linecap="round" fill="none"/><path d="M24 14c1-2 2-3 2-5" stroke="#b8b0a8" stroke-width="1.6" stroke-linecap="round" fill="none"/><path d="M28 16c1-2 2-3 2-5" stroke="#b8b0a8" stroke-width="1.6" stroke-linecap="round" fill="none"/>',
  generic: '<path d="M14 20h20v18a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V20z" fill="#f5f0e8" stroke="#2f1a0f" stroke-width="2"/><rect x="14" y="30" width="20" height="8" fill="#5c3a28"/><ellipse cx="24" cy="20" rx="10" ry="3" fill="#d4a853"/>',
};

let menuDrinks = [];
let menuEditorSelectedIcon = 'generic';
let menuEditorEditingId = null;

const cartItems = new Map();
let paymentTotal = 0;
let recoverTimer = null;
let thanksTimer = null;
let receiptBuildTimer = null;
let pendingOrder = null;
let pendingOrderId = null;
let awaitingPayment = false;
let otherPaymentRecorded = false;
let cartWasHidden = true;

function getMenuRows() {
  return document.querySelectorAll('.menu .row');
}

function normalizeDrink(raw) {
  const name = String(raw?.name || '').trim();
  const amount = Number(raw?.amount);
  const id = String(raw?.id || '').trim();
  if (!name || !id || !Number.isFinite(amount) || amount <= 0 || amount > 100000) return null;
  return {
    id,
    name,
    amount: Math.round(amount),
    icon: String(raw?.icon || 'generic').trim() || 'generic',
  };
}

function loadMenuDrinksFromStorage() {
  try {
    const raw = localStorage.getItem(MENU_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const drinks = parsed.map(normalizeDrink).filter(Boolean);
    return drinks.length ? drinks : null;
  } catch {
    return null;
  }
}

function menusEqual(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  return JSON.stringify(a) === JSON.stringify(b);
}

function isDefaultMenu(drinks) {
  return menusEqual(drinks, DEFAULT_DRINKS) || menusEqual(drinks, LEGACY_DEFAULT_DRINKS);
}

async function uploadMenuDrinks(drinks) {
  try {
    const response = await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ drinks }),
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const data = await response.json();
    if (data.updatedAt) {
      localStorage.setItem(MENU_UPDATED_KEY, data.updatedAt);
    }
    return data;
  } catch {
    return null;
  }
}

async function loadMenuDrinks() {
  const local = loadMenuDrinksFromStorage();
  const localUpdatedAt = localStorage.getItem(MENU_UPDATED_KEY);
  let remote = null;
  let remoteUpdatedAt = null;

  try {
    const response = await fetch('/api/menu', { cache: 'no-store' });
    if (response.ok) {
      const data = await response.json();
      remote = Array.isArray(data.drinks)
        ? data.drinks.map(normalizeDrink).filter(Boolean)
        : null;
      remoteUpdatedAt = data.updatedAt || null;
    }
  } catch {
    // fall back to local copy
  }

  if (local?.length && remote?.length && !menusEqual(local, remote)) {
    const remoteTime = remoteUpdatedAt ? Date.parse(remoteUpdatedAt) : 0;
    const localTime = localUpdatedAt ? Date.parse(localUpdatedAt) : 0;

    if (localTime > remoteTime || isDefaultMenu(remote)) {
      localStorage.setItem(MENU_KEY, JSON.stringify(local));
      await uploadMenuDrinks(local);
      return local;
    }

    localStorage.setItem(MENU_KEY, JSON.stringify(remote));
    if (remoteUpdatedAt) localStorage.setItem(MENU_UPDATED_KEY, remoteUpdatedAt);
    return remote;
  }

  if (local?.length && (!remote?.length || isDefaultMenu(remote))) {
    localStorage.setItem(MENU_KEY, JSON.stringify(local));
    await uploadMenuDrinks(local);
    return local;
  }

  if (remote?.length && !isDefaultMenu(remote)) {
    localStorage.setItem(MENU_KEY, JSON.stringify(remote));
    if (remoteUpdatedAt) localStorage.setItem(MENU_UPDATED_KEY, remoteUpdatedAt);
    return remote;
  }

  if (local?.length) return local;

  const drinks = DEFAULT_DRINKS.map((item) => ({ ...item }));
  localStorage.setItem(MENU_KEY, JSON.stringify(drinks));
  await uploadMenuDrinks(drinks);
  return drinks;
}

function saveMenuDrinksLocal() {
  try {
    localStorage.setItem(MENU_KEY, JSON.stringify(menuDrinks));
  } catch {
    // ignore quota errors
  }
}

async function saveMenuDrinks() {
  saveMenuDrinksLocal();
  const updatedAt = new Date().toISOString();
  localStorage.setItem(MENU_UPDATED_KEY, updatedAt);

  try {
    const response = await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ drinks: menuDrinks }),
      keepalive: true,
      cache: 'no-store',
    });
    if (response.ok) {
      const data = await response.json();
      if (data.updatedAt) localStorage.setItem(MENU_UPDATED_KEY, data.updatedAt);
    }
  } catch {
    // menu still saved locally; server sync retries on next edit
  }
}

function makeDrinkId(name, existingIds) {
  const transliterated = String(name || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 40);
  let base = transliterated || `drink-${Date.now()}`;
  if (!existingIds.has(base)) return base;
  let index = 2;
  while (existingIds.has(`${base}-${index}`)) index += 1;
  return `${base}-${index}`;
}

function drinkIconMarkup(iconKey) {
  const inner = DRINK_ICONS[iconKey] || DRINK_ICONS.generic;
  return `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
}

function bindMenuRow(row) {
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
}

function createDrinkRow(drink) {
  const row = document.createElement('article');
  row.className = 'row';
  row.dataset.id = drink.id;
  row.dataset.name = drink.name;
  row.dataset.amount = String(drink.amount);

  row.innerHTML = `
    <span class="drink-icon" aria-hidden="true">${drinkIconMarkup(drink.icon)}</span>
    <div class="row-main">
      <span class="name"></span>
    </div>
    <span class="price"></span>
    <div class="qty">
      <button class="qty-btn" type="button" data-action="minus" aria-label="Менше">−</button>
      <span class="qty-value">0</span>
      <button class="qty-btn" type="button" data-action="plus" aria-label="Більше">+</button>
    </div>
  `;

  row.querySelector('.name').textContent = drink.name;
  row.querySelector('.price').textContent = `${drink.amount} грн`;
  return row;
}

function renderDrinksMenu() {
  if (!drinksMenu) return;

  const prevQty = new Map();
  drinksMenu.querySelectorAll('.row').forEach((row) => {
    const qty = cartItems.get(row.dataset.id)?.qty;
    if (qty) prevQty.set(row.dataset.id, qty);
  });

  drinksMenu.innerHTML = '';
  menuDrinks.forEach((drink) => {
    const row = createDrinkRow(drink);
    drinksMenu.appendChild(row);
    bindMenuRow(row);
    if (prevQty.has(drink.id)) {
      setRowQty(row, prevQty.get(drink.id));
    }
  });

  Array.from(cartItems.keys()).forEach((id) => {
    if (!menuDrinks.some((drink) => drink.id === id)) {
      cartItems.delete(id);
    }
  });

  updateCart();
  updateMenuEntryMeta();
}

function addMenuDrink(name, amount, icon = menuEditorSelectedIcon) {
  const existingIds = new Set(menuDrinks.map((drink) => drink.id));
  const drink = {
    id: makeDrinkId(name, existingIds),
    name,
    amount: Math.round(amount),
    icon: DRINK_ICONS[icon] ? icon : 'generic',
  };
  menuDrinks.push(drink);
  persistMenuDrinks();
  renderDrinksMenu();
  renderMenuEditorList();
  updateMenuEntryMeta();
}

function updateMenuDrink(id, name, amount, icon) {
  const drink = menuDrinks.find((item) => item.id === id);
  if (!drink) return;

  drink.name = name;
  drink.amount = Math.round(amount);
  if (icon && DRINK_ICONS[icon]) drink.icon = icon;
  persistMenuDrinks();
  renderDrinksMenu();
  renderMenuEditorList();
}

function removeMenuDrink(id) {
  menuDrinks = menuDrinks.filter((drink) => drink.id !== id);
  cartItems.delete(id);
  if (menuEditorEditingId === id) {
    menuEditorEditingId = null;
    menuEditorSelectedIcon = 'generic';
    renderMenuEditorIconPicker();
  }
  persistMenuDrinks();
  renderDrinksMenu();
  renderMenuEditorList();
  updateMenuEntryMeta();
  updateCart();
}

function moveMenuDrink(id, direction) {
  const index = menuDrinks.findIndex((drink) => drink.id === id);
  if (index < 0) return;

  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= menuDrinks.length) return;

  const [drink] = menuDrinks.splice(index, 1);
  menuDrinks.splice(nextIndex, 0, drink);
  persistMenuDrinks();
  renderDrinksMenu();
  renderMenuEditorList();
}

function persistMenuDrinks() {
  saveMenuDrinksLocal();
  saveMenuDrinks();
}

function updateMenuEntryMeta() {
  if (!statsMenuEntryMeta) return;
  const count = menuDrinks.length;
  const label = count === 1 ? 'напій' : count >= 2 && count <= 4 ? 'напої' : 'напоїв';
  statsMenuEntryMeta.textContent = count
    ? `${count} ${label} · додати або прибрати`
    : 'Додати або прибрати напої';
}

function setMenuEditorIcon(iconId, { editingId = null } = {}) {
  menuEditorSelectedIcon = DRINK_ICONS[iconId] ? iconId : 'generic';
  menuEditorEditingId = editingId;

  if (editingId) {
    const drink = menuDrinks.find((item) => item.id === editingId);
    if (drink) {
      drink.icon = menuEditorSelectedIcon;
      persistMenuDrinks();
      renderDrinksMenu();
      renderMenuEditorList();
    }
  }

  renderMenuEditorIconPicker();
}

function renderMenuEditorIconPicker() {
  if (!menuEditorIconPicker) return;

  menuEditorIconPicker.innerHTML = '';

  if (menuEditorIconHint) {
    if (menuEditorEditingId) {
      const drink = menuDrinks.find((item) => item.id === menuEditorEditingId);
      menuEditorIconHint.textContent = drink
        ? `Значок для «${drink.name}»`
        : 'Оберіть значок';
    } else {
      menuEditorIconHint.textContent = 'Оберіть значок для нового напою';
    }
  }

  DRINK_ICON_OPTIONS.forEach((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'menu-editor-icon-option';
    button.dataset.icon = option.id;
    button.setAttribute('role', 'option');
    button.setAttribute('aria-label', option.label);
    button.setAttribute('aria-selected', option.id === menuEditorSelectedIcon ? 'true' : 'false');

    if (option.id === menuEditorSelectedIcon) {
      button.classList.add('is-active');
    }

    button.innerHTML = `
      <span class="menu-editor-icon-preview">${drinkIconMarkup(option.id)}</span>
      <span class="menu-editor-icon-label">${option.label}</span>
    `;

    button.addEventListener('click', () => {
      setMenuEditorIcon(option.id, { editingId: menuEditorEditingId });
    });

    menuEditorIconPicker.appendChild(button);
  });
}

function renderMenuEditorList() {
  if (!menuEditorList) return;

  menuEditorList.innerHTML = '';

  if (!menuDrinks.length) {
    if (menuEditorEmpty) menuEditorEmpty.hidden = false;
    return;
  }

  if (menuEditorEmpty) menuEditorEmpty.hidden = true;

  menuDrinks.forEach((drink, index) => {
    const li = document.createElement('li');
    li.className = 'menu-editor-item';
    if (menuEditorEditingId === drink.id) {
      li.classList.add('is-editing-icon');
    }

    const orderWrap = document.createElement('div');
    orderWrap.className = 'menu-editor-item-order';

    const upBtn = document.createElement('button');
    upBtn.type = 'button';
    upBtn.className = 'menu-editor-move-btn';
    upBtn.textContent = '↑';
    upBtn.disabled = index === 0;
    upBtn.setAttribute('aria-label', 'Підняти вище');
    upBtn.addEventListener('click', () => moveMenuDrink(drink.id, -1));

    const downBtn = document.createElement('button');
    downBtn.type = 'button';
    downBtn.className = 'menu-editor-move-btn';
    downBtn.textContent = '↓';
    downBtn.disabled = index === menuDrinks.length - 1;
    downBtn.setAttribute('aria-label', 'Опустити нижче');
    downBtn.addEventListener('click', () => moveMenuDrink(drink.id, 1));

    orderWrap.append(upBtn, downBtn);

    const iconBtn = document.createElement('button');
    iconBtn.type = 'button';
    iconBtn.className = 'menu-editor-item-icon';
    iconBtn.innerHTML = drinkIconMarkup(drink.icon);
    iconBtn.setAttribute('aria-label', `Змінити значок для ${drink.name}`);
    iconBtn.addEventListener('click', () => {
      setMenuEditorIcon(drink.icon, { editingId: drink.id });
    });

    const fields = document.createElement('div');
    fields.className = 'menu-editor-item-fields';

    const nameInput = document.createElement('input');
    nameInput.className = 'menu-editor-item-name';
    nameInput.type = 'text';
    nameInput.maxLength = 80;
    nameInput.value = drink.name;
    nameInput.setAttribute('aria-label', 'Назва напою');

    const amountInput = document.createElement('input');
    amountInput.className = 'menu-editor-item-amount';
    amountInput.type = 'number';
    amountInput.min = '1';
    amountInput.step = '1';
    amountInput.value = String(drink.amount);
    amountInput.setAttribute('aria-label', 'Ціна');

    const commit = () => {
      const name = nameInput.value.trim();
      const amount = Number(amountInput.value);
      if (!name || !Number.isFinite(amount) || amount <= 0) return;
      updateMenuDrink(drink.id, name, amount, drink.icon);
    };

    nameInput.addEventListener('change', commit);
    amountInput.addEventListener('change', commit);

    fields.append(nameInput, amountInput);

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'menu-editor-delete-btn';
    deleteBtn.textContent = '−';
    deleteBtn.setAttribute('aria-label', 'Видалити напій');
    deleteBtn.addEventListener('click', () => removeMenuDrink(drink.id));

    li.append(orderWrap, iconBtn, fields, deleteBtn);
    menuEditorList.appendChild(li);
  });
}

function renderMenuEditor() {
  renderMenuEditorIconPicker();
  renderMenuEditorList();
}

function openMenuEditor() {
  if (!menuEditor) return;

  menuEditorEditingId = null;
  menuEditorSelectedIcon = 'generic';
  renderMenuEditor();
  menuEditor.hidden = false;
  document.body.classList.add('menu-editor-open');
  menuAddName?.focus();
}

function closeMenuEditor() {
  if (!menuEditor) return;

  menuEditor.hidden = true;
  menuEditorEditingId = null;
  menuEditorSelectedIcon = 'generic';
  menuAddForm?.reset();
  document.body.classList.remove('menu-editor-open');
}

async function initMenu() {
  menuDrinks = await loadMenuDrinks();
  renderDrinksMenu();
  updateMenuEntryMeta();
}

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

function savePendingPayment(order, orderId) {
  sessionStorage.setItem(PAYMENT_KEY, JSON.stringify({
    order,
    orderId: orderId || null,
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

    if (!data.order) return null;

    return {
      order: data.order,
      orderId: data.orderId || null,
    };
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
  if (sheet.hidden && confirmSheet.hidden
    && (!cardPaySheet || cardPaySheet.hidden)) {
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
  getMenuRows().forEach((row) => {
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
  if (cardPaySheet) cardPaySheet.hidden = true;
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
  if (confirmSheet.hidden
    && (!carWashSheet || carWashSheet.hidden)
    && (!cardPaySheet || cardPaySheet.hidden)) {
    document.body.classList.remove('sheet-open');
  }
  paymentTotal = 0;
}

function openCardPaySheet(total) {
  if (!cardPaySheet) return;

  if (cardPayAmount) cardPayAmount.textContent = `${total} грн`;
  cardPaySheet.hidden = false;
  document.body.classList.add('sheet-open');
}

function closeCardPaySheet() {
  if (!cardPaySheet) return;

  cardPaySheet.hidden = true;
  if (sheet.hidden && confirmSheet.hidden
    && (!carWashSheet || carWashSheet.hidden)) {
    document.body.classList.remove('sheet-open');
  }
}

async function copyCardNumber() {
  if (!pendingOrder || !pendingOrderId) return;

  if (!otherPaymentRecorded) {
    notifyOrder(pendingOrder, 'other', pendingOrderId);
    otherPaymentRecorded = true;
  }

  try {
    await navigator.clipboard.writeText(OTHER_BANK_CARD);
    if (cardPayCopy) {
      const original = cardPayCopy.textContent;
      cardPayCopy.textContent = 'Скопійовано';
      setTimeout(() => {
        cardPayCopy.textContent = original;
      }, 1500);
    }
    finishOtherPayment();
  } catch {
    if (cardPayCopy) cardPayCopy.textContent = 'Не вдалося скопіювати';
  }
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

function makeOrderId() {
  return `order-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function notifyOrder(order, provider, orderId) {
  const payload = JSON.stringify({
    id: orderId,
    items: order.items,
    total: order.total,
    provider,
  });

  const postOrder = () => fetch('/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true,
  }).catch(() => {
    // payment flow should continue even if notification fails
  });

  // Інші банки: користувач лишається на сторінці — fetch надійніший за sendBeacon
  if (provider === 'other') {
    postOrder();
    return;
  }

  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: 'application/json' });
    navigator.sendBeacon('/api/order', blob);
    return;
  }

  postOrder();
}

function goToPayment(provider) {
  const order = snapshotOrder();
  if (!order.items.length) return;

  const orderId = makeOrderId();
  pendingOrder = order;
  pendingOrderId = orderId;
  awaitingPayment = true;
  savePendingPayment(order, orderId);

  payActions.forEach((action) => {
    action.disabled = true;
  });

  if (provider === 'other') {
    otherPaymentRecorded = false;
    closeSheet();
    openCardPaySheet(order.total);
    return;
  }

  notifyOrder(order, provider, orderId);

  const url = getPaymentUrl(provider, order.total);

  closeSheet();
  loader.hidden = false;
  loaderText.textContent = provider === 'privat'
    ? `Відкриваємо конверт… Введіть ${order.total} грн`
    : 'Відкриваємо Monobank…';

  openPaymentUrl(url);

  recoverTimer = setTimeout(() => {
    loader.hidden = true;
  }, 1500);
}

function handleReturnFromPayment() {
  if (sessionStorage.getItem(RELOAD_KEY)) return;
  if (!awaitingPayment || !pendingOrder) return;

  savePendingPayment(pendingOrder, pendingOrderId);
  reloadAfterPaymentReturn();
}

function initPaymentReturn() {
  sessionStorage.removeItem(RELOAD_KEY);

  const saved = loadPendingPayment();
  if (!saved) return;

  pendingOrder = saved.order;
  pendingOrderId = saved.orderId;
  dismissOverlays();
  restoreCartFromOrder(saved.order);
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

function resetPendingPayment() {
  pendingOrderId = null;
  otherPaymentRecorded = false;
  clearPendingPayment();
  pendingOrder = null;
  awaitingPayment = false;
  payActions.forEach((action) => {
    action.disabled = false;
  });
}

async function revokePendingOrderIncome() {
  const orderId = pendingOrderId;
  pendingOrderId = null;
  if (!orderId) return;

  try {
    await fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'delete',
        id: orderId,
      }),
      keepalive: true,
    });
  } catch {
    // ignore delete failures
  }
}

function finishOtherPayment() {
  pendingOrderId = null;
  otherPaymentRecorded = false;
  clearPendingPayment();
  pendingOrder = null;
  awaitingPayment = false;
  closeCardPaySheet();
  payActions.forEach((action) => {
    action.disabled = false;
  });
  clearCart();
  showThanks();
}
function confirmPaymentSuccess() {
  pendingOrderId = null;
  otherPaymentRecorded = false;
  clearPendingPayment();
  pendingOrder = null;
  awaitingPayment = false;
  closeConfirmSheet();
  clearCart();
  showThanks();
}

function cancelPendingPayment() {
  revokePendingOrderIncome();
  otherPaymentRecorded = false;
  clearPendingPayment();
  pendingOrder = null;
  awaitingPayment = false;
  closeConfirmSheet();
  payActions.forEach((action) => {
    action.disabled = false;
  });
  clearCart();
}

rows.forEach(bindMenuRow);

menuAddForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = menuAddName?.value.trim();
  const amount = Number(menuAddAmount?.value);
  if (!name || !Number.isFinite(amount) || amount <= 0) return;
  addMenuDrink(name, amount, menuEditorSelectedIcon);
  menuAddForm.reset();
  menuEditorEditingId = null;
  renderMenuEditorIconPicker();
  menuAddName?.focus();
});

menuSettingsBtn?.addEventListener('click', openMenuEditor);
menuEditor?.querySelector('[data-menu-editor-back]')?.addEventListener('click', closeMenuEditor);

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

cardPaySheet?.querySelectorAll('[data-card-pay-close]').forEach((el) => {
  el.addEventListener('click', () => {
    closeCardPaySheet();
    if (!otherPaymentRecorded) resetPendingPayment();
  });
});

cardPayCopy?.addEventListener('click', copyCardNumber);

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
    if (menuEditor && !menuEditor.hidden) closeMenuEditor();
    else if (statsGate && !statsGate.hidden) closeStatsGate();
    else if (statsPanel && !statsPanel.hidden) closeStats();
    else if (carWashSheet && !carWashSheet.hidden) closeCarWashSheet();
    else if (cardPaySheet && !cardPaySheet.hidden) {
      closeCardPaySheet();
      if (!otherPaymentRecorded) resetPendingPayment();
    }
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

initMenu();
initPaymentReturn();
updateCart();
try {
  localStorage.removeItem('kava-business-stats');
} catch {
  // ignore
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

function isHaircutName(value) {
  return String(value || '').toLowerCase().includes('стрижк');
}

function isHaircutLine(line) {
  const id = String(line?.id || '').toLowerCase();
  return id === HAIRCUT_ID || isHaircutName(line?.name);
}

function getLineAmount(line) {
  return Number(line?.amount || 0) * Number(line?.qty || 1);
}

function getLineQty(line) {
  const qty = Number(line?.qty);
  if (!Number.isFinite(qty) || qty <= 0) return 1;
  return Math.min(qty, 99);
}

function normalizeIncomeItems(items) {
  if (!items) return null;
  if (typeof items === 'string') {
    try {
      const parsed = JSON.parse(items);
      return Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }
  return Array.isArray(items) ? items : null;
}

function parseLabelLines(label) {
  return String(label || '')
    .split(',')
    .map((part) => {
      const match = part.trim().match(/^(.+?)\s×\s*(\d+)$/);
      if (!match) return null;
      return {
        name: match[1].trim(),
        qty: Number(match[2]) || 1,
        amount: 0,
        id: null,
      };
    })
    .filter(Boolean);
}

function getIncomeItems(record) {
  const items = normalizeIncomeItems(record.items);
  if (items?.length) return items;
  if (record.source !== 'order') return null;
  const parsed = parseLabelLines(record.label);
  return parsed.length ? parsed : null;
}

function estimateLineAmount(line) {
  const qty = getLineQty(line);
  const amount = Number(line?.amount);
  if (Number.isFinite(amount) && amount > 0) return amount * qty;

  if (isHaircutLine(line)) return 250 * qty;

  const drink = menuDrinks.find((item) => item.id === line.id || item.name === line.name);
  if (drink) return drink.amount * qty;

  return 0;
}

function splitIncomeRecord(record) {
  const amount = Number(record.amount || 0);
  let coffee = 0;
  let haircut = 0;
  let coffeeDrinks = 0;
  let haircutCount = 0;
  let manualCoffeeCount = 0;

  if (record.source === 'order') {
    const items = getIncomeItems(record);
    if (items?.length) {
      const lineAmounts = items.map((line) => ({
        line,
        value: estimateLineAmount(line),
      }));
      let knownTotal = lineAmounts.reduce((sum, entry) => sum + entry.value, 0);

      if (knownTotal <= 0 && amount > 0) {
        lineAmounts.forEach((entry) => {
          entry.value = amount / lineAmounts.length;
        });
        knownTotal = amount;
      } else if (knownTotal > 0 && amount > 0 && Math.abs(knownTotal - amount) > 0.01) {
        const scale = amount / knownTotal;
        lineAmounts.forEach((entry) => {
          entry.value *= scale;
        });
      }

      lineAmounts.forEach(({ line, value }) => {
        const qty = getLineQty(line);
        if (isHaircutLine(line)) {
          haircut += value;
          haircutCount += qty;
        } else {
          coffee += value;
          coffeeDrinks += qty;
        }
      });
    } else if (isHaircutName(record.label)) {
      haircut += amount;
      haircutCount += 1;
    } else {
      coffee += amount;
      coffeeDrinks += 1;
    }
    return { coffee, haircut, coffeeDrinks, haircutCount, manualCoffeeCount };
  }

  if (isHaircutName(record.label)) {
    haircut += amount;
    haircutCount += 1;
  } else {
    coffee += amount;
    manualCoffeeCount += 1;
  }

  return { coffee, haircut, coffeeDrinks, haircutCount, manualCoffeeCount };
}

function getCoffeeOnlyIncomes(incomes) {
  return incomes.flatMap((record) => {
    const part = splitIncomeRecord(record);
    if (part.coffee <= 0) return [];

    const items = getIncomeItems(record);
    if (record.source === 'order' && items?.length) {
      const coffeeItems = items.filter((line) => !isHaircutLine(line));
      if (!coffeeItems.length) return [];

      return [{
        ...record,
        amount: part.coffee,
        items: coffeeItems,
      }];
    }

    if (isHaircutName(record.label)) return [];

    return [{
      ...record,
      amount: part.coffee,
    }];
  });
}

function summarizeIncomes(incomes) {
  return incomes.reduce((summary, record) => {
    const part = splitIncomeRecord(record);
    summary.coffee += part.coffee;
    summary.haircut += part.haircut;
    summary.coffeeDrinks += part.coffeeDrinks;
    summary.haircutCount += part.haircutCount;
    summary.manualCoffeeCount += part.manualCoffeeCount;
    return summary;
  }, {
    coffee: 0,
    haircut: 0,
    coffeeDrinks: 0,
    haircutCount: 0,
    manualCoffeeCount: 0,
  });
}

function localDayKey(value) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function localMonthKey(value) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function coffeeDrinkCount(income) {
  const part = splitIncomeRecord(income);
  if (income.source === 'order') return part.coffeeDrinks;
  if (part.manualCoffeeCount > 0) return 1;
  return 0;
}

function formatChartBucketLabel(date, period) {
  const day = date.getDate();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);

  if (period === 'month') {
    return `${day}.${month}.`;
  }

  if (period === 'year') {
    return `${month}.${year}`;
  }

  const weekday = new Intl.DateTimeFormat('uk-UA', { weekday: 'short' }).format(date);
  return `${weekday} ${day}`;
}

function buildDailyChartBuckets(dayCount, period) {
  const buckets = [];

  for (let offset = dayCount - 1; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - offset);

    buckets.push({
      key: localDayKey(date),
      label: formatChartBucketLabel(date, period),
      count: 0,
    });
  }

  return buckets;
}

function buildMonthlyChartBuckets(monthCount = 12) {
  const buckets = [];

  for (let offset = monthCount - 1; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    date.setMonth(date.getMonth() - offset);

    buckets.push({
      key: localMonthKey(date),
      label: formatChartBucketLabel(date, 'year'),
      count: 0,
    });
  }

  return buckets;
}

function buildChartBuckets(period) {
  if (period === 'year') return buildMonthlyChartBuckets(12);
  if (period === 'month') return buildDailyChartBuckets(30, 'month');
  return buildDailyChartBuckets(7, 'week');
}

function fillChartBuckets(buckets, incomes, period) {
  const map = Object.fromEntries(buckets.map((bucket) => [bucket.key, bucket]));
  const useMonths = period === 'year';

  incomes.forEach((income) => {
    const drinks = coffeeDrinkCount(income);
    if (!drinks) return;

    const key = useMonths
      ? localMonthKey(income.createdAt)
      : localDayKey(income.createdAt);

    if (map[key]) map[key].count += drinks;
  });

  return buckets;
}

function setChartPeriod(period) {
  if (!CHART_PERIOD_CONFIG[period]) return;
  statsChartPeriod = period;

  statsChartPeriodButtons.forEach((button) => {
    const isActive = button.dataset.chartPeriod === period;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  if (statsChartHeading) {
    statsChartHeading.textContent = CHART_PERIOD_CONFIG[period].heading;
  }
  if (statsDailyChart) {
    statsDailyChart.className = `stats-daily-chart ${CHART_PERIOD_CONFIG[period].className}`;
  }
}

function renderOrderChart(incomes) {
  if (!statsDailyChart) return;

  const buckets = fillChartBuckets(buildChartBuckets(statsChartPeriod), incomes, statsChartPeriod);
  const maxCount = Math.max(...buckets.map((bucket) => bucket.count), 1);

  statsDailyChart.innerHTML = '';
  statsDailyChart.setAttribute(
    'aria-label',
    buckets.map((bucket) => `${bucket.label}: ${bucket.count}`).join(', '),
  );

  buckets.forEach((bucket) => {
    const bar = document.createElement('div');
    bar.className = 'stats-chart-bar';

    const track = document.createElement('div');
    track.className = 'stats-chart-bar-track';

    const fill = document.createElement('div');
    fill.className = 'stats-chart-bar-fill';
    const heightPercent = bucket.count > 0
      ? Math.max(8, Math.round((bucket.count / maxCount) * 100))
      : 0;
    fill.style.height = `${heightPercent}%`;
    if (bucket.count === 0) fill.classList.add('is-zero');

    track.appendChild(fill);

    const count = document.createElement('span');
    count.className = 'stats-chart-count';
    count.textContent = String(bucket.count);

    const label = document.createElement('span');
    label.className = 'stats-chart-day';
    label.textContent = bucket.label;

    bar.append(track, count, label);
    statsDailyChart.appendChild(bar);
  });
}

function formatCountLabel(count, one, few, many) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} ${one}`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} ${few}`;
  return `${count} ${many}`;
}

function formatBalanceMoney(value) {
  const rounded = Math.round(value);
  const formatted = Math.abs(rounded).toLocaleString('uk-UA');
  if (rounded > 0) return `+${formatted} грн`;
  if (rounded < 0) return `-${formatted} грн`;
  return `${formatted} грн`;
}

function incomeCategory(record) {
  const part = splitIncomeRecord(record);
  if (part.haircut > 0 && part.coffee <= 0) return 'haircut';
  if (part.haircut > 0 && part.coffee > 0) return 'mixed';
  return 'coffee';
}

function formatRoiPercent(value) {
  return `${value.toLocaleString('uk-UA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;
}

function setStatsTab(tab, { keepEdit = false } = {}) {
  const isIncome = tab === 'income';
  statsActiveTab = tab;

  statsTabIncome?.classList.toggle('is-active', isIncome);
  statsTabExpense?.classList.toggle('is-active', !isIncome);
  statsTabIncome?.setAttribute('aria-selected', isIncome ? 'true' : 'false');
  statsTabExpense?.setAttribute('aria-selected', isIncome ? 'false' : 'true');

  if (statsPanelIncome) {
    statsPanelIncome.hidden = !isIncome;
    statsPanelIncome.classList.toggle('is-active', isIncome);
  }

  if (statsPanelExpense) {
    statsPanelExpense.hidden = isIncome;
    statsPanelExpense.classList.toggle('is-active', !isIncome);
  }

  if (!keepEdit && editingTransactionId) closeEditTransaction();
}

function renderRoi(income, expenses) {
  if (!statsRoiMain || !statsRoiSub) return;

  statsRoiCard?.classList.remove('stats-card--roi-complete');

  if (expenses <= 0) {
    statsRoiMain.textContent = '—';
    statsRoiSub.hidden = true;
    statsRoiSub.textContent = '';
    if (statsRoiFill) statsRoiFill.style.width = '0%';
    return;
  }

  const rawPercent = (income / expenses) * 100;
  const barPercent = Math.min(100, rawPercent);

  if (statsRoiFill) statsRoiFill.style.width = `${barPercent}%`;

  if (income >= expenses) {
    const profit = income - expenses;
    statsRoiMain.textContent = formatRoiPercent(100);
    statsRoiSub.textContent = profit > 0
      ? `Окуплено · прибуток ${formatStatsMoney(profit)}`
      : 'Окуплено';
    statsRoiSub.hidden = false;
    statsRoiCard?.classList.add('stats-card--roi-complete');
    return;
  }

  const left = expenses - income;
  statsRoiMain.textContent = formatRoiPercent(rawPercent);
  statsRoiSub.textContent = `Ще ${formatStatsMoney(left)} до повної окупності`;
  statsRoiSub.hidden = false;
}

function incomeTitle(item) {
  if (item.source === 'order' && Array.isArray(item.items) && item.items.length) {
    const category = incomeCategory(item);
    const summary = formatOrderSummary(item.items);
    if (category === 'haircut') return summary;
    if (category === 'mixed') return `Кава + стрижка · ${summary}`;
    return summary;
  }

  if (isHaircutName(item.label)) {
    const label = String(item.label || '').trim();
    return label || 'Стрижка';
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
        : item.provider === 'other'
          ? 'Інші банки'
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

async function fetchStats() {
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
  const category = incomeCategory(item);
  li.className = 'stats-list-item';
  if (category === 'haircut') li.classList.add('stats-list-item--haircut');
  if (category === 'mixed') li.classList.add('stats-list-item--mixed');

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
  const summary = summarizeIncomes(data.incomes);
  const coffeeIncome = summary.coffee;
  const expenses = data.expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const balance = coffeeIncome - expenses;
  const coffeeIncomes = getCoffeeOnlyIncomes(data.incomes);

  statsIncome.textContent = formatStatsMoney(coffeeIncome);
  statsExpensesTotal.textContent = formatStatsMoney(expenses);
  statsCoffeeTotal.textContent = formatStatsMoney(summary.coffee);
  const coffeeDrinks = summary.coffeeDrinks + summary.manualCoffeeCount;
  statsCoffeeMeta.textContent = formatCountLabel(coffeeDrinks, 'напій', 'напої', 'напоїв');
  statsHaircutTotal.textContent = formatStatsMoney(summary.haircut);
  statsHaircutMeta.textContent = formatCountLabel(summary.haircutCount, 'раз', 'рази', 'разів');

  statsTotalIncome.textContent = formatStatsMoney(coffeeIncome);
  statsTotalExpenses.textContent = formatStatsMoney(expenses);
  statsBalanceTotal.textContent = formatBalanceMoney(balance);
  statsBalanceTotal.classList.toggle('is-negative', balance < 0);
  statsBalanceTotal.classList.toggle('is-positive', balance > 0);

  renderRoi(summary.coffee, expenses);
  renderOrderChart(data.incomes);

  renderTransactionSection({
    listEl: statsIncomes,
    moreBtn: statsIncomesMore,
    items: coffeeIncomes,
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

async function refreshStats() {
  const data = await fetchStats();
  currentStatsData = data;
  renderStatsView(data);
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
  updateMenuEntryMeta();
  refreshStats();
}

function closeStats() {
  if (!statsPanel) return;
  statsPanel.hidden = true;
  document.body.classList.remove('stats-open');
  closeMenuEditor();
  incomesListExpanded = false;
  expensesListExpanded = false;
  setStatsTab('income');
  setChartPeriod('week');
  closeEditTransaction();
}

async function addCashIncome(label, amount) {
  const id = `income-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  try {
    await fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'income',
        id,
        label,
        amount,
      }),
    });
  } catch {
    // online-only: failed request will show on next refresh
  }

  await refreshStats();
}

async function addExpense(label, amount) {
  const id = `expense-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  try {
    await fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'expense',
        id,
        label,
        amount,
      }),
    });
  } catch {
    // online-only: failed request will show on next refresh
  }

  await refreshStats();
}

let statsSubmitLock = false;

async function submitStatsForm(handler, label, amount) {
  if (statsSubmitLock) return;
  statsSubmitLock = true;
  try {
    await handler(label, amount);
  } finally {
    statsSubmitLock = false;
  }
}

async function deleteTransaction(id) {
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
    // online-only: failed request will show on next refresh
  }

  if (editingTransactionId === id) closeEditTransaction();
  await refreshStats();
}

function openEditTransaction(item) {
  if (!statsEditForm) return;

  const isIncome = currentStatsData.incomes.some((entry) => entry.id === item.id);
  setStatsTab(isIncome ? 'income' : 'expense', { keepEdit: true });

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
    // online-only: failed request will show on next refresh
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

statsTabIncome?.addEventListener('click', () => setStatsTab('income'));
statsTabExpense?.addEventListener('click', () => setStatsTab('expense'));

statsChartPeriodButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setChartPeriod(button.dataset.chartPeriod);
    renderOrderChart(currentStatsData.incomes);
  });
});

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

  await submitStatsForm(addCashIncome, label, amount);
  statsIncomeForm.reset();
});

statsExpenseForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const label = statsExpenseLabel?.value.trim();
  const amount = Number(statsExpenseAmount?.value);

  if (!label || !Number.isFinite(amount) || amount <= 0) return;

  await submitStatsForm(addExpense, label, amount);
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
