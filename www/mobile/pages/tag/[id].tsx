import * as React from 'react';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import Button from '../../components/inputs/Button';
import Feed from '../../components/Feed/index';
import StoryMobile from '../../components/story/StoryMobile';
import useLocation from '../../src/hooks/router/useLocation';
import {fetchTag} from '../../src/reducers/orm/tag/tagReducer';
import {makeFeedKey} from '../../src/lib/feed';
import {btnMixin, fontStyleMixin, radiusMixin} from '../../styles/mixins.styles';
import {pickTagSelector} from '../../src/reducers/orm/tag/selector';
import {numberWithCommas} from '../../src/lib/numbers';
import {BASE_URL, staticUrl} from '../../src/constants/env';
import cn from 'classnames';
import {
  $BORDER_COLOR,
  $LIGHT_BLUE,
  $POINT_BLUE,
  $WHITE,
  $GRAY,
  $TEXT_GRAY,
  $FONT_COLOR,
  $FLASH_WHITE,
} from '../../styles/variables.types';
import OGMetaHead from "../../components/OGMetaHead";
import {followTag} from "../../src/reducers/orm/tag/thunks";
import WholeBlueFollowButton from "../../components/WholeBlueFollowButton";
import WriteStory from '../../components/Feed/write/writeStory/WriteStory';
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import SearchInput from '../../components/UI/SearchInput';
import {throttle} from 'lodash'
import FeedTheme from '../../components/Feed/FeedTheme';
import {Waypoint} from 'react-waypoint';
import {RootState} from "../../src/reducers";
import {setLayout, clearLayout} from '../../src/reducers/system/style/styleReducer';
import loginRequired from "../../hocs/loginRequired";
import userTypeRequired from "../../hocs/userTypeRequired";

const TagFeedDiv = styled.div`
  padding-bottom: 150px;
  border-bottom: 10px solid #f2f3f7;
  
  .tag-title {
    border-bottom: 1px solid #eee;

    div {
      position: relative;
      max-width: 680px;
      margin: auto;
      padding: 11px 0;

      h2 {
        ${fontStyleMixin({
          size: 18, 
          weight: 'bold'
        })};

        p {
          margin-top: 6px;
          ${fontStyleMixin({
            size: 14,
            color: '#999'
          })};
          opacity: 0.8;
        }
      }

      .whole-blue-follow-button {
        position: absolute;
        top: 11px;
        right: 0;
      }
    }

    @media screen and (max-width: 680px) {
      padding: 0 15px;
    }
  }

  > div:nth-child(2) {
    position: relative;
    max-width: 680px;
    margin: auto;

    .tag-feed-title {
      position: relative;
      padding-top: 15px;
      background-color: ${$WHITE};
      
      .whole-blue-follow-button {
        position: relative;
        float: right;
        bottom: 12px;
        right: 15px;
        padding: 4px 13px;
      }
      
      & > h2 {
        max-height: 90px;

        span {
          background: linear-gradient(transparent 50%, ${$LIGHT_BLUE} 50%);
          ${fontStyleMixin({
            size: 24,
            weight: '300'
          })};
        }
      }

      .new-meetup-btn {
        margin-top: -5px;

        p {
          padding-bottom: 6px;
          text-align: center;
          ${fontStyleMixin({
            size: 12, 
            weight: '600'
          })};
        }
      }
      
      @media screen and (max-width: 680px) {
        padding: 15px 15px 0;
      }
    }

    .search-input {
      height: auto;
    }

    .Write-story {
      margin-top: 0;
    }
    
    & > .follow-count {
      margin: 10px 0;
      display: inline-block;
      ${fontStyleMixin({
        size: 13,
        weight: 'bold'
      })};

      span {
        ${fontStyleMixin({
          color: $POINT_BLUE,
          weight: 'bold'
        })};
      }

      @media screen and (max-width: 680px) {
        margin: 10px 0 10px 15px;
      }
    }

    .seminar-category-list {
      height: 22px;
      padding-bottom: 10px;
      text-align: center;

      li {
        float: left;
        margin: 2.5px;
        border-radius: 0;
        background-color: ${$FLASH_WHITE};
    
        button {   
          ${btnMixin(50, 22, 11, 'bold', null, $TEXT_GRAY)};
          &:hover {
            color: ${$GRAY};
          }
        }

        .on {
          &.total {
            ${radiusMixin('0', $GRAY)};
            color:${$FONT_COLOR};
          }
          &.ongoing {
            background-color: ${$POINT_BLUE};
            color: ${$WHITE};
            border-radius: 0;
          }
          &.deadline {
            background-color: ${$FONT_COLOR};
            color: ${$WHITE};
            border-radius: 0;
          }
          &.tobe {
            background-color: ${$POINT_BLUE};
            color: ${$WHITE};
            border-radius: 0;
          }
          &.end {
            background-color: ${$TEXT_GRAY};
            color: ${$WHITE};
            border-radius: 0;
          }
        }
      }

      @media screen and (max-width: 680px) {
        padding: 0 0 10px 10px;
      }
    }
  }
`;

const StyledFeed = styled(Feed)`
  border-top: 10px solid #f2f3f7;
`;

const TagMobile = React.memo(() => {
  const [realId, setRealId] = React.useState(null);
  const {history, location: {pathname}} = useLocation();
  const {query: {id: queryId}} = useRouter();
  const _fetchURI = `${BASE_URL}/tag/${queryId}/story/`;

  const dispatch = useDispatch();
  const {count, access, tag, user} = useSelector(
    ({feed, orm, system: {session: {access}}}: RootState) => ({
      access,
      tag: pickTagSelector(realId)(orm) || {},
      count: (feed[makeFeedKey(pathname)] || {}).count,
      user: pickUserSelector(queryId)(orm)
    }),
    shallowEqual,
  );

  React.useEffect(() => {
    dispatch(fetchTag(queryId, ({id: _id}) => setRealId(_id)));
  }, [queryId]);

  React.useEffect(() => {
    if (tag.name) {
      dispatch(setLayout(tag.name));
    }

    return () => {
      dispatch(clearLayout());
    }
  }, [tag.name]);

  const [q, setQ] = React.useState('');
  const [fetchURI, setFetchURI] = React.useState(_fetchURI);
  const [viewUIFixed, setViewUIFixed] = React.useState(true);
  const throttledSetFetchURI = React.useCallback(throttle(setFetchURI, 700), []);

  const isHani = React.useMemo(() => (tag.name || '').includes('함께 만드는 한의플래닛'), [tag]);
  const isMeetup = React.useMemo(() => ['세미나', '모임'].some(item => (tag.name || '').includes(item)), [tag]);
  const isCounsel = React.useMemo(() => (tag.name || '').includes('온라인 상담'), [tag]);
  const isConsultant = React.useMemo(() => user && user.user_type === 'consultant', [user]);
  const isJob = React.useMemo(
    () => ['구인', '구직'].some(item => (tag.name || '').includes(item)),
    [tag.name]
  );
  const isAffiliated = React.useMemo(() => (tag.name || '').includes('제휴서비스'), [tag.name]);

  return (
    <TagFeedDiv>
      <OGMetaHead title={tag.name}/>
      <div className="tag-title">
        <div>
          <h2>
            {tag.name}
            {isHani && (
              <p>말하는 대로, 꿈꾸는 대로</p>
            )}
            {isMeetup && (
              <p>나누면 나눌수록 깊어지는 지식의 숲</p>
            )}
            {isJob && (
              <p>새로운 만남, 새로운 시작</p>
            )}
            {isAffiliated && (
              <p>한의플래닛과 함께라서 더 좋은 서비스</p>
            )}
          </h2>
          {!!count && (
            <>
              <WholeBlueFollowButton
                is_follow={tag.is_follow}
                onClick={() => dispatch(followTag(tag.id))}
              />
            </>
          )}
        </div>
      </div>
      <div>
        <Waypoint
          topOffset={55}
          onEnter={() => setViewUIFixed(false)}
          onLeave={() => setViewUIFixed(true)}
        >
          {(tag.name && (!isCounsel && !(isCounsel && !!access)) && !isConsultant) && (
            <div className="tag-feed-title">
              {(tag.name && !isConsultant) && (
                <WriteStory
                  url="/story/new"
                  queryParams={{defaultTagId: tag.id}}
                />
              )}
              <SearchInput
                value={q}
                onChange={({target: {value}}) => {
                  setQ(value);
                  throttledSetFetchURI(`${_fetchURI}?q=${value}`);
                }}
                placeholder={`${tag.name} 내 상세 검색`}
              />
            </div>
          )}
        </Waypoint>
        {!!count && (
          <>
            <p className="follow-count">
              <span>{`${numberWithCommas(count)}건`}</span>의 태그 검색결과
            </p>
            <FeedTheme className={cn({fixed: viewUIFixed})} />
          </>
        )}
      </div>
        <div className="styled-feed-wrapper">
          <StyledFeed
            fetchURI={fetchURI}
            component={StoryMobile}
          />
        </div>
    </TagFeedDiv>
  );
});

TagMobile.displayName = 'TagListMobile';

export default loginRequired(
  userTypeRequired(
    React.memo(TagMobile),
    ['doctor', 'student']
  )
);
