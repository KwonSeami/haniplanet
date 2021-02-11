import React from 'react';
import Button from '../../inputs/Button';
import {$WHITE, $FONT_COLOR} from '../../../styles/variables.types';
import {staticUrl} from '../../../src/constants/env';

interface Props {
  onClick: () => void;
}

const NewsUrlButton: React.FC<Props> = ({onClick}) => (
  <Button
    className="news-url-btn"
    size={{
      width: '68px',
      height: '42px'
    }}
    border={{
      radius: '0'
    }}
    font={{
      size: '14px',
      weight: '600',
      color: $WHITE
    }}
    backgroundColor={$FONT_COLOR}
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
