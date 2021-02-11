import * as React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import {fontStyleMixin, heightMixin} from '../../../styles/mixins.styles';
import {$TEXT_GRAY} from '../../../styles/variables.types';

interface Props {
  name?: string;
  className?: string;
  onClick?: (name: string) => void;
}

const NonStyleGuideLabel = React.memo<Props>(
  (({name, className, onClick}) => (
    <span
      className={classNames('guide-label', className)}
      onClick={() => onClick && onClick(name || '')}
    >
      {name}
    </span>
  )),
);

interface IStyledGuideLabelProps {
  color?: string;
  bgColor?: string;
  borderColor?: string;
  cssText?: string;
}

const GuideLabel = styled(NonStyleGuideLabel)<IStyledGuideLabelProps>`
  display: inline-block;
  vertical-align: middle;
  padding: 0 7px 0 6px;
  border-radius: 10.5px;
  background-color: ${({bgColor}) => bgColor || '#f6f7f9'};
  border: 1px solid transparent;
  ${heightMixin(21)};
  ${fontStyleMixin({size: 12, weight: '600', color: $TEXT_GRAY})}; 
  ${({color}) => !!color && `color: ${color}`};
  ${({borderColor}) => !!borderColor && `border: 1px solid ${borderColor}`}
  ${({cssText}) => cssText}
  box-sizing: border-box;
`;

export default GuideLabel;
