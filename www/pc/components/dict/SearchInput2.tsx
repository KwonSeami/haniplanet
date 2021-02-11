import * as React from 'react';
import {$POINT_BLUE, $WHITE, $FONT_COLOR, $BORDER_COLOR} from '../../styles/variables.types';
import {heightMixin} from '../../styles/mixins.styles';
import {staticUrl} from '../../src/constants/env';

interface State {
  focusedRow: number;
}

interface Props {
  onChange: (query: string) => void;
  autoCompleteFn?: (row: number) => React.ReactNode;
  autoCompleteList?: string[];
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onSubmit: (...args: any) => void; // TODO: 타입 정의 확인 필요
  onEnter?: React.KeyboardEvent<HTMLInputElement>;
  value: string;
  placeholder?: string;
  hasSearchIcon?: boolean;
  hasSearchBtn?: boolean;
  keyOfAutoComplete?: string;
  minInputLength?: number;
  maxInputLength?: number;
  className?: string;
}

class SearchInput2 extends React.PureComponent<Props, State> {
  public static defaultProps = {
    onChange: () => {},
    placeholder: '검색어를 입력해 주세요.',
    hasSearchIcon: false,
    keyOfAutoComplete: 'name',
    hasSearchBtn: true,
  };
  
  constructor(props) {
    super(props);

    this.state = {
      focusedRow: 0,
    };
  }

  public render() {
    const {
      onChange,
      onFocus,
      onBlur,
      onSubmit,
      autoCompleteFn,
      autoCompleteList,
      keyOfAutoComplete,
      value,
      className,
      placeholder,
      hasSearchIcon,
      hasSearchBtn: _hasSearchBtn,
      minInputLength: _minInputLength,
      maxInputLength: _maxInputLength,
      onEnter,
        ...rest
    } = this.props;
    const {focusedRow} = this.state;
    const acList = autoCompleteFn ? autoCompleteFn(focusedRow) : autoCompleteList;
    return (
      <>
        <div className={`search-input2 ${className}`}>
          <style jsx>{`
          .search-input2 {
            box-sizing: border-box;
            width: 100%;
            position: relative;
          }

          .input-1 {
            display: block;
            width: 100%;
            min-height: 35px;
            padding: 0 10px;
            font-size: 15px;
            color:${$FONT_COLOR};
            border-radius: 2px;
            outline: none;
            border: 1px solid ${$BORDER_COLOR};
            box-sizing:border-box;
          }

          .input-1:focus {
            border-color: ${$POINT_BLUE} !important;
          }

          .search-input2 .search-input-box {
            box-sizing: border-box;
            width: 100%;
            position: relative;
            background-color: ${$WHITE};
            padding-right: 70px;
          }

          .search-input2 .search-input-box .input-1 {
            height: 40px;
            border: 0 !important;
            border-radius: 0;
          }
          .search-input2 .search-input-box .input-1:focus {
            border: 0 !important;
          }
          .search-input2 .search-input-box .input-clear, 
          .search-input2 .search-input-box .search-icon {
            position: absolute;
            right: 50px;
            top: 7px;
            padding: 5px;
          }

          .search-input2 .search-input-box .search-icon {
            top: 5px;
            right: 15px;
            width: 20px;
          }

          .search-input2 .btn-2 {
            ${heightMixin(40)}
            position: absolute;
            right: 0;
            top: 0;
            width: 85px;
          }
          `}</style>
          <form
            action=""
            onSubmit={e => { 
              const {minInputLength, maxInputLength} = this.props;
              e.preventDefault();

              if (onSubmit) {
                if (minInputLength && value.length < minInputLength) {
                  alert(`검색어는 ${minInputLength}자 이상어야 합니다`);
                } else if (maxInputLength && value.length > maxInputLength) {
                  alert(`검색어는 ${minInputLength}자 이하여야 합니다`);
                } else {
                  onSubmit(e);
                }
              }
          }}>
            <div className="search-input-box">
              <input
                className="input-1"
                ref={r => (this.input = r)}
                value={value}
                onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
                  onChange(value);
                  this.setState({
                      focusedRow: 0,
                  });
                }}
                onFocus={onFocus}
                onBlur={onBlur}
                
                onKeyDown={e => {
                  if (focusedRow > 1 && e.keyCode === 13) {
                      // enter(return) key
                      const row = autoCompleteList[focusedRow - 1];
                      onChange(typeof row === 'string' ? row : row[keyOfAutoComplete]);
                  } else if (e.keyCode === 13) {
                    onEnter && onEnter();
                  } else if (e.keyCode === 40) {
                      // down arrow key
                      this.setState({
                          focusedRow: focusedRow < autoCompleteList.length ? focusedRow + 1 : 0,
                      });
                  } else if (e.keyCode === 38) {
                      // up arrow key
                      this.setState({
                          focusedRow: focusedRow !== 0 ? focusedRow - 1 : autoCompleteList.length - 1,
                      });
                  }
                }}
                placeholder={placeholder}
                {...rest}
              />
              {value && !!value.length && (
                <div className="pointer input-clear" onClick={() => onChange('')}>
                  <img
                    src={staticUrl('/static/images/icon/icon-clear-btn.png')}
                    alt="검색어 초기화"
                    style={{
                        width: '16px',
                    }}
                  />
                </div>
              )}

              {hasSearchIcon && (
                <input
                  type="image"
                  src={
                    value && value.length
                      ? staticUrl('/static/images/icon/icon-search-on.png')
                      : staticUrl('/static/images/icon/icon-search-off.png')
                  }
                  className="search-icon"
                />
              )}
            </div>
          </form>
          {acList}
        </div>
      </>
    );
  }
}

export default SearchInput2;
