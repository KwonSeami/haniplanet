import * as React from 'react';
import cn from 'classnames';
import Link from 'next/link';
import {ParsedUrlQuery} from 'querystring';
import Button from '../../../inputs/Button/ButtonDynamic';
import {createMeetupUrl} from '../../../../src/lib/meetup';
import {$BORDER_COLOR} from '../../../../styles/variables.types';

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
    <Link
      href={placeMeetupUrl}
      as={placeMeetupUrl}
      shallow
    >
      <a>
        <Button
          key={value}
          className={cn({on: place === value})}
          size={{width: '70px', height: '32px'}}
          font={{size: '14px', weight: '600', color: '#999'}}
          border={{radius: '0', width: '1px', color: $BORDER_COLOR}}
        >
          {label}
        </Button>
      </a>
    </Link>
  );
};

export default React.memo(MeetupPlaceItem);
