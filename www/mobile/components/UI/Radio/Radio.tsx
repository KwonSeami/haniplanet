import * as React from 'react';
import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$BORDER_COLOR, $GRAY, $POINT_BLUE} from '../../../styles/variables.types';

interface Props {
  className?: string;
  checked?: boolean;
  children?: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export const Div = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 1px; 
  height: 1px; 
  padding: 0; 
  border: 0 none; 
  margin: 0; 
  position: absolute; 
  left: 0; 
  top: 0; 
  overflow: hidden;
  clip: rect(0 0 0 0);
`;

const Label = styled.label`
  display: block;
  position: relative;
  z-index: 1;
  padding-left: 28px;
  
  ${fontStyleMixin({ size: 15, color: $GRAY })};
`;

export const Span = styled.span<Pick<Props, 'checked'>>`
  display: block;
  position: absolute;
  border: 1px solid ${$BORDER_COLOR};
  border-radius: 50%;
  height: 20px;
  width: 20px;
  top: 0;
  left: 0;
  z-index: 2;
  box-sizing: border-box;

  &::before {
    display: block;
    position: absolute;
    content: '';
    border-radius: 50%;
    height: 6px;
    width: 6px;
    top: 6px;
    left: 6px;

    ${({checked}) => checked && `
      background-color: ${$POINT_BLUE};
    `}
  }
`;

const Radio: React.FC<Props> = React.memo(
  ({className, children, checked, onClick}) => (
    <Div
      className={`radio ${className}`}
      onClick={onClick}
    >
      <Input type="radio" />
      <Label>
        {children}
      </Label>
      <Span checked={checked} />
    </Div>
  )
);

Radio.displayName = 'Radio';
export default Radio;
