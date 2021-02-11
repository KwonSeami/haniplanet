import * as React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';

interface Props {
  className?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  isRequired?: boolean;
  isSubtitle?: boolean;
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

  .required {
    display: inline-block;
    vertical-align: top;
    margin: -3px 0 0 3px;
    ${fontStyleMixin({
      size: 11,
      weight: 'bold',
      color: '#f32b43'
    })}
  }
`;

export const Div = styled.div`
  padding-left: 93px;
  position: relative;
`;

const ResponsiveLi = React.memo<Props>(
  ({className, title, subtitle, children, isRequired, isSubtitle}) => (
    <Li className={cn(className, 'responsive-li')}>
      <H3 className="title">
        {title}
        {isRequired && <span className="required">*</span>}
        {isSubtitle && <p className="subtitle">{subtitle}</p>}
      </H3>
      <Div className="clearfix">{children}</Div>
    </Li>
  )
);

export default ResponsiveLi;
