const serialize = (body) => {
  delete body.client_secret;
  delete body.password;
  return body;
};

const replaceManagerListArr = (list) => {
  let strWord = '';

  list.map((word, i) => {
    if (i === 0) {
      strWord = strWord + word;
    } else {
      strWord = strWord + `, ${word}`; // 띄어쓰기 유지
    }
  });
  return strWord;
};

module.exports = {
  replaceManagerListArr,
  serialize,
};
