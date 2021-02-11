import * as React from 'react';
import Router from 'next/router';
import {fireEvent} from '@testing-library/react';
import MeetupHeader from '../../../meetup/main/MeetupHeader';
import {renderWithRedux} from '../../../../src/lib/test';
import {createMeetupUrl} from "../../../../src/lib/meetup";

describe('MeetupHeader Component', () => {
  Router.push = jest.fn();

  it('searchInput', () => {
    const defaultQuery = {};
    const inputValue = '123';

    const {getByPlaceholderText} = renderWithRedux(<MeetupHeader />, {});
    const searchInput = getByPlaceholderText('세미나/모임 내 상세검색');

    const nextUrl = createMeetupUrl(defaultQuery, {page: 1, q: inputValue});

    // onChange 테스트
    fireEvent.change(searchInput, {target: {value: inputValue}});
    expect(searchInput).toHaveAttribute('value', inputValue);

    // Enter Key Press 테스트
    fireEvent.keyPress(searchInput, { key: "Enter", code: 13, charCode: 13 });
    expect(Router.push).toHaveBeenCalled();
    expect(Router.push).toHaveBeenCalledWith(nextUrl, nextUrl, {shallow: true});
  });
});
