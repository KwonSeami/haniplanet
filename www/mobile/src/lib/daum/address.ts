interface IDaumPostCodeOpenParams {
  q: string;
  left: number;
  top: number;
  popupName: string;
  autoClose: boolean;
}

export const getDaumAddress = (openParams?: Partial<IDaumPostCodeOpenParams>) => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject();
    } else {
      window.daum.postcode.load(() => {
        new window.daum.Postcode({
          oncomplete: data => {
            resolve(data);
          }
        }).open(openParams || {});
      });
    }
  });
};
