import * as React from 'react';
import Button from '../../inputs/Button/ButtonDynamic';
import {staticUrl} from '../../../src/constants/env';
import isEmpty from 'lodash/isEmpty';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from '../../../src/reducers';
import styled from 'styled-components';
import SelectBox, {Select} from '../../inputs/SelectBox';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$POINT_BLUE, $BORDER_COLOR, $FONT_COLOR} from '../../../styles/variables.types';
import {LEVEL} from '../../../src/constants/profile';
import StyledButton from '../style/StyledButton';
import cn from 'classnames';

type ToolForm = TProfileFormParamsExceptId<IProfileTool>;

interface Props extends Partial<IProfileTool>, IProfileFormCommonProps<ToolForm> {
  className?: string;
}

const StyledSelectBox = styled(SelectBox)`
  width: 115px;
  display: inline-block !important;
  vertical-align: top;
  margin-right: 15px;
`;

export const ToolFormDiv = styled.div`
  position: relative;
  padding-bottom: 10px;

  .btn-delete {
    position: absolute;
    top: 4px;
    left: -66px;
    background-color: #f9f9f9;

    img {
      width: 35px;
    }
  }

  h3 {
    display: inline-block;
    vertical-align: middle;
    padding: 14px 8px 0 0;
    ${fontStyleMixin({
      size: 11,
      weight: 'bold'
    })}
  }

  li {
    display: inline-block;
    vertical-align: middle;
  }

  .skill {
    display: inline-block;
    vertical-align: top;

    li {
      padding-right: 34px;
  
      ${Select} {
        margin: 0;
      }
    }
  }

  .btn-group {
    display: inline-block;
    text-align: right;
    padding: 4px 2px 0;
    float: right;

    li {
      position: relative;
      display: block;
      margin-bottom: 18px;

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
  }, [level, _tool, toolData]);

  if (isEmpty(toolData) || (type === 'EDIT' && _tool === undefined)) {
    return null;
  }

  return (
    <ToolFormDiv className={cn(className, 'clearfix')}>
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
          onClick={() => onDeleteForm(id)}
        >
          <img
            src={staticUrl('/static/images/icon/icon-delete-minus.png')}
            alt="삭제하기"
          />
        </StyledButton>
      )}
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
      <ul className="btn-group">
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
              src={staticUrl("/static/images/icon/icon-save-circle.png")}
              alt="저장하기"
            />
            저장
          </Button>
        </li>
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
      </ul>
    </ToolFormDiv>
  );
});

ProfileToolForm.displayName = 'ProfileToolForm';

export default ProfileToolForm;
