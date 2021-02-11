import React from 'react';
import styled from 'styled-components';
import Button from '../../inputs/Button';
import cn from 'classnames';
import {$WHITE} from '../../../styles/variables.types';
import {staticUrl} from '../../../src/constants/env';
import A from '../../UI/A';

const DoctalkLinkBtn = styled(Button)`
  img {
    width: 57px;
    height: 10px;
    margin: -2px 3px 0 0;
    vertical-align: middle;
  }
`;

interface Props {
  text?: string;
  className?: string;
}

const DoctalkButton = React.memo<Props>(({
  text = '연동하기',
  className
}) => {

  return (
    <A
      to="http://bit.ly/38Y8Si4"
      newTab
    >
      <DoctalkLinkBtn
        className={cn('doctalk-link-btn', className)}
        size={{
          width: '100%',
          height: '35px'
        }}
        border={{
          radius: '0'
        }}
        font={{
          size: '12px',
          weight: 'bold',
          color: $WHITE
        }}
        backgroundColor="#00b430"
      >
        <img
          src={staticUrl('/static/images/logo/img-doctalk-logo.png')}
          alt="닥톡 로고"
        />
        {text}
      </DoctalkLinkBtn>
    </A>
  );
});

DoctalkButton.displayName = 'DoctalkButton';
export default DoctalkButton;
