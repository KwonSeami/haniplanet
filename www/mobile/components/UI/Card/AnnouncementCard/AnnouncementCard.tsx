/*
 * 작업: 정윤재
 * 제플린 - 피드에서 각 아이템(?)들의 상단에 위치하는 Card 컴포넌트입니다.
 * TitleCard 컴포넌트를 반환하며, 다른 점은 name이라는 객체 props를 받는다는 점 입니다.
 * Weekly Topic, 한의학 NEWS, Weekly Card, Story 컴포넌트에서 사용됩니다.
 */
import * as React from 'react';
import TitleCard from '../TitleCard';
import Link from 'next/link';
import styled from 'styled-components';
import {$POINT_BLUE} from '../../../../styles/variables.types';
import {inlineBlockMixin} from '../../../../styles/mixins.styles';
import {staticUrl} from '../../../../src/constants/env';

interface Props {
  name?: string;
  sub?: {
    text: string;
    to: string;
  };
  children: React.ReactNode;
  className?: string;
}

const StyledTitleCard = styled(TitleCard)`
  margin-top: 35px;
`;

const H2 = styled.h2`
  padding: 10px 0 16px;
  font-size: 12px;

  span {
    padding-right: 9px;
    color: ${$POINT_BLUE};
    font-weight: bold;
    letter-spacing: 0;
  }

  img {
    ${inlineBlockMixin(11)};
    margin-top: -2px;
  }
`;

const AnnouncementCard: React.SFC<Props> = React.memo(({
  name,
  className,
  sub: {text, to},
  children
}) => (
  <StyledTitleCard
    className={className}
    title={name && (
      <H2>
        <Link href={to}>
          <a>
            <span>{name}</span>
            {text}
            <img
              src={staticUrl('/static/images/icon/arrow/icon-mini-shortcuts.png')}
              alt={`${text} 바로가기`}
            />
          </a>
        </Link>
      </H2>
    )}
  >
    {children}
  </StyledTitleCard>
));

export default AnnouncementCard;
