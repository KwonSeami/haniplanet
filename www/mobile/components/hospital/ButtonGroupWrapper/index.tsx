import * as React from 'react';
import styled from 'styled-components';
import {$WHITE, $BORDER_COLOR} from '../../../styles/variables.types';
import Button from '../../inputs/Button/ButtonDynamic';
import {staticUrl} from '../../../src/constants/env';

const Div = styled.div`
  min-width: 240px;
  min-height: 100px;

  ul.buttons {
      text-align: center;
      margin-top: 15px;

    li {
      display: inline-block;
      margin: 0 3px;

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
              size={{
                width: '80px',
                height: '32px'
              }}
              border={{
                width: '1px',
                radius: '0',
                color: $BORDER_COLOR
              }}
              font={{
                size: '14px'
              }}
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
            size={{
              width: '80px',
              height: '32px'
            }}
            font={{
              size: '14px',
              color: $WHITE
            }}
            border={{
              radius: '0'
            }}
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
