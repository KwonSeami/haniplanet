import * as React from 'react';
import styled from 'styled-components';
import {$WHITE, $BORDER_COLOR} from '../../../styles/variables.types';

export interface TitleCardProps {
  className?: string;
  title?: React.ReactNode;
  children: React.ReactNode;
}

const Article = styled.article`
  position: relative;
  background-color: ${$WHITE};
  border-top: 1px solid ${$BORDER_COLOR};
`;

/**
 * 작업자: 임용빈
 * todo: 해당 부분 box layout으로 변경
 * 주의: TitleCard 컴포넌트는 최소한의 스타일만 포함하도록 해주세요
 * @param param0 
 */
const TitleCard = ({className, title, children}: TitleCardProps) => (
  <Article className={className}>
    {title && title}
    {children}
  </Article>
);

export default TitleCard;