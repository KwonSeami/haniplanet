import * as React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import {backgroundImgMixin, heightMixin} from '../../../styles/mixins.styles';
import {$BORDER_COLOR, $WHITE, $POINT_BLUE} from '../../../styles/variables.types';
import {staticUrl} from '../../../src/constants/env';
import v4 from 'uuid/v4';

const Div = styled.div`
  position:relative;

  Input:checked + Label::before {
    ${backgroundImgMixin({
      img: staticUrl('/static/images/icon/check/icon-checkbox.png'),
      size: '100%'
    })};
    border-color: ${$POINT_BLUE};
  }
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
  position: relative;
  font-size: 14px; 
  padding-left: 25px;

  &::before {
    content: '';
    position: absolute;
    top: 3px;
    left: 1px;
    width: 17px;
    ${heightMixin(17)};
    cursor:pointer;
    border: 1px solid ${$BORDER_COLOR};
    background-color: ${$WHITE};
    box-sizing: border-box;
  }
`;

interface Props {
  name?: string;
  className?: string;
  children?: React.ReactNode;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent) => void;
  id?: string | number;
  disabled?: boolean;
}

const CheckBox = React.memo(React.forwardRef<HTMLInputElement, Props>(
  ({
    name,
    className,
    children,
    checked,
    onChange,
    id,
    disabled
  }, ref) => {
    const useId = id ? String(id) : v4();

    return (
      <Div className={cn('check-box', className)}>
        <Input
          ref={ref}
          id={useId}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
        <Label htmlFor={useId}>
          {children}
        </Label>
      </Div>
    );
  }
));

export default CheckBox;
