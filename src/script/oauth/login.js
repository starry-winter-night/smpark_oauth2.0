$(document).ready(function () {
  // 엔터키로 로그인 체크 함수 호출
  $('#oauthInputId, #oauthInputPassword').keydown(function (e) {
    if (e.keyCode === 13) {
      e.preventDefault(); // 폼 제출 방지
      oauthLoginCheck();
    }
  });

  // 버튼 클릭으로 로그인 체크 함수 호출
  $('#oauthLoginButton').on('click', function (e) {
    e.preventDefault();
    oauthLoginCheck();
  });

  // 동의하지 않을 경우 창 닫기
  $('.noAgreeButton').on('click', function (e) {
    window.close();
  });

  function oauthLoginCheck() {
    let id = $('#oauthInputId').val();
    let pw = $('#oauthInputPassword').val();

    // 로그인 폼 빈칸 검사
    if (id.replace(/\s/g, '').length === 0) {
      alert('아이디를 입력해주세요.');
      $('#oauthInputId').val('');
      $('#oauthInputId').focus();
      return false;
    }
    if (pw.replace(/\s/g, '').length === 0) {
      alert('패스워드를 입력해주세요.');
      $('#oauthInputPassword').val('');
      $('#oauthInputPassword').focus();
      return false;
    }

    // 로그인 폼 공백 검사
    let id_check = checkSpace(id);
    let pw_check = checkSpace(pw);
    if (id_check === true || pw_check === true) {
      alert('공백은 사용하실 수 없습니다.');
      $('#oauthInputId').val('');
      $('#oauthInputPassword').val('');
      $('#oauthInputId').focus();
      return false;
    } else {
      // 로그인 아이디 특수문자 검사
      id_check = checkSpecial(id);
      if (id_check === true) {
        alert('특수문자는 사용하실 수 없습니다.');
        $('#oauthInputId').val('');
        $('#oauthInputPassword').val('');
        $('#oauthInputId').focus();
        return false;
      } else {
        // FormData 객체를 일반 객체로 변환
        const form = document.getElementById('oauthForm');
        const formData = new FormData(form);
        const data = {};

        formData.forEach((value, key) => {
          data[key] = value;
        });

        $.ajax({
          url: '/oauth/authorize', // Correct the URL spelling here
          dataType: 'json',
          type: 'POST',
          data: JSON.stringify(data), // 객체를 JSON 문자열로 변환하여 전송
          contentType: 'application/json', // JSON 형식으로 전송
          success: function (result) {
            if (result.redirect) {
              window.location.replace(result.redirect);
            }
          },
          error: function (jqXHR) {
            alert(jqXHR.responseJSON.message);
          },
        });
      }
    }
  }

  function checkSpace(str) {
    // 공백 문자 검사 함수 구현
    return /\s/.test(str);
  }

  function checkSpecial(str) {
    // 특수 문자 검사 함수 구현
    return /[^a-zA-Z0-9]/.test(str);
  }
});
