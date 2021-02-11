import * as React from 'react';
import Button from '../../inputs/Button/ButtonDynamic';
import {staticUrl} from '../../../src/constants/env';
import isEmpty from 'lodash/isEmpty';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from '../../../src/reducers';
import styled from 'styled-components';
import {Select} from '../../inputs/SelectBox';
import SelectBox from '../../inputs/SelectBox';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$BORDER_COLOR, $POINT_BLUE} from '../../../styles/variables.types';
import {LEVEL} from '../../../src/constants/profile';
import cn from 'classnames';
import StyledButton from '../style/StyledButton';

type ToolForm = TProfileFormParamsExceptId<IProfileTool>;

interface Props extends Partial<IProfileTool>, IProfileFormCommonProps<ToolForm> {
  className?: string;
}

const StyledSelectBox = styled(SelectBox)`
  width: 113px;
  display: inline-block !important;
  vertical-align: top;
  margin-right: 12px;
`;

export const ToolFormDiv = styled.div`
  position: relative;
  padding-bottom: 10px;

  h3 {
    display: inline-block;
    vertical-align: middle;
    padding: 14px 8px 0 0;
    ${fontStyleMixin({
      size: 11,
      weight: 'bold'
    })};
  }

  li {
    display: inline-block;
    vertical-align: middle;
  }

  .skill li {
    padding-right: 34px;

    &:last-child {
      padding: 0;
    }

    ${Select} {
      margin: 0;
    }
  }

  .btn-delete {
    position: absolute;
    top: 12px;
    right: 0;

    img {
      width: 35px;
    }
  }

  .btn-group {
    text-align: center;
    margin-top: 10px;

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
`;

const ProfileToolForm: React.FC<Props> = React.memo(({
  tool: _tool,
  level,
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
  const {toolData} = useSelector(({tool}: RootState) => tool, shallowEqual);
  const [tool, setTool] = React.useState({level: '', tool: ''});

  React.useEffect(() => {
    setTool({
      level: level || 'high',
      tool: _tool || toolData[0].value
    });
  }, [level, _tool]);

  if (isEmpty(toolData) || (type === 'EDIT' && _tool === undefined)) {
    return null;
  }

  return (
    <ToolFormDiv className={cn('clearfix', className)}>
      <ul className="skill">
        <li>
          <h3>프로그램</h3>
          <StyledSelectBox
            option={toolData}
            value={tool.tool}
            disabled={!controllable}
            onChange={value => {
              setTool(curr => ({
                ...curr,
                tool: value
              }));
            }}
          />
        </li>
        <li>
          <h3>수준</h3>
          <StyledSelectBox
            option={LEVEL}
            value={tool.level}
            disabled={!controllable}
            onChange={value => {
              setTool(curr => ({
                ...curr,
                level: value as TLevel
              }));
            }}
          />
        </li>
      </ul>
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
            onClick={() => {
              if (type === 'ADD') {
                onAddForm(tool as any, () => {
                  alert('저장되었습니다.');

                  setTool({
                    level: 'high',
                    tool: toolData[0].value
                  });
                  onFilterUnSavedForm(id);
                });
              } else {
                onEditForm(id, tool as any, () => {
                  alert('수정되었습니다.');
                });
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
    </ToolFormDiv>
  );
});

ProfileToolForm.displayName = 'ProfileToolForm';

export default ProfileToolForm;