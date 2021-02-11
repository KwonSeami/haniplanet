import * as React from 'react';
import styled from 'styled-components';
import {$WHITE, $BORDER_COLOR} from '../../../styles/variables.types';
import Button from '../../inputs/Button/ButtonDynamic';
import {radiusMixin} from '../../../styles/mixins.styles';
import {staticUrl} from '../../../src/constants/env';

const Div = styled.div`
  position: absolute;
  min-width: 240px;
  min-height: 100px;
  z-index: 2;
  padding: 12px 15px;
  margin-top: 12px;
  ${radiusMixin('7px', $BORDER_COLOR)};
  background-color: ${$WHITE};
  box-shadow: 1px 2px 7px 0 rgba(0, 0, 0, 0.11);

  ul.buttons {
    position: absolute;
    bottom: 15px;
    right: 15px;
    
    li {
      display: inline-block;
      margin-left: 6px;

      button {
        img {
          width: 15px;
          margin-right: 2px;
          vertical-align: middle;
        }
      }
    }
  }
`;

interface Props {
  children: React.ReactNode;
  hasResetBtn?: boolean;
  onClickResetBtn?: () => void;
  rightBtnText?: string;
  onClickRightBtn?: () => void;
  className?: string;
}

const HospitalButtonGroupWrapper = React.memo<Props>(({
  children,
  hasResetBtn,
  onClickResetBtn,
  rightBtnText = '등록',
  onClickRightBtn,
  className
}) => {
  return (
    <Div className={className}>
      {children}
      <ul className="buttons">
        {hasResetBtn && (
          <li>
            <Button
              font={{size: '14px'}}
              size={{width: '80px', height: '32px'}}
              border={{width: '1px', radius: '0', color: $BORDER_COLOR}}
              backgroundColor={$WHITE}
              onClick={onClickResetBtn}
            >
              <img
                src={staticUrl('/static/images/icon/icon-refresh-on.png')}
                alt="초기화"
              />
              초기화
            </Button>
          </li>
        )}
        <li>
          <Button
            className="right-btn"
            border={{radius: '0'}}
            font={{size: '14px', color: $WHITE}}
            size={{width: '80px', height: '32px'}}
            backgroundColor="#499aff"
            onClick={onClickRightBtn}
          >
            {rightBtnText}
          </Button>
        </li>
      </ul>
    </Div>
  );
});

export default HospitalButtonGroupWrapper;
