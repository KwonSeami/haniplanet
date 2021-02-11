import * as React from 'react';
import styled from 'styled-components';
import {ParsedUrlQuery} from 'querystring';
import MeetupPlaceItem from './MeetupPlaceItem';
import {LINE_TYPE} from '../../../../src/constants/meetup';
import {$POINT_BLUE} from '../../../../styles/variables.types';

const MeetupPlaceListDiv = styled.div`
  position: absolute;
  top: 4px;
  left: 0;

  .button {
    margin-right: 8px;

    &.on {
      color: ${$POINT_BLUE};
      border-color: ${$POINT_BLUE};
    }
  }
`;

interface Props {
  query: ParsedUrlQuery;
}

const MeetupPlaceList: React.FC<Props> = ({query}) => (
  <MeetupPlaceListDiv>
    {LINE_TYPE.map(({label, value}) => (
      <MeetupPlaceItem
        key={value}
        query={query}
        value={value}
        label={label}
      />
    ))}
  </MeetupPlaceListDiv>
);

export default React.memo(MeetupPlaceList);
