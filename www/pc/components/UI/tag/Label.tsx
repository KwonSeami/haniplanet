// 정윤재 작업 - 피드의 타입을 나타내는 태그입니다.
// 피드의 오른쪽 상단에 사용되며 전체공개, 익명 등이 이에 속합니다.
import * as React from 'react';
import styled from 'styled-components';
import {fontStyleMixin, heightMixin} from '../../../styles/mixins.styles';

interface Props extends Pick<ITag, 'name'> {
  color: string;
  borderColor?: string;
  className?: string;
}

const Span = styled.span<Pick<Props, 'color' | 'borderColor'>>`
  display: inline-block;
  vertical-align: middle;
  ${heightMixin(20)};
  padding: 0 6px;
  ${props => props.color && fontStyleMixin({
    size: 10,
    weight: '600',
    color: `${props.color}`
  })};
  border: 1px solid ${({color, borderColor}) => borderColor || color};
  border-radius: 10px;
  box-sizing: border-box;
`;

const Label = ({name, color, borderColor, className}: Props) => (
  <Span
    className={`label ${className}`}
    color={color}
    borderColor={borderColor}
  >
    {name}
  </Span>
);

export default Label;