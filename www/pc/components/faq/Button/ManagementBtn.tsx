import React from 'react';
import styled from 'styled-components';
import Router from 'next/router';
import Button from '../../inputs/Button';
import {$FONT_COLOR, $WHITE} from '../../../styles/variables.types';
import {staticUrl} from '../../../src/constants/env';

interface Props {
  className?: string;
}

const StyledButton = styled(Button)`
  img {
    position: relative;
    top: 1px;
    left: 1px;
    width: 12px;
  }
`;

const ManagementBtn: React.FC<Props> = ({className}) => (
  <StyledButton
    className={className}
    size={{
      width: '320px',
      height: '47px'
    }}
    border={{
      radius: '4px'
    }}
    backgroundColor={$FONT_COLOR}
    font={{
      size: '14px',
      color: $WHITE
    }}
    onClick={() => Router.push('/user/faq')}
  >
    나의 FAQ 관리
    <img
      src={staticUrl('/static/images/icon/arrow/icon-arrow-gray.png')}
      alt="관리페이지로 이동"
    />
  </StyledButton>
);

export default React.memo(ManagementBtn);
