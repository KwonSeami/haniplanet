import * as React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';

interface Props {
  className?: string;
  title?: React.ReactNode;
  children: React.ReactNode;
}

const Li = styled.li`
  position: relative;
  padding-bottom: 10px;
`;

export const H3 = styled.h3`
  position: absolute;
  left: 0;
  top: 12px;

  ${fontStyleMixin({
    size: 11,
    weight: 'bold'
  })}
`;

export const Div = styled.div`
  padding-left: 93px;
  position: relative;
`;

const ResponsiveLi = React.memo<Props>(
  ({className, title, children}) => (
    <Li className={cn(className, 'responsive-li')}>
      <H3 className="title">{title}</H3>
      <Div className="clearfix">{children}</Div>
    </Li>
  )
);

export default ResponsiveLi;
