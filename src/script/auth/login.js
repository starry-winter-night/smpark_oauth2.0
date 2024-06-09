$('#InputId').keydown(function (e) {
  if (e.keyCode == 13) {
    e.preventDefault();
    loginCheck();
  }
});
$('#InputPassword').keydown(function (e) {
  if (e.keyCode == 13) {
    e.preventDefault();
    loginCheck();
  }
});

$('#loginButton').on('click', function (e) {
  e.preventDefault();
  loginCheck();
});

function loginCheck() {
  let id = $('#InputId').val();
  let pw = $('#InputPassword').val();
  // 로그인 폼 빈칸 검사
  if (id.replace(/\s/g, '').length == 0) {
    alert('아이디를 입력해주세요.');
    $('#InputId').val('');
    $('#InputId').focus();
    return false;
  }
  if (pw.replace(/\s/g, '').length == 0) {
    alert('패스워드를 입력해주세요.');
    $('#InputPassword').val('');
    $('#InputPassword').focus();
    return false;
  }
  //로그인 폼 공백 검사
  let id_check = checkSpace(id);
  let pw_check = checkSpace(pw);
  if (id_check == true || pw_check == true) {
    alert('공백은 사용하실 수 없습니다.');
    $('#InputId').val('');
    $('#InputPassword').val('');
    $('#InputId').focus();
    return false;
  } else {
    //로그인 아이디 특수문자 검사
    id_check = checkSpecial(id);
    if (id_check == true) {
      alert('특수문자는 사용하실 수 없습니다.');
      $('#InputId').val('');
      $('#InputPassword').val('');
      $('#InputId').focus();
      return false;
    } else {
      $.ajax({
        url: '/login',
        dataType: 'json',
        type: 'POST',
        data: { username: id, password: pw },
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

//공백검사 함수
function checkSpace(str) {
  if (str.search(/\s/) != -1) {
    return true;
  } else {
    return false;
  }
}
//특수문자검사 함수
function checkSpecial(str) {
  var special_pattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
  if (special_pattern.test(str) == true) {
    return true;
  } else {
    return false;
  }
}
