import * as React from 'react';
import cn from 'classnames';
import * as queryString from 'query-string';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import {shallowEqual, useSelector} from 'react-redux';
import MeetupList from '../../../components/user/meetup/MeetupList';
import {makeFeedKey} from "../../../src/lib/feed";
import {numberWithCommas} from '../../../src/lib/numbers';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {MenuLi, MenuUl} from '../../../components/common/Menu';
import {SeminarBanner} from '../../../components/meetup/pcStyledComp';
import {FeedContentDiv, LeftFeed} from '../../../components/search/styleCompPC';
import {StyledSelectBox, StyeldListCount} from '../../../components/meetup/pcStyledComp';
import {BASE_URL} from "../../../src/constants/env";
import {$GRAY, $BORDER_COLOR} from '../../../styles/variables.types';
import Link from 'next/link';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import {MEETUP_STATUS_LIST, MY_CLASS_STATUS, CATEGORY_TYPE_LIST, APPLY_TYPE_LIST, LINE_TYPE, MENU_LIST} from '../../../src/constants/meetup';
import useSetPageNavigation from '../../../src/hooks/useSetPageNavigation';

const StyledFeedContentDiv = styled(FeedContentDiv)`
  position: relative;
  margin-top: 40px;

  .select-wrapper {
    margin-top: 4px;
  }

  .list-title {
    padding: 26px 0 9px;
    border-bottom: 1px solid ${$BORDER_COLOR};

    ul {
      display: flex;
      align-items: center;
      width: 100%;

      li {
        box-sizing: border-box;
        ${fontStyleMixin({
          size: 18,
          weight: '300',
          color: $GRAY
        })};

        & ~ li {
          padding-left: 20px;
          width: 135px;
        }

        &.title-info {
          -ms-flex: 1 auto;
          flex: 1 0 0;
          overflow: hidden;
        }

        &.title-date {
          width: 111px;
        }

        &.title-class {
          width: 123px;
        }

        &.title-state {
          width: 156px;
        }

        &.title-class-state {
          width: 125px;
        }
      }
    }
  }
`;

const Right = styled.div`
  float: right;
  width: 320px;

  ${MenuUl} {
    margin-top: 0;
  }
`;

const PAGE_SIZE = 20;

const INITIAL_MEETUP_TYPE = {
  meetup_status: '',
  apply_status: '',
  onclass_status: '',
  place: '',
  category: '',
};

const meetupTypeReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return {...state, [action.key]: action.value}
  }
};

const Meetup = React.memo(() => {
  
  // Router
  const router = useRouter();
  const {asPath, query: {page_type}} = router;
  
  // State
  const [fetchURI, setFetchURI] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [meetupType, dispatchMeetupType] = React.useReducer(meetupTypeReducer, INITIAL_MEETUP_TYPE);
  const {meetup_status, apply_status, onclass_status, place, category} = meetupType;

  const meetupFilterOnChange = (key: string, value: string) => {
    dispatchMeetupType({type: 'SET', key, value});
    setCurrentPage(1);
  };

  // Custom Hooks
  useSetPageNavigation('/meetup');
  
  // Redux
  const {user: {id: myId}, currentFeed: {count, pending}} = useSelector(
    ({feed, orm, system: {session: {id}}}) => ({
      user: pickUserSelector(id)(orm) || {} as any,
      currentFeed: feed[makeFeedKey(asPath)] || {},
    }),
    shallowEqual,
  );

  React.useEffect(() => {
    const form = {
      page_type,
      page: currentPage,
      meetup_status,
      apply_status,
      onclass_status,
      place,
      category,
      offset: (currentPage - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
    };
    setFetchURI(`${BASE_URL}/user/me/meetup/?${queryString.stringify(form)}`);
    
  }, [currentPage, page_type, meetup_status, apply_status, onclass_status, place, category]);
  
  return (
    <>
      <SeminarBanner>
        <h2>나의 세미나/모임 활동</h2>
      </SeminarBanner>
      <StyledFeedContentDiv className="clearfix">
        <LeftFeed>
          <StyeldListCount>
            <span>{`${numberWithCommas(count)}건`}</span>
            의 세미나/모임
          </StyeldListCount>
          {!!fetchURI && (
            <div className="select-wrapper">
              {(page_type === 'applied') && (
                <StyledSelectBox
                  option={APPLY_TYPE_LIST}
                  value={apply_status as string}
                  placeholder="신청상태"
                  disabled={pending}
                  onChange={apply_status => {
                    meetupFilterOnChange('apply_status', apply_status);
                  }}
                />
              )}
              {(page_type === 'created' || page_type === 'followed') && (
                <StyledSelectBox
                  option={MEETUP_STATUS_LIST}
                  value={meetup_status as string}
                  placeholder="모집상태"
                  disabled={pending}
                  onChange={meetup_status => {
                    meetupFilterOnChange('meetup_status', meetup_status);
                  }}
                />
              )}
              {(page_type === 'onclass') && (
                <StyledSelectBox
                  option={MY_CLASS_STATUS}
                  value={onclass_status as string}
                  placeholder="수강상태"
                  disabled={pending}
                  onChange={onclass_status => {
                    meetupFilterOnChange('onclass_status', onclass_status);
                  }}
                />
              )}
              {page_type !== 'onclass' && (
                <StyledSelectBox
                  option={LINE_TYPE}
                  value={place as string}
                  placeholder="장소 유형"
                  disabled={pending}
                  onChange={place => {
                    meetupFilterOnChange('place', place);
                  }}
                />
              )}
              <StyledSelectBox
                option={CATEGORY_TYPE_LIST}
                value={category as string}
                placeholder="카테고리"
                disabled={pending}
                onChange={category => {
                  meetupFilterOnChange('category', category);
                }}
              />
            </div>
          )}
          <div>
            <div className="list-title">
              <ul>
                <li className="title-info">세미나/모임 정보</li>
                {page_type === 'applied' && (
                  <li className="title-date">신청일자</li>
                )}
                {page_type === 'onclass' && (
                  <li className="title-class">수강 가능일</li>
                )}
                <li
                  className={cn({
                    'title-state': page_type === 'created',
                    'title-class-state': page_type === 'onclass'
                  })}
                >
                  상태
                </li>
              </ul>
            </div>
          </div>
          {fetchURI && (
            <MeetupList
              fetchURI={fetchURI}
              currentPage={currentPage}
              handleChangePage={(page) => {
                setCurrentPage(page);
              }}
            />
          )}
        </LeftFeed>
        <Right>
          <MenuUl>
            {MENU_LIST.map(({name, value}) => (
              <MenuLi
                key={name}
                on={page_type === value}
                className={cn({on: page_type === value})}
              >
                <Link
                  href={`/user/me/meetup?page_type=${value}`}
                  as={`/user/me/meetup?page_type=${value}`}
                >
                  <a>
                    <span>{name}</span>
                  </a>
                </Link>
              </MenuLi>
            ))}
          </MenuUl>
        </Right>
      </StyledFeedContentDiv>
    </>
  )
});

Meetup.displayName = 'Meetup';
export default Meetup;