import * as React from 'react';
import {toDateFormat} from '../../../src/lib/date';
import {staticUrl} from '../../../src/constants/env';
import Button from '../../inputs/Button/ButtonDynamic';
import {VALIDATE_REGEX} from '../../../src/constants/validates';
import {$POINT_BLUE, $BORDER_COLOR} from '../../../styles/variables.types';
import styled from 'styled-components';
import Input from '../../inputs/Input';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import CheckBox from '../../UI/Checkbox1/CheckBox';
import cn from 'classnames';
import StyledButton from '../style/StyledButton';

type TLicenseForm = TProfileFormParamsExceptId<IProfileLicense>;

interface Props extends Partial<IProfileLicense>, IProfileFormCommonProps<TLicenseForm> {
  hasSpecialistCheckbox?: boolean;
  className?: string;
}

const isValidForm = (currentState: {
  name: string,
  organization: string,
  acquisition_at: {
    year: string,
    month: string
  },
  is_specialist?: boolean
}): [boolean, string] | TLicenseForm => {
  const {
    name,
    organization,
    acquisition_at: {
      year,
      month
    },
    is_specialist
  } = currentState;
  const {
    VALIDATE_YEAR,
    VALIDATE_MONTH
  } = VALIDATE_REGEX;

  if (year === '' || month === '') {
    return [false, '취득년월을 입력해주세요.'];
  } else if (!VALIDATE_YEAR[0].test(year) || !VALIDATE_MONTH[0].test(month)) {
    return [false, '형식에 맞는 취득년월을 입력해주세요.'];
  } else if (name === '') {
    return [false, '자격증명을 입력해주세요.'];
  } else if (organization === '') {
    return [false, '발급기관명을 입력해주세요.'];
  }

  return [true, {
    name,
    organization,
    acquisition_at: new Date(`${year}-${month}`).toISOString(),
    is_specialist
  }];
};

const StyledInput = styled(Input)`
  width: 100%;
  height: 44px;
  border-bottom: 1px solid ${$BORDER_COLOR} !important;
  font-size: 15px;
`;

const StyledCheckBox = styled(CheckBox)`
  display: inline-block;
  vertical-align: middle;
  padding: 11px 0 0 21px;

  label {
    font-size: 14px;
  }
`;

export const LicenseUl = styled.ul`
  position: relative;

  > li:not(.btn) {
    padding-bottom: 10px;

    > h3 {
      vertical-align: middle;
      padding: 10px 9px 0 0;
      ${fontStyleMixin({
        size: 11,
        weight: 'bold'
      })}
    }
  }

  > li.btn {
    position: absolute;
    top: 28px;
    right: 0;

    .btn-delete {
      img {
        width: 35px;
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

const ProfileLicenseForm: React.FC<Props> = React.memo(({
  name,
  organization,
  is_specialist,
  acquisition_at,
  onAddForm,
  onDeleteForm,
  onEditForm,
  onCreateForm,
  onFilterUnSavedForm,
  id,
  type,
  isAddBtnVisible,
  hasSpecialistCheckbox,
  controllable = true,
  className
}) => {
  const [license, setLicense] = React.useState({
    name: name || '',
    acquisition_at: {
      year: acquisition_at ? toDateFormat(acquisition_at, 'YYYY') : '',
      month: acquisition_at ? toDateFormat(acquisition_at, 'MM') : ''
    },
    organization: organization || '',
    is_specialist: !!is_specialist
  });

  const [warningText, setWarningText] = React.useState('');

  return (
    <LicenseUl className={cn('clearfix', className)}>
      <li>
        <h3>취득년도</h3>
        <ul className="date-group">
          <li>
            <StyledInput
              className="years"
              placeholder="2018"
              readOnly={!controllable}
              value={license.acquisition_at.year}
              maxLength={4}
              onChange={({target: {value}}) => {
                setLicense(curr => ({
                  ...curr,
                  acquisition_at: {
                    ...curr.acquisition_at,
                    year: value
                  }
                }));
              }}
            />
          </li>
          <li>
            <StyledInput
              className="month"
              placeholder="03"
              readOnly={!controllable}
              value={license.acquisition_at.month}
              maxLength={2}
              onChange={({target: {value}}) => {
                setLicense(curr => ({
                  ...curr,
                  acquisition_at: {
                    ...curr.acquisition_at,
                    month: value
                  }
                }));
              }}
            />
          </li>
          {hasSpecialistCheckbox && (
            <li>
              <StyledCheckBox
                checked={license.is_specialist}
                disabled={!controllable}
                onChange={({target: {checked}}) => {
                  setLicense(curr => ({
                    ...curr,
                    is_specialist: checked
                  }));
                }}
              >
                전문의
              </StyledCheckBox>
            </li>
          )}
        </ul>
      </li>
      <li className="btn">
        {(controllable && type === 'EDIT') && (
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
            onClick={() => onDeleteForm(id)}
          >
            <img
              src={staticUrl('/static/images/icon/icon-delete-minus.png')}
              alt="삭제하기"
            />
          </StyledButton>
        )}
      </li>
      <li>
        <StyledInput
          placeholder="자격증명을 입력해주세요.(50자 이내)"
          value={license.name}
          readOnly={!controllable}
          maxLength={50}
          onChange={({target: {value}}) => {
            setLicense(curr => ({
              ...curr,
              name: value
            }));
          }}
        />
      </li>
      <li>
        <StyledInput
          placeholder="발급기관을 입력해주세요.(50자 이내)"
          value={license.organization}
          readOnly={!controllable}
          maxLength={50}
          onChange={({target: {value}}) => {
            setLicense(curr => ({
              ...curr,
              organization: value
            }));
          }}
        />
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
                disabled={!isValidForm(license)[0]}
                onClick={() => onCreateForm()}
              >
                <img
                  src={staticUrl("/static/images/icon/icon-plus-circle.png")}
                  alt="삭제하기"
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
                color: $BORDER_COLOR
              }}
              font={{
                size: '12px',
                weight: 'bold',
                color: $POINT_BLUE
              }}
              disabled={type === 'ADD' && !isValidForm(license)[0]}
              onClick={() => {
                const [isValid, result] = isValidForm(license);

                if (isValid) {
                  if (type === 'ADD') {
                    onAddForm(result, () => {
                      alert('저장되었습니다.');

                      setLicense({
                        name: '',
                        acquisition_at: {
                          year: '',
                          month: ''
                        },
                        organization: '',
                        is_specialist: false
                      });
                      setWarningText('');
                      onFilterUnSavedForm(id);
                    });
                  } else {
                    onEditForm(id, result, () => {
                      alert('수정되었습니다.');

                      setWarningText('');
                    });
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
    </LicenseUl>
  );
});

ProfileLicenseForm.displayName = 'ProfileLicenseForm';

export default ProfileLicenseForm;
