import * as React from 'react';
import styled from 'styled-components';
import loginRequired from '../../hocs/loginRequired';
import WaypointHeader from '../../components/layout/header/WaypointHeader';
import Meetup2 from '../../components/meetup/Meetup2';
import {BASE_URL} from '../../src/constants/env';
import {numberWithCommas} from '../../src/lib/numbers';
import {StyeldListCount, MeetupMainSelectBox} from '../../components/meetup/pcStyledComp';
import {useSelector, shallowEqual} from 'react-redux';
import {useRouter} from 'next/router';
import {makeFeedKey} from '../../src/lib/feed';
import * as queryString from 'query-string';
import {MEETUP_STATUS_LIST, CATEGORY_TYPE_LIST} from '../../src/constants/meetup';
import {RootState} from '../../src/reducers';
import PaginationFeed from '../../components/Feed/PaginationFeed';
import MeetupPlaceList from "../../components/meetup/main/meetupPlace/MeetupPlaceList";
import MeetupHeader from "../../components/meetup/main/MeetupHeader";
import {changeFirstPageUrl} from "../../src/lib/meetup";
import userTypeRequired from "../../hocs/userTypeRequired";
import useSetPageNavigation from '../../src/hooks/useSetPageNavigation';
import {MAIN_USER_TYPES} from '../../src/constants/users';

const MeetupContent = styled.div`
  position: relative;
  width: 1091px;
  margin: 0 auto;

  .top-wrapper {
    padding-top: 39px;
  }

  .select-wrapper {
    position: relative;
    margin: 15px 0 14px;
    text-align: right;
  }

  .pagination-feed {
    margin: -25px 0 0 -25px;
    
    .feed-item {
      position: relative;
      display: inline-block;
      vertical-align: top;
      width: 254px;
      margin: 25px 0 0 25px;
      
      > li {
        margin: 0;
      }
    }
  }

  .pagination {
    margin: 50px 0 100px;
  }

  .no-content {
    padding: 80px 0 180px;
  }
`;

const Meetup = () => {
  // Router
  const {asPath, query} = useRouter();
  const {q = '', page = 1, place = '', category = '', meetup_status = ''} = query;

  // Variable
  const fetchURI = `${BASE_URL}/meetup/?${
    queryString.stringify({q, page, place, category, meetup_status})}`;

  // REDUX
  const feedCount = useSelector(
    ({feed}: RootState) => (feed[makeFeedKey(asPath)] || {} as any).count || 0,
    shallowEqual,
  );

  useSetPageNavigation('/meetup');

  const meetupHeader = React.useMemo(() => (
    <MeetupHeader query={query} />
  ), [query]);

  const changeCategoryUrl = React.useCallback(category => (
    changeFirstPageUrl(query, {category})
  ), [query]);
  const changeMeetupStatueUrl = React.useCallback(meetup_status => (
    changeFirstPageUrl(query, {meetup_status})
  ), [query]);

  return (
    <WaypointHeader
      themetype="white"
      headerComp={meetupHeader}
    >
      <MeetupContent>
        <div className="top-wrapper">
          <StyeldListCount>
            <span>{`${numberWithCommas(feedCount)}건`}</span>
            의 세미나/모임
          </StyeldListCount>
          <div className="select-wrapper">
            <MeetupPlaceList query={query} />
            <MeetupMainSelectBox
              option={MEETUP_STATUS_LIST}
              value={meetup_status as string}
              placeholder={!meetup_status ? '모집상태' : ''}
              onChange={changeMeetupStatueUrl}
            />
            <MeetupMainSelectBox
              option={CATEGORY_TYPE_LIST}
              value={category as string}
              placeholder={!category ? '카테고리' : ''}
              onChange={changeCategoryUrl}
            />
          </div>
        </div>
        <PaginationFeed
          className="pagination-feed"
          component={Meetup2}
          highlightKeyword={q as string}
          fetchURI={fetchURI}
        />
      </MeetupContent>
    </WaypointHeader>
  )
};

export default loginRequired(
  userTypeRequired(
    Meetup,
    MAIN_USER_TYPES
  )
);
