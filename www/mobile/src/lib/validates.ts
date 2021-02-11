import {VALIDATE_REGEX, IValidateRegex} from '../constants/validates';

export function isValid(str: string, validate: keyof IValidateRegex) {
  if (VALIDATE_REGEX.hasOwnProperty(validate)) {
    const result = VALIDATE_REGEX[validate];
    return str.match(result[0]);
  } 
  throw Error(`VALIDATE_REGEX 상수 객체에 파라미터로 넘어온 "${validate}" 프로퍼티가 존재하지 않습니다.`);
    
}

export function isNumberInputValid(str: string) {
  return (!!str && isValid(str, 'VALIDATE_NUMBER_ONLY')) || !str;
}
