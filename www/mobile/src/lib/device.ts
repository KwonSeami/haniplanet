const getUserAgent = () => {
  try {
    return navigator.userAgent || navigator.vendor || window.opera;
  } catch (err) {
    return '';
  }
};

export const isIOS = () => {
  const ua = getUserAgent();

  return /ip(hone|od|ad)/i.test(ua) && !window.MSStream;
};
