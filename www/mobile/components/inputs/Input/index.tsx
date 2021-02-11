import * as React from 'react';
import cn from 'classnames';
import {IValidateRegex, VALIDATE_REGEX} from '../../../src/constants/validates';
import {isValid, isNumberInputValid} from '../../../src/lib/validates';

export interface IInputProps extends React.HTMLAttributes<HTMLInputElement> {
  className?: string;
  disabled?: boolean;
  maxLength?: number;
  name?: string;
  numberOnly?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  regex?: keyof IValidateRegex;
  type?: string;
  value: string;
  searchBtn?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
}

let inputTimerId = null;

const Input = React.memo(
  React.forwardRef<HTMLInputElement, IInputProps>(({
    className,
    disabled,
    readOnly,
    regex,
    value,
    onChange,
    maxLength = 10000,
    name = '',
    numberOnly = false,
    placeholder = '텍스트를 입력해주세요.',
    type = 'text',
    searchBtn,
    autoComplete,
    ...props
  }, ref) => {
  
    const handleChangeValue = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const {target: {value}} = e;

        if (value.length > 0){
          if (value.length > maxLength) {
            alert('최대 입력 가능 글자 수를 초과하였습니다');
            e.preventDefault();
            return false;
          }

          if (numberOnly && !isNumberInputValid(value)) {
            e.preventDefault();
            return false;
          }

          if (!!regex && !isValid(value, regex)) {
            if (inputTimerId){
              clearTimeout(inputTimerId);
            }
            inputTimerId = setTimeout(() =>{
              alert(VALIDATE_REGEX[regex][1]);
              inputTimerId = null;
            }, 300);
            e.preventDefault();
            return false;
          }
        }
        onChange && onChange(e);
      }, [maxLength, numberOnly, regex, onChange]
    );
  
    return (
      <>
        <input
          ref={ref}
          type={type}
          className={cn(className, 'input')}
          disabled={disabled}
          readOnly={readOnly}
          value={value}
          onChange={handleChangeValue}
          name={name}
          placeholder={placeholder}
          autoComplete={autoComplete}
          pattern={numberOnly && "[0-9]"}
          inputMode={numberOnly && "numeric"}
          {...props}
        />
        {searchBtn}
      </>
    );
  })
);

export default Input;
