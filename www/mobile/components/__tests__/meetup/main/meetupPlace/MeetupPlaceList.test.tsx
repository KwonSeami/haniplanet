import * as React from 'react';
import {render} from '@testing-library/react';
import MeetupPlaceList from '../../../../meetup/main/meetupPlace/MeetupPlaceList';
import {LINE_TYPE} from '../../../../../src/constants/meetup';

describe('MeetupPlaceList Component', () => {
  it ('LINE_TYPE 항목이 정상적으로 노출되는지 확인',  async () => {
    const labels = LINE_TYPE.map(({label}) => label);

    const {findByText} = render(
      <MeetupPlaceList query={{query: 'query', q: '1234'}} />
    );

    for (const item of labels) {
      await findByText(item);
    }
  });
});