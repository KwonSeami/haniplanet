import * as React from 'react';
import Button from '../../inputs/Button/ButtonDynamic';
import {staticUrl} from '../../../src/constants/env';
import Input from '../../inputs/Input';
import styled from 'styled-components';
import {$BORDER_COLOR, $POINT_BLUE} from '../../../styles/variables.types';
import StyledButton from '../style/StyledButton';
import cn from 'classnames';

type ThesisForm = TProfileFormParamsExceptId<IProfileThesis>;

interface Props extends Partial<IProfileThesis>, IProfileFormCommonProps<ThesisForm> {
  index?: number;
  lastIndex?: number;
  onSwapData?: (currIdx: number, swapIdx: number) => void;
  className?: string;
}

const isValidForm = (currentState: {
  title: string
}): [boolean, string] | ThesisForm => {
  const {title} = currentState;

  if (title === '') {
    return [false, '올바른 명칭을 입력해주세요.'];
  }

  return [true, {
    title
  }];
};

const StyledInput = styled(Input)`
  display: inline-block !important;
  width: calc(100% - 114px);
  height: 44px;
  margin-bottom: 10px;
  border-bottom: 1px solid ${$BORDER_COLOR} !important;
  font-size: 14px;
`;

const Li = styled.li`
  padding-bottom: 10px;

  .btn-group {
    margin-top: 9px;
    text-align: center;

    li {
      position: relative;
      display: inline-block;
      vertical-align: middle;
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

  .btn-updown {
    float: right;
    padding-top: 8px;

    li {
      display: inline-block;
      
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
  }
`;

const ProfileThesisForm: React.FC<Props> = React.memo(({
  title,
  onAddForm,
  onDeleteForm,
  onEditForm,
  onCreateForm,
  onFilterUnSavedForm,
  id,
  type,
  isAddBtnVisible,
  controllable = true,
  index,
  lastIndex,
  onSwapData,
  className
}) => {
  const [thesis, setThesis] = React.useState({
    title: title || ''
  });

  const [warningText, setWarningText] = React.useState('');

  return (
    <Li className={cn('clearfix', className)}>
      <StyledInput
        placeholder="ooo논문"
        value={thesis.title}
        readOnly={!controllable}
        onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
          setThesis(curr => ({
            ...curr,
            title: value
          }));
        }}
      />
      {warningText && (
        <span className="error">{warningText}</span>
      )}
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
              disabled={!isValidForm(thesis)[0]}
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
            disabled={type === 'ADD' && !isValidForm(thesis)[0]}
            onClick={() => {
              const [isValid, result] = isValidForm(thesis);

              if (isValid) {
                if (type === 'ADD') {
                  onAddForm(result, () => {
                    alert('저장되었습니다.');

                    setThesis(curr => ({
                      ...curr,
                      title: ''
                    }));
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
    </Li>
  );
});

ProfileThesisForm.displayName = 'ProfileThesisForm';

export default ProfileThesisForm;
