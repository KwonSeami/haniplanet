import * as React from 'react';
import {staticUrl} from '../../../src/constants/env';
import {VALIDATE_REGEX} from '../../../src/constants/validates';
import {toDateFormat} from '../../../src/lib/date';
import styled from 'styled-components';
import SelectBox from '../../inputs/SelectBox';
import Input from '../../inputs/Input';
import {$BORDER_COLOR, $GRAY, $POINT_BLUE, $FONT_COLOR} from '../../../styles/variables.types';
import {EDU_DEGREE_TYPE, EDU_PROGRESS_STATUS} from '../../../src/constants/profile';
import StyledButton from '../style/StyledButton';
import Button from '../../inputs/Button/ButtonDynamic';

type TEduForm = TProfileFormParamsExceptId<IProfileEdu>;

interface Props extends Partial<IProfileEdu>, IProfileFormCommonProps<TEduForm> {
  isSelect?: boolean;
  index?: number;
  lastIndex?: number;
  onSwapData?: (currIdx: number, swapIdx: number) => void;
  className?: string;
}

const isValidForm = (currentState: {
  school_name: string,
  degree_type: TEduDegreeType,
  major_name: string,
  admission_at: {
    year: string,
    month: string
  },
  graduate_at: {
    year: string,
    month: string
  },
  progress_status: TEduProgressStatus
}): [boolean, string] | TEduForm => {
  const {
    school_name,
    degree_type,
    major_name,
    admission_at: {
      year: admissionYear,
      month: admissionMonth
    },
    graduate_at: {
      year: graduateYear,
      month: graduateMonth
    },
    progress_status
  } = currentState;
  const {
    VALIDATE_YEAR,
    VALIDATE_MONTH
  } = VALIDATE_REGEX;

  if (major_name === '') {
    return [false, '전공을 입력해주세요.'];
  } else if (school_name === '') {
    return [false, '학교명을 입력해주세요.'];
  } else if (admissionYear === '' || admissionMonth === '') {
    return [false, '시작년월을 입력해주세요.'];
  } else if (!VALIDATE_YEAR[0].test(admissionYear) || !VALIDATE_MONTH[0].test(admissionMonth)) {
    return [false, '형식에 맞는 시작년월을 입력해주세요.'];
  } else if (graduateYear === '' || graduateMonth === '') {
    return [false, '종료년월을 입력해주세요.'];
  } else if (!VALIDATE_YEAR[0].test(graduateYear) || !VALIDATE_MONTH[0].test(graduateMonth)) {
    return [false, '형식에 맞는 종료년월을 입력해주세요.'];
  } else if ((parseInt(graduateYear + graduateMonth, 10) - parseInt(admissionYear + admissionMonth, 10)) < 0) {
    return [false, '종료년월은 시작년월보다 빠를 수 없습니다.'];
  }

  return [true, {
    school_name,
    degree_type,
    major_name,
    admission_at: new Date(`${admissionYear}-${admissionMonth}`).toISOString(),
    graduate_at: new Date(`${graduateYear}-${graduateMonth}`).toISOString(),
    progress_status
  }];
};

const StyledSelectBox = styled(SelectBox)`
  width: 115px;
  display: inline-block;
  vertical-align: top;
  margin-right: 15px;
`;

export const StyledFormInput = styled(Input)<
  Pick<Props, 'isSelect'>
>`
  width: 100%;
  height: 44px;
  border-bottom: 1px solid ${$BORDER_COLOR} !important;
  font-size: 14px;

  ${({isSelect}) => isSelect && `
    width: 400px;
    display: inline-block !important;
    vertical-align: top;
  `}
`;

const EduFormUl = styled.ul`
  position: relative;
  margin-bottom: 13px;

  & > li {
    padding-bottom: 10px;
  }

  .top-btn-wrapper {
    position: absolute;
    top: 3px;
    left: -149px;
    padding: 0;

    button {
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

        ${StyledFormInput} {
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

const ProfileEduForm: React.FC<Props> = React.memo(({
  school_name,
  degree_type,
  major_name,
  admission_at,
  graduate_at,
  progress_status,
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
  const [edu, setEdu] = React.useState({
    school_name: school_name || '',
    degree_type: degree_type || 'bachelor',
    major_name: major_name || '',
    progress_status: progress_status || 'attending',
    admission_at: {
      year: admission_at ? toDateFormat(admission_at, 'YYYY') : '',
      month: admission_at ? toDateFormat(admission_at, 'MM') : ''
    },
    graduate_at: {
      year: graduate_at ? toDateFormat(graduate_at, 'YYYY') : '',
      month: graduate_at ? toDateFormat(graduate_at, 'MM') : ''
    }
  });

  const [warningText, setWarningText] = React.useState('');

  return (
    <EduFormUl className={className}>
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
        <StyledSelectBox
          value={edu.degree_type}
          option={EDU_DEGREE_TYPE}
          disabled={!controllable}
          onChange={degree_type => {
            setEdu(curr => ({
              ...curr,
              degree_type
            }));
          }}
        />
        <StyledFormInput
          isSelect
          placeholder="전공을 입력해주세요. (50자 이내)"
          maxLength={50}
          readOnly={!controllable}
          value={edu.major_name}
          onChange={({target: {value}}) => {
            setEdu(curr => ({
              ...curr,
              major_name: value
            }));
          }}
        />
      </li>
      <li>
        <StyledFormInput
          placeholder="학교명을 입력해주세요. (50자 이내)"
          maxLength={50}
          readOnly={!controllable}
          value={edu.school_name}
          onChange={({target: {value}}) => {
            setEdu(curr => ({
              ...curr,
              school_name: value
            }));
          }}
        />
      </li>
      <li>
        <StyledSelectBox
          value={edu.progress_status}
          option={EDU_PROGRESS_STATUS}
          disabled={!controllable}
          onChange={progress_status => {
            setEdu(curr => ({
              ...curr,
              progress_status
            }));
          }}
        />
        <ul className="date-group">
          <li className="date">
            <StyledFormInput
              className="years"
              placeholder="2018"
              maxLength={4}
              readOnly={!controllable}
              value={edu.admission_at.year}
              onChange={({target: {value}}) => {
                setEdu(curr => ({
                  ...curr,
                  admission_at: {
                    ...curr.admission_at,
                    year: value
                  }
                }));
              }}
            />
            <StyledFormInput
              className="month"
              placeholder="03"
              maxLength={2}
              readOnly={!controllable}
              value={edu.admission_at.month}
              onChange={({target: {value}}) => {
                setEdu(curr => ({
                  ...curr,
                  admission_at: {
                    ...curr.admission_at,
                    month: value
                  }
                }));
              }}
            />
          </li>
          <li>
            <StyledFormInput
              className="years"
              placeholder="2018"
              maxLength={4}
              readOnly={!controllable}
              value={edu.graduate_at.year}
              onChange={({target: {value}}) => {
                setEdu(curr => ({
                  ...curr,
                  graduate_at: {
                    ...curr.graduate_at,
                    year: value
                  }
                }));
              }}
            />
            <StyledFormInput
              className="month"
              placeholder="03"
              maxLength={2}
              readOnly={!controllable}
              value={edu.graduate_at.month}
              onChange={({target: {value}}) => {
                setEdu(curr => ({
                  ...curr,
                  graduate_at: {
                    ...curr.graduate_at,
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
                disabled={!isValidForm(edu)[0]}
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
              disabled={type === 'ADD' && !isValidForm(edu)[0]}
              onClick={() => {
                const [isValid, result] = isValidForm(edu);

                if (isValid) {
                  if (type === 'ADD') {
                    onAddForm(result, () => {
                      alert('저장되었습니다.');

                      setEdu({
                        school_name: '',
                        degree_type: 'bachelor',
                        major_name: '',
                        admission_at: {
                          year: '',
                          month: ''
                        },
                        graduate_at: {
                          year: '',
                          month: ''
                        },
                        progress_status: 'attending'
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
                src={staticUrl("/static/images/icon/icon-save-circle.png")}
                alt="저장하기"
              />
              저장
            </Button>
          </li>
        </ul>
      </li>
    </EduFormUl>
  );
});

ProfileEduForm.displayName = 'ProfileEduForm';

export default ProfileEduForm;
