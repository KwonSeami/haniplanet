import * as React from 'react';
import styled from 'styled-components';
import MeetupPlaceItem from './MeetupPlaceItem';
import {ParsedUrlQuery} from 'querystring';
import {LINE_TYPE} from '../../../../src/constants/meetup';

const MeetupPlaceListUl = styled.ul`
  display: inline-block;
  float: right;

  @media screen and (max-width: 680px) {
    padding-right: 15px;
  }
`;

interface Props {
  query: ParsedUrlQuery;
}

const MeetupPlaceList: React.FC<Props> = ({query}) => (
  <MeetupPlaceListUl>
    {LINE_TYPE.map(({label, value}) => (
      <MeetupPlaceItem
        key={value}
        query={query}
        value={value}
        label={label}
      />
    ))}
  </MeetupPlaceListUl>
);

export default React.memo(MeetupPlaceList);