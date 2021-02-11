import * as React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import useClickOutside from '../../../src/hooks/element/useClickOutside';
import {staticUrl} from '../../../src/constants/env';
import {fontStyleMixin, heightMixin} from '../../../styles/mixins.styles';
import {$WHITE, $BORDER_COLOR} from '../../../styles/variables.types';

interface ISelectOption {
  value: string;
  label?: string;
  disabled?: boolean;
}

export interface ISelectBox {
  value: string;
  option: ISelectOption[];
  onChange?: (selectedOptions: string) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: React.ReactNode;
}

interface SelectBoxItemProps {
  isSelected?: boolean;
}

export const Select = styled.div`
  position: relative;
  width: 100%;
  border-bottom: 1px solid ${$BORDER_COLOR};

  & > p {
    font-size: 14px;
    ${heightMixin(42)}
    cursor: pointer;

    img {
      width: 19px;
      position: absolute;
      right: 3px;
      top: 50%;
      margin-top: -11px;
    }
  }
`;

export const SelectUl = styled.ul`
  position: absolute;
  left: 0;
  z-index: 10;
  width: 100%;
  max-height: 370px;
  margin-top: 2px;
  overflow-y: auto;
  box-sizing: border-box;
  background-color: ${$WHITE};
`;

export const SelectBoxItem = styled.li<SelectBoxItemProps>`
  display: block !important;
  ${heightMixin(40)};
  padding: 0 14px;
  border: 1px solid ${$BORDER_COLOR};
  border-top: 0;
  cursor: pointer;
  ${fontStyleMixin({ size: 14, color: '#999' })};

  &:first-child {
    border-top: 0;
  }
  
  &:hover {
    background-color: #f9f9f9;
  }

  ${({isSelected}) => isSelected && `
    background-color: #f9f9f9;
  `}
`;

const SelectBox: React.FC<ISelectBox> = React.memo(({
  value,
  onChange,
  className,
  option = [],
  disabled,
  placeholder,
 }) => {
  const [showOptions, setShowOptions] = React.useState(false);
  const selectRef = React.useRef(null);
  const isClicked = useClickOutside<HTMLDivElement>(selectRef);
  const [categoryName, setCategoryName] = React.useState(placeholder);

  React.useEffect(() => {
    if (selectRef.current && isClicked) {
      setShowOptions(false);
    }
  }, [isClicked]);

  const [selectedItem = {} as any as ISelectOption] = option.filter(item => item.value === value);

  return (
    <Select
      className={cn('select-box', className)}
      ref={selectRef}
      onClick={() => {
        if (disabled) {
          return null;
        }
        setShowOptions(curr => !curr)
      }}
    >
      <p>
        {categoryName || selectedItem.label || selectedItem.value}
        <img
          src={staticUrl('/static/images/icon/arrow/icon-select-more.png')}
          alt="Select 화살표"
        />
      </p>
      {showOptions && (
        <SelectUl>
          {option.map(({value: itemValue, label, disabled = false}) => (
            <SelectBoxItem
              key={itemValue}
              onClick={() => {
                if (disabled) {
                  return null;
                }
                setCategoryName(null);
                onChange && onChange(itemValue);
              }}
              isSelected={value === itemValue || disabled}
            >
              {label || itemValue}
            </SelectBoxItem>
          ))}
        </SelectUl>
      )}
    </Select>
  );
});

export default SelectBox;
