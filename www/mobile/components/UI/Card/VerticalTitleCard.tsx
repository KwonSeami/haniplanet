import * as React from 'react';
import styled from 'styled-components';
import TitleCard from '../../UI/Card/TitleCard';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$TEXT_GRAY} from '../../../styles/variables.types';

const StyledVerticalTitleCard = styled(TitleCard)`
  position: relative;
  padding: 15px 0 30px 188px;
`;

const H2 = styled.h2`
  position: absolute;
  left: 0;
  top: 17px;
  ${fontStyleMixin({
    size: 19,
    weight: '300'
  })};

  span {
    display: block;
    padding-top: 2px;
    ${fontStyleMixin({
      size: 11,
      color: '#ea6060'
    })}

    &.msg {
      color: ${$TEXT_GRAY}
    }
  }
`;

interface Props {
  title: string;
  errormsg?: string;
  msg?: string;
  className?: string;
  children: React.ReactNode;
}

const VerticalTitleCard = ({className, title, errormsg, msg, children}) => (
  <StyledVerticalTitleCard
    className={className}
    title={
      <H2>
        {title}
        {errormsg && (
          <span className="erroemsg">{errormsg}</span>
        )}
        {msg && (
          <span className="msg">{msg}</span>
        )}
      </H2>
    }
  >
    {children}
  </StyledVerticalTitleCard>
);

export default React.memo<Props>(VerticalTitleCard);
