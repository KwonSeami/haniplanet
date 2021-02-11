import * as React from 'react';
import TitleCard from './TitleCard';
import styled from 'styled-components';
import {$POINT_BLUE} from '../../../styles/variables.types';
import {staticUrl} from '../../../src/constants/env';
import {fontStyleMixin} from '../../../styles/mixins.styles';

export interface NoticeProps {
  label?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const StyledTitleCard = styled(TitleCard)`
  padding-bottom: 0;
`;

export const StoryLabelP = styled.p`
  margin-bottom: -9px;
  padding-top: 10px;
  ${fontStyleMixin({
    size: 12,
    weight: 'bold',
    color: $POINT_BLUE
  })};

  > span {
    font-weight: bold;
  }
  
  img {
    display: inline-block;
    vertical-align: middle;
    margin: -2px 3px 0 0;
    width: 14px;
  }

  @media screen and (max-width: 680px) {
    padding: 15px 15px 0;
    margin-bottom: -11px;
  }
`;

export const NoticeIcon = React.memo(() => (
  <StoryLabelP>
    <img
      src={staticUrl("/static/images/icon/icon-notice2.png")}
      alt="공지사항"
    />
    공지사항
  </StoryLabelP>
));

NoticeIcon.displayName = 'NoticeIcon';

// 스타일 수정이 필요합니다.
const StoryLabelCard: React.ExoticComponent<NoticeProps> = React.memo(({
  label,
  className,
  children
}) => (
  <StyledTitleCard
    className={className}
    title={label}
  >
    {children}
  </StyledTitleCard>
));

export default StoryLabelCard;
