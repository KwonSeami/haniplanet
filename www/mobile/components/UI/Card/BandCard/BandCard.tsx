import * as React from 'react';
import TitleCard from '../TitleCard';
import styled from 'styled-components';
import {fontStyleMixin} from '../../../../styles/mixins.styles';

interface Props {
  title: string;
  className?: string;
  children: React.ComponentType | React.ReactNode;
}

const StyledTitleCard = styled(TitleCard)`
  padding: 30px 0 50px; 

  & > h2 {
    padding-bottom: 18px;
    ${fontStyleMixin({
      size: 23,
      weight: '300'
    })}
  }
`;

const BandCard: React.SFC<Props> = React.memo(({
  title,
  className,
  children
}) => (
  <StyledTitleCard
    className={className}
    title={(
      <h2>{title}</h2>
    )}
  >
    {children}
  </StyledTitleCard>
));

export default BandCard;