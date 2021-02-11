import * as React from 'react';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import {useRouter} from 'next/router';
import {fontStyleMixin, maxLineEllipsisMixin, heightMixin} from '../../../styles/mixins.styles';
import {$GRAY, $TEXT_GRAY, $POINT_BLUE, $BORDER_COLOR} from '../../../styles/variables.types';
import Loading from '../../../components/common/Loading';
import {BASE_URL, staticUrl} from '../../../src/constants/env';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import {RootState} from '../../../src/reducers';
import OGMetaHead from '../../../components/OGMetaHead';
import {fetchBandThunk} from '../../../src/reducers/orm/band/thunks';
import {InfiniteScrollDiv} from '../../../components/InfiniteScroll/InfiniteScroll';
import OnClassVideoTable from '../../../components/onClass/OnClassVideoTable';
import {pickBandSelector} from "../../../src/reducers/orm/band/selector";
import MoaCategory from "../../../components/moa/category/MoaCategory";
import Avatar from '../../../components/AvatarDynamic';
import MyClassInfo from '../../../components/onClass/MyClassInfo';
import {followUser} from '../../../src/reducers/orm/user/follow/thunks';
import cn from 'classnames';
import Feed from '../../../components/Feed';
import StoryMobile from '../../../components/story/StoryMobile';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import {toFormatSec} from '../../../src/lib/date';
import loginRequired from '../../../hocs/loginRequired';
import {setLayout, clearLayout} from '../../../src/reducers/system/style/styleReducer';
import Link from 'next/link';
import OnClassApi from '../../../src/apis/OnClassApi';
import {MAIN_USER_TYPES} from '../../../src/constants/users';
import userTypeRequired from '../../../hocs/userTypeRequired';

const Section = styled.section`
  padding-bottom: 7px;
  overflow: hidden;
  
  .onclass-guide {
    padding: 14px 0 15px;
    box-sizing: border-box;
    border-bottom: 1px solid ${$BORDER_COLOR};
    
    a {
      display: block;
      max-width: 680px;
      margin: 0 auto;
      ${fontStyleMixin({
        size: 12,
        weight: '600'
      })};
    }

    img {
      width: 18px;
      display: inline-block;
      vertical-align: middle;
      margin: -3px 0 0 1px;
    }
  }

  @media screen and (max-width: 680px) {
    .onclass-guide {
      padding: 14px 13px 15px;
    }
  }
`;

const CategoryDiv = styled.div`
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background-color: ${$BORDER_COLOR};
  }

  @media screen and (max-width: 680px) {
    margin-bottom: 0;
  }
`;

const UserFollowInfo = styled.div`
  position: relative;
  display: inline-block;
  margin-left: 5px;

  div {
    ${heightMixin(20)};
    padding-right: 5px;
    border-radius: 10px;
    box-sizing: border-box;
    ${fontStyleMixin({
      size: 10,
      weight: '600',
    })};

    img {
      width: 6px;
      height: 6px;
      vertical-align: middle;
      margin: -2px 3px 0 4px;
    }

    &.follow-cancel {
      color: #aeaeae;
      border: 1px solid #eee;
      background-color: #eee;
    }

    &.follow-add {
      color: ${$POINT_BLUE};
      border: 1px solid rgba(43, 137, 255, 0.3);
      img {
        width: 8px;
        margin: -2px 2px 0 3px;
      }
    }
  }
`;

const Div = styled.div`
  max-width: 680px;
  margin: auto;
  box-sizing: border-box;
  position: relative;

  > div {
    margin-bottom: 30px;
    padding-bottom: 10px; //피드뷰 UI fixed고정 문제로 margin-bottom: 40px을 나눔

    ${InfiniteScrollDiv} {
      padding: 0;
    }
  }

  .feed-theme {
    margin: -36px 0 0 0;
  }
`;

const StyledFeed = styled(Feed)`
  article {
    padding-bottom: 35px;
  }

  @media screen and (max-width: 680px) {
    article {
      padding-bottom: 0;
    }
  }
`;

const StudySection = styled.section`
  max-width: 680px;
  margin: auto;

  .class-info {
    border-bottom: 8px solid #f2f3f7;
    
    .tutor {
      padding: 15px 0;
      border-bottom: 1px solid ${$BORDER_COLOR};

      a {
        display: inline-block;
      }

      p {
        display: inline-block;
        padding-left: 8px;
        margin-left: 8px;
        border-left: 1px solid #d8d8d8;
        ${fontStyleMixin({
          size: 14,
          weight: '600',
        })};
      }
    }
  }

  .pagination {
    margin: 0 auto;
  }

  @media screen and (max-width: 680px) {
    .class-info {
      border-top: 8px solid #f2f3f7;

      .tutor {
        padding: 15px;
      }
    }
  }
`;

const PLAYER_HEIGHT = 184;

const PlayerWrapper = styled.div`
  padding: 20px 0;
  border-bottom: 8px solid #f2f3f7;

  iframe {
    border: 0;
  }

  .onclass-video {
    position: relative;
    width: 100%;
    height: ${PLAYER_HEIGHT}px;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
    }
  }

  .video-title {
    position: relative;
    margin-top: 15px;

    span {
      position: absolute;
      top: 2px;
      left: 17px;
      ${fontStyleMixin({
        size: 13,
        family: 'Montserrat',
        color: '#999'
      })};
    }

    > div {
      padding-left: 34px;
    }

    h2 {
      ${maxLineEllipsisMixin(14, 1.44, 3)};
      ${fontStyleMixin({
        size: 14,
        weight: '600',
      })};
    }

    p {
      margin-top: 5px;
      ${fontStyleMixin({
        size: 12,
        color: $TEXT_GRAY
      })};
    }
  }

  .video-introduction {
    padding-top: 15px;
    margin-top: 15px;
    border-top: 1px solid #eee;

    p {
      ${fontStyleMixin({
        size: 13,
        color: $GRAY
      })};
    }
  }

  @media screen and (max-width: 680px) {
    padding: 20px 15px;

    .video-title {
      span {
        left: 2px;
      }

      > div {
        padding-left: 19px;
      }
    }
  }
`;

const OnClassDetail = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {query: {slug, id: videoId, ...search}} = router;
  const {timeline: timelineParams} = search;
  const [{
    data: {
      token,
      kollus_custom_key,
      last_play_time,
      story: {
        body,
        content: {order, title, length: videoLength, progress_rate, retrieve_count},
      },
    },
    pending: mediaContentPending,
  }, setMediaContent] = React.useState({
    data: {story: {content: {}}} as any,
    pending: true,
  });

  const {me, band} = useSelector(
    ({system, orm}: RootState) => ({
      me: pickUserSelector(system.session.id)(orm) || {} as any,
      band: pickBandSelector(slug)(orm),
    }),
    shallowEqual,
  );

  const onClassApi: OnClassApi = useCallAccessFunc(access => access && new OnClassApi(access));

  React.useEffect(() => {
    dispatch(fetchBandThunk(onClassApi, slug));
  }, [slug]);

  React.useEffect(() => {
    if (slug && videoId) {
      onClassApi.onclassProgress(slug, {media_content_key: videoId})
        .then(({data: {result}}) => {
          setMediaContent({data: result, pending: false});
        });
    }
    window.scrollTo(0, 0);
  }, [slug, videoId]);

  const {
    name,
    timelines,
    extension,
    band_member_grade,
  } = band || {};

  React.useEffect(() => {
    dispatch(setLayout({
      headerDetail: name,
    }));

    return () => {
      dispatch(clearLayout());
    }
  }, [name]);

  const {
    story,
    remaining_days,
    period_range,
    total_progress_rate,
    total_retrieve_count,
    total_contents_count,
  } = extension || {};

  // Variable
  const {user: owner, receipt_range} = story || {};
  const [isOwnerFollow, setIsOwnerFollow] = React.useState((owner || {}).is_follow || false);

  const lastDate = (band_member_grade === 'normal') ? (period_range || [])[1] : (receipt_range || [])[1];

  const isActive = lastDate && moment(lastDate).isAfter();

  if (isEmpty(band)) {
    return <Loading />
  }

  return (
    <Section>
      <OGMetaHead title={name}/>
      <section className="clearfix">
        <CategoryDiv>
          <MoaCategory
            timelines={timelines}
            mainPageName="강의실"
            isOnClass
          />
        </CategoryDiv>
        <p className="onclass-guide">
          <Link href="/guide">
            <a>
              온라인 강의 이용가이드
              <img
                src={staticUrl('/static/images/icon/icon-help-btn.png')}
                alt="온라인 강의 이용가이드"
              />
            </a>
          </Link>
        </p>
        {timelineParams && (
          <Div>
            <StyledFeed
              fetchURI={timelineParams
                ? `${BASE_URL}/timeline/${timelineParams}/story/`
                : `${BASE_URL}/band/${slug}/story/`
              }
              fetchType="overwrite"
              component={StoryMobile}
            />
          </Div>
        )}
      </section>
      {!timelineParams && (
        <StudySection>
          <div className="class-info">
            <div className="tutor">
              {!isEmpty(owner) && (
                <>
                  <Avatar
                    src={owner.avatar}
                    name={owner.name}
                    userExposeType="real"
                    {...owner}
                  />
                  {(!!owner.name && (owner.id !== me.id)) && (
                    <UserFollowInfo>
                      <div
                        className={cn(isOwnerFollow ? 'follow-cancel' : 'follow-add')}
                        onClick={() => {
                          dispatch(followUser(owner.id, () => setIsOwnerFollow(curr => !curr)));
                        }}
                      >
                        <img
                          src={staticUrl(`/static/images/icon/${isOwnerFollow ? 'plus-gray' : 'check/check-blue-small'}.png`)}
                          alt="팔로우"
                        />
                        팔로우
                      </div>
                    </UserFollowInfo>
                  )}
                </>
              )}
              <p>총 {total_contents_count || 0}강</p>
              <p>조회수 {total_retrieve_count || 0}</p>
            </div>
            {band_member_grade !== 'visitor' && (
              <MyClassInfo
                band_member_grade={band_member_grade}
                periodRange={period_range}
                remainingDay={remaining_days}
                receipt_range={receipt_range}
                total_progress_rate={(total_progress_rate || 0).toFixed(0)}
              />
            )}
          </div>
          {kollus_custom_key && (
            <PlayerWrapper>
              <iframe
                className="onclass-video"
                src={mediaContentPending
                  ? ''
                  : `https://v.kr.kollus.com/s?jwt=${token}&custom_key=${kollus_custom_key}&player_version=v3`}
              />
              <div className="video-title">
                <span>{order + 1}</span>
                <div>
                  <h2>{title}</h2>
                  <p>
                    {toFormatSec(last_play_time)} 수강 중/
                    {(videoLength / 60).toFixed(0)}분&nbsp;·&nbsp;조회&nbsp;{retrieve_count}
                  </p>
                </div>
              </div>
              {!!body && (
                <div className="video-introduction">
                  <p className="pre-wrap">{body}</p>
                </div>
              )}
            </PlayerWrapper>
          )}
          <OnClassVideoTable
            band_member_grade={band_member_grade}
            isActive={isActive}
            video={videoId}
          />
        </StudySection>
      )}
    </Section>
  );
};

export default loginRequired(
  userTypeRequired(
    React.memo(OnClassDetail),
    [...MAIN_USER_TYPES, 'hani']
  )
);
