import React from 'react';
import Button from '../../inputs/Button';
import {$BORDER_COLOR, $GRAY} from '../../../styles/variables.types';
import {staticUrl} from '../../../src/constants/env';

interface Props {
  onClick: () => void;
}

const NewsUrlButton: React.FC<Props> = ({onClick}) => (
  <Button
    size={{
      width: '53px',
      height: '26px'
    }}
    border={{
      width: '1px',
      color: $BORDER_COLOR,
      radius: '4px',
    }}
    font={{
      size: '12px',
      color: $GRAY,
    }}
    onClick={onClick}
  >
    <img
      src={staticUrl('/static/images/icon/icon-gray-share.png')}
      alt="링크"
    />
    URL
  </Button>
);

export default React.memo(NewsUrlButton);
