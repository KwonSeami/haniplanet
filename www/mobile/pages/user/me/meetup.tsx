import * as React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import queryString from 'query-string';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import {useSelector, shallowEqual} from 'react-redux';
import MeetupList from '../../../components/user/meetup/MeetupList';
import {makeFeedKey} from '../../../src/lib/feed';
import {numberWithCommas} from '../../../src/lib/numbers';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import {BASE_URL} from '../../../src/constants/env';
import {$FONT_COLOR, $BORDER_COLOR, $POINT_BLUE} from '../../../styles/variables.types';
import {CountSelectWrapper, StyledSelectBox} from '../../../components/meetup/MeetupCommon';
import {MENU_LIST, MEETUP_STATUS_LIST, MY_CLASS_STATUS, APPLY_TYPE_LIST, LINE_TYPE, CATEGORY_TYPE_LIST} from '../../../src/constants/meetup';

const Div = styled.div`
  .menu-tab {
    border-bottom: 1px solid ${$BORDER_COLOR};
    overflow-x: auto;
    white-space: nowrap;
    
    ul {
      max-width: 680px;
      margin: 0 auto;
    }
  }

  @media screen and (max-width: 680px) {
    .menu-tab {
      ul {
        padding: 0 15px;
      }
    }
  }
`;

const StoryTopTitle = styled.div`
  border-bottom: 1px solid #eee;
  
  h2 {
    max-width: 680px;
    margin: 0 auto;
    padding: 11px 0 10px;
    ${fontStyleMixin({
      weight: 'bold',
      color: $FONT_COLOR,
    })}
  
    @media screen and (max-width: 680px) {
      padding: 11px 15px 10px;
    }
  }
`;

const MenuLi = styled.li<{on?: boolean;}>`
  display: inline-block;
  vertical-align: middle;
  padding: 14px 0;
  font-size: 0;

  & ~ li {
    margin-left: 15px;
  }

  &.on {
    span {
      ${fontStyleMixin({
        weight: 'bold',
        color: $FONT_COLOR
      })};

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        border-bottom: 1px solid ${$POINT_BLUE};
      }
    }
  }

  span {
    position: relative;
    ${fontStyleMixin({
      size: 16,
      color: '#999'
    })};
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

const meetupTypeReduecer = (state, action) => {
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
  const [meetupType, dispatchMeetupType] = React.useReducer(meetupTypeReduecer, INITIAL_MEETUP_TYPE);
  const {meetup_status, apply_status, onclass_status, place, category} = meetupType;

  const meetupFilterOnChange = (key: string, value: string) => {
    dispatchMeetupType({type: 'SET', key, value});
    setCurrentPage(1);
  };

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
    <Div>
      <StoryTopTitle>
        <h2>나의 세미나/모임 활동</h2>
      </StoryTopTitle>
      <div className="menu-tab">
        <ul>
          {MENU_LIST.map(({name, value}) => {
            return(
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
            )
          })}
        </ul>
      </div>
      <CountSelectWrapper>
        <p className="list-count">
          <span>{`${numberWithCommas(count)}건`}</span>의 세미나/모임
        </p>
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
              disabled={pending}
              placeholder="카테고리"
              onChange={category => {
                meetupFilterOnChange('category', category);
              }}
            />
          </div>
        )}
      </CountSelectWrapper>
      {fetchURI && (
        <MeetupList
          fetchURI={fetchURI}
          currentPage={currentPage}
          handleChangePage={page => {
            setCurrentPage(page);
          }}
        />
      )}
    </Div>
  )
});

Meetup.displayName = 'Meetup';
export default Meetup;