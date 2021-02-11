import React from 'react';
import Button from '../../inputs/Button';
import {$BORDER_COLOR} from '../../../styles/variables.types';
import {staticUrl} from '../../../src/constants/env';

interface Props {
  onClick: () => void;
}

const PrevButton: React.FC<Props> = ({onClick}) => (
  <Button
    className="prev-btn"
    size={{
      width: '50px',
      height: '30px'
    }}
    border={{
      width: '1px',
      color: $BORDER_COLOR,
      radius: '18px'
    }}
    onClick={onClick}
  >
    <img
      src={staticUrl('/static/images/icon/arrow/icon-arrow-next.png')}
      alt="이전"
    />
  </Button>
);

export default React.memo(PrevButton);
