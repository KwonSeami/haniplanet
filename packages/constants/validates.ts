export interface IValidateRegex {
  VALIDATE_NUMBER_ONLY: [RegExp, string];
  VALIDATE_ENGLISH_ONLY: [RegExp, string];
  VALIDATE_ENGLISH_AND_NUMBER_ONLY: [RegExp, string];
  VALIDATE_EMAIL: [RegExp, string];
  VALIDATE_IMAGE_OR_PDF: [RegExp, string];
  VALIDATE_IMAGE: [RegExp, string];
  VALIDATE_NUMBER_ENGLISH_ONLY: [RegExp, string];
  VALIDATE_NUMBER_ENGLISH_FIVE_TO_TWENTY: [RegExp, string];
  VALIDATE_NUMBER_LOWER_CASE_REQUIRED: [RegExp, string];
  VALIDATE_NUMBER_LOWER_CASE__KOREAN_REQUIRED: [RegExp, string];
  VALIDATE_NUMBER_ENGLISH__KOREAN_REQUIRED: [RegExp, string];
  VALIDATE_PASSWORD: [RegExp, string];
  VALIDATE_BIRTH_WITHOUT_CHARACTER: [RegExp, string];
  VALIDATE_YEAR: [RegExp, string];
  VALIDATE_MONTH: [RegExp, string];
  VALIDATE_PHONE: [RegExp, string];
  VALIDATE_PHONE_WITH_HYPHEN: [RegExp, string];
  VALIDATE_HH_MM_TIME: [RegExp, string];
  VALIDATE_URL: [RegExp, string];
}

export const VALIDATE_REGEX: IValidateRegex = {
  VALIDATE_ENGLISH_AND_NUMBER_ONLY: [/^[a-zA-Z0-9]+$/, '영어와 숫자만 가능합니다.'],
  VALIDATE_ENGLISH_ONLY: [/^[a-zA-Z]+$/, '영어만 가능합니다.'],
  VALIDATE_NUMBER_ONLY: [/^[0-9]+$/, '숫자만 가능합니다.'],
  VALIDATE_EMAIL: [/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, '잘못된 이메일 형식입니다.'],
  VALIDATE_IMAGE_OR_PDF: [/^(image\/.+|application\/pdf)$/, '이미지 또는 PDF파일만 가능합니다.'],
  VALIDATE_IMAGE: [/^(image\/.+)$/, '이미지 파일만 가능합니다.'],
  VALIDATE_NUMBER_ENGLISH_ONLY: [/^[a-zA-Z0-9]+$/, '영어와 숫자만 가능합니다.'],
  VALIDATE_NUMBER_ENGLISH_FIVE_TO_TWENTY: [/^[a-zA-Z0-9]{5,20}$/, '5~20자 이내의 영문 또는 숫자만 입력 가능합니다.'],
  VALIDATE_NUMBER_LOWER_CASE_REQUIRED: [/([a-z]+[0-9]+)|([0-9]+[a-z]+), '']/, '영문 소문자와 숫자만 입력 가능합니다.'],
  VALIDATE_NUMBER_LOWER_CASE__KOREAN_REQUIRED: [/^[a-z0-9ㄱ-ㅎ가-힣]+$/, '영문 소문자와 숫자 또는 한글만 입력 가능합니다.'],
  VALIDATE_NUMBER_ENGLISH__KOREAN_REQUIRED: [/^[a-zA-Z0-9ㄱ-ㅎ가-힣]+$/, '영문과 숫자 또는 한글만 입력 가능합니다.'],
  VALIDATE_PASSWORD: [/^(?=.*\d)(?=.*[a-z]).{8,15}$/, '입력 양식이 올바르지 않습니다.'],
  VALIDATE_YEAR: [/^(19[0-9][0-9]|20\d{2})$/, '형식에 맞는 연도를 입력해주세요.'],
  VALIDATE_MONTH: [/^(0[1-9]|1[0-2])$/, '형식에 맞는 월을 입력해주세요.'],
  VALIDATE_BIRTH_WITHOUT_CHARACTER: [/^(19[0-9][0-9]|20\d{2})(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/, '형식에 맞는 생년월일을 입력해주세요.'],
  VALIDATE_PHONE: [/(^02.{0}|^01.{1}|[0-9]{3})([0-9]{3,4})([0-9]{4})$/, '전화번호 형식에 맞지 않습니다.'],
  VALIDATE_PHONE_WITH_HYPHEN: [/(^02.{0}|^01.{1}|[0-9]{3})-([0-9]{3,4})-([0-9]{4})$/, '전화번호 형식에 맞지 않습니다.'],
  VALIDATE_HH_MM_TIME: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, '형식에 맞는 시간을 입력해주세요.'],
  VALIDATE_URL: [/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/, '형식에 맞는 URL을 입력해주세요.']
};