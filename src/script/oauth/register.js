(() => {
  $('#chatManagerIdAdd').click('on', function () {
    let arrList = [];
    let managerId = $('#regInputSmpChatManagerId').val();
    const blank = blankPattern(managerId, '#regInputSmpChatManagerId');
    if (blank) {
      let managerIdList = $('#regListSmpChatManagerId').val();

      if (managerIdList.trim() === '') {
        arrList.push(managerId);
        $('#regListSmpChatManagerId').text(managerId);
        return;
      } else {
        let splitWord = managerIdList.trim().split(',');
        // 1차 중복 검사
        for (let word of splitWord) {
          if (word.trim() === managerId) {
            alert('이미 등록된 아이디 입니다.');
            return;
          } else {
            arrList.push(word.trim());
          }
        }
        arrList.push(managerId);
        // 2차 중복 검사 및 중복제거
        const clearList = checkArrWord(arrList);

        let strList = clearList.join(','); // 배열의 문자열화
        strList = strList.replaceAll(',', ', '); // 콤마 띄어쓰기 유지할 것
        $('#regListSmpChatManagerId').text(strList);
      }
    }
  });
  $('#chatManagerIdRemove').click('on', async function () {
    let arrList2 = [];
    let nonFindWord = [];
    let managerId = $('#regInputSmpChatManagerId').val();
    const blank = blankPattern(managerId, '#regInputSmpChatManagerId');
    if (blank) {
      let managerIdList = $('#regListSmpChatManagerId').val();
      let splitWord = managerIdList.trim().split(',');
      for (let word of splitWord) {
        if (word.trim() === managerId) {
          // 아이디 존재 여부 검사
          nonFindWord.push(word.trim());
        } else {
          // 삭제 요청 아이디를 제외하고 저장
          arrList2.push(word.trim());
        }
      }
      if (nonFindWord.length === 0) {
        alert('해당하는 아이디가 없습니다.');
        return;
      }
      // 2차 중복 검사 및 중복제거
      const clearList = checkArrWord(arrList2);

      let strList = clearList.join(','); // 배열의 문자열화
      strList = strList.replaceAll(',', ', '); // 콤마 띄어쓰기 유지할 것
      $('#regListSmpChatManagerId').text(strList);
    }
  });
})();

function checkArrWord(arrList) {
  // 2차 중복 검사 및 중복제거
  let clearList = arrList.filter((word, index) => {
    return arrList.indexOf(word) === index;
  });
  return clearList;
}

function sendManagerList() {}
function blankPattern(str, id) {
  let result = true;
  if (str.replace(/\s/g, '').length == 0) {
    alert('아이디를 입력 해주세요.');
    $(id).val('');
    $(id).focus();
    result = false;
  }
  return result;
}
$('.oauth-logo-image').click('on', function () {
  window.location.replace('/');
});

$('#idCopy').click('on', function () {
  let id = $('#regInputClientId');
  id.select();
  document.execCommand('Copy');
});

$('#secretCopy').click('on', function () {
  let secret = $('#regInputClientSecret');
  secret.select();
  document.execCommand('Copy');
});
$('#chatApiKeyCopy').click('on', function () {
  let secret = $('#regInputChatApiKey');
  secret.select();
  document.execCommand('Copy');
});

$('#regInputAppName').keydown(function (e) {
  if (e.keyCode == 13) {
    oauthRegCheck();
  }
});
$('#regInputHomepageAddr').keydown(function (e) {
  if (e.keyCode == 13) {
    oauthRegCheck();
  }
});
$('#regInputCallBackUrl').keydown(function (e) {
  if (e.keyCode == 13) {
    oauthRegCheck();
  }
});

$('#oauthRegisterButton').on('click', function (e) {
  oauthRegCheck();
});

function oauthRegCheck() {
  let ClientId = $('#regInputClientId').val();
  let ClientSecret = $('#regInputClientSecret').val();
  let ChatServiceApiKey = $('#regInputChatApiKey').val();
  let AppName = $('#regInputAppName').val();
  let HomepageAddr = $('#regInputHomepageAddr').val();
  let chkReqInfo = {};

  $('input[name=agreement]:checked').each(function (i) {
    chkReqInfo[$(this).parent().text()] = $(this).val();
    return chkReqInfo;
  });

  let AuthCallbackURL = $('#regInputCallBackUrl').val();

  if (ClientId.replace(/\s/g, '').length == 0) {
    alert('잘못된 접근입니다.');
    window.location.replace('/');
    return false;
  }
  if (ClientSecret.replace(/\s/g, '').length == 0) {
    alert('잘못된 접근입니다.');
    window.location.replace('/');
    return false;
  }
  if (ChatServiceApiKey.replace(/\s/g, '').length == 0) {
    alert('잘못된 접근입니다.');
    window.location.replace('/');
    return false;
  }
  if (AppName.replace(/\s/g, '').length == 0) {
    alert('어플리케이션 이름을 입력하세요.');
    $('#regInputAppName').val('');
    $('#regInputAppName').focus();
    return false;
  }
  if (HomepageAddr.replace(/\s/g, '').length == 0) {
    alert('홈페이지 주소를 입력하세요.');
    $('#regInputHomepageAddr').val('');
    $('#regInputHomepageAddr').focus();
    return false;
  }
  if (AuthCallbackURL.replace(/\s/g, '').length == 0) {
    alert('허가요청을 위한 콜백 주소를 입력하세요.');
    $('#regInputCallBackUrl').val('');
    $('#regInputCallBackUrl').focus();
    return false;
  }

  //로그인 폼 공백 검사
  let AppName_check = checkSpace(AppName);
  let HomepageAddr_check = checkSpace(HomepageAddr);
  let AuthCallbackURL_check = checkSpace(AuthCallbackURL);
  if (AppName_check == true || HomepageAddr_check == true || AuthCallbackURL_check == true) {
    alert('공백은 사용하실 수 없습니다.');
    $('#regInputAppName').val('');
    $('#regInputHomepageAddr').val('');
    $('#regInputCallBackUrl').val('');
    $('#regInputAppName').focus();
    return false;
  }

  if (chkReqInfo.length == 0) {
    alert('Check Required Information 중 최소 1개 이상 클릭해 주세요');
    return false;
  }

  let managerIdList = $('#regListSmpChatManagerId').val();
  let managerList = [];
  const splitWord = managerIdList.split(',');
  for (let word of splitWord) {
    managerList.push(word.trim());
  }

  $.ajax({
    url: '/oauth/regapp',
    dataType: 'json',
    type: 'POST',
    data: {
      homepageAddr: HomepageAddr,
      redirectUris: AuthCallbackURL,
      appName: AppName,
      reqInfo: JSON.stringify(chkReqInfo),
      chatManagerList: JSON.stringify(managerList),
    },
    success: function (result) {
      if (result.message === true) {
        alert('Application 등록완료!');
        return window.location.replace('/');
      } else if (result.code >= 400) {
        alert('형식에 맞지 않는 항목이 있습니다.');
      }
    },
  });
}
