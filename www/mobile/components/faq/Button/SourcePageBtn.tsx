import React from 'react';
import Button from '../../inputs/Button';
import {$WHITE} from '../../../styles/variables.types';
import A from '../../UI/A';

interface Props {
  url: string;
  className?: string;
}

const SourcePageBtn: React.FC<Props> = ({url, className}) => (
  <A
    to={url}
    newTab
    className={className}
  >
    <Button
      size={{
        width: '232px',
        height: '40px'
      }}
      border={{
        radius: '24px'
      }}
      backgroundColor="#499aff"
      font={{
        size: '15px',
        color: $WHITE
      }}
    >
      출처 홈페이지에서 확인하기
    </Button>
  </A>
);

export default React.memo(SourcePageBtn);
