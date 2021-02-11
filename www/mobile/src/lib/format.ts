export const birthAutoHyphen = (value: string) => {
  if (typeof value !== 'string') {
    return '';
  }

  const trimmedValue = value.trim();
  let result = trimmedValue.split('-').join('');
  const resultLeng = result.length;

  if (resultLeng > 4 && resultLeng <= 6) {
    result = `${result.slice(0, 4)}-${result.slice(4)}`;
  } else if (resultLeng > 6) {
    result = `${result.slice(0, 4)}-${result.slice(4, 6)}-${result.slice(6)}`;
  }

  return result;
};
