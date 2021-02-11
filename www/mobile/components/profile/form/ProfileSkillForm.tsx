import * as React from 'react';
import Button from '../../inputs/Button/ButtonDynamic';
import {staticUrl} from '../../../src/constants/env';
import isEmpty from 'lodash/isEmpty';
import {useSelector} from 'react-redux';
import {RootState} from '../../../src/reducers';
import {$POINT_BLUE, $BORDER_COLOR, $TEXT_GRAY} from '../../../styles/variables.types';
import {Select} from '../../inputs/SelectBox';
import SelectBox from '../../inputs/SelectBox';
import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {LEVEL} from '../../../src/constants/profile';
import cn from 'classnames';
import StyledButton from '../style/StyledButton';

type TSkillForm = TProfileFormParamsExceptId<IProfileSkill>;

interface Props extends Partial<IProfileSkill>, IProfileFormCommonProps<TSkillForm> {
  className?: string;
}

const isValidForm = (currentState: {
  description: string,
  level: TLevel,
  skill: {
    field: string,
    id: string
  }
}): [boolean, string] | TSkillForm => {
  const {
    description,
    level,
    skill: {id}
  } = currentState;

  if (description === '') {
    return [false, '상세내용을 입력해주세요.'];
  }

  return [true, {
    description,
    level,
    skill: id
  }];
};

const SkillFormUl = styled.ul`
  position: relative;

  & > li {
    padding-bottom: 10px;

    &.btn {
      position: absolute;
      top: 9px;
      right: 0;

      .btn-delete {
        img {
          width: 35px;
        }
      }
    }

    h3 {
      display: inline-block;
      vertical-align: middle;
      padding: 14px 7px 0 0;
      ${fontStyleMixin({
        size: 11,
        weight: 'bold'
      })};
    }
  }

  ul {
    li {
      position: relative;
      display: inline-block;
      vertical-align: middle;
    }

    &.skill > li {
      padding-right: 38px;

      &:last-child {
        padding: 0;
      }

      ${Select} {
        margin: 0;
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

const StyledSelectBox = styled(SelectBox)`
  width: 113px;
  display: inline-block !important;
  vertical-align: top;
  margin-right: 15px;
`;

const TextArea = styled.textarea`
  padding: 8px 12px;
  height: 80px;
  font-size: 14px;
  box-sizing: border-box;
  border: 1px solid ${$BORDER_COLOR};

  &::placeholder {
    color: ${$TEXT_GRAY};
  }
`;

const ProfileSkillForm: React.FC<Props> = React.memo(({
  description,
  level,
  skill: _skill,
  onAddForm,
  onDeleteForm,
  onEditForm,
  onCreateForm,
  onFilterUnSavedForm,
  id,
  type,
  isAddBtnVisible,
  controllable = true,
  className
}) => {
  const fetchedSkill = useSelector(({skill}: RootState) => skill);

  const [warningText, setWarningText] = React.useState('');
  const [skill, setSkill] = React.useState({
    description: '',
    level: '',
    skill: {
      field: '',
      id: ''
    }
  });

  React.useEffect(() => {
    setSkill({
      description: description || '',
      level: level || 'high',
      skill: {
        field: _skill ? _skill.field : defaultFieldValue,
        id: _skill ? _skill.id : detail[defaultFieldValue][0].value
      }
    });
  }, [description, level, _skill]);

  if (isEmpty(fetchedSkill) || (type === 'EDIT' && _skill === undefined)) {
    return null;
  }

  const {field, detail} = fetchedSkill;

  const defaultFieldValue = field[0].value;

  return (
    <SkillFormUl className={cn('clearfix', className)}>
      <li>
        <ul className="skill">
          <li>
            <h3>기술구분</h3>
            <StyledSelectBox
              option={field}
              value={skill.skill.field}
              disabled={!controllable}
              onChange={value => {
                setSkill(curr => ({
                  ...curr,
                  skill: {
                    ...curr.skill,
                    field: value,
                    id: detail[value][0].value
                  }
                }));
              }}
            />
          </li>
          <li>
            <h3>종류</h3>
            <StyledSelectBox
              option={detail[skill.skill.field]}
              value={skill.skill.id}
              disabled={!controllable}
              onChange={value => {
                setSkill(curr => ({
                  ...curr,
                  skill : {
                    ...curr.skill,
                    id: value
                  }
                }));
              }}
            />
          </li>
          <li>
            <h3>수준</h3>
            <StyledSelectBox
              option={LEVEL}
              value={skill.level}
              disabled={!controllable}
              onChange={value => {
                setSkill(curr => ({
                  ...curr,
                  level: value
                }));
              }}
            />
          </li>
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
        <TextArea
          placeholder="상세내용을 입력해주세요.(100자 이내)"
          value={skill.description}
          maxLength={100}
          readOnly={!controllable}
          onChange={({target: {value}}) => {
            setSkill(curr => ({
              ...curr,
              description: value
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
                disabled={!isValidForm(skill as any)[0]}
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
              disabled={type === 'ADD' && !isValidForm(skill as any)[0]}
              onClick={() => {
                const [isValid, result] = isValidForm(skill as any);

                if (isValid) {
                  if (type === 'ADD') {
                    onAddForm(result, () => {
                      alert('저장되었습니다.');

                      setSkill({
                        description: '',
                        level: 'high',
                        skill: {
                          field: defaultFieldValue,
                          id: detail[defaultFieldValue][0].value
                        }
                      } as any);
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
    </SkillFormUl>
  );
});

ProfileSkillForm.displayName = 'ProfileSkillForm';

export default ProfileSkillForm;
