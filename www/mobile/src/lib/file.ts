export const checkValidImage = (
  e: React.ChangeEvent<HTMLInputElement>,
  callback: (file: File) => void
) => {
  const file = e.target.files[0];

  if (!file.type.includes('image')) {
    alert('잘못된 파일 타입입니다.')
    return false;
  }

  callback(file);
};
