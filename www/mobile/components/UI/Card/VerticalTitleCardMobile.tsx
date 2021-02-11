import * as React from 'react';
import styled from 'styled-components';
import TitleCard from '../../UI/Card/TitleCard';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$TEXT_GRAY} from '../../../styles/variables.types';

const StyledVerticalTitleCard = styled(TitleCard)`
  position: relative;
  padding: 10px 0 30px;
  max-width: 680px;

  @media screen and (max-width: 680px) {
    padding: 10px 15px 15px;
  }
`;

const H2 = styled.h2`
  position: relative;
  padding: 4px 0 10px;
  ${fontStyleMixin({
    size: 17,
    weight: 'normal'
  })};

  span {
    display: block;
    padding-top: 2px;
    ${fontStyleMixin({
      size: 12,
      color: '#ea6060'
    })}

    &.msg {
      color: ${$TEXT_GRAY};
    }
    
    @media screen and (max-width: 680px) {
      display: inline-block;
      vertical-align: middle;
      margin: -6px 0 0 2px;
    }
  }
`;

const VerticalTitleCardMobile = ({className, title, errormsg, msg, children}: Props) => (
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

export default VerticalTitleCardMobile;
