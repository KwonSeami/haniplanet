import * as React from 'react';
import {staticUrl} from '../../../src/constants/env';
import {VALIDATE_REGEX} from '../../../src/constants/validates';
import {toDateFormat} from '../../../src/lib/date';
import styled from 'styled-components';
import Input from '../../inputs/Input';
import {$BORDER_COLOR, $GRAY, $POINT_BLUE, $FONT_COLOR} from '../../../styles/variables.types';
import StyledButton from '../style/StyledButton';
import Button from '../../inputs/Button/ButtonDynamic';

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
  width: 100%;
  height: 44px;
  border-bottom: 1px solid ${$BORDER_COLOR} !important;
  font-size: 14px;
`;

const BriefFormUl = styled.ul`
  position: relative;
  margin-bottom: 13px;

  & > li {
    padding-bottom: 10px;
  }

  .top-btn-wrapper {
    position: absolute;
    top: 4px;
    left: -149px;
    padding: 0;

    .button {
      position: relative;
      padding-bottom: 0;
      margin-left: -1px;

      &.btn-delete {
        background-color: #f9f9f9;
        margin-left: 26px;

        img {
          width: 35px;
          height: 35px;
        }
      }

      &:hover {
        z-index: 1;
        border: 1px solid ${$GRAY};
      }

      &:active {
        background-color: #f9f9f9;
      }
      
      img {
        width: 12px;
        height: 13px;
      }
    }
  }

  ul {
    li {
      position: relative;
      display: inline-block;
      vertical-align: middle;
    }

    &.date-group {
      display: inline-block;
      vertical-align: top;

      li {
        vertical-align: top;

        &.date {
          padding-right: 20px;
          
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
      position: relative;
      float: right;
      margin-top: 10px;
    
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

      .button {
        margin-left: 4px;

        img {
          width: 16px;
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
  index,
  lastIndex,
  type,
  isAddBtnVisible,
  controllable = true,
  onSwapData,
  className
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
    <BriefFormUl className={className}>
      {(controllable && typeof index === 'number' && type === 'EDIT') && (
        <li className="top-btn-wrapper">
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
              alt="위로 이동"
            />
          </StyledButton>
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
              alt="아래로 이동"
            />
          </StyledButton>
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
            onClick={() => onDeleteForm(id)}
          >
            <img
              src={staticUrl('/static/images/icon/icon-delete-minus.png')}
              alt="삭제하기"
            />
          </StyledButton>
        </li>
      )}
      <li>
        <StyledInput
          placeholder="약력을 입력해주세요.(50자 이내)"
          readOnly={!controllable}
          maxLength={50}
          value={brief.title}
          onChange={({target: {value}}) => {
            setBrief(curr => ({
              ...curr,
              title: value
            }));
          }}
        />
      </li>
      <li>
        <ul className="date-group">
          <li className="date">
            <StyledInput
              className="years"
              placeholder="2018"
              readOnly={!controllable}
              value={brief.start_at.year}
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
              readOnly={!controllable}
              value={brief.start_at.month}
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
              readOnly={!controllable}
              maxLength={4}
              value={brief.end_at.year}
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
              readOnly={!controllable}
              value={brief.end_at.month}
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
      <li className="clearfix">
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
                  weight: 'bold',
                  color: $FONT_COLOR
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
                    alert('저장되었습니다.');

                    onAddForm(result, () => {
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
                    alert('수정되었습니다.');

                    onEditForm(id, result, () => {
                      setWarningText('');
                    })
                  }
                } else {
                  setWarningText(result);
                }
              }}
            >
              <img
                src={staticUrl("/static/images/icon/icon-save-circle.png")}
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
