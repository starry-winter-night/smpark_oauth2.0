import { checkSpace, checkSpecial } from '../utils/utils.js';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#InputId, #InputPassword').forEach((input) => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        loginCheck();
      }
    });
  });

  // 버튼 클릭으로 로그인 체크 함수 호출
  const oauthLoginButton = document.getElementById('loginButton');
  if (oauthLoginButton) {
    oauthLoginButton.addEventListener('click', (e) => {
      e.preventDefault();
      loginCheck();
    });
  }
});

const loginCheck = async () => {
  const id = document.getElementById('InputId').value;
  const pw = document.getElementById('InputPassword').value;

  // 로그인 폼 빈칸 검사
  if (id.replace(/\s/g, '').length === 0) {
    alert('아이디를 입력해주세요.');
    document.getElementById('InputId').value = '';
    document.getElementById('InputId').focus();
    return false;
  }
  if (pw.replace(/\s/g, '').length === 0) {
    alert('패스워드를 입력해주세요.');
    document.getElementById('InputPassword').value = '';
    document.getElementById('InputPassword').focus();
    return false;
  }

  // 로그인 폼 공백 검사
  if (checkSpace(id) || checkSpace(pw)) {
    alert('공백은 사용하실 수 없습니다.');
    document.getElementById('InputId').value = '';
    document.getElementById('InputPassword').value = '';
    document.getElementById('InputId').focus();
    return false;
  } else {
    // 로그인 아이디 특수문자 검사
    if (checkSpecial(id)) {
      alert('특수문자는 사용하실 수 없습니다.');
      document.getElementById('InputId').value = '';
      document.getElementById('InputPassword').value = '';
      document.getElementById('InputId').focus();
      return false;
    } else {
      try {
        const response = await fetch('/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id, password: pw }),
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
    }
  }
};
