import React from 'react';
import Button from '../../inputs/Button';
import {$WHITE} from '../../../styles/variables.types';
import A from '../../UI/A';

interface Props {
  url: string;
  className?: string;
}

const NaverKinBtn: React.FC<Props> = ({url, className}) => (
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
      backgroundColor="#6bc56b"
      font={{
        size: '15px',
        color: $WHITE
      }}
    >
      네이버지식iN에서 확인하기
    </Button>
  </A>
);

export default React.memo(NaverKinBtn);
