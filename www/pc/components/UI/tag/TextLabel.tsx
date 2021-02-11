import * as React from 'react';
import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';

interface Props extends Pick<ITag, 'name'> {
  color: string;
  className?: string;
}

const Span = styled.span<Pick<Props, 'color'>>`
  ${props => props.color && fontStyleMixin({
    size: 13,
    color: `${props.color}`
  })};
  box-sizing: border-box;
`;

const TextLabel = ({name, color, className}: Props) => (
  <Span
    className={`label ${className}`}
    color={color}
  >
    {name}
  </Span>
);

export default TextLabel;