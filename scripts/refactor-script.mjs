#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';

const filePath = new URL('../script.js', import.meta.url);
let src = readFileSync(filePath, 'utf8');
const APP_VERSION = '144';

src = src.replace(/const APP_VERSION = '[^']*';/, `const APP_VERSION = '${APP_VERSION}';`);
src = src.replace(/const STATS_PASSWORD = '1111';\n/, '');
src = src.replace(/const USER_CACHE_KEY = '[^']*';\n/, '');
src = src.replace(/let currentUser = null;\nlet googleClientId = null;\nlet googleSdkReady = null;\nlet authLoginResolver = null;\n/, '');

// Remove google DOM bindings
[
  'appSplashAuth', 'appSplashSkip', 'appSplashAuthError', 'googleSignInBtn',
  'userAccountLogout', 'heroAvatar', 'heroCupWrap',
].forEach((name) => {
  src = src.replace(new RegExp(`const ${name} = [^;]+;\n`, 'g'), '');
});

src = src.replace(/const loyaltyEnabled = Boolean\(currentUser\?\.id\);/, 'const loyaltyEnabled = true;');

src = src.replace(
  /function getIdentityId\(\) \{[\s\S]*?\n\}/,
  'function getIdentityId() {\n  return getDeviceId();\n}',
);

src = src.replace(
  /if \(freeCoffeeSection\) \{\n\s*freeCoffeeSection\.hidden = !currentUser \|\| Boolean\(drinksMenu\?\.hidden\);\n\s*\}/g,
  'if (freeCoffeeSection) {\n    freeCoffeeSection.hidden = Boolean(drinksMenu?.hidden);\n  }',
);

src = src.replace(
  /if \(!currentUser\) \{\n\s*freeCoffeeStamps\.replaceChildren\(\);\n\s*return;\n\s*\}\n\n/g,
  '',
);

src = src.replace(
  /function setFreeCoffeeBalance\(payload = \{\}, \{ animate = false, celebrated = false \} = \{\}\) \{\n\s*if \(!currentUser\?\.id\) \{[\s\S]*?return;\n\s*\}\n\n/,
  'function setFreeCoffeeBalance(payload = {}, { animate = false, celebrated = false } = {}) {\n  ',
);

src = src.replace(
  /async function loadFreeCoffeeBalance\(\) \{\n\s*if \(!currentUser\?\.id\) \{[\s\S]*?return;\n\s*\}\n\n\s*const deviceId = getIdentityId\(\);/,
  'async function loadFreeCoffeeBalance() {\n  const deviceId = getIdentityId();',
);

src = src.replace(
  /if \(!claim \|\| !currentUser\?\.id\) return;/,
  'if (!claim) return;',
);

src = src.replace(
  /function recordLocalUserCoffee\(drinkQty, forSelf = true\) \{\n\s*if \(!currentUser\?\.id\) return;\n/,
  'function recordLocalUserCoffee(drinkQty, forSelf = true) {\n',
);

src = src.replace(
  /async function loadUserCoffeeStats\(\) \{\n\s*if \(!currentUser\?\.id\) \{[\s\S]*?return;\n\s*\}\n\n\s*applyUserCoffeeStats\(readLocalUserCoffee\(\)\);/,
  'async function loadUserCoffeeStats() {\n  applyUserCoffeeStats(readLocalUserCoffee());',
);

// Remove auto-upload blocks in loadFullMenu
src = src.replace(
  /\n\s*if \(localDrinks\?\.length && remote\?\.drinks\?\.length && !menusEqual\(localDrinks, remote\.drinks\)\) \{[\s\S]*?\n\s*\}\n\n\s*if \(localDrinks\?\.length && \(!remote\?\.drinks\?\.length \|\| isDefaultMenu\(remote\.drinks\)\)\) \{[\s\S]*?\n\s*\}\n/,
  '\n',
);

src = src.replace(
  /saveFullMenuLocalFrom\(menu\);\n\s*await uploadFullMenu\(menu\);\n\s*return menu;\n\}/,
  'saveFullMenuLocalFrom(menu);\n  return menu;\n}',
);

// notifyOrder
src = src.replace(
  /function notifyOrder\(order, provider, orderId\) \{[\s\S]*?postOrder\(\);\n\}/,
  `async function notifyOrder(order, provider, orderId) {
  const payload = JSON.stringify({
    id: orderId,
    items: order.items.map(({ id, qty, category }) => ({ id, qty, category })),
    provider,
    deviceId: getIdentityId(),
    forSelf: order.forSelf !== false,
  });

  const response = await fetch('/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (data?.freeCoffee) applyFreeCoffeeClaim(data.freeCoffee, { animate: true });
  if (data?.ok) await refreshMenuAfterOrder();
  return { ok: Boolean(data?.ok), data };
}`,
);

src = src.replace(/function goToPayment\(provider\) \{/, `async function goToPayment(provider) {
  try { sessionStorage.setItem('kava-last-provider', provider); } catch { /* ignore */ }`);

src = src.replace(
  /if \(order\.total === 0\) \{[\s\S]*?return;\n\s*\}\n\n\s*if \(provider === 'other'\)/,
  `if (order.total === 0) {
    closeSheet();
    setPayActionsDisabled(true);
    try {
      const result = await notifyOrder(order, 'free', orderId);
      if (!result?.ok) throw new Error('order_failed');
      if (order.drinkQty > 0) recordLocalUserCoffee(order.drinkQty, order.forSelf !== false);
      awaitingPayment = false;
      clearPendingPayment();
      pendingOrder = null;
      pendingOrderId = null;
      clearCart();
      completeOrderCelebration();
      await loadFreeCoffeeBalance();
      await loadUserCoffeeStats();
    } catch {
      if (stockToast) {
        stockToast.textContent = 'Не вдалося підтвердити замовлення. Спробуйте ще.';
        stockToast.hidden = false;
      }
    } finally {
      setPayActionsDisabled(false);
    }
    return;
  }

  if (provider === 'other')`,
);

src = src.replace(/\n\s*notifyOrder\(order, provider, orderId\);\n\n\s*const url = getPaymentUrl/, '\n\n  const url = getPaymentUrl');

src = src.replace(
  /async function copyCardNumber\(\) \{[\s\S]*?cardPayCopy\) cardPayCopy\.textContent = 'Не вдалося скопіювати';\n\s*\}\n\}/,
  `async function copyCardNumber() {
  try {
    await navigator.clipboard.writeText(OTHER_BANK_CARD);
    if (cardPayCopy) {
      const original = cardPayCopy.textContent;
      cardPayCopy.textContent = 'Скопійовано';
      setTimeout(() => {
        cardPayCopy.textContent = original;
      }, 1500);
    }
  } catch {
    if (cardPayCopy) cardPayCopy.textContent = 'Не вдалося скопіювати';
  }
}`,
);

src = src.replace(
  /async function finishOtherPayment\(\) \{[\s\S]*?loadUserCoffeeStats\(\);\n\}/,
  `async function finishOtherPayment() {
  closeCardPaySheet();
  openConfirmSheet();
}`,
);

src = src.replace(
  /async function confirmPaymentSuccess\(\) \{[\s\S]*?loadUserCoffeeStats\(\);\n\}/,
  `async function confirmPaymentSuccess() {
  const order = pendingOrder ? { ...pendingOrder, items: pendingOrder.items.map((item) => ({ ...item })) } : null;
  const orderId = pendingOrderId;
  if (!order || !orderId) {
    closeConfirmSheet();
    return;
  }

  closeConfirmSheet();
  loader.hidden = false;
  loaderText.textContent = 'Підтверджуємо замовлення…';

  try {
    const provider = sessionStorage.getItem('kava-last-provider') || 'bank';
    const result = await notifyOrder(order, provider, orderId);
    if (!result?.ok) throw new Error('order_failed');
    if (order.drinkQty > 0) recordLocalUserCoffee(order.drinkQty, order.forSelf !== false);
    pendingOrderId = null;
    otherPaymentRecorded = false;
    clearPendingPayment();
    pendingOrder = null;
    awaitingPayment = false;
    setPayActionsDisabled(false);
    clearCart();
    completeOrderCelebration();
    await loadFreeCoffeeBalance();
    await loadUserCoffeeStats();
  } catch {
    if (stockToast) {
      stockToast.textContent = 'Не вдалося зберегти замовлення. Спробуйте ще.';
      stockToast.hidden = false;
    }
  } finally {
    loader.hidden = true;
  }
}`,
);

src = src.replace(/async function cancelPendingPayment\(\) \{\n\s*revokePendingOrderIncome\(\);\n/, 'async function cancelPendingPayment() {\n');

// Remove google auth block
src = src.replace(/function waitForGoogleSdk\([\s\S]*?if \(userAccountLogout\) \{[\s\S]*?\}\n\}\n\n/, '');

// renderUserAccount
src = src.replace(/function renderUserAccount\(\) \{[\s\S]*?\n\}\n\nfunction showSplashAuthError/, `function renderUserAccount() {
  resetHeroAvatar();
  if (!heroTitle) return;
  heroTitle.textContent = 'Кавове меню';
  heroTitle.classList.remove('is-user');
  if (heroLead) {
    heroLead.hidden = false;
    heroLead.textContent = 'Що бажаєте сьогодні?';
  }
}

function showSplashAuthError`);

// Remove unused splash auth helpers through getKyivDayKey
src = src.replace(/function showSplashAuthError\([\s\S]*?function getKyivDayKey\(/, 'function getKyivDayKey(');

// updateSplashLoyaltyMessage
src = src.replace(
  /function updateSplashLoyaltyMessage\(stamps = freeCoffeeStampsCount, cycle = freeCoffeeCycle\) \{[\s\S]*?\n\}\n\nfunction loyaltyCupMarkup/,
  `function updateSplashLoyaltyMessage(stamps = freeCoffeeStampsCount, cycle = freeCoffeeCycle) {
  if (!appSplashLoyalty) return;
  const untilFree = getLoyaltyUntilFree(stamps, cycle);
  appSplashLoyalty.hidden = false;
  appSplashLoyalty.textContent = formatLoyaltySplashText(untilFree);
  appSplashLoyalty.classList.add('is-loyalty');
}

function loyaltyCupMarkup`,
);

// bootApp
src = src.replace(/async function bootApp\(\) \{[\s\S]*?\n\}\n\napplyTheme/, `async function bootApp() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const minSplashMs = reducedMotion ? 0 : coarsePointer ? 900 : 1200;
  const started = Date.now();

  showSplashLoadingMessage('Готуємо для вас…');
  initMenuDelegation();

  try {
    await Promise.all([initMenu(), loadFreeCoffeeBalance(), loadUserCoffeeStats()]);
    updateSplashLoyaltyMessage(freeCoffeeStampsCount, freeCoffeeCycle);
  } catch {
    renderFreeCoffeeStamps();
  }

  window.setTimeout(dismissSplash, Math.max(0, minSplashMs - (Date.now() - started)));
}

applyTheme`);

// fetchStats
src = src.replace(
  /async function fetchStats\(\) \{\n\s*const response = await fetch\('\/api\/stats', \{ cache: 'no-store' \}\);/,
  `async function fetchStats() {
  const response = await fetch('/api/stats', { cache: 'no-store', credentials: 'include' });`,
);

if (!src.includes('async function loginStatsAdmin')) {
  src = src.replace(
    /function isStatsAuthenticated\(\) \{/,
    `async function loginStatsAdmin(password) {
  const response = await fetch('/api/stats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ type: 'login', password }),
  });
  const data = await response.json();
  if (!response.ok || !data?.ok) return false;
  sessionStorage.setItem(STATS_AUTH_KEY, '1');
  return true;
}

function isStatsAuthenticated() {`,
  );
}

src = src.replace(
  /statsGateForm\?\.addEventListener\('submit', \(event\) => \{[\s\S]*?openStats\(\);\n\}\);/,
  `statsGateForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const password = statsGatePassword?.value.trim();
  const ok = await loginStatsAdmin(password);
  if (!ok) {
    statsGateError.hidden = false;
    statsGatePassword?.focus();
    statsGatePassword?.select();
    return;
  }
  closeStatsGate();
  openStats();
});`,
);

src = src.replace(
  /fetch\('\/api\/stats', \{\n\s*method: 'POST',\n\s*headers: \{ 'Content-Type': 'application\/json' \},/g,
  "fetch('/api/stats', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    credentials: 'include',",
);

src = src.replace(
  /fetch\('\/api\/menu', \{\n\s*method: 'POST',\n\s*headers: \{ 'Content-Type': 'application\/json' \},/g,
  "fetch('/api/menu', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    credentials: 'include',",
);

// card pay: add confirm button handler
if (!src.includes('cardPayConfirm')) {
  src = src.replace(
    /cardPayCopy\?\.addEventListener\('click', copyCardNumber\);/,
    `cardPayCopy?.addEventListener('click', copyCardNumber);
const cardPayConfirm = document.getElementById('card-pay-confirm');
cardPayConfirm?.addEventListener('click', () => finishOtherPayment());`,
  );
}

// Clean dangling currentUser references
src = src.replace(/if \(currentUser\?\.id && order\.drinkQty > 0\)/g, 'if (order.drinkQty > 0)');
src = src.replace(/currentUser && picture/g, 'false');
src = src.replace(/!currentUser/g, 'true');
src = src.replace(/currentUser\?\.id/g, 'true');

writeFileSync(filePath, src);
console.log('Done. Lines:', src.split('\n').length);
