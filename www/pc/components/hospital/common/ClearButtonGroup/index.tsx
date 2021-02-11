import * as React from 'react';
import ClearButtonGroupDiv from './ClearButtonGroupDiv';
import Button from '../../../inputs/Button/ButtonDynamic';
import {staticUrl} from '../../../../src/constants/env';
import {$BORDER_COLOR, $WHITE} from '../../../../styles/variables.types';

interface Props {
  children: React.ReactNode;
  hasResetBtn?: boolean;
  onClickResetBtn?: () => void;
  rightBtnText?: string;
  onClickRightBtn?: () => void;
  className?: string;
}

const ClearButtonGroup: React.FC<Props> = ({
  children,
  hasResetBtn,
  onClickResetBtn,
  rightBtnText = '등록',
  onClickRightBtn,
  className,
}) => (
  <ClearButtonGroupDiv className={className}>
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
  </ClearButtonGroupDiv>
);

export default React.memo(ClearButtonGroup);
