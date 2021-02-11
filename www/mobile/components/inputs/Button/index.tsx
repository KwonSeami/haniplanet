import * as React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import {$BORDER_COLOR} from '../../../styles/variables.types';

interface IBorder {
  color?: string;
  radius?: string;
  width?: string;
}

interface IFont {
  color?: string;
  size?: string;
  weight?: string;
}

interface ISize {
  width?: string;
  height?: string;
}

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
  variant?: 'text' | 'contained';
  border?: IBorder;
  backgroundColor?: string;
  font?: IFont;
  size?: ISize;
  weight?: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
  type?: string;
}

const StyledButton = styled.button<ButtonProps>`
  ${({variant, backgroundColor, border}) => {
    switch (variant) {
    case 'text':
      return `border: 0;`;
    default:
      return `
        ${border.width ? `border-width: ${border.width}` : ''};
        ${border.color ? `border-color: ${border.color}` : ''};
        ${border.radius ? `border-radius: ${border.radius}` : ''};
        border-style: solid;
        background: ${backgroundColor};
      `;
    }
  }};

  ${({font}) => `
    ${font.color ? `color: ${font.color}` : ''};
    ${font.size ? `font-size: ${font.size}` : ''};
    ${font.weight ? `font-weight: ${font.weight}` : ''};
  `};

  ${({size}) => `
    ${size.width ? `width: ${size.width}` : ''};
    ${size.height ? `height: ${size.height}` : ''};
  `};

  text-align: center;
  box-sizing: border-box;
  
  outline: none;
`;

const Button: React.FC<ButtonProps> = React.memo(({
  className,
  variant,
  border = {
    radius: '6px',
    color: $BORDER_COLOR
  },
  backgroundColor,
  font = {},
  size = {},
  onClick = () => null,
  children,
  type,
  ...props
}) => (
  <StyledButton
    className={cn(className, 'button')}
    variant={variant}
    border={border}
    backgroundColor={backgroundColor}
    font={font}
    size={size}
    onClick={onClick}
    {...props}
  >
    {children}
  </StyledButton>
));

export default Button;
