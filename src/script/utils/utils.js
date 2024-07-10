export const checkSpace = (str) => /\s/.test(str);

export const checkSpecial = (str) => /[^a-zA-Z0-9]/.test(str);

export const validateId = (id) => !/[`~!@#$%^&*|\\\'\";:\/?]/i.test(id);

export const validateEmail = (email) => {
  const email_pattern =
    /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)*\w[\w-]{0,66}\.[a-z]{2,6}(?:\.[a-z]{2})?$/i;
  return email_pattern.test(email);
};

export const addEnterKeyListener = (elementId, callback) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        callback();
      }
    });
  }
};

export const copyToClipboard = (inputId) => {
  const inputElement = document.getElementById(inputId);
  if (inputElement) {
    inputElement.select();
    document.execCommand('copy');
  }
};

export const checkArrWord = (arrList) => {
  return arrList.filter((word, index) => arrList.indexOf(word) === index);
};

export const blankPattern = (str, id) => {
  if (str.trim().length === 0) {
    alert('아이디를 입력 해주세요.');
    const element = document.querySelector(id);
    if (element) {
      element.value = '';
      element.focus();
    }
    return false;
  }
  return true;
};
