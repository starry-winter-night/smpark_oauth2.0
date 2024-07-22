import {
  checkSpace,
  addEnterKeyListener,
  copyToClipboard,
  checkArrWord,
  blankPattern,
} from '../utils/utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const addEventListenerIfExists = (selector, event, callback) => {
    const element = document.getElementById(selector);
    if (element) {
      element.addEventListener(event, callback);
    }
  };

  const addChatManagerId = () => {
    const arrList = [];
    const managerId = document.getElementById('regInputSmpChatManagerId').value;
    const blank = blankPattern(managerId, '#regInputSmpChatManagerId');
    if (blank) {
      const managerIdList = document.getElementById('regListSmpChatManagerId').value;

      if (managerIdList.trim() === '') {
        arrList.push(managerId);
        document.getElementById('regListSmpChatManagerId').innerText = managerId;
        return;
      } else {
        const splitWord = managerIdList.trim().split(',');
        // 1차 중복 검사
        for (const word of splitWord) {
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

        let strList = clearList.join(',');
        strList = strList.replace(/,/g, ', '); // 콤마 띄어쓰기 유지할 것
        document.getElementById('regListSmpChatManagerId').innerText = strList;
        document.getElementById('regInputSmpChatManagerId').value = '';
      }
    }
  };

  const removeChatManagerId = () => {
    const arrList2 = [];
    const nonFindWord = [];
    const managerId = document.getElementById('regInputSmpChatManagerId').value;
    const blank = blankPattern(managerId, '#regInputSmpChatManagerId');
    if (blank) {
      const managerIdList = document.getElementById('regListSmpChatManagerId').value;
      const splitWord = managerIdList.trim().split(',');
      for (const word of splitWord) {
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
      strList = strList.replace(/,/g, ', '); // 콤마 띄어쓰기 유지할 것
      document.getElementById('regListSmpChatManagerId').innerText = strList;
      document.getElementById('regInputSmpChatManagerId').value = '';
    }
  };

  const generateCredentials = async (type) => {
    const userConfirmed = window.confirm('새로운 인증 정보를 생성하고 저장하시겠습니까?');

    if (!userConfirmed) {
      return;
    }

    const status = {
      client_id: false,
      client_secret: false,
      api_key: false,
    };

    if (type === 'id') {
      status.client_id = true;
    } else if (type === 'secret') {
      status.client_secret = true;
    } else if (type === 'apiKey') {
      status.api_key = true;
    } else {
      throw new Error('존재하지 않는 타입');
    }

    try {
      const response = await fetch('/oauth/credential', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(status),
      });

      const result = await response.json();
      if (response.ok) {
        document.getElementById('regInputClientId').value = result.client.client_id;
        document.getElementById('regInputClientSecret').value = result.client.client_secret;
        document.getElementById('regInputChatApiKey').value = result.client.api_key;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const oauthRegCheck = async () => {
    const AppName = document.getElementById('regInputAppName').value.trim();
    const HomepageAddr = document.getElementById('regInputHomepageAddr').value.trim();
    const AuthCallbackURL = document.getElementById('regInputCallBackUrl').value.trim();

    if (!AppName) {
      alert('어플리케이션 이름을 입력하세요.');
      document.getElementById('regInputAppName').focus();
      return false;
    }
    if (!HomepageAddr) {
      alert('홈페이지 주소를 입력하세요.');
      document.getElementById('regInputHomepageAddr').focus();
      return false;
    }
    if (!AuthCallbackURL) {
      alert('허가요청을 위한 콜백 주소를 입력하세요.');
      document.getElementById('regInputCallBackUrl').focus();
      return false;
    }

    if ([AppName, HomepageAddr, AuthCallbackURL].some(checkSpace)) {
      alert('공백은 사용하실 수 없습니다.');
      document.getElementById('regInputAppName').value = '';
      document.getElementById('regInputHomepageAddr').value = '';
      document.getElementById('regInputCallBackUrl').value = '';
      document.getElementById('regInputAppName').focus();
      return false;
    }

    const chkReqInfo = { id: true };
    document.querySelectorAll('input[name=consent]').forEach((input) => {
      chkReqInfo[input.value] = input.checked;
    });

    const managerIdList = document.getElementById('regListSmpChatManagerId').value;
    const managerList = [];
    const splitWord = managerIdList.split(',');
    for (const word of splitWord) {
      managerList.push(word.trim());
    }

    try {
      const response = await fetch('/oauth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address_uri: HomepageAddr,
          redirect_uri: AuthCallbackURL,
          clientAllowedScopes: chkReqInfo,
          manager_list: managerList,
          application_name: AppName,
        }),
      });
      const result = await response.json();

      if (response.ok) {
        alert('Application 등록완료!');
        window.location.replace('/');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // 이벤트 리스너 설정
  addEventListenerIfExists('chatManagerIdAdd', 'click', addChatManagerId);
  addEventListenerIfExists('regInputSmpChatManagerId', 'keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addChatManagerId();
    }
  });
  addEventListenerIfExists('chatManagerIdRemove', 'click', removeChatManagerId);
  addEventListenerIfExists('idCopy', 'click', () => copyToClipboard('regInputClientId'));
  addEventListenerIfExists('secretCopy', 'click', () => copyToClipboard('regInputClientSecret'));
  addEventListenerIfExists('chatApiKeyCopy', 'click', () => copyToClipboard('regInputChatApiKey'));

  const oauthLogoImage = document.querySelector('.oauth-logo-image');
  if (oauthLogoImage) {
    oauthLogoImage.addEventListener('click', () => {
      window.location.replace('/');
    });
  }

  const inputIds = ['regInputAppName', 'regInputHomepageAddr', 'regInputCallBackUrl'];
  inputIds.forEach((id) => {
    addEnterKeyListener(id, oauthRegCheck);
  });

  addEventListenerIfExists('oauthRegisterButton', 'click', oauthRegCheck);
  addEventListenerIfExists('idCreate', 'click', () => generateCredentials('id'));
  addEventListenerIfExists('secretCreate', 'click', () => generateCredentials('secret'));
  addEventListenerIfExists('chatApiKeyCreate', 'click', () => generateCredentials('apiKey'));
});
