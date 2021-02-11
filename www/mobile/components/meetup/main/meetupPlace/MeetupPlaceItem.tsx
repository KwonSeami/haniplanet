import * as React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import styled from 'styled-components';
import {ParsedUrlQuery} from 'querystring';
import {createMeetupUrl} from '../../../../src/lib/meetup';
import {fontStyleMixin} from '../../../../styles/mixins.styles';
import {$BORDER_COLOR, $POINT_BLUE} from '../../../../styles/variables.types';

const MeetupPlaceItemLi = styled.li`
  display: inline-block;
  ${fontStyleMixin({size: 13, weight: '600', color: '#999'})};

  & ~ li {
    position: relative;
    padding-left: 7px;
    margin-left: 7px;

    &::before {
      content: '';
      position: absolute;
      top: 5px;
      left: 0;
      width: 1px;
      height: 8px;
      background-color: ${$BORDER_COLOR};
    }
  }
  
  a {
    ${fontStyleMixin({size: 13, weight: '600', color: '#999'})};

    &.on {
      color: ${$POINT_BLUE};
      text-decoration: underline;
    }      
  }
`;

interface Props {
  query: ParsedUrlQuery;
  value: string;
  label: string;
}

const MeetupPlaceItem: React.FC<Props> = ({query, value, label}) => {
  const {place = ''} = query;
  const placeMeetupUrl = React.useMemo(() => (
    createMeetupUrl(query, {place: value, page: 1})
  ), [query, value]);

  return (
    <MeetupPlaceItemLi key={value}>
      <Link
        href={placeMeetupUrl}
        as={placeMeetupUrl}
        shallow
      >
        <a className={cn({on: place === value})}>
          {label}
        </a>
      </Link>
    </MeetupPlaceItemLi>
  )
};

export default React.memo(MeetupPlaceItem);