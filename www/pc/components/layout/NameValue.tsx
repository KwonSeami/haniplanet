// 이름과 경로 수정이 반드시 필요합니다..빠른 작업을 위해 일단 이렇게 이름지었습니다.

import * as React from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  children: React.ReactNode;
  name: string;
}

// 임시 스타일 줬습니다.
const Strong = styled.strong`
  font-size: 11px;
  color: #333;
  font-weight: bold;
`;

const NameValue: React.SFC<Props> = React.memo(({
  className,
  children,
  name
}) => (
  <div className={className}>
    <strong>{name}</strong>
    {children}
  </div>
));

export default NameValue;