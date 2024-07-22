import { checkSpace, validateId, validateEmail, addEnterKeyListener } from '../utils/utils.js';

document.addEventListener('DOMContentLoaded', () => {
  addEnterKeyListener('regInputId', registerCheck);
  addEnterKeyListener('regInputPassword', registerCheck);
  addEnterKeyListener('regInputEmail', registerCheck);

  const registerButton = document.getElementById('registerButton');
  if (registerButton) {
    registerButton.addEventListener('click', registerCheck);
  }
});

const registerCheck = async () => {
  const id = document.getElementById('regInputId').value.trim();
  const pw = document.getElementById('regInputPassword').value.trim();
  const email = document.getElementById('regInputEmail').value.trim();
  const name = document.getElementById('regInputName').value.trim();

  if (!id) {
    alert('아이디를 입력해주세요.');
    document.getElementById('regInputId').focus();
    return false;
  }
  if (!pw) {
    alert('패스워드를 입력해주세요.');
    document.getElementById('regInputPassword').focus();
    return false;
  }
  if (!email) {
    alert('이메일을 입력해주세요.');
    document.getElementById('regInputEmail').focus();
    return false;
  }

  if (checkSpace(id) || checkSpace(pw) || checkSpace(email)) {
    alert('공백은 사용하실 수 없습니다.');
    document.getElementById('regInputId').focus();
    return false;
  }

  if (!validateId(id)) {
    alert('특수문자는 사용하실 수 없습니다.');
    document.getElementById('regInputId').focus();
    return false;
  }
  if (!validateEmail(email)) {
    alert('이메일 아이디 @ 도메인주소 형식을 지켜주세요.');
    document.getElementById('regInputEmail').focus();
    return false;
  }

  try {
    const response = await fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, password: pw, email, name }),
    });

    const result = await response.json();
    if (response.ok) {
      if (result.redirect) {
        window.location.replace(result.redirect);
      }
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    alert(error.message);
  }
};
