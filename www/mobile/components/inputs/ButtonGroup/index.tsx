import * as React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import Button from '../Button/ButtonDynamic';
import {ButtonProps} from '../Button';

export interface IButtonGroupProps {
  className?: string;
  leftButton?: ButtonProps;
  rightButton?: ButtonProps;
}

const Ul = styled.ul`
  text-align: center;

  li {
    display: inline-block;
    vertical-align: middle;
  }
`;

const ButtonGroup: React.FC<IButtonGroupProps> = React.memo(({
  className,
  leftButton,
  rightButton
}) => (
  <Ul className={cn(className, 'button-group')}>
    <li>
      <Button
        className="left-button"
        {...leftButton}
      />
    </li>
    <li>
      <Button
        className="right-button"
        {...rightButton}
      />
    </li>
  </Ul>
));

ButtonGroup.displayName = 'ButtonGroup';
export default ButtonGroup;
