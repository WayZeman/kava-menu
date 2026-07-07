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
const stockToast = document.getElementById('stock-toast');
const appSplash = document.getElementById('app-splash');
const receiptDate = document.getElementById('receipt-date');
const thanksForm = document.getElementById('thanks-form');
const thanksFeedback = document.getElementById('thanks-feedback');
const thanksSend = document.getElementById('thanks-send');
const thanksSkip = document.getElementById('thanks-skip');
const thanksStatus = document.getElementById('thanks-status');
const rows = document.querySelectorAll('[data-picker="car-wash"]');
const drinksMenu = document.getElementById('drinks-menu');
const extrasMenu = document.getElementById('extras-menu');
const extrasMenuList = document.getElementById('extras-menu-list');
const servicesMenu = document.getElementById('services-menu');
const servicesMenuList = document.getElementById('services-menu-list');
const menuEditor = document.getElementById('menu-editor');
const menuEditorIconPicker = document.getElementById('menu-editor-icon-picker');
const menuEditorIconHint = document.getElementById('menu-editor-icon-hint');
const menuEditorList = document.getElementById('menu-editor-list');
const menuEditorEmpty = document.getElementById('menu-editor-empty');
const menuEditorSaveBtn = document.getElementById('menu-editor-save');
const menuSettingsBtn = document.getElementById('stats-menu-settings');
const statsMenuEntryMeta = document.getElementById('stats-menu-entry-meta');
const statsThemeEntryMeta = document.getElementById('stats-theme-entry-meta');
const menuAddForm = document.getElementById('menu-add-form');
const menuAddName = document.getElementById('menu-add-name');
const menuAddStock = document.getElementById('menu-add-stock');
const menuEditorAddTitle = document.getElementById('menu-editor-add-title');
const menuEditorListTitle = document.getElementById('menu-editor-list-title');
const menuEditorSectionTabs = document.querySelectorAll('[data-menu-section]');
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
const statsHub = document.getElementById('stats-hub');
const statsCategoryView = document.getElementById('stats-category');
const statsCategoryTitle = document.getElementById('stats-category-title');
const statsCategorySubtitle = document.getElementById('stats-category-subtitle');
const statsHubCoffeeTotal = document.getElementById('stats-hub-coffee-total');
const statsHubCoffeeMeta = document.getElementById('stats-hub-coffee-meta');
const statsHubCoffeeRoi = document.getElementById('stats-hub-coffee-roi');
const statsHubExtrasTotal = document.getElementById('stats-hub-extras-total');
const statsHubExtrasMeta = document.getElementById('stats-hub-extras-meta');
const statsHubExtrasRoi = document.getElementById('stats-hub-extras-roi');
const statsHubServicesTotal = document.getElementById('stats-hub-services-total');
const statsHubServicesMeta = document.getElementById('stats-hub-services-meta');
const statsHubServicesRoi = document.getElementById('stats-hub-services-roi');
const statsHubYoutubeTotal = document.getElementById('stats-hub-youtube-total');
const statsHubYoutubeMeta = document.getElementById('stats-hub-youtube-meta');
const statsHubYoutubeRoi = document.getElementById('stats-hub-youtube-roi');
const statsYoutubeChannel = document.getElementById('stats-youtube-channel');
const statsYoutubeSubscribers = document.getElementById('stats-youtube-subscribers');
const statsYoutubeViews = document.getElementById('stats-youtube-views');
const statsYoutubeVideos = document.getElementById('stats-youtube-videos');
const statsYoutubeTitle = document.getElementById('stats-youtube-title');
const statsYoutubeStatus = document.getElementById('stats-youtube-status');
const statsMenuEntry = document.querySelector('.stats-menu-entry');
const statsChartSection = document.querySelector('.stats-chart-section');
const statsHubTotalIncome = document.getElementById('stats-hub-total-income');
const statsHubTotalExpenses = document.getElementById('stats-hub-total-expenses');
const statsHubIncomeShare = document.getElementById('stats-hub-income-share');
const statsHubExpensesShare = document.getElementById('stats-hub-expenses-share');
const statsHubBalanceTotal = document.getElementById('stats-hub-balance-total');
const statsHubBalanceShare = document.getElementById('stats-hub-balance-share');
const statsMenuEntryTitle = document.getElementById('stats-menu-entry-title');
const statsRoiWrap = document.getElementById('stats-roi-wrap');
const statsBalanceIncomeLabel = document.getElementById('stats-balance-income-label');
const statsBalanceExpenseLabel = document.getElementById('stats-balance-expense-label');
const statsBalanceTotalLabel = document.getElementById('stats-balance-total-label');
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
const MENU_EXTRAS_KEY = 'kava-menu-extras';
const MENU_SERVICES_KEY = 'kava-menu-services';
const MENU_UPDATED_KEY = 'kava-menu-updated-at';
const MENU_VISIBILITY_KEY = 'kava-menu-visibility';
const THEME_KEY = 'kava-ui-theme';
const APP_VERSION = '74';
const HAIRCUT_ID = 'haircut';
const THEMES = {
  'soft-premium': {
    id: 'soft-premium',
    label: 'Soft Premium',
    description: 'Поточний світлий стиль сайту',
  },
};
const STATS_CATEGORIES = {
  drinks: {
    id: 'drinks',
    label: 'Кава',
    subtitle: 'Дохід, витрати та меню напоїв',
    menuTitle: 'Редагування напоїв',
    menuMeta: 'Додати або прибрати напої',
    chartHeading: 'Замовлення кави по днях',
    incomePlaceholder: 'Напр. кава готівкою',
    expensePlaceholder: 'Напр. зерно, молоко',
    countLabels: ['напій', 'напої', 'напоїв'],
    roiLabel: 'Окупність кави',
  },
  extras: {
    id: 'extras',
    label: 'До кави',
    subtitle: 'Дохід, витрати та асортимент',
    menuTitle: 'Редагування «До кави»',
    menuMeta: 'Додати або прибрати позиції',
    chartHeading: 'Продажі «До кави» по днях',
    incomePlaceholder: 'Напр. булочка готівкою',
    expensePlaceholder: 'Напр. закупівля снеків',
    countLabels: ['позиція', 'позиції', 'позицій'],
    roiLabel: 'Окупність «До кави»',
  },
  services: {
    id: 'services',
    label: 'Послуги',
    subtitle: 'Дохід, витрати та перелік послуг',
    menuTitle: 'Редагування послуг',
    menuMeta: 'Додати або прибрати послуги',
    chartHeading: 'Послуги по днях',
    incomePlaceholder: 'Напр. стрижка готівкою',
    expensePlaceholder: 'Напр. інструменти',
    countLabels: ['раз', 'рази', 'разів'],
    roiLabel: 'Окупність послуг',
  },
  youtube: {
    id: 'youtube',
    label: 'YouTube',
    channelUrl: 'https://www.youtube.com/@КіноМить',
    subtitle: 'Дохід, витрати та статистика @КіноМить',
    menuTitle: '',
    menuMeta: '',
    chartHeading: 'Доходи YouTube по днях',
    incomePlaceholder: 'Напр. AdSense, спонсорство',
    expensePlaceholder: 'Напр. обладнання, монтаж',
    countLabels: ['дохід', 'доходи', 'доходів'],
    roiLabel: 'Окупність YouTube',
    analyticsOnly: true,
  },
};
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
let statsCategory = 'drinks';
let menuEditorSingleSection = false;
let categoryVisibility = { drinks: true, extras: true, services: true };
let youtubeChannelStats = null;
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

const DEFAULT_SERVICES = [
  { id: 'haircut', name: 'Стрижка', amount: 250, icon: 'haircut' },
];

const SERVICE_ICON_OPTIONS = [
  { id: 'haircut', label: 'Стрижка' },
  { id: 'generic', label: 'Послуга' },
];

const SERVICE_ICONS = {
  haircut: '<circle cx="16" cy="13" r="6.5" stroke="#2f1a0f" stroke-width="2.5" fill="#f5f0e8"/><circle cx="32" cy="13" r="6.5" stroke="#2f1a0f" stroke-width="2.5" fill="#f5f0e8"/><path d="M20 17.5 24 27.5 28 17.5" stroke="#2f1a0f" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 27.5 17.5 40" stroke="#2f1a0f" stroke-width="2.5" stroke-linecap="round"/><path d="M24 27.5 30.5 40" stroke="#2f1a0f" stroke-width="2.5" stroke-linecap="round"/><circle cx="24" cy="27.5" r="2.5" fill="#d4a853"/>',
  generic: '<rect x="14" y="16" width="20" height="18" rx="4" fill="#f5f0e8" stroke="#2f1a0f" stroke-width="2"/><path d="M18 24h12M18 28h8" stroke="#2f1a0f" stroke-width="2" stroke-linecap="round"/>',
};

const EXTRA_ICON_OPTIONS = [
  { id: 'candy', label: 'Цукерка' },
  { id: 'bar', label: 'Батончик' },
  { id: 'bun', label: 'Булочка' },
  { id: 'chocolate', label: 'Шоколадка' },
  { id: 'cookie', label: 'Печиво' },
  { id: 'generic', label: 'Товар' },
];

const EXTRA_ICONS = {
  candy: '<circle cx="24" cy="24" r="10" fill="#f5f0e8" stroke="#2f1a0f" stroke-width="2"/><path d="M24 14v20M14 24h20" stroke="#d4a853" stroke-width="2" stroke-linecap="round"/><path d="M17.8 17.8 30.2 30.2M30.2 17.8 17.8 30.2" stroke="#d4a853" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/>',
  bar: '<rect x="18" y="11" width="12" height="26" rx="3" fill="#5c3a28" stroke="#2f1a0f" stroke-width="2"/><rect x="20" y="13" width="8" height="6" rx="1.5" fill="#d4a853"/><path d="M20 21.5h8M20 25h8M20 28.5h5.5" stroke="#f5f0e8" stroke-width="1.5" stroke-linecap="round" opacity="0.9"/>',
  bun: '<path d="M13 30c0-9 5-14 11-14s11 5 11 14" fill="#d4a853" stroke="#2f1a0f" stroke-width="2" stroke-linejoin="round"/><ellipse cx="24" cy="30" rx="11" ry="5" fill="#f5f0e8" stroke="#2f1a0f" stroke-width="2"/><path d="M17 24.5c1.5-4 4-6.5 7-6.5s5.5 2.5 7 6.5" stroke="#2f1a0f" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.28"/>',
  chocolate: '<rect x="12" y="17" width="24" height="14" rx="2.5" fill="#5c3a28" stroke="#2f1a0f" stroke-width="2"/><path d="M12 24h24M24 17v14M18 17v14M30 17v14" stroke="#2f1a0f" stroke-width="1.3"/><rect x="13.5" y="18.5" width="9" height="5" rx="1" fill="#d4a853" opacity="0.6"/>',
  cookie: '<circle cx="24" cy="24" r="11.5" fill="#d4a853" stroke="#2f1a0f" stroke-width="2"/><circle cx="18.5" cy="21" r="1.7" fill="#5c3a28"/><circle cx="27.5" cy="20" r="1.7" fill="#5c3a28"/><circle cx="29" cy="26.5" r="1.5" fill="#5c3a28"/><circle cx="22" cy="29" r="1.4" fill="#5c3a28"/><circle cx="17" cy="26" r="1.3" fill="#5c3a28"/>',
  generic: '<path d="M16 15h16l-1.8 22a2.5 2.5 0 0 1-2.5 2.2H20.3a2.5 2.5 0 0 1-2.5-2.2L16 15z" fill="#f5f0e8" stroke="#2f1a0f" stroke-width="2" stroke-linejoin="round"/><path d="M18 15V12a6 6 0 0 1 12 0v3" stroke="#2f1a0f" stroke-width="2" stroke-linecap="round"/><circle cx="24" cy="26" r="4" fill="#d4a853" stroke="#2f1a0f" stroke-width="1.5"/>',
};

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
let menuExtras = [];
let menuServices = [];
let menuEditorDraft = [];
let menuEditorExtrasDraft = [];
let menuEditorServicesDraft = [];
let menuEditorSection = 'drinks';
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

function normalizeExtra(raw) {
  const name = String(raw?.name || '').trim();
  const amount = Number(raw?.amount);
  const stock = Number(raw?.stock);
  const id = String(raw?.id || '').trim();
  if (!name || !id || !Number.isFinite(amount) || amount <= 0 || amount > 100000) return null;
  const icon = String(raw?.icon || 'generic').trim() || 'generic';
  return {
    id,
    name,
    amount: Math.round(amount),
    stock: Number.isFinite(stock) && stock >= 0 ? Math.round(stock) : 0,
    icon: EXTRA_ICONS[icon] ? icon : 'generic',
  };
}

function normalizeService(raw) {
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

function loadMenuSectionFromStorage(key, normalizer) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const items = parsed.map(normalizer).filter(Boolean);
    return items.length ? items : null;
  } catch {
    return null;
  }
}

function loadMenuDrinksFromStorage() {
  return loadMenuSectionFromStorage(MENU_KEY, normalizeDrink);
}

function loadMenuExtrasFromStorage() {
  return loadMenuSectionFromStorage(MENU_EXTRAS_KEY, normalizeExtra);
}

function loadMenuServicesFromStorage() {
  return loadMenuSectionFromStorage(MENU_SERVICES_KEY, normalizeService);
}

function saveFullMenuLocal() {
  try {
    localStorage.setItem(MENU_KEY, JSON.stringify(menuDrinks));
    localStorage.setItem(MENU_EXTRAS_KEY, JSON.stringify(menuExtras));
    localStorage.setItem(MENU_SERVICES_KEY, JSON.stringify(menuServices));
    localStorage.setItem(MENU_VISIBILITY_KEY, JSON.stringify(categoryVisibility));
  } catch {
    // ignore quota errors
  }
}

function normalizeVisibility(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  return {
    drinks: source.drinks !== false,
    extras: source.extras !== false,
    services: source.services !== false,
  };
}

function loadVisibilityFromStorage() {
  try {
    const raw = localStorage.getItem(MENU_VISIBILITY_KEY);
    if (!raw) return normalizeVisibility();
    return normalizeVisibility(JSON.parse(raw));
  } catch {
    return normalizeVisibility();
  }
}

function normalizeTheme(themeId) {
  return THEMES[themeId] ? themeId : 'soft-premium';
}

function loadThemeFromStorage() {
  try {
    return normalizeTheme(localStorage.getItem(THEME_KEY));
  } catch {
    return 'soft-premium';
  }
}

let currentTheme = loadThemeFromStorage();

function applyTheme(themeId) {
  currentTheme = normalizeTheme(themeId);
  document.body.dataset.theme = currentTheme;
  document.documentElement.dataset.theme = currentTheme;
  if (statsThemeEntryMeta) {
    statsThemeEntryMeta.textContent = THEMES[currentTheme].label;
  }
  document.querySelectorAll('[data-theme-option]').forEach((button) => {
    const active = button.dataset.themeOption === currentTheme;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

function saveTheme(themeId) {
  applyTheme(themeId);
  try {
    localStorage.setItem(THEME_KEY, currentTheme);
  } catch {
    // ignore quota errors
  }
}

function menusEqual(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  return JSON.stringify(a) === JSON.stringify(b);
}

function isDefaultMenu(drinks) {
  return menusEqual(drinks, DEFAULT_DRINKS) || menusEqual(drinks, LEGACY_DEFAULT_DRINKS);
}

async function uploadFullMenu(menu) {
  try {
    const response = await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(menu),
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

async function loadFullMenu() {
  const localDrinks = loadMenuDrinksFromStorage();
  const localExtras = loadMenuExtrasFromStorage();
  const localServices = loadMenuServicesFromStorage();
  const localUpdatedAt = localStorage.getItem(MENU_UPDATED_KEY);
  let remote = null;
  let remoteUpdatedAt = null;

  try {
    const response = await fetch('/api/menu', { cache: 'no-store' });
    if (response.ok) {
      const data = await response.json();
      remote = {
        drinks: Array.isArray(data.drinks) ? data.drinks.map(normalizeDrink).filter(Boolean) : null,
        extras: Array.isArray(data.extras) ? data.extras.map(normalizeExtra).filter(Boolean) : [],
        services: Array.isArray(data.services) ? data.services.map(normalizeService).filter(Boolean) : null,
        visibility: normalizeVisibility(data.visibility),
      };
      remoteUpdatedAt = data.updatedAt || null;
    }
  } catch {
    // fall back to local copy
  }

  const localMenu = {
    drinks: localDrinks,
    extras: localExtras || [],
    services: localServices,
  };

  if (localDrinks?.length && remote?.drinks?.length && !menusEqual(localDrinks, remote.drinks)) {
    const remoteTime = remoteUpdatedAt ? Date.parse(remoteUpdatedAt) : 0;
    const localTime = localUpdatedAt ? Date.parse(localUpdatedAt) : 0;

    if (localTime > remoteTime || isDefaultMenu(remote.drinks)) {
      await uploadFullMenu({
        drinks: localDrinks,
        extras: localExtras || [],
        services: localServices || DEFAULT_SERVICES.map((item) => ({ ...item })),
        visibility: loadVisibilityFromStorage(),
      });
      return {
        drinks: localDrinks,
        extras: localExtras || [],
        services: localServices || DEFAULT_SERVICES.map((item) => ({ ...item })),
        visibility: loadVisibilityFromStorage(),
      };
    }
  }

  if (localDrinks?.length && (!remote?.drinks?.length || isDefaultMenu(remote.drinks))) {
    await uploadFullMenu({
      drinks: localDrinks,
      extras: localExtras || [],
      services: localServices || DEFAULT_SERVICES.map((item) => ({ ...item })),
      visibility: loadVisibilityFromStorage(),
    });
    return {
      drinks: localDrinks,
      extras: localExtras || [],
      services: localServices || DEFAULT_SERVICES.map((item) => ({ ...item })),
      visibility: loadVisibilityFromStorage(),
    };
  }

  if (remote?.drinks?.length) {
    const menu = {
      drinks: remote.drinks,
      extras: remote.extras || [],
      services: remote.services?.length
        ? remote.services
        : DEFAULT_SERVICES.map((item) => ({ ...item })),
      visibility: remote.visibility || normalizeVisibility(),
    };
    saveFullMenuLocalFrom(menu);
    if (remoteUpdatedAt) localStorage.setItem(MENU_UPDATED_KEY, remoteUpdatedAt);
    return menu;
  }

  if (localDrinks?.length) {
    return {
      drinks: localDrinks,
      extras: localExtras || [],
      services: localServices || DEFAULT_SERVICES.map((item) => ({ ...item })),
      visibility: loadVisibilityFromStorage(),
    };
  }

  const menu = {
    drinks: DEFAULT_DRINKS.map((item) => ({ ...item })),
    extras: [],
    services: DEFAULT_SERVICES.map((item) => ({ ...item })),
    visibility: normalizeVisibility(),
  };
  saveFullMenuLocalFrom(menu);
  await uploadFullMenu(menu);
  return menu;
}

function saveFullMenuLocalFrom(menu) {
  menuDrinks = menu.drinks;
  menuExtras = menu.extras;
  menuServices = menu.services;
  if (menu.visibility) categoryVisibility = normalizeVisibility(menu.visibility);
  saveFullMenuLocal();
}

async function saveFullMenu() {
  saveFullMenuLocal();
  const updatedAt = new Date().toISOString();
  localStorage.setItem(MENU_UPDATED_KEY, updatedAt);

  try {
    const response = await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        drinks: menuDrinks,
        extras: menuExtras,
        services: menuServices,
        visibility: categoryVisibility,
      }),
      keepalive: true,
      cache: 'no-store',
    });
    if (response.ok) {
      const data = await response.json();
      if (data.updatedAt) localStorage.setItem(MENU_UPDATED_KEY, data.updatedAt);
    }
  } catch {
    // menu still saved locally
  }
}

function makeDrinkId(name, existingIds, prefix = 'drink') {
  const transliterated = String(name || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 40);
  let base = transliterated || `${prefix}-${Date.now()}`;
  if (!existingIds.has(base)) return base;
  let index = 2;
  while (existingIds.has(`${base}-${index}`)) index += 1;
  return `${base}-${index}`;
}

function drinkIconMarkup(iconKey) {
  const inner = DRINK_ICONS[iconKey] || DRINK_ICONS.generic;
  return `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
}

function serviceIconMarkup(iconKey) {
  const inner = SERVICE_ICONS[iconKey] || SERVICE_ICONS.generic;
  return `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
}

function extraIconMarkup(iconKey) {
  const inner = EXTRA_ICONS[iconKey] || EXTRA_ICONS.generic;
  return `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
}

function getAllMenuIds() {
  return new Set([
    ...menuDrinks.map((item) => item.id),
    ...menuExtras.map((item) => item.id),
    ...menuServices.map((item) => item.id),
  ]);
}

function getExtraStock(id) {
  const extra = menuExtras.find((item) => item.id === id);
  return extra?.stock ?? 0;
}

function pruneCartItems() {
  const validIds = getAllMenuIds();
  Array.from(cartItems.keys()).forEach((id) => {
    if (!validIds.has(id)) cartItems.delete(id);
  });
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
  row.dataset.category = 'drink';

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

function createExtraRow(extra) {
  const row = document.createElement('article');
  row.className = 'row';
  row.dataset.id = extra.id;
  row.dataset.name = extra.name;
  row.dataset.amount = String(extra.amount);
  row.dataset.category = 'extra';

  if (extra.stock <= 0) {
    row.classList.add('row--out-of-stock');
    row.innerHTML = `
      <span class="drink-icon" aria-hidden="true">${extraIconMarkup(extra.icon)}</span>
      <div class="row-main">
        <span class="name"></span>
      </div>
      <span class="row-status">нема в наявності</span>
    `;
    row.querySelector('.name').textContent = extra.name;
    return row;
  }

  row.innerHTML = `
    <span class="drink-icon" aria-hidden="true">${extraIconMarkup(extra.icon)}</span>
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

  row.querySelector('.name').textContent = extra.name;
  row.querySelector('.price').textContent = `${extra.amount} грн`;
  return row;
}

function createServiceRow(service) {
  const row = document.createElement('article');
  row.className = 'row';
  row.dataset.id = service.id;
  row.dataset.name = service.name;
  row.dataset.amount = String(service.amount);
  row.dataset.category = 'service';

  row.innerHTML = `
    <span class="drink-icon" aria-hidden="true">${serviceIconMarkup(service.icon)}</span>
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

  row.querySelector('.name').textContent = service.name;
  row.querySelector('.price').textContent = `${service.amount} грн`;
  return row;
}

function restoreRowQuantities(container, prevQty) {
  if (!container) return;
  container.querySelectorAll('.row').forEach((row) => {
    if (prevQty.has(row.dataset.id)) {
      setRowQty(row, prevQty.get(row.dataset.id));
    }
  });
}

function captureRowQuantities(container) {
  const prevQty = new Map();
  if (!container) return prevQty;
  container.querySelectorAll('.row').forEach((row) => {
    const qty = cartItems.get(row.dataset.id)?.qty;
    if (qty) prevQty.set(row.dataset.id, qty);
  });
  return prevQty;
}

function renderDrinksMenu() {
  if (!drinksMenu) return;

  const prevQty = captureRowQuantities(drinksMenu);
  drinksMenu.innerHTML = '';
  menuDrinks.forEach((drink) => {
    const row = createDrinkRow(drink);
    drinksMenu.appendChild(row);
    bindMenuRow(row);
  });
  restoreRowQuantities(drinksMenu, prevQty);
}

function renderExtrasMenu() {
  if (!extrasMenu || !extrasMenuList) return;

  const prevQty = captureRowQuantities(extrasMenuList);
  extrasMenuList.innerHTML = '';

  if (!menuExtras.length) {
    extrasMenu.hidden = true;
    return;
  }

  extrasMenu.hidden = false;
  menuExtras.forEach((extra) => {
    const row = createExtraRow(extra);
    extrasMenuList.appendChild(row);
    if (extra.stock > 0) bindMenuRow(row);
  });
  restoreRowQuantities(extrasMenuList, prevQty);
}

function renderServicesMenu() {
  if (!servicesMenuList) return;

  const prevQty = captureRowQuantities(servicesMenuList);
  servicesMenuList.innerHTML = '';

  menuServices.forEach((service) => {
    const row = createServiceRow(service);
    servicesMenuList.appendChild(row);
    bindMenuRow(row);
  });
  restoreRowQuantities(servicesMenuList, prevQty);
}

function renderAllMenus() {
  renderDrinksMenu();
  renderExtrasMenu();
  renderServicesMenu();
  applyCategoryVisibility();
  pruneCartItems();
  updateCart();
  updateMenuEntryMeta();
  renderStatsHubVisibility();
}

function applyCategoryVisibility() {
  if (drinksMenu) {
    drinksMenu.hidden = !categoryVisibility.drinks || !menuDrinks.length;
  }

  if (extrasMenu) {
    extrasMenu.hidden = !categoryVisibility.extras || !menuExtras.length;
  }

  if (servicesMenu) {
    servicesMenu.hidden = !categoryVisibility.services || !menuServices.length;
  }
}

async function toggleCategoryVisibility(category) {
  if (!STATS_CATEGORIES[category]) return;
  categoryVisibility = {
    ...categoryVisibility,
    [category]: !categoryVisibility[category],
  };
  saveFullMenuLocal();
  applyCategoryVisibility();
  renderStatsHubVisibility();
  try {
    await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        drinks: menuDrinks,
        extras: menuExtras,
        services: menuServices,
        visibility: categoryVisibility,
      }),
      keepalive: true,
      cache: 'no-store',
    });
  } catch {
    // local state still updated
  }
}

function getActiveEditorDraft() {
  if (menuEditorSection === 'extras') return menuEditorExtrasDraft;
  if (menuEditorSection === 'services') return menuEditorServicesDraft;
  return menuEditorDraft;
}

function setActiveEditorDraft(items) {
  if (menuEditorSection === 'extras') menuEditorExtrasDraft = items;
  else if (menuEditorSection === 'services') menuEditorServicesDraft = items;
  else menuEditorDraft = items;
}

function addMenuEditorItem(name, amount, stock = 0) {
  const draft = getActiveEditorDraft();
  const prefix = menuEditorSection === 'extras'
    ? 'extra'
    : menuEditorSection === 'services'
      ? 'service'
      : 'drink';
  const existingIds = new Set(draft.map((item) => item.id));
  const item = {
    id: makeDrinkId(name, existingIds, prefix),
    name,
    amount: Math.round(amount),
  };

  if (menuEditorSection === 'drinks') {
    item.icon = DRINK_ICONS[menuEditorSelectedIcon] ? menuEditorSelectedIcon : 'generic';
  } else if (menuEditorSection === 'services') {
    item.icon = SERVICE_ICONS[menuEditorSelectedIcon] ? menuEditorSelectedIcon : 'generic';
  } else {
    item.stock = Number.isFinite(stock) && stock >= 0 ? Math.round(stock) : 0;
    item.icon = EXTRA_ICONS[menuEditorSelectedIcon] ? menuEditorSelectedIcon : 'generic';
  }

  draft.push(item);
  renderMenuEditorList();
}

function updateMenuEditorItem(id, name, amount, extra = {}) {
  const draft = getActiveEditorDraft();
  const item = draft.find((entry) => entry.id === id);
  if (!item) return;

  item.name = name;
  item.amount = Math.round(amount);

  if (menuEditorSection === 'drinks' && extra.icon && DRINK_ICONS[extra.icon]) {
    item.icon = extra.icon;
  }
  if (menuEditorSection === 'services' && extra.icon && SERVICE_ICONS[extra.icon]) {
    item.icon = extra.icon;
  }
  if (menuEditorSection === 'extras' && extra.stock !== undefined) {
    const stock = Number(extra.stock);
    item.stock = Number.isFinite(stock) && stock >= 0 ? Math.round(stock) : 0;
  }
  if (menuEditorSection === 'extras' && extra.icon && EXTRA_ICONS[extra.icon]) {
    item.icon = extra.icon;
  }

  renderMenuEditorList();
}

function removeMenuEditorItem(id) {
  setActiveEditorDraft(getActiveEditorDraft().filter((item) => item.id !== id));
  if (menuEditorEditingId === id) {
    menuEditorEditingId = null;
    menuEditorSelectedIcon = 'generic';
    renderMenuEditorIconPicker();
  }
  renderMenuEditorList();
}

function moveMenuEditorItem(id, direction) {
  const draft = getActiveEditorDraft();
  const index = draft.findIndex((item) => item.id === id);
  if (index < 0) return;

  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= draft.length) return;

  const [item] = draft.splice(index, 1);
  draft.splice(nextIndex, 0, item);
  renderMenuEditorList();
}

function updateMenuEntryMeta() {
  if (!statsMenuEntryMeta) return;
  const config = STATS_CATEGORIES[statsCategory] || STATS_CATEGORIES.drinks;
  if (statsMenuEntry) statsMenuEntry.hidden = Boolean(config.analyticsOnly);
  if (config.analyticsOnly) return;

  if (statsMenuEntryTitle) statsMenuEntryTitle.textContent = config.menuTitle;

  let count = 0;
  if (statsCategory === 'drinks') count = menuDrinks.length;
  if (statsCategory === 'extras') count = menuExtras.length;
  if (statsCategory === 'services') count = menuServices.length;

  statsMenuEntryMeta.textContent = count
    ? `${count} поз. · редагувати`
    : config.menuMeta;
}

function setMenuEditorIcon(iconId, { editingId = null } = {}) {
  if (menuEditorSection === 'services') {
    menuEditorSelectedIcon = SERVICE_ICONS[iconId] ? iconId : 'generic';
  } else if (menuEditorSection === 'extras') {
    menuEditorSelectedIcon = EXTRA_ICONS[iconId] ? iconId : 'generic';
  } else {
    menuEditorSelectedIcon = DRINK_ICONS[iconId] ? iconId : 'generic';
  }
  menuEditorEditingId = editingId;

  if (editingId) {
    const item = getActiveEditorDraft().find((entry) => entry.id === editingId);
    if (item) {
      item.icon = menuEditorSelectedIcon;
      renderMenuEditorList();
    }
  }

  renderMenuEditorIconPicker();
}

function updateMenuEditorSectionUi() {
  const isDrinks = menuEditorSection === 'drinks';
  const isExtras = menuEditorSection === 'extras';
  const isServices = menuEditorSection === 'services';

  menuEditorSectionTabs.forEach((tab) => {
    const active = tab.dataset.menuSection === menuEditorSection;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', active ? 'true' : 'false');
  });

  if (menuEditorAddTitle) {
    menuEditorAddTitle.textContent = isDrinks
      ? 'Новий напій'
      : isExtras
        ? 'Нова позиція'
        : 'Нова послуга';
  }

  if (menuEditorListTitle) {
    menuEditorListTitle.textContent = isDrinks
      ? 'Напої'
      : isExtras
        ? 'До кави'
        : 'Послуги';
  }

  if (menuEditorIconPicker) menuEditorIconPicker.hidden = false;
  if (menuEditorIconHint) menuEditorIconHint.hidden = false;
  if (menuAddStock) menuAddStock.hidden = !isExtras;
  menuAddForm?.classList.toggle('menu-editor-form--extras', isExtras);

  if (menuAddName) {
    menuAddName.placeholder = isExtras ? 'Назва товару' : isServices ? 'Назва послуги' : 'Назва напою';
  }
}

function setMenuEditorSection(section) {
  collectMenuEditorDraftFromDom();
  menuEditorSection = section;
  menuEditorEditingId = null;
  menuEditorSelectedIcon = section === 'extras' ? 'candy' : 'generic';
  updateMenuEditorSectionUi();
  renderMenuEditor();
  menuAddForm?.reset();
  menuAddName?.focus();
}

function renderMenuEditorIconPicker() {
  if (!menuEditorIconPicker) return;

  menuEditorIconPicker.innerHTML = '';
  const options = menuEditorSection === 'services'
    ? SERVICE_ICON_OPTIONS
    : menuEditorSection === 'extras'
      ? EXTRA_ICON_OPTIONS
      : DRINK_ICON_OPTIONS;
  const markup = menuEditorSection === 'services'
    ? serviceIconMarkup
    : menuEditorSection === 'extras'
      ? extraIconMarkup
      : drinkIconMarkup;
  const icons = menuEditorSection === 'services'
    ? SERVICE_ICONS
    : menuEditorSection === 'extras'
      ? EXTRA_ICONS
      : DRINK_ICONS;

  if (menuEditorIconHint) {
    if (menuEditorEditingId) {
      const item = getActiveEditorDraft().find((entry) => entry.id === menuEditorEditingId);
      menuEditorIconHint.textContent = item
        ? `Значок для «${item.name}»`
        : 'Оберіть значок';
    } else {
      menuEditorIconHint.textContent = menuEditorSection === 'services'
        ? 'Оберіть значок для нової послуги'
        : menuEditorSection === 'extras'
          ? 'Оберіть значок для товару'
          : 'Оберіть значок для нового напою';
    }
  }

  options.forEach((option) => {
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
      <span class="menu-editor-icon-preview">${markup(option.id)}</span>
      <span class="menu-editor-icon-label">${option.label}</span>
    `;

    button.addEventListener('click', () => {
      if (!icons[option.id]) return;
      setMenuEditorIcon(option.id, { editingId: menuEditorEditingId });
    });

    menuEditorIconPicker.appendChild(button);
  });
}

function renderMenuEditorList() {
  if (!menuEditorList) return;

  const draft = getActiveEditorDraft();
  menuEditorList.innerHTML = '';

  if (!draft.length) {
    if (menuEditorEmpty) menuEditorEmpty.hidden = false;
    return;
  }

  if (menuEditorEmpty) menuEditorEmpty.hidden = true;

  draft.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'menu-editor-item';
    li.dataset.drinkId = item.id;
    if (menuEditorEditingId === item.id) {
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
    upBtn.addEventListener('click', () => moveMenuEditorItem(item.id, -1));

    const downBtn = document.createElement('button');
    downBtn.type = 'button';
    downBtn.className = 'menu-editor-move-btn';
    downBtn.textContent = '↓';
    downBtn.disabled = index === draft.length - 1;
    downBtn.setAttribute('aria-label', 'Опустити нижче');
    downBtn.addEventListener('click', () => moveMenuEditorItem(item.id, 1));

    orderWrap.append(upBtn, downBtn);

    const fields = document.createElement('div');
    fields.className = 'menu-editor-item-fields';

    const nameInput = document.createElement('input');
    nameInput.className = 'menu-editor-item-name';
    nameInput.type = 'text';
    nameInput.maxLength = 80;
    nameInput.value = item.name;
    nameInput.setAttribute('aria-label', 'Назва');

    const amountInput = document.createElement('input');
    amountInput.className = 'menu-editor-item-amount';
    amountInput.type = 'number';
    amountInput.min = '1';
    amountInput.step = '1';
    amountInput.value = String(item.amount);
    amountInput.setAttribute('aria-label', 'Ціна');

    let stockInput = null;
    const commit = () => {
      const name = nameInput.value.trim();
      const amount = Number(amountInput.value);
      if (!name || !Number.isFinite(amount) || amount <= 0) return;
      const payload = { icon: item.icon };
      if (menuEditorSection === 'extras') {
        payload.stock = Number(stockInput?.value ?? item.stock);
      }
      updateMenuEditorItem(item.id, name, amount, payload);
    };

    nameInput.addEventListener('change', commit);
    amountInput.addEventListener('change', commit);

    fields.append(nameInput, amountInput);

    if (menuEditorSection === 'extras') {
      stockInput = document.createElement('input');
      stockInput.className = 'menu-editor-item-stock';
      stockInput.type = 'number';
      stockInput.min = '0';
      stockInput.step = '1';
      stockInput.value = String(item.stock ?? 0);
      stockInput.setAttribute('aria-label', 'Кількість');
      stockInput.addEventListener('change', () => {
        const name = nameInput.value.trim();
        const amount = Number(amountInput.value);
        const stock = Number(stockInput.value);
        if (!name || !Number.isFinite(amount) || amount <= 0) return;
        updateMenuEditorItem(item.id, name, amount, { stock, icon: item.icon });
      });
      fields.append(stockInput);
    }

    const iconBtn = document.createElement('button');
    iconBtn.type = 'button';
    iconBtn.className = 'menu-editor-item-icon';
    iconBtn.innerHTML = menuEditorSection === 'services'
      ? serviceIconMarkup(item.icon)
      : menuEditorSection === 'extras'
        ? extraIconMarkup(item.icon)
        : drinkIconMarkup(item.icon);
    iconBtn.setAttribute('aria-label', `Змінити значок для ${item.name}`);
    iconBtn.addEventListener('click', () => {
      setMenuEditorIcon(item.icon, { editingId: item.id });
    });
    li.append(orderWrap, iconBtn, fields);

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'menu-editor-delete-btn';
    deleteBtn.textContent = '−';
    deleteBtn.setAttribute('aria-label', 'Видалити');
    deleteBtn.addEventListener('click', () => removeMenuEditorItem(item.id));

    li.append(deleteBtn);
    menuEditorList.appendChild(li);
  });
}

function renderMenuEditor() {
  updateMenuEditorSectionUi();
  renderMenuEditorIconPicker();
  renderMenuEditorList();
}

function collectMenuEditorDraftFromDom() {
  if (!menuEditorList) return;

  const draft = getActiveEditorDraft();
  menuEditorList.querySelectorAll('.menu-editor-item').forEach((row) => {
    const item = draft.find((entry) => entry.id === row.dataset.drinkId);
    if (!item) return;

    const name = row.querySelector('.menu-editor-item-name')?.value.trim();
    const amount = Number(row.querySelector('.menu-editor-item-amount')?.value);
    if (!name || !Number.isFinite(amount) || amount <= 0) return;

    item.name = name;
    item.amount = Math.round(amount);

    if (menuEditorSection === 'extras') {
      const stock = Number(row.querySelector('.menu-editor-item-stock')?.value);
      item.stock = Number.isFinite(stock) && stock >= 0 ? Math.round(stock) : 0;
    }
  });
}

async function saveMenuEditor() {
  if (!menuEditorSaveBtn) return;

  collectMenuEditorDraftFromDom();
  menuEditorSaveBtn.disabled = true;
  menuEditorSaveBtn.textContent = 'Зберігається…';

  menuDrinks = menuEditorDraft.map((item) => ({ ...item }));
  menuExtras = menuEditorExtrasDraft.map((item) => ({ ...item }));
  menuServices = menuEditorServicesDraft.map((item) => ({ ...item }));
  pruneCartItems();

  try {
    await saveFullMenu();
    renderAllMenus();
    menuEditorSaveBtn.textContent = 'Збережено ✓';
    window.setTimeout(() => {
      closeMenuEditor();
    }, 450);
  } catch {
    menuEditorSaveBtn.textContent = 'Помилка — спробуйте ще';
    menuEditorSaveBtn.disabled = false;
  }
}

function openMenuEditor(section = 'drinks', { singleSection = true } = {}) {
  if (!menuEditor) return;

  menuEditorDraft = menuDrinks.map((item) => ({ ...item }));
  menuEditorExtrasDraft = menuExtras.map((item) => ({ ...item }));
  menuEditorServicesDraft = menuServices.map((item) => ({ ...item }));
  menuEditorSection = STATS_CATEGORIES[section] ? section : 'drinks';
  menuEditorSingleSection = singleSection;
  menuEditorEditingId = null;
  menuEditorSelectedIcon = menuEditorSection === 'extras' ? 'candy' : 'generic';
  menuEditor.classList.toggle('menu-editor--single-section', menuEditorSingleSection);
  if (menuEditorSaveBtn) {
    menuEditorSaveBtn.disabled = false;
    menuEditorSaveBtn.textContent = 'Зберегти меню';
  }
  updateMenuEditorSectionUi();
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
  menuEditorSection = 'drinks';
  menuEditorSingleSection = false;
  menuEditor.classList.remove('menu-editor--single-section');
  menuAddForm?.reset();
  document.body.classList.remove('menu-editor-open');
}

async function initMenu() {
  const menu = await loadFullMenu();
  menuDrinks = menu.drinks;
  menuExtras = menu.extras;
  menuServices = menu.services;
  categoryVisibility = normalizeVisibility(menu.visibility || loadVisibilityFromStorage());
  renderAllMenus();
}

async function applyOrderStockChanges(order) {
  if (!order?.items?.length) return false;

  let changed = false;
  order.items.forEach((item) => {
    const extra = menuExtras.find((entry) => entry.id === item.id);
    if (!extra) return;
    extra.stock = Math.max(0, (extra.stock ?? 0) - item.qty);
    changed = true;
  });

  if (changed) {
    await saveFullMenu();
    renderExtrasMenu();
  }

  return changed;
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

let stockToastTimer = null;

function showStockLimitNotice() {
  if (!stockToast) return;

  stockToast.textContent = 'На жаль, це все що наразі є';
  stockToast.hidden = false;
  requestAnimationFrame(() => stockToast.classList.add('is-visible'));

  if (stockToastTimer) clearTimeout(stockToastTimer);
  stockToastTimer = setTimeout(() => {
    stockToast.classList.remove('is-visible');
    stockToastTimer = setTimeout(() => {
      stockToast.hidden = true;
      stockToastTimer = null;
    }, 220);
  }, 2600);
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
    category: 'service',
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
    category: row.dataset.category || 'drink',
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
  let next = Math.max(0, current + delta);

  if (row.dataset.category === 'extra' && delta > 0) {
    const stock = getExtraStock(row.dataset.id);
    if (stock <= 0) return;
    if (current >= stock) {
      showStockLimitNotice();
      return;
    }
    next = Math.min(next, stock);
  }

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

async function finishOtherPayment() {
  const order = pendingOrder ? { ...pendingOrder, items: pendingOrder.items.map((item) => ({ ...item })) } : null;
  pendingOrderId = null;
  otherPaymentRecorded = false;
  clearPendingPayment();
  pendingOrder = null;
  awaitingPayment = false;
  closeCardPaySheet();
  payActions.forEach((action) => {
    action.disabled = false;
  });
  if (order) await applyOrderStockChanges(order);
  clearCart();
  showThanks();
}
async function confirmPaymentSuccess() {
  const order = pendingOrder ? { ...pendingOrder, items: pendingOrder.items.map((item) => ({ ...item })) } : null;
  pendingOrderId = null;
  otherPaymentRecorded = false;
  clearPendingPayment();
  pendingOrder = null;
  awaitingPayment = false;
  closeConfirmSheet();
  if (order) await applyOrderStockChanges(order);
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
  const stock = Number(menuAddStock?.value);
  if (!name || !Number.isFinite(amount) || amount <= 0) return;
  if (menuEditorSection === 'extras') {
    if (!Number.isFinite(stock) || stock < 0) return;
    addMenuEditorItem(name, amount, stock);
  } else {
    addMenuEditorItem(name, amount);
  }
  menuAddForm.reset();
  menuEditorEditingId = null;
  renderMenuEditorIconPicker();
  menuAddName?.focus();
});

menuEditorSectionTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const section = tab.dataset.menuSection;
    if (!section || section === menuEditorSection) return;
    setMenuEditorSection(section);
  });
});

menuSettingsBtn?.addEventListener('click', () => {
  openMenuEditor(statsCategory, { singleSection: true });
});
menuEditorSaveBtn?.addEventListener('click', () => {
  saveMenuEditor();
});
menuEditor?.querySelector('[data-menu-editor-back]')?.addEventListener('click', closeMenuEditor);
document.querySelectorAll('[data-theme-option]').forEach((button) => {
  button.addEventListener('click', () => {
    saveTheme(button.dataset.themeOption);
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

function initStandaloneMode() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true;
  if (isStandalone) {
    document.documentElement.classList.add('is-standalone');
  }
}

let splashDismissed = false;

function dismissSplash() {
  if (splashDismissed || !appSplash) return;
  splashDismissed = true;
  document.body.classList.remove('is-splash-active');
  appSplash.classList.add('is-exiting');
  appSplash.setAttribute('aria-hidden', 'true');
  appSplash.setAttribute('aria-busy', 'false');
  window.setTimeout(() => {
    appSplash.hidden = true;
  }, 520);
}

async function bootApp() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const minSplashMs = reducedMotion ? 0 : 1500;
  const started = Date.now();
  const maxTimer = window.setTimeout(dismissSplash, 6000);

  try {
    await initMenu();
  } catch {
    // show menu with cached data or empty state
  }

  const wait = Math.max(0, minSplashMs - (Date.now() - started));
  window.setTimeout(() => {
    window.clearTimeout(maxTimer);
    dismissSplash();
  }, wait);
}

applyTheme(currentTheme);
initStandaloneMode();
bootApp();
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
  return isServiceLine(line);
}

function isServiceLine(line) {
  if (line?.category === 'service') return true;
  const id = String(line?.id || '');
  if (menuServices.some((service) => service.id === id)) return true;
  const name = String(line?.name || '').trim();
  if (menuServices.some((service) => service.name === name)) return true;
  return isHaircutName(line?.name);
}

function isExtraLine(line) {
  if (line?.category === 'extra') return true;
  const id = String(line?.id || '');
  if (menuExtras.some((extra) => extra.id === id)) return true;
  const name = String(line?.name || '').trim();
  return menuExtras.some((extra) => extra.name === name);
}

function isCoffeeLine(line) {
  return !isServiceLine(line) && !isExtraLine(line);
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

  const extra = menuExtras.find((item) => item.id === line.id || item.name === line.name);
  if (extra) return extra.amount * qty;

  const service = menuServices.find((item) => item.id === line.id || item.name === line.name);
  if (service) return service.amount * qty;

  if (isHaircutLine(line)) return 250 * qty;

  const drink = menuDrinks.find((item) => item.id === line.id || item.name === line.name);
  if (drink) return drink.amount * qty;

  return 0;
}

function splitIncomeRecord(record) {
  const amount = Number(record.amount || 0);
  let coffee = 0;
  let haircut = 0;
  let extras = 0;
  let youtube = 0;
  let coffeeDrinks = 0;
  let haircutCount = 0;
  let extrasCount = 0;
  let youtubeCount = 0;
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
        if (isServiceLine(line)) {
          haircut += value;
          haircutCount += qty;
        } else if (isExtraLine(line)) {
          extras += value;
          extrasCount += qty;
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
    return {
      coffee,
      haircut,
      extras,
      youtube,
      coffeeDrinks,
      haircutCount,
      extrasCount,
      youtubeCount,
      manualCoffeeCount,
    };
  }

  if (record.source === 'cash-youtube') {
    youtube += amount;
    youtubeCount += 1;
  } else if (isHaircutName(record.label)) {
    haircut += amount;
    haircutCount += 1;
  } else if (record.source === 'cash-extras') {
    extras += amount;
    extrasCount += 1;
  } else if (record.source === 'cash-services') {
    haircut += amount;
    haircutCount += 1;
  } else {
    coffee += amount;
    manualCoffeeCount += 1;
  }

  return {
    coffee,
    haircut,
    extras,
    youtube,
    coffeeDrinks,
    haircutCount,
    extrasCount,
    youtubeCount,
    manualCoffeeCount,
  };
}

function getYoutubeOnlyIncomes(incomes) {
  return incomes.flatMap((record) => {
    const part = splitIncomeRecord(record);
    if (part.youtube <= 0) return [];
    return [{ ...record, amount: part.youtube }];
  });
}

function getCoffeeOnlyIncomes(incomes) {
  return incomes.flatMap((record) => {
    const part = splitIncomeRecord(record);
    if (part.coffee <= 0) return [];

    const items = getIncomeItems(record);
    if (record.source === 'order' && items?.length) {
      const coffeeItems = items.filter((line) => isCoffeeLine(line));
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

function getExtrasOnlyIncomes(incomes) {
  return incomes.flatMap((record) => {
    const part = splitIncomeRecord(record);
    if (part.extras <= 0) return [];

    const items = getIncomeItems(record);
    if (record.source === 'order' && items?.length) {
      const extraItems = items.filter((line) => isExtraLine(line));
      if (!extraItems.length) return [];

      return [{
        ...record,
        amount: part.extras,
        items: extraItems,
      }];
    }

    if (record.source === 'cash-extras') {
      return [{ ...record, amount: part.extras }];
    }

    return [];
  });
}

function getServiceOnlyIncomes(incomes) {
  return incomes.flatMap((record) => {
    const part = splitIncomeRecord(record);
    if (part.haircut <= 0) return [];

    const items = getIncomeItems(record);
    if (record.source === 'order' && items?.length) {
      const serviceItems = items.filter((line) => isServiceLine(line));
      if (!serviceItems.length) return [];

      return [{
        ...record,
        amount: part.haircut,
        items: serviceItems,
      }];
    }

    if (record.source === 'cash-services' || isHaircutName(record.label)) {
      return [{ ...record, amount: part.haircut }];
    }

    return [];
  });
}

function getExpenseCategory(expense) {
  const source = String(expense?.source || '');
  if (source === 'expense-extras') return 'extras';
  if (source === 'expense-services') return 'services';
  if (source === 'expense-youtube') return 'youtube';
  if (source === 'expense-drinks') return 'drinks';
  return 'drinks';
}

function getExpensesByCategory(expenses, category) {
  return expenses.filter((expense) => getExpenseCategory(expense) === category);
}

function getCategoryIncomes(incomes, category) {
  if (category === 'drinks') return getCoffeeOnlyIncomes(incomes);
  if (category === 'extras') return getExtrasOnlyIncomes(incomes);
  if (category === 'youtube') return getYoutubeOnlyIncomes(incomes);
  return getServiceOnlyIncomes(incomes);
}

function getCategoryIncomeTotal(incomes, category) {
  const summary = summarizeIncomes(incomes);
  if (category === 'drinks') return summary.coffee;
  if (category === 'extras') return summary.extras;
  if (category === 'youtube') return summary.youtube;
  return summary.haircut;
}

function getCategoryCount(summary, category) {
  if (category === 'drinks') return summary.coffeeDrinks + summary.manualCoffeeCount;
  if (category === 'extras') return summary.extrasCount;
  if (category === 'youtube') return summary.youtubeCount;
  return summary.haircutCount;
}

function categoryChartCount(income, category) {
  const part = splitIncomeRecord(income);
  if (category === 'drinks') return coffeeDrinkCount(income);
  if (category === 'extras') {
    if (income.source === 'order') return part.extrasCount;
    return income.source === 'cash-extras' ? 1 : 0;
  }
  if (category === 'youtube') return income.source === 'cash-youtube' ? 1 : 0;
  if (income.source === 'order') return part.haircutCount;
  return income.source === 'cash-services' || isHaircutName(income.label) ? 1 : 0;
}

function summarizeIncomes(incomes) {
  return incomes.reduce((summary, record) => {
    const part = splitIncomeRecord(record);
    summary.coffee += part.coffee;
    summary.haircut += part.haircut;
    summary.extras += part.extras;
    summary.youtube += part.youtube;
    summary.coffeeDrinks += part.coffeeDrinks;
    summary.haircutCount += part.haircutCount;
    summary.extrasCount += part.extrasCount;
    summary.youtubeCount += part.youtubeCount;
    summary.manualCoffeeCount += part.manualCoffeeCount;
    return summary;
  }, {
    coffee: 0,
    haircut: 0,
    extras: 0,
    youtube: 0,
    coffeeDrinks: 0,
    haircutCount: 0,
    extrasCount: 0,
    youtubeCount: 0,
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

function fillChartBuckets(buckets, incomes, period, category = 'drinks') {
  const map = Object.fromEntries(buckets.map((bucket) => [bucket.key, bucket]));
  const useMonths = period === 'year';

  incomes.forEach((income) => {
    const count = categoryChartCount(income, category);
    if (!count) return;

    const key = useMonths
      ? localMonthKey(income.createdAt)
      : localDayKey(income.createdAt);

    if (map[key]) map[key].count += count;
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

function renderOrderChart(incomes, category = statsCategory) {
  if (!statsDailyChart) return;

  const buckets = fillChartBuckets(
    buildChartBuckets(statsChartPeriod),
    incomes,
    statsChartPeriod,
    category,
  );
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

function formatYoutubeCount(value) {
  return Number(value || 0).toLocaleString('uk-UA');
}

function getYoutubeHubMeta(summary) {
  if (youtubeChannelStats) {
    return `${formatYoutubeCount(youtubeChannelStats.subscribers)} підписників`;
  }
  return formatCountLabel(
    getCategoryCount(summary, 'youtube'),
    ...STATS_CATEGORIES.youtube.countLabels,
  );
}

function setYoutubeStatus(message, { isError = false } = {}) {
  if (!statsYoutubeStatus) return;
  if (!message) {
    statsYoutubeStatus.hidden = true;
    statsYoutubeStatus.textContent = '';
    statsYoutubeStatus.classList.remove('is-error');
    return;
  }
  statsYoutubeStatus.hidden = false;
  statsYoutubeStatus.textContent = message;
  statsYoutubeStatus.classList.toggle('is-error', isError);
}

function renderYoutubeChannelStats(channel) {
  if (statsYoutubeSubscribers) statsYoutubeSubscribers.textContent = formatYoutubeCount(channel?.subscribers);
  if (statsYoutubeViews) statsYoutubeViews.textContent = formatYoutubeCount(channel?.views);
  if (statsYoutubeVideos) statsYoutubeVideos.textContent = formatYoutubeCount(channel?.videos);
  if (statsYoutubeTitle) {
    const config = STATS_CATEGORIES.youtube;
    const link = channel?.url || config.channelUrl;
    const name = channel?.title || 'КіноМить';
    statsYoutubeTitle.innerHTML = link
      ? `<a href="${link}" target="_blank" rel="noopener noreferrer">${name}</a>`
      : name;
    statsYoutubeTitle.hidden = false;
  }
  setYoutubeStatus('');
}

async function refreshYoutubeStats() {
  try {
    const response = await fetch('/api/youtube', { cache: 'no-store' });
    const data = await response.json();
    if (data.ok && data.channel) {
      youtubeChannelStats = data.channel;
      return;
    }
    youtubeChannelStats = null;
  } catch {
    youtubeChannelStats = null;
  }
}

async function loadYoutubeChannelStats() {
  if (!statsYoutubeSubscribers) return;

  statsYoutubeSubscribers.textContent = '…';
  if (statsYoutubeViews) statsYoutubeViews.textContent = '…';
  if (statsYoutubeVideos) statsYoutubeVideos.textContent = '…';
  setYoutubeStatus('');

  try {
    const response = await fetch('/api/youtube', { cache: 'no-store' });
    const data = await response.json();

    if (!data.ok) {
      youtubeChannelStats = null;
      if (statsYoutubeSubscribers) statsYoutubeSubscribers.textContent = '—';
      if (statsYoutubeViews) statsYoutubeViews.textContent = '—';
      if (statsYoutubeVideos) statsYoutubeVideos.textContent = '—';
      setYoutubeStatus('Не вдалося завантажити статистику каналу @КіноМить', { isError: true });
      return;
    }

    youtubeChannelStats = data.channel;
    renderYoutubeChannelStats(data.channel);
  } catch {
    youtubeChannelStats = null;
    if (statsYoutubeSubscribers) statsYoutubeSubscribers.textContent = '—';
    if (statsYoutubeViews) statsYoutubeViews.textContent = '—';
    if (statsYoutubeVideos) statsYoutubeVideos.textContent = '—';
    setYoutubeStatus('Помилка мережі при завантаженні YouTube', { isError: true });
  }
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
  if (part.haircut > 0 && part.coffee <= 0 && part.extras <= 0) return 'haircut';
  if (part.extras > 0 && part.coffee <= 0 && part.haircut <= 0) return 'extras';
  if ((part.haircut > 0 || part.extras > 0) && part.coffee > 0) return 'mixed';
  return 'coffee';
}

function formatRoiPercent(value) {
  return `${value.toLocaleString('uk-UA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;
}

function formatSignedPercent(value) {
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  return `${sign}${Math.abs(value).toLocaleString('uk-UA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;
}

function getRoiPercent(income, expenses) {
  if (expenses <= 0) return null;
  return (income / expenses) * 100;
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
    statsRoiMain.textContent = formatRoiPercent(rawPercent);
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
    if (category === 'extras') return summary;
    if (category === 'mixed') {
      const part = splitIncomeRecord(item);
      if (part.coffee > 0 && part.haircut > 0) return `Кава + послуги · ${summary}`;
      if (part.coffee > 0 && part.extras > 0) return `Кава + до кави · ${summary}`;
      if (part.extras > 0 && part.haircut > 0) return `До кави + послуги · ${summary}`;
      return summary;
    }
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
  if (category === 'extras') li.classList.add('stats-list-item--extras');
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

function renderStatsHubVisibility() {
  document.querySelectorAll('[data-visibility-toggle]').forEach((button) => {
    const category = button.dataset.visibilityToggle;
    const visible = categoryVisibility[category] !== false;
    button.classList.toggle('is-off', !visible);
    button.setAttribute('aria-pressed', visible ? 'true' : 'false');
  });

  document.querySelectorAll('.stats-hub-card[data-category]').forEach((card) => {
    const category = card.dataset.category;
    const visible = categoryVisibility[category] !== false;
    card.classList.toggle('is-menu-hidden', !visible);
    const hint = card.querySelector(`[data-visibility-hint="${category}"]`);
    if (hint) hint.hidden = visible;
  });
}

function renderStatsHub(data) {
  const summary = summarizeIncomes(data.incomes);
  const config = STATS_CATEGORIES;
  const drinksExpenses = getExpensesByCategory(data.expenses, 'drinks')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const extrasExpenses = getExpensesByCategory(data.expenses, 'extras')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const servicesExpenses = getExpensesByCategory(data.expenses, 'services')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const youtubeExpenses = getExpensesByCategory(data.expenses, 'youtube')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalIncome = summary.coffee + summary.extras + summary.haircut + summary.youtube;
  const totalExpenses = data.expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalFlow = totalIncome + totalExpenses;
  const balance = totalIncome - totalExpenses;
  const incomeShare = totalFlow > 0 ? (totalIncome / totalFlow) * 100 : 0;
  const expenseShare = totalFlow > 0 ? (totalExpenses / totalFlow) * 100 : 0;
  const balanceShare = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

  if (statsHubCoffeeTotal) {
    statsHubCoffeeTotal.textContent = formatStatsMoney(summary.coffee);
  }
  if (statsHubCoffeeMeta) {
    statsHubCoffeeMeta.textContent = formatCountLabel(
      getCategoryCount(summary, 'drinks'),
      ...config.drinks.countLabels,
    );
  }
  if (statsHubCoffeeRoi) {
    const roi = getRoiPercent(summary.coffee, drinksExpenses);
    statsHubCoffeeRoi.textContent = roi === null ? 'Окупність: —' : `Окупність: ${formatRoiPercent(roi)}`;
  }
  if (statsHubExtrasTotal) {
    statsHubExtrasTotal.textContent = formatStatsMoney(summary.extras);
  }
  if (statsHubExtrasMeta) {
    statsHubExtrasMeta.textContent = formatCountLabel(
      getCategoryCount(summary, 'extras'),
      ...config.extras.countLabels,
    );
  }
  if (statsHubExtrasRoi) {
    const roi = getRoiPercent(summary.extras, extrasExpenses);
    statsHubExtrasRoi.textContent = roi === null ? 'Окупність: —' : `Окупність: ${formatRoiPercent(roi)}`;
  }
  if (statsHubServicesTotal) {
    statsHubServicesTotal.textContent = formatStatsMoney(summary.haircut);
  }
  if (statsHubServicesMeta) {
    statsHubServicesMeta.textContent = formatCountLabel(
      getCategoryCount(summary, 'services'),
      ...config.services.countLabels,
    );
  }
  if (statsHubServicesRoi) {
    const roi = getRoiPercent(summary.haircut, servicesExpenses);
    statsHubServicesRoi.textContent = roi === null ? 'Окупність: —' : `Окупність: ${formatRoiPercent(roi)}`;
  }
  if (statsHubYoutubeTotal) {
    statsHubYoutubeTotal.textContent = formatStatsMoney(summary.youtube);
  }
  if (statsHubYoutubeMeta) {
    statsHubYoutubeMeta.textContent = getYoutubeHubMeta(summary);
  }
  if (statsHubYoutubeRoi) {
    const roi = getRoiPercent(summary.youtube, youtubeExpenses);
    statsHubYoutubeRoi.textContent = roi === null ? 'Окупність: —' : `Окупність: ${formatRoiPercent(roi)}`;
  }
  if (statsHubTotalIncome) {
    statsHubTotalIncome.textContent = formatStatsMoney(totalIncome);
  }
  if (statsHubTotalExpenses) {
    statsHubTotalExpenses.textContent = formatStatsMoney(totalExpenses);
  }
  if (statsHubIncomeShare) {
    statsHubIncomeShare.textContent = `${formatRoiPercent(incomeShare)} потоку`;
  }
  if (statsHubExpensesShare) {
    statsHubExpensesShare.textContent = `${formatRoiPercent(expenseShare)} потоку`;
  }
  if (statsHubBalanceTotal) {
    statsHubBalanceTotal.textContent = formatBalanceMoney(balance);
    statsHubBalanceTotal.classList.toggle('is-positive', balance > 0);
    statsHubBalanceTotal.classList.toggle('is-negative', balance < 0);
  }
  if (statsHubBalanceShare) {
    statsHubBalanceShare.textContent = totalIncome > 0
      ? `${formatSignedPercent(balanceShare)} маржа`
      : '0.00% маржа';
  }

  renderStatsHubVisibility();
}

function renderStatsCategoryView(data) {
  const category = statsCategory;
  const config = STATS_CATEGORIES[category] || STATS_CATEGORIES.drinks;
  const categoryIncome = getCategoryIncomeTotal(data.incomes, category);
  const categoryExpenses = getExpensesByCategory(data.expenses, category);
  const expensesTotal = categoryExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const balance = categoryIncome - expensesTotal;
  const categoryIncomes = getCategoryIncomes(data.incomes, category);

  if (statsCategoryTitle) statsCategoryTitle.textContent = config.label;
  if (statsCategorySubtitle) statsCategorySubtitle.textContent = config.subtitle;
  if (statsChartHeading) statsChartHeading.textContent = config.chartHeading;
  if (statsChartSection) statsChartSection.hidden = Boolean(config.analyticsOnly);
  if (statsYoutubeChannel) statsYoutubeChannel.hidden = !config.analyticsOnly;
  if (config.analyticsOnly) loadYoutubeChannelStats();

  const incomeFormTitle = document.querySelector('#stats-income-form .stats-section-title');
  if (incomeFormTitle) incomeFormTitle.textContent = 'Додати готівковий дохід';
  const expenseFormTitle = document.querySelector('#stats-expense-form .stats-section-title');
  if (expenseFormTitle) expenseFormTitle.textContent = 'Додати витрату';
  const incomeLabelInput = document.getElementById('stats-income-label');
  if (incomeLabelInput) incomeLabelInput.placeholder = config.incomePlaceholder;
  const expenseLabelInput = document.getElementById('stats-expense-label');
  if (expenseLabelInput) expenseLabelInput.placeholder = config.expensePlaceholder;

  const roiLabelEl = document.querySelector('.stats-card--roi .stats-card-label');
  if (roiLabelEl) roiLabelEl.textContent = config.roiLabel || 'Окупність';
  if (statsRoiWrap) statsRoiWrap.hidden = false;

  statsIncome.textContent = formatStatsMoney(categoryIncome);
  statsExpensesTotal.textContent = formatStatsMoney(expensesTotal);

  if (statsBalanceIncomeLabel) statsBalanceIncomeLabel.textContent = `Дохід (${config.label.toLowerCase()})`;
  if (statsBalanceExpenseLabel) statsBalanceExpenseLabel.textContent = 'Витрати';
  if (statsBalanceTotalLabel) statsBalanceTotalLabel.textContent = 'Баланс';
  statsTotalIncome.textContent = formatStatsMoney(categoryIncome);
  statsTotalExpenses.textContent = formatStatsMoney(expensesTotal);
  statsBalanceTotal.textContent = formatBalanceMoney(balance);
  statsBalanceTotal.classList.toggle('is-negative', balance < 0);
  statsBalanceTotal.classList.toggle('is-positive', balance > 0);

  renderRoi(categoryIncome, expensesTotal);

  if (!config.analyticsOnly) renderOrderChart(data.incomes, category);
  updateMenuEntryMeta();

  renderTransactionSection({
    listEl: statsIncomes,
    moreBtn: statsIncomesMore,
    items: categoryIncomes,
    expanded: incomesListExpanded,
    emptyText: 'Доходів ще немає',
    renderItem: renderIncomeItem,
  });

  renderTransactionSection({
    listEl: statsExpenseList,
    moreBtn: statsExpensesMore,
    items: categoryExpenses,
    expanded: expensesListExpanded,
    emptyText: 'Витрат ще немає',
    renderItem: renderExpenseItem,
  });
}

function renderStatsView(data) {
  if (statsHub && statsCategoryView) {
    const inCategory = !statsCategoryView.hidden;
    if (inCategory) renderStatsCategoryView(data);
    else renderStatsHub(data);
  }
}

function showStatsHub() {
  if (statsHub) statsHub.hidden = false;
  if (statsCategoryView) statsCategoryView.hidden = true;
  incomesListExpanded = false;
  expensesListExpanded = false;
  setStatsTab('income');
  setChartPeriod('week');
  closeEditTransaction();
  renderStatsHub(currentStatsData);
}

function openStatsCategory(category) {
  if (!STATS_CATEGORIES[category]) return;
  statsCategory = category;
  if (statsHub) statsHub.hidden = true;
  if (statsCategoryView) statsCategoryView.hidden = false;
  incomesListExpanded = false;
  expensesListExpanded = false;
  setStatsTab('income');
  setChartPeriod('week');
  closeEditTransaction();
  updateMenuEntryMeta();
  renderStatsCategoryView(currentStatsData);
}

async function refreshStats() {
  const [data] = await Promise.all([
    fetchStats(),
    refreshYoutubeStats(),
  ]);
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
  showStatsHub();
  refreshStats();
}

function closeStats() {
  if (!statsPanel) return;
  statsPanel.hidden = true;
  document.body.classList.remove('stats-open');
  closeMenuEditor();
  showStatsHub();
}

async function addCashIncome(label, amount, category = statsCategory) {
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
        category,
      }),
    });
  } catch {
    // online-only: failed request will show on next refresh
  }

  await refreshStats();
}

async function addExpense(label, amount, category = statsCategory) {
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
        category,
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

statsHub?.querySelectorAll('[data-open-category]').forEach((button) => {
  button.addEventListener('click', () => {
    openStatsCategory(button.dataset.openCategory);
  });
});

statsHub?.querySelectorAll('[data-visibility-toggle]').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleCategoryVisibility(button.dataset.visibilityToggle);
  });
});

statsCategoryView?.querySelector('[data-stats-hub-back]')?.addEventListener('click', showStatsHub);

statsTabIncome?.addEventListener('click', () => setStatsTab('income'));
statsTabExpense?.addEventListener('click', () => setStatsTab('expense'));

statsChartPeriodButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setChartPeriod(button.dataset.chartPeriod);
    renderOrderChart(currentStatsData.incomes, statsCategory);
  });
});

statsIncomesMore?.addEventListener('click', () => {
  incomesListExpanded = !incomesListExpanded;
  renderStatsCategoryView(currentStatsData);
});

statsExpensesMore?.addEventListener('click', () => {
  expensesListExpanded = !expensesListExpanded;
  renderStatsCategoryView(currentStatsData);
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
