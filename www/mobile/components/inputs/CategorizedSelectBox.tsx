import * as React from 'react';
import cn from 'classnames';
import {ISelectBox, Select, SelectUl, SelectBoxItem} from './SelectBox';
import {staticUrl} from '../../src/constants/env';
import styled from 'styled-components';
import useClickOutside from '../../src/hooks/element/useClickOutside';
import {$BORDER_COLOR} from '../../styles/variables.types';

const SelectBoxCategory = styled.li`
  display: block !important;
  padding: 0 14px;
  border: 1px solid ${$BORDER_COLOR};
`;


interface ICategorizedSelectOption {
  category?: string;
  values?: Array<{
    label?: string;
    value: string;
    disabled?: boolean;
  }>;
}

interface Props extends Pick<ISelectBox, 'value'
  | 'onChange'
  | 'className'
  | 'disabled'
  | 'placeholder'
  > {
  options: ICategorizedSelectOption[];
}

const flattenOptions = options => Object.values(options.map(({values}) => values)).flat();
const findItemFromOptions = (options, value) => options.find(({value: _value}) => value === _value) || {label: '', value: null};

const CategorizedSelectBox: React.FC<Props> = ({
  className,
  disabled,
  options = [],
  placeholder,
  value,
  onChange
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

  const selectedItem = findItemFromOptions(flattenOptions(options), value);

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
          src={staticUrl('/static/images/icon/check/icon-select-more.png')}
          alt="Select 화살표"
        />
      </p>
      {showOptions && (
        <SelectUl>
          {options.map(({category, values}) => (
            <>
              {!!category && (
                <SelectBoxCategory
                  key={category}
                  className="selectbox-category no-select"
                  onClick={e => e.stopPropagation()}
                >
                  {category}
                </SelectBoxCategory>
              )}
              {values.map(({value: itemValue, label, disabled = false}) => (
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
            </>
          ))}
        </SelectUl>
      )}
    </Select>
  );
};

export default React.memo(CategorizedSelectBox);
