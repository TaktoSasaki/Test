const menuToggle = document.querySelector('.menu-toggle');
const globalNav = document.getElementById('global-nav');
const form = document.getElementById('mock-login-form');
const loginIdInput = document.getElementById('loginId');
const passwordInput = document.getElementById('password');
const agreeInput = document.getElementById('agree');
const formMessage = document.getElementById('formMessage');
const togglePassword = document.getElementById('togglePassword');
const externalLogin = document.getElementById('externalLogin');
const registerDialog = document.getElementById('registerDialog');
const openRegisterDialog = document.getElementById('openRegisterDialog');

if (menuToggle && globalNav) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    globalNav.classList.toggle('open');
  });
}

function setMessage(text, type = '') {
  formMessage.textContent = text;
  formMessage.className = 'form-message';
  if (type) formMessage.classList.add(type);
}

function applyQueryParams() {
  const params = new URLSearchParams(location.search);
  const prefillId = params.get('id') || params.get('login_id') || '';
  const prefillPassword = params.get('password') || params.get('pass') || '';
  const autoAgree = params.get('agree');

  if (prefillId) loginIdInput.value = prefillId;
  if (prefillPassword) passwordInput.value = prefillPassword;
  if (autoAgree === '1' || autoAgree === 'true') agreeInput.checked = true;
}

function validateForm() {
  const loginId = loginIdInput.value.trim();
  const password = passwordInput.value;
  const agree = agreeInput.checked;

  if (!loginId) {
    setMessage('ID番号を入力してください。', 'error');
    loginIdInput.focus();
    return false;
  }

  if (!password) {
    setMessage('パスワードを入力してください。', 'error');
    passwordInput.focus();
    return false;
  }

  if (!agree) {
    setMessage('規約への同意が必要です。', 'error');
    agreeInput.focus();
    return false;
  }

  return { loginId, password };
}

function saveSession(loginId) {
  const session = {
    loginId,
    loggedInAt: new Date().toISOString(),
    authType: 'original',
    isMock: true
  };
  localStorage.setItem('mockPortalSession', JSON.stringify(session));
}

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const result = validateForm();
  if (!result) return;

  setMessage('ログイン成功。マイページへ移動します。', 'success');
  saveSession(result.loginId);
  setTimeout(() => {
    location.href = 'dashboard.html';
  }, 500);
});

togglePassword?.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  togglePassword.textContent = isPassword ? '非表示' : '表示';
});

externalLogin?.addEventListener('click', () => {
  const fakeExternalId = 'external-user-2027';
  localStorage.setItem('mockPortalSession', JSON.stringify({
    loginId: fakeExternalId,
    loggedInAt: new Date().toISOString(),
    authType: 'external',
    isMock: true
  }));
  location.href = 'dashboard.html';
});

openRegisterDialog?.addEventListener('click', () => {
  registerDialog?.showModal();
});

applyQueryParams();
