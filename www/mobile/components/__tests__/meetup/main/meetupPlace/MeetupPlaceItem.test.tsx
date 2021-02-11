import * as React from 'react';
import {render} from '@testing-library/react';
import MeetupPlaceItem from '../../../../meetup/main/meetupPlace/MeetupPlaceItem';

describe('MeetupPlaceItem Component', () => {
  it ('pass label, value props', async () => {
    const {findByText} = render(
      <MeetupPlaceItem
        query={{query: 'query', q: '1234'}}
        label="라벨"
        value="값"
      />
    );

    await findByText('라벨');
  });
});