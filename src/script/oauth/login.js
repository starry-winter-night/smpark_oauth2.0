import { checkSpace, checkSpecial } from '../utils/utils.js';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#oauthInputId, #oauthInputPassword').forEach((input) => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // 폼 제출 방지
        oauthLoginCheck();
      }
    });
  });

  // 버튼 클릭으로 로그인 체크 함수 호출
  const oauthLoginButton = document.getElementById('oauthLoginButton');
  if (oauthLoginButton) {
    oauthLoginButton.addEventListener('click', (e) => {
      e.preventDefault();
      oauthLoginCheck();
    });
  }

  // 동의하지 않을 경우 창 닫기
  document.querySelectorAll('.noAgreeButton').forEach((button) => {
    button.addEventListener('click', () => {
      window.close();
    });
  });
});

const oauthLoginCheck = async () => {
  const id = document.getElementById('oauthInputId').value;
  const pw = document.getElementById('oauthInputPassword').value;

  // 로그인 폼 빈칸 검사
  if (id.replace(/\s/g, '').length === 0) {
    alert('아이디를 입력해주세요.');
    document.getElementById('oauthInputId').value = '';
    document.getElementById('oauthInputId').focus();
    return false;
  }
  if (pw.replace(/\s/g, '').length === 0) {
    alert('패스워드를 입력해주세요.');
    document.getElementById('oauthInputPassword').value = '';
    document.getElementById('oauthInputPassword').focus();
    return false;
  }

  // 로그인 폼 공백 검사
  if (checkSpace(id) || checkSpace(pw)) {
    alert('공백은 사용하실 수 없습니다.');
    document.getElementById('oauthInputId').value = '';
    document.getElementById('oauthInputPassword').value = '';
    document.getElementById('oauthInputId').focus();
    return false;
  } else {
    // 로그인 아이디 특수문자 검사
    if (checkSpecial(id)) {
      alert('특수문자는 사용하실 수 없습니다.');
      document.getElementById('oauthInputId').value = '';
      document.getElementById('oauthInputPassword').value = '';
      document.getElementById('oauthInputId').focus();
      return false;
    } else {
      // FormData 객체를 일반 객체로 변환
      const form = document.getElementById('oauthForm');
      const formData = new FormData(form);
      const loginData = {};

      formData.forEach((value, key) => {
        loginData[key] = value;
      });

      try {
        const response = await fetch('/oauth/authorize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData),
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
