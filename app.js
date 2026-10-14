const NAV_ITEMS = [
  ["dashboard", "Dashboard", "⌂"],
  ["accounts", "Accounts", "▣"],
  ["transfers", "Transfers", "⇄"],
  ["payments", "Payments", "▤"],
  ["transactions", "Transactions", "↕"],
  ["cards", "Cards", "▭"],
  ["bills", "Bills", "≡"],
  ["profile", "Profile", "◉"],
  ["settings", "Settings", "⚙"],
];

const DEMO_ACCOUNT = "192830292";
const DEMO_PASSWORD = "alex1965";
const DEMO_OTP = "684291";
const app = document.querySelector("#app");
const toastRegion = document.querySelector("#toast-region");

const state = {
  authenticated: false,
  screen: "login",
  activePage: "dashboard",
  isNavigating: false,
  isProcessing: false,
  carouselInterval: null,
  balance: 8246.5,
  savingsBalance: 12480,
  monthlySpending: 2184.63,
  transactions: [
    { name: "Whole Foods Market", date: "Today, 10:42 AM", amount: -86.42, icon: "🛒" },
    { name: "Salary deposit", date: "Today, 8:15 AM", amount: 4200, icon: "↙" },
    { name: "Blue Bottle Coffee", date: "Yesterday, 9:18 AM", amount: -8.75, icon: "☕" },
    { name: "Monthly rent", date: "Oct 1, 2026", amount: -1850, icon: "⌂" },
    { name: "Netflix", date: "Sep 29, 2026", amount: -15.99, icon: "▣" },
  ],
};

const money = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

function brand() {
  return `<div class="brand-mark" aria-hidden="true"><span></span><span></span><span></span></div><span class="brand-name">Northstar</span>`;
}

function safeText(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function showToast(message, type = "") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`.trim();
  toast.textContent = message;
  toastRegion.append(toast);
  window.setTimeout(() => toast.remove(), 3500);
}

function renderLogin(error = "") {
  state.screen = "login";
  state.authenticated = false;
  app.innerHTML = `
    <main class="auth-screen">
      <aside class="auth-aside">
        <div class="sidebar-brand">${brand()}</div>
        <div class="aside-copy">
          <span class="eyebrow">A brighter way to bank</span>
          <h1>Your money,<br>moving forward.</h1>
          <p>Thoughtful banking tools to help you feel confident about every next step.</p>
        </div>
        <div class="aside-footer">Member FDIC · Equal Housing Lender</div>
      </aside>
      <section class="auth-panel">
        <form class="auth-card" id="login-form">
          <h2>Welcome to Northstar Bank</h2>
          <p class="intro">Sign in to your Northstar account to continue.</p>
          <div class="field"><label for="login-id">Account number</label><input id="login-id" name="accountNumber" inputmode="numeric" autocomplete="off" maxlength="9" pattern="[0-9]{9}" placeholder="Enter your account number" required></div>
          <div class="field"><label for="login-password">Password</label><input id="login-password" name="password" type="password" autocomplete="current-password" placeholder="Enter your password" required></div>
          <p class="auth-error" role="alert">${safeText(error)}</p>
          <button class="btn btn-full" id="sign-in" type="submit">Sign In</button>
          <div class="demo-hint"><strong>Bank smarter</strong><br>Take control of your money with tools designed to help you move forward.</div>
        </form>
      </section>
    </main>`;
  document.querySelector("#login-form").addEventListener("submit", signIn);
}

async function signIn(event) {
  event.preventDefault();
  if (state.isProcessing) return;
  state.isProcessing = true;
  const form = event.currentTarget;
  const button = form.querySelector("#sign-in");
  button.disabled = true;
  button.innerHTML = `<span class="spinner spinner-light" aria-hidden="true"></span> Signing in...`;
  await delay(850);
  const formData = new FormData(form);
  if (formData.get("accountNumber") !== DEMO_ACCOUNT || formData.get("password") !== DEMO_PASSWORD) {
    state.isProcessing = false;
    renderLogin("That account number and password don't match. Please try again.");
    return;
  }
  state.isProcessing = false;
  renderOtp();
}

function renderOtp(error = "") {
  state.screen = "otp";
  app.innerHTML = `
    <main class="auth-screen">
      <aside class="auth-aside">
        <div class="sidebar-brand">${brand()}</div>
        <div class="aside-copy">
          <span class="eyebrow">Your security matters</span>
          <h1>One more step,<br>then you're in.</h1>
          <p>Verify your identity to keep your account and your money protected.</p>
        </div>
        <div class="aside-footer">Secure access, wherever you are.</div>
      </aside>
      <section class="auth-panel">
        <form class="auth-card" id="otp-form">
          <h2>Verify it's you</h2>
          <p class="intro">Enter the 6-digit verification code to securely access your account.</p>
          <div class="field"><label for="otp-code">Verification code</label><input class="otp-digits" id="otp-code" name="otp" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" placeholder="000000" required></div>
          <p class="auth-error" role="alert">${safeText(error)}</p>
          <button class="btn btn-full" id="verify" type="submit">Verify</button>
        </form>
      </section>
    </main>`;
  document.querySelector("#otp-form").addEventListener("submit", verifyOtp);
  restrictToDigits(document.querySelector("#otp-code"));
}

function restrictToDigits(input) {
  input?.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "");
  });
}

async function verifyOtp(event) {
  event.preventDefault();
  if (state.isProcessing) return;
  state.isProcessing = true;
  const form = event.currentTarget;
  const button = form.querySelector("#verify");
  button.disabled = true;
  button.innerHTML = `<span class="spinner spinner-light" aria-hidden="true"></span> Verifying...`;
  await delay(750);
  if (new FormData(form).get("otp") !== DEMO_OTP) {
    state.isProcessing = false;
    renderOtp("Incorrect OTP number. Please try again.");
    return;
  }
  button.innerHTML = `<span aria-hidden="true">✓</span> Verified`;
  button.classList.add("verified");
  await delay(550);
  state.isProcessing = false;
  state.authenticated = true;
  state.activePage = "dashboard";
  renderDashboardLoading();
  window.setTimeout(() => {
    if (state.authenticated && state.activePage === "dashboard") renderDashboard();
  }, 1050);
}

function delay(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function renderDashboardLoading() {
  state.screen = "dashboard";
  app.innerHTML = `
    <div class="dashboard-shell">
      ${sidebarMarkup()}
      <main class="main-area">
        ${topbarMarkup()}
        <section class="page-content">
          <div class="page-heading"><div><h1>Good morning, Alex</h1><p>Here's what's happening with your money today.</p></div></div>
          <div class="dashboard-grid" aria-label="Loading account information" aria-busy="true">
            <div class="skeleton skeleton-balance"><div class="skeleton skeleton-line short"></div><div class="skeleton skeleton-line large"></div><div class="skeleton skeleton-line medium"></div></div>
            <div class="skeleton skeleton-stat"><div class="skeleton skeleton-line short"></div><div class="skeleton skeleton-line large"></div><div class="skeleton skeleton-line medium"></div></div>
            <div class="skeleton-quick"><div class="skeleton skeleton-action"></div><div class="skeleton skeleton-action"></div><div class="skeleton skeleton-action"></div><div class="skeleton skeleton-action"></div></div>
            <div class="skeleton skeleton-transactions"><div class="skeleton skeleton-line short"></div><div class="skeleton skeleton-row"></div><div class="skeleton skeleton-row"></div><div class="skeleton skeleton-row"></div></div>
            <div class="skeleton skeleton-chart"><div class="skeleton skeleton-line short"></div><div class="skeleton skeleton-bars"></div></div>
          </div>
        </section>
      </main>
    </div>`;
  wireNavigation();
}

function sidebarMarkup() {
  return `<aside class="sidebar" id="sidebar">
    <div class="sidebar-brand">${brand()}</div>
    <div class="nav-caption">Your finances</div>
    <nav aria-label="Main navigation"><ul class="nav-list">${NAV_ITEMS.map(([id, label, icon]) => `
      <li><button class="nav-link ${id === state.activePage ? "active" : ""}" data-page="${id}" type="button"><span class="nav-icon" aria-hidden="true">${icon}</span>${label}</button></li>`).join("")}</ul></nav>
    <button class="nav-link logout-link" id="logout" type="button"><span class="nav-icon" aria-hidden="true">↪</span>Sign out</button>
    <div class="sidebar-bottom">
      <div class="help-card"><strong>Here when you need us</strong><p>Questions? Our team is ready to help, day or night.</p><a class="help-link" id="customer-service" href="#" aria-disabled="true">Customer service</a></div>
    </div>
  </aside>`;
}

function topbarMarkup() {
  return `<div class="top-progress" id="top-progress" hidden></div>
    <header class="topbar">
      <button class="mobile-menu" id="mobile-menu" aria-label="Open navigation" type="button">☰</button>
      <div class="mobile-brand">${brand()}</div>
      <div></div>
      <div class="profile-chip"><div class="avatar">AM</div><div class="profile-name">Alex Morgan<span class="profile-role">Personal account</span></div></div>
    </header>`;
}

function renderDashboard() {
  if (!state.authenticated) return;
  state.activePage = "dashboard";
  renderAppPage("dashboard");
}

function renderAppPage(page, options = {}) {
  if (!state.authenticated) return;
  window.clearInterval(state.carouselInterval);
  state.carouselInterval = null;
  state.activePage = page;
  if (state.screen !== "dashboard") {
    renderDashboardLoading();
  }
  state.screen = "dashboard";
  const heading = pageHeading(page);
  const content = options.loadingTransactions ? transactionSkeletonContent() : pageContent(page);
  app.innerHTML = `<div class="dashboard-shell">${sidebarMarkup()}<main class="main-area">${topbarMarkup()}
    <section class="page-content" id="page-content">
      <div class="page-heading"><div><h1>${heading.title}</h1><p>${heading.subtitle}</p></div>${heading.action || ""}</div>
      ${content}
    </section></main></div>`;
  wireNavigation();
  if (options.mobileOpen) document.querySelector("#sidebar")?.classList.add("mobile-open");
  wirePageEvents(page);
  if (page === "dashboard") wireDashboardCarousel();
}

function transactionSkeletonContent() {
  return `<div class="card content-card" aria-label="Loading transaction history" aria-busy="true">
    <div class="section-title">All activity</div>
    <div class="skeleton skeleton-line short"></div>
    ${Array.from({ length: 5 }, () => `<div class="skeleton skeleton-row"></div>`).join("")}
  </div>`;
}

function pageHeading(page) {
  const headings = {
    dashboard: ["Good morning, Alex", "Here's what's happening with your money today."],
    accounts: ["Your accounts", "A clear view of all your Northstar accounts."],
    transfers: ["Move money", "Send money securely between accounts."],
    payments: ["Pay a bill", "Take care of your bills, all in one place."],
    transactions: ["Transactions", "Review your recent account activity."],
    cards: ["Your cards", "Manage the cards connected to your account."],
    bills: ["Bills & subscriptions", "Stay on top of what's due and what's coming up."],
    profile: ["Your profile", "Manage your personal account details."],
    settings: ["Settings", "Choose how Northstar works for you."],
  };
  const [title, subtitle] = headings[page] || headings.dashboard;
  return { title, subtitle };
}

function pageContent(page) {
  const templates = {
    dashboard: dashboardContent,
    accounts: accountsContent,
    transfers: () => moneyFormContent("transfer"),
    payments: () => moneyFormContent("payment"),
    transactions: transactionsContent,
    cards: cardsContent,
    bills: billsContent,
    profile: profileContent,
    settings: settingsContent,
  };
  return (templates[page] || dashboardContent)();
}

function dashboardContent() {
  return `${accountCardsMarkup(false, "account-grid dashboard-account-grid")}<div class="dashboard-grid">
    <article class="balance-card">
      <div class="balance-label">Everyday Checking balance</div>
      <div class="balance-value">${money(state.balance)}</div>
      <div class="balance-footer"><div><div class="balance-meta"><span>●</span> All accounts up to date</div><div class="balance-meta" style="margin-top:8px">Checking •••• 4829</div></div><span class="card-chip" aria-hidden="true">✦</span></div>
    </article>
    <article class="card stat-card"><div class="stat-top"><span>Monthly spending</span><span class="stat-symbol" aria-hidden="true">↗</span></div><div><div class="stat-value">${money(state.monthlySpending)}</div><div class="stat-caption">↓ 12% less than last month</div></div></article>
    <section class="dashboard-feature-row" aria-label="Quick actions and promotions">
      <article class="card quick-card"><h2 class="section-title">Quick actions</h2><div class="quick-actions">
        ${quickAction("transfers", "⇄", "Transfer money")}${quickAction("payments", "▤", "Pay a bill")}${quickAction("cards", "▭", "Manage cards")}${quickAction("transactions", "↕", "View activity")}
      </div></article>
      ${dashboardCarouselMarkup()}
    </section>
    <article class="card transactions-card"><h2 class="section-title">Recent transactions<button class="view-all" type="button" data-page="transactions">View all</button></h2>${transactionRows(state.transactions.slice(0, 4))}</article>
    <article class="card chart-card"><h2 class="section-title">Spending this week</h2><div class="chart-legend"><span>Weekly overview</span><span>Last 7 days</span></div><div class="chart-amount">$486.20</div>
      <div class="bar-chart" aria-label="Weekly spending chart">${[38, 68, 47, 81, 55, 94, 63].map((height, index) => `<div class="bar-group"><div class="bar ${index === 5 ? "current" : ""}" style="height:${height}%"></div>${["M", "T", "W", "T", "F", "S", "S"][index]}</div>`).join("")}</div>
    </article>
  </div>`;
}

function dashboardCarouselMarkup() {
  const slides = [
    ["asset/pic1.png", "Northstar Bank new account opening promotion"],
    ["asset/pic2.png", "Northstar Bank home loan campaign"],
    ["asset/pic3.png", "Northstar Bank financial wellness webinar"],
  ];
  return `<section class="dashboard-carousel" aria-label="Northstar Bank promotions">
    <div class="carousel-slides">${slides.map(([source, description], index) => `<img class="carousel-slide${index === 0 ? " is-active" : ""}" src="${source}" alt="${description}" aria-hidden="${index !== 0}" draggable="false">`).join("")}</div>
    <div class="carousel-indicators" role="group" aria-label="Choose promotion">${slides.map((_, index) => `<button class="carousel-indicator${index === 0 ? " is-active" : ""}" type="button" data-slide="${index}" aria-label="Show promotion ${index + 1}" aria-pressed="${index === 0}"></button>`).join("")}</div>
  </section>`;
}

function wireDashboardCarousel() {
  const carousel = document.querySelector(".dashboard-carousel");
  if (!carousel) return;
  const slides = [...carousel.querySelectorAll(".carousel-slide")];
  const indicators = [...carousel.querySelectorAll(".carousel-indicator")];
  let activeSlide = 0;

  const showSlide = (index) => {
    activeSlide = index;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeSlide;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });
    indicators.forEach((indicator, indicatorIndex) => {
      const isActive = indicatorIndex === activeSlide;
      indicator.classList.toggle("is-active", isActive);
      indicator.setAttribute("aria-pressed", String(isActive));
    });
  };

  indicators.forEach((indicator) => {
    indicator.addEventListener("click", () => showSlide(Number(indicator.dataset.slide)));
  });
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    state.carouselInterval = window.setInterval(() => {
      showSlide((activeSlide + 1) % slides.length);
    }, 5000);
  }
}

function quickAction(page, icon, label) {
  return `<button class="quick-action" type="button" data-page="${page}"><span class="quick-icon" aria-hidden="true">${icon}</span>${label}</button>`;
}

function transactionRows(rows) {
  if (!rows.length) return `<div class="empty-state">No transactions to show yet.</div>`;
  return `<div class="transaction-list">${rows.map((transaction) => `<div class="transaction-row">
    <span class="transaction-icon" aria-hidden="true">${safeText(transaction.icon)}</span>
    <div><div class="transaction-name">${safeText(transaction.name)}</div><div class="transaction-date">${safeText(transaction.date)}</div>${transaction.note ? `<div class="transaction-note">Note: ${safeText(transaction.note)}</div>` : ""}</div>
    <span class="transaction-amount ${transaction.amount > 0 ? "amount-positive" : "amount-negative"}">${transaction.amount > 0 ? "+" : "−"}${money(Math.abs(transaction.amount))}</span>
  </div>`).join("")}</div>`;
}

function accountsContent() {
  return accountCardsMarkup();
}

function accountCardsMarkup(includeChecking = true, className = "account-grid") {
  return `<div class="${className}">
    ${includeChecking ? `<article class="card account-card"><div class="stat-top"><span>Everyday Checking</span><span class="stat-symbol">▣</span></div><div class="account-number">•••• •••• •••• 4829</div><div class="account-balance">${money(state.balance)}</div><div class="stat-caption" style="margin-top:7px">Available balance</div></article>` : ""}
    <article class="card account-card"><div class="stat-top"><span>Growth Savings</span><span class="stat-symbol">↗</span></div><div class="account-number">•••• •••• •••• 1906</div><div class="account-balance">${money(state.savingsBalance)}</div><div class="stat-caption" style="margin-top:7px">Available balance · 3.85% APY</div></article>
  </div>`;
}

function moneyFormContent(kind) {
  const isTransfer = kind === "transfer";
  return `<div class="action-layout ${isTransfer ? "transfer-layout" : "payment-layout"}"><form class="card form-card" id="${kind}-form">
    <h2 class="section-title">${isTransfer ? "Transfer details" : "Payment details"}</h2>
    <div class="field"><label for="${kind}-from">From account</label><select id="${kind}-from" name="from"><option value="checking">Everyday Checking ···· 4829 (${money(state.balance)})</option><option value="savings">Growth Savings ···· 1906 (${money(state.savingsBalance)})</option></select></div>
    <div class="field"><label for="${kind}-to">${isTransfer ? "Account name" : "Payee"}</label><input id="${kind}-to" name="recipient" placeholder="${isTransfer ? "Name" : "Company or payee name"}" maxlength="60" ${isTransfer ? 'pattern="(?=.*[A-Za-z])[A-Za-z ]+" title="Use letters and spaces only."' : 'pattern=".*[^0-9].*" title="Enter a payee name, not only numbers."'} required></div>
    ${isTransfer ? `<div class="field"><label for="transfer-account">Account number</label><input id="transfer-account" name="accountNumber" inputmode="numeric" pattern="[0-9]+" placeholder="Enter account number" maxlength="30" required></div>` : ""}
    <div class="field"><label for="${kind}-amount">Amount</label><input id="${kind}-amount" name="amount" type="number" min="0.01" max="${state.balance.toFixed(2)}" step="0.01" placeholder="$0.00" required></div>
    <div class="field"><label for="${kind}-note">Note (optional)</label><textarea id="${kind}-note" name="note" maxlength="140" rows="3" placeholder="Add a note for this ${isTransfer ? "transfer" : "payment"}"></textarea></div>
    <p class="form-error" role="alert"></p>
    <button class="btn btn-full" type="submit">Confirm ${isTransfer ? "Transfer" : "Payment"}</button>
  </form><aside class="card side-note"><h3>${isTransfer ? "Secure transfers" : "Simple bill pay"}</h3><p>${isTransfer ? "Review the account name, account number, and amount before confirming your transfer." : "Enter a payee and amount to confirm payment."}</p></aside></div>`;
}

function transactionsContent() {
  return `<div class="card content-card" id="transactions-card"><div class="section-title">All activity <span class="text-muted" style="font:400 10px 'DM Sans',sans-serif">Everyday Checking ···· 4829</span></div><div class="transaction-list">${[...state.transactions].map((transaction) => `<div class="transaction-row"><span class="transaction-icon" aria-hidden="true">${safeText(transaction.icon)}</span><div><div class="transaction-name">${safeText(transaction.name)}</div><div class="transaction-date">${safeText(transaction.date)}</div>${transaction.note ? `<div class="transaction-note">Note: ${safeText(transaction.note)}</div>` : ""}</div><span class="transaction-amount ${transaction.amount > 0 ? "amount-positive" : "amount-negative"}">${transaction.amount > 0 ? "+" : "−"}${money(Math.abs(transaction.amount))}</span></div>`).join("")}</div></div>`;
}

function cardsContent() {
  return `<div class="account-grid">
    <article class="card account-card debit-card"><div class="stat-top"><span>Northstar Debit</span><span class="status-pill">Active</span></div><div class="debit-number">•••• &nbsp; •••• &nbsp; •••• &nbsp; 4829</div><div class="stat-top"><span>Alex Morgan</span><span class="debit-network">VISA</span></div></article>
    <article class="card account-card"><div class="stat-top"><span>Card controls</span><span class="stat-symbol">⚙</span></div><div class="setting-row"><div><strong>Online purchases</strong><small>Use your card online</small></div><button class="toggle" role="switch" aria-checked="true" aria-label="Online purchases"></button></div><div class="setting-row"><div><strong>International use</strong><small>Purchases outside the US</small></div><button class="toggle" role="switch" aria-checked="false" aria-label="International use"></button></div></article>
  </div>`;
}

function billsContent() {
  const bills = [["City Utilities", "Oct 12, 2026", "$74.20"], ["Home Internet", "Oct 15, 2026", "$65.00"], ["Northstar Card", "Oct 22, 2026", "$318.45"]];
  return `<div class="card content-card"><h2 class="section-title">Upcoming bills</h2><table class="data-table"><thead><tr><th>Payee</th><th>Due date</th><th>Amount due</th><th>Status</th></tr></thead><tbody>${bills.map((bill) => `<tr><td>${bill[0]}</td><td>${bill[1]}</td><td>${bill[2]}</td><td><span class="status-pill">Scheduled</span></td></tr>`).join("")}</tbody></table></div>`;
}

function profileContent() {
  return `<div class="action-layout profile-layout"><div class="card content-card"><div class="profile-hero"><div class="avatar">AM</div><div><h2>Alex Morgan</h2><p>Northstar member since 2014</p></div></div><ul class="info-list"><li><span>Email</span><span>alex.morgan@gmail.com</span></li><li><span>Phone</span><span>+63 917 555 0131</span></li><li><span>Mailing address</span><span>A. Luna, Taguig, 1630 Metro Manila</span></li><li><span>Membership</span><span>Personal Banking</span></li></ul></div><aside class="card side-note"><h3>Your information is protected</h3><p>We use strong encryption and account safeguards to help protect your personal details.</p></aside></div>`;
}

function settingsContent() {
  return `<div class="settings-grid"><section class="card content-card"><h2 class="section-title">Notifications</h2>${settingRow("Account activity", "Get notified about deposits and withdrawals", true)}${settingRow("Bill reminders", "A heads-up before bills are due", true)}${settingRow("Product updates", "News about Northstar features", false)}</section><section class="card content-card"><h2 class="section-title">Privacy & security</h2>${settingRow("Biometric sign-in", "Use your device's biometrics", false)}${settingRow("Remember this device", "Keep this device trusted", true)}</section></div>`;
}

function settingRow(title, description, checked) {
  return `<div class="setting-row"><div><strong>${title}</strong><small>${description}</small></div><button class="toggle" role="switch" aria-checked="${checked}" aria-label="${title}"></button></div>`;
}

function wireNavigation() {
  document.querySelectorAll("[data-page]").forEach((button) => {
    button.addEventListener("click", () => navigate(button.dataset.page));
  });
  document.querySelector("#mobile-menu")?.addEventListener("click", () => {
    document.querySelector("#sidebar")?.classList.toggle("mobile-open");
  });
  document.querySelector("#logout")?.addEventListener("click", confirmLogOut);
  document.querySelector("#customer-service")?.addEventListener("click", (event) => event.preventDefault());
}

async function navigate(page) {
  if (!state.authenticated || state.isNavigating || state.isProcessing || !NAV_ITEMS.some(([id]) => id === page)) return;
  if (page === state.activePage) {
    document.querySelector("#sidebar")?.classList.remove("mobile-open");
    return;
  }
  state.isNavigating = true;
  const progress = document.querySelector("#top-progress");
  if (progress) progress.hidden = false;
  await delay(360);
  renderAppPage(page, { loadingTransactions: page === "transactions" });
  if (page === "transactions") {
    await delay(620);
    if (state.authenticated && state.activePage === page) renderAppPage(page);
  }
  state.isNavigating = false;
}

function wirePageEvents(page) {
  restrictToDigits(document.querySelector("#transfer-account"));
  if (page === "transfers" || page === "payments") {
    document.querySelector(`#${page === "transfers" ? "transfer" : "payment"}-form`)?.addEventListener("submit", processMoney);
    const accountSelect = document.querySelector('select[name="from"]');
    const amountInput = document.querySelector('input[name="amount"]');
    accountSelect?.addEventListener("change", () => {
      amountInput.max = (accountSelect.value === "savings" ? state.savingsBalance : state.balance).toFixed(2);
    });
  }
  document.querySelectorAll(".toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => toggle.setAttribute("aria-checked", toggle.getAttribute("aria-checked") !== "true"));
  });
}

async function processMoney(event) {
  event.preventDefault();
  if (state.isProcessing) return;
  const form = event.currentTarget;
  const type = form.id.startsWith("transfer") ? "transfer" : "payment";
  const formData = new FormData(form);
  const amount = Number(formData.get("amount"));
  const recipient = String(formData.get("recipient") || "").trim();
  const recipientAccount = String(formData.get("accountNumber") || "");
  const note = String(formData.get("note") || "").trim();
  const account = formData.get("from") === "savings" ? "savings" : "checking";
  const availableBalance = account === "savings" ? state.savingsBalance : state.balance;
  const error = form.querySelector(".form-error");
  if (!recipient || !Number.isFinite(amount) || amount <= 0) {
    error.textContent = "Enter a valid recipient and an amount greater than zero.";
    return;
  }
  if (type === "payment" && /^[0-9]+$/.test(recipient)) {
    error.textContent = "Enter a payee name, not only numbers.";
    return;
  }
  if (type === "transfer" && !/^(?=.*[A-Za-z])[A-Za-z ]+$/.test(recipient)) {
    error.textContent = "Enter an account name using letters and spaces only.";
    return;
  }
  if (type === "transfer" && !/^\d+$/.test(recipientAccount)) {
    error.textContent = "Enter an account number using digits only.";
    return;
  }
  if (amount > availableBalance) {
    error.textContent = `The amount is greater than your available ${account} balance.`;
    return;
  }
  error.textContent = "";
  state.isProcessing = true;
  showMoneyConfirmation(form, type, recipient, recipientAccount, amount, account, note);
}

function showMoneyConfirmation(form, type, recipient, recipientAccount, amount, account, note) {
  const isTransfer = type === "transfer";
  const accountName = account === "savings" ? "Growth Savings ···· 1906" : "Everyday Checking ···· 4829";
  const title = isTransfer ? "Review transfer" : "Review payment";
  const actionLabel = isTransfer ? "Confirm transfer" : "Confirm payment";
  const overlay = document.createElement("div");
  overlay.className = "processing-overlay confirmation-overlay";
  overlay.innerHTML = `<section class="processing-card confirmation-card" role="alertdialog" aria-modal="true" aria-labelledby="money-confirm-title" aria-describedby="money-confirm-message">
    <div class="confirmation-heading">
      <div class="processing-icon" aria-hidden="true">${isTransfer ? "⇄" : "▤"}</div>
      <div><h2 id="money-confirm-title">${title}</h2><p id="money-confirm-message">Check the details before confirming.</p></div>
    </div>
    <div class="confirmation-amount-label">Amount</div>
    <div class="confirmation-amount">${money(amount)}</div>
    <dl class="confirmation-details">
      <div><dt>${isTransfer ? "Account name" : "Payee"}</dt><dd>${safeText(recipient)}</dd></div>
      ${isTransfer ? `<div><dt>Account number</dt><dd>${safeText(recipientAccount)}</dd></div>` : ""}
      <div><dt>From account</dt><dd>${safeText(accountName)}</dd></div>
      ${note ? `<div><dt>Note</dt><dd>${safeText(note)}</dd></div>` : ""}
    </dl>
    <div class="confirmation-actions"><button class="btn btn-secondary" id="cancel-money" type="button">Cancel</button><button class="btn" id="confirm-money" type="button">${actionLabel}</button></div>
  </section>`;

  const closeConfirmation = () => {
    document.removeEventListener("keydown", handleKeydown);
    overlay.remove();
    state.isProcessing = false;
    form.querySelector('button[type="submit"]')?.focus();
  };
  const handleKeydown = (event) => {
    if (event.key === "Escape") closeConfirmation();
  };

  overlay.querySelector("#cancel-money").addEventListener("click", closeConfirmation);
  overlay.querySelector("#confirm-money").addEventListener("click", () => {
    document.removeEventListener("keydown", handleKeydown);
    overlay.remove();
    processValidatedMoney(form, type, amount, recipient, note, account);
  });
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeConfirmation();
  });
  document.addEventListener("keydown", handleKeydown);
  document.body.append(overlay);
  overlay.querySelector("#cancel-money").focus();
}

async function processValidatedMoney(form, type, amount, recipient, note, account) {
  state.isProcessing = true;
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  button.innerHTML = `<span class="spinner spinner-light" aria-hidden="true"></span> Processing...`;
  const title = type === "transfer" ? "Processing Transfer" : "Processing Payment";
  const success = type === "transfer" ? "Transfer Successful" : "Payment Successful";
  const overlay = document.createElement("div");
  overlay.className = "processing-overlay";
  overlay.innerHTML = `<div class="processing-card" role="status" aria-live="polite"><div class="processing-icon"><span class="spinner" aria-hidden="true"></span></div><h2>${title}</h2><p>Please wait while we process your request.</p></div>`;
  document.body.append(overlay);
  try {
    await delay(1350);
    if (account === "savings") {
      state.savingsBalance = Math.round((state.savingsBalance - amount) * 100) / 100;
    } else {
      state.balance = Math.round((state.balance - amount) * 100) / 100;
    }
    state.monthlySpending = Math.round((state.monthlySpending + amount) * 100) / 100;
    state.transactions.unshift({
      name: `${type === "transfer" ? "Transfer to" : "Payment to"} ${recipient}`,
      date: "Just now",
      amount: -amount,
      icon: type === "transfer" ? "⇄" : "▤",
      ...(note ? { note } : {}),
    });
    overlay.innerHTML = `<div class="processing-card" role="status" aria-live="polite"><div class="success-mark" aria-hidden="true">✓</div><h2>${success}</h2><p>${money(amount)} ${type === "transfer" ? "sent to" : "paid to"} ${safeText(recipient)}.</p></div>`;
    await delay(1000);
    overlay.remove();
    state.isProcessing = false;
    renderAppPage(type === "transfer" ? "transfers" : "payments");
    showToast(`${success}. Your balance has been updated.`);
  } catch (operationError) {
    overlay.remove();
    state.isProcessing = false;
    button.disabled = false;
    button.textContent = `Confirm ${type === "transfer" ? "Transfer" : "Payment"}`;
    error.textContent = "We couldn't complete that request. Please try again.";
    console.error("Unable to process demo transaction.", operationError);
  }
}

async function logOut() {
  if (state.isProcessing) return;
  state.isProcessing = true;
  const overlay = document.createElement("div");
  overlay.className = "processing-overlay";
  overlay.innerHTML = `<div class="processing-card" role="status"><div class="processing-icon"><span class="spinner" aria-hidden="true"></span></div><h2>Signing out...</h2><p>Securing your account.</p></div>`;
  document.body.append(overlay);
  await delay(700);
  state.authenticated = false;
  state.isProcessing = false;
  overlay.remove();
  renderLogin();
}

function confirmLogOut(event) {
  if (state.isProcessing) return;
  const trigger = event.currentTarget;
  const overlay = document.createElement("div");
  overlay.className = "processing-overlay confirmation-overlay";
  overlay.innerHTML = `<section class="processing-card confirmation-card" role="alertdialog" aria-modal="true" aria-labelledby="sign-out-title" aria-describedby="sign-out-message">
    <div class="processing-icon" aria-hidden="true">↪</div>
    <h2 id="sign-out-title">Sign out?</h2>
    <p id="sign-out-message">Are you sure you want to sign out of your account?</p>
    <div class="confirmation-actions"><button class="btn btn-secondary" id="cancel-sign-out" type="button">No</button><button class="btn" id="confirm-sign-out" type="button">Yes</button></div>
  </section>`;

  const closeConfirmation = () => {
    document.removeEventListener("keydown", handleKeydown);
    overlay.remove();
    trigger.focus();
  };
  const handleKeydown = (keyEvent) => {
    if (keyEvent.key === "Escape") closeConfirmation();
  };

  overlay.querySelector("#cancel-sign-out").addEventListener("click", closeConfirmation);
  overlay.querySelector("#confirm-sign-out").addEventListener("click", () => {
    closeConfirmation();
    logOut();
  });
  overlay.addEventListener("click", (clickEvent) => {
    if (clickEvent.target === overlay) closeConfirmation();
  });
  document.addEventListener("keydown", handleKeydown);
  document.body.append(overlay);
  overlay.querySelector("#cancel-sign-out").focus();
}

function start() {
  const bootScreen = document.querySelector(".boot-screen");
  window.setTimeout(() => {
    bootScreen.classList.add("is-leaving");
    window.setTimeout(() => {
      bootScreen.remove();
      renderLogin();
    }, 450);
  }, 900);
}

start();
