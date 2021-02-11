import * as React from 'react';
import {isEmpty} from 'lodash/lang';
import styled from 'styled-components';
import {IInputProps} from '.';
import Input from '.';
import useClickOutside from '../../../src/hooks/element/useClickOutside';
import {staticUrl} from '../../../src/constants/env';

const Div = styled.div`
  position: relative;

  .clear-button {
    position: absolute;
    right: 36px;
    top: 13px;
    width: 16px;
  }
`;

export const StyledInput = styled(Input)`
  width: 100%;
  height: 100%;
`;

export interface IAcCompProps {
  acList: Indexable[];
  onSelectAutoList: (item: any) => void;
  queryKey?: string;
  keyword?: string;
  rightContent?: React.ElementType | React.ComponentType;
  focusedRow: number;
  onDelete?: (text: string) => void;
  className?: string;
}

interface IAutoList {
  acList: Indexable[];
  queryKey?: string;
  blockStrItemSelect?: boolean;
  acComp: React.ComponentType<IAcCompProps>;
  acCompProps?: Indexable;
  onSelect: (row: Indexable | string) => void;
  rightContent?: React.ElementType;
  children?: React.ReactNode;
}

interface Props extends Omit<IInputProps, 'onSelect'> {
  autoList: IAutoList;
  onChange: (e: React.ChangeEvent<HTMLInputElement> | string) => void;
  onReset?: () => void;
}

const SearchBaseInput: React.FC<Props> = React.memo((props) => {
  const {
    autoList,
    className,
    onBlur,
    onFocus,
    value,
    onReset,
    ...rest
  } = props;
  const {
    acList,
    acComp: AcComp,
    rightContent,
    onSelect,
    queryKey,
    blockStrItemSelect,
    acCompProps
  } = autoList || {} as any as IAutoList;
  const {children: acChildren} = acCompProps || {} as IAutoList['acCompProps'];

  const [{focusedRow, isFocus}, setFocusState] = React.useState({
    focusedRow: 0,
    isFocus: false
  });
  const isTabOpen = React.useMemo(() =>
    (!isEmpty(acList) || acChildren) && isFocus,
    [acList, isFocus, acChildren]
  );
  const onSelectAutoList = React.useCallback(item => {
    setFocusState(curr => ({ ...curr, focusedRow: 0 }));
    onSelect && (
      blockStrItemSelect ? (
        typeof(item) !== 'string' && onSelect(item)
      ) : onSelect(item));
  }, [onSelect, blockStrItemSelect]);

  const inputRef = React.useRef();
  const autoListRef = React.useRef();
  const isInputOutsideClick = useClickOutside([inputRef, autoListRef]);

  React.useEffect(() => {
    if (autoListRef.current && isInputOutsideClick) {
      setFocusState(curr => ({...curr, isFocus: false}));
    }
  }, [isInputOutsideClick]);

  return (
    <>
      <Div className={className}>
        <StyledInput
          ref={inputRef}
          value={value}
          onFocus={e => {
            setFocusState(curr => ({...curr, isFocus: true}));
            onFocus && onFocus(e);
          }}
          onBlur={e => {
            onBlur && onBlur(e);
          }}
          onKeyDown={e => {
            if (focusedRow === 0 && e.keyCode === 13) {
              onSelectAutoList(value);
            }

            if (!acList) { return null; }

            if (focusedRow > 0 && e.keyCode === 13) {
              // Key Return
              onSelectAutoList(acList[focusedRow - 1]);
            } else if (e.keyCode === 40) {
              // Key Down
              setFocusState(curr => ({
                ...curr,
                focusedRow: focusedRow < acList.length
                  ? focusedRow + 1
                  : 0
              }));
            } else if (e.keyCode === 38) {
              // Key Up
              setFocusState(curr => ({
                ...curr,
                focusedRow: focusedRow > 0
                  ? focusedRow - 1
                  : acList.length
              }));
            }
          }}
          {...rest}
        />
        {value && (
          <img
            src={staticUrl("/static/images/icon/icon-clear-btn.png")}
            alt="전제 지우기"
            className="clear-button pointer"
            onClick={onReset}
          />
        )}
      </Div>
      {isTabOpen && (
        <AcComp
          ref={autoListRef}
          acList={acList}
          queryKey={queryKey}
          keyword={value}
          rightContent={rightContent}
          onSelectAutoList={onSelectAutoList}
          focusedRow={focusedRow}
          {...acCompProps}
        />
      )}
    </>
  );
});

SearchBaseInput.defaultProps = {
  placeholder: '텍스트를 입력해주세요.',
  type: 'text'
};

export default SearchBaseInput; 
