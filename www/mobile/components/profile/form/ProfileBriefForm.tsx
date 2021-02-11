import * as React from 'react';
import Button from '../../inputs/Button/ButtonDynamic';
import {staticUrl} from '../../../src/constants/env';
import {VALIDATE_REGEX} from '../../../src/constants/validates';
import {toDateFormat} from '../../../src/lib/date';
import styled from 'styled-components';
import Input from '../../inputs/Input';
import {$BORDER_COLOR, $POINT_BLUE} from '../../../styles/variables.types';
import StyledButton from '../style/StyledButton';
import cn from 'classnames';

type TBriefForm = TProfileFormParamsExceptId<IProfileBrief>;

interface Props extends Partial<IProfileBrief>, IProfileFormCommonProps<TBriefForm> {
  index?: number;
  lastIndex?: number;
  onSwapData?: (currIdx: number, swapIdx: number) => void;
  className?: string;
}

const isValidForm = (currentState: {
  title: string,
  start_at: {
    year: string,
    month: string
  },
  end_at: {
    year: string,
    month: string
  }
}): [boolean, string] | TBriefForm => {
  const {
    title,
    start_at: {
      year: startYear,
      month: startMonth
    },
    end_at: {
      year: endYear,
      month: endMonth
    }
  } = currentState;
  const {
    VALIDATE_YEAR,
    VALIDATE_MONTH
  } = VALIDATE_REGEX;

  if (title === '') {
    return [false, '약력을 입력해주세요.'];
  } else if (startYear === '' || startMonth === '') {
    return [false, '시작년월을 입력해주세요.'];
  } else if (!VALIDATE_YEAR[0].test(startYear) || !VALIDATE_MONTH[0].test(startMonth)) {
    return [false, '형식에 맞는 시작년월을 입력해주세요.'];
  } else if (endYear === '' || endMonth === '') {
    return [false, '종료년월을 입력해주세요.'];
  } else if (!VALIDATE_YEAR[0].test(endYear) || !VALIDATE_MONTH[0].test(endMonth)) {
    return [false, '형식에 맞는 종료년월을 입력해주세요.'];
  } else if ((parseInt(endYear + endMonth, 10) - parseInt(startYear + startMonth, 10)) < 0) {
    return [false, '종료년월은 시작년월보다 빠를 수 없습니다.'];
  }

  return [true, {
    title,
    start_at: new Date(`${startYear}-${startMonth}`).toISOString(),
    end_at: new Date(`${endYear}-${endMonth}`).toISOString()
  }];
};

const StyledInput = styled(Input)`
  display: inline-block !important;
  width: calc(100% - 114px);
  height: 44px;
  border-bottom: 1px solid ${$BORDER_COLOR} !important;
  font-size: 14px;
`;

const BriefFormUl = styled.ul`
  & > li {
    padding-bottom: 10px;
  }

  ul {
    li {
      position: relative;
      display: inline-block;
      vertical-align: middle;
    }

    &.btn-updown {
      float: right;
      padding-top: 8px;

      .btn-up {
        margin-left: 0;

        img {
          width: 12px;
          height: 13px;
        }
      }
    
      .btn-down {
        margin-left: -1px;
        
        img {
          width: 12px;
          height: 13px;
        }
      }

      .btn-delete {
        margin-left: -1px;
        
        img {
          width: 35px;
        }
      }
    }

    &.date-group {
      display: inline-block;
      vertical-align: top;

      li {
        vertical-align: top;

        &.date {
          padding-right: 15px;
          
          &::after {
            content: '';
            position: absolute;
            right: 4px;
            top: 50%;
            width: 8px;
            height: 1px;
            background-color: ${$BORDER_COLOR};
          }
        }

        ${StyledInput} {
          display: inline-block;
          vertical-align: middle;
        }

        .years {
          text-align: center;
          width: 83px;
          margin-right: 10px;
        }

        .month {
          text-align: center;
          width: 53px;
        }
      }
    }

    &.btn-group {
      margin-top: 9px;
      text-align: center;

      li {
        display: inline-block;
        margin: 0 2px;

        button:disabled {
          border-color: ${$BORDER_COLOR};
          opacity: 1;

          &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #f9f9f9;
            opacity: 0.5;
          }
        }

        img {
          width: 16px;
          display: inline-block;
          vertical-align: middle;
          margin: -3px 3px 0 0;
        }
      }
    }
  }
`;

const ProfileBriefForm: React.FC<Props> = React.memo(({
  title,
  start_at,
  end_at,
  onAddForm,
  onDeleteForm,
  onEditForm,
  onCreateForm,
  onFilterUnSavedForm,
  id,
  type,
  isAddBtnVisible,
  className,
  controllable = true,
  index,
  lastIndex,
  onSwapData
}) => {
  const [brief, setBrief] = React.useState({
    title: title || '',
    start_at: {
      year: start_at ? toDateFormat(start_at, 'YYYY') : '',
      month: start_at ? toDateFormat(start_at, 'MM') : ''
    },
    end_at: {
      year: end_at ? toDateFormat(end_at, 'YYYY') : '',
      month: end_at ? toDateFormat(end_at, 'MM') : ''
    }
  });

  const [warningText, setWarningText] = React.useState('');

  return (
    <BriefFormUl className={cn('clearfix', className)}>
      <li>
        <StyledInput
          placeholder="약력을 입력해주세요.(50자 이내)"
          maxLength={50}
          readOnly={!controllable}
          value={brief.title}
          onChange={({target: {value}}) => {
            setBrief(curr => ({
              ...curr,
              title: value
            }));
          }}
        />
        {(controllable && typeof index === 'number' && type === 'EDIT') && (
          <ul className="btn-updown">
            <li>
              <StyledButton
                className="btn-up"
                size={{
                  width: '35px',
                  height: '35px'
                }}
                border={{
                  radius: '0',
                  width: '1px',
                  color: $BORDER_COLOR
                }}
                disabled={!index}
                onClick={() => onSwapData(index, index - 1)}
              >
                <img
                  src={staticUrl('/static/images/icon/arrow/icon-btn-up.png')}
                  alt="위로"
                />
              </StyledButton>
            </li>
            <li>
              <StyledButton
                className="btn-down"
                size={{
                  width: '35px',
                  height: '35px'
                }}
                border={{
                  radius: '0',
                  width: '1px',
                  color: $BORDER_COLOR
                }}
                disabled={index === lastIndex}
                onClick={() => onSwapData(index, index + 1)}
              >
                <img
                  src={staticUrl('/static/images/icon/arrow/icon-btn-down.png')}
                  alt="아래로"
                />
              </StyledButton>
            </li>
            <li>
              <StyledButton
                className="btn-delete"
                size={{
                  width: '35px',
                  height: '35px'
                }}
                border={{
                  radius: '0',
                  width: '1px',
                  color: $BORDER_COLOR
                }}
                backgroundColor="#f9f9f9"
                disabled={index === lastIndex}
                onClick={() => onDeleteForm(id)}
              >
                <img
                  src={staticUrl('/static/images/icon/icon-delete-minus.png')}
                  alt="삭제하기"
                />
              </StyledButton>
            </li>
          </ul>
        )}
      </li>
      <li>
        <ul className="date-group">
          <li className="date">
            <StyledInput
              className="years"
              placeholder="2018"
              value={brief.start_at.year}
              readOnly={!controllable}
              maxLength={4}
              onChange={({target: {value}}) => {
                setBrief(curr => ({
                  ...curr,
                  start_at: {
                    ...curr.start_at,
                    year: value
                  }
                }));
              }}
            />
            <StyledInput
              className="month"
              placeholder="03"
              value={brief.start_at.month}
              readOnly={!controllable}
              maxLength={2}
              onChange={({target: {value}}) => {
                setBrief(curr => ({
                  ...curr,
                  start_at: {
                    ...curr.start_at,
                    month: value
                  }
                }));
              }}
            />
          </li>
          <li>
            <StyledInput
              className="years"
              placeholder="2018"
              maxLength={4}
              value={brief.end_at.year}
              readOnly={!controllable}
              onChange={({target: {value}}) => {
                setBrief(curr => ({
                  ...curr,
                  end_at: {
                    ...curr.end_at,
                    year: value
                  }
                }));
              }}
            />
            <StyledInput
              className="month"
              placeholder="03"
              value={brief.end_at.month}
              readOnly={!controllable}
              maxLength={2}
              onChange={({target: {value}}) => {
                setBrief(curr => ({
                  ...curr,
                  end_at: {
                    ...curr.end_at,
                    month: value
                  }
                }));
              }}
            />
          </li>
        </ul>
        {warningText && (
          <span className="error">{warningText}</span>
        )}
      </li>
      <li>
        <ul className="btn-group">
          {isAddBtnVisible && (
            <li>
              <Button
                size={{
                  width: '114px',
                  height: '35px'
                }}
                border={{
                  width: '1px',
                  radius: '0',
                  color: $BORDER_COLOR
                }}
                font={{
                  size: '12px',
                  weight: 'bold'
                }}
                disabled={!isValidForm(brief)[0]}
                onClick={() => onCreateForm()}
              >
                <img
                  src={staticUrl("/static/images/icon/icon-plus-circle.png")}
                  alt="항목추가"
                />
                항목추가
              </Button>
            </li>
          )}
          <li>
            <Button
              className="save-btn"
              size={{
                width: '114px',
                height: '35px'
              }}
              border={{
                width: '1px',
                radius: '0',
                color: $POINT_BLUE
              }}
              font={{
                size: '12px',
                weight: 'bold',
                color: $POINT_BLUE
              }}
              disabled={type === 'ADD' && !isValidForm(brief)[0]}
              onClick={() => {
                const [isValid, result] = isValidForm(brief);

                if (isValid) {
                  if (type === 'ADD') {
                    onAddForm(result, () => {
                      alert('저장되었습니다.');

                      setBrief({
                        title: '',
                        start_at: {
                          year: '',
                          month: ''
                        },
                        end_at: { 
                          year: '',
                          month: ''
                        }
                      });
                      setWarningText('');
                      onFilterUnSavedForm(id);
                    });
                  } else {
                    onEditForm(id, result, () => {
                      alert('수정되었습니다.');

                      setWarningText('');
                    })
                  }
                } else {
                  setWarningText(result);
                }
              }}
            >
              <img
                src={staticUrl("/static/images/icon/check/icon-btn-save.png")}
                alt="저장하기"
              />
              저장
            </Button>
          </li>
        </ul>
      </li>
    </BriefFormUl>
  );
});

ProfileBriefForm.displayName = 'ProfileBriefForm';

export default ProfileBriefForm;
