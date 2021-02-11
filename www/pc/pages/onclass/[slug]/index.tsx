import * as React from 'react';
import loginRequired from '../../../hocs/loginRequired';
import styled from 'styled-components';
import {BASE_URL, staticUrl} from '../../../src/constants/env';
import {backgroundImgMixin, fontStyleMixin, heightMixin} from '../../../styles/mixins.styles';
import {$GRAY, $TEXT_GRAY, $BORDER_COLOR, $FONT_COLOR, $POINT_BLUE, $THIN_GRAY, $WHITE} from '../../../styles/variables.types';
import Link from 'next/link';
import Button from '../../../components/inputs/Button';
import cn from 'classnames';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../src/reducers';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import {useRouter} from 'next/router';
import MyClassInfo from '../../../components/onClass/MyClassInfo';
import OnClassNoticeCard from '../../../components/onClass/OnClassNoticeCard';
import {pickBandSelector} from '../../../src/reducers/orm/band/selector';
import {fetchBandThunk, patchBandThunk} from '../../../src/reducers/orm/band/thunks';
import OnClassVideoTable from '../../../components/onClass/OnClassVideoTable';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import {ADMIN_PERMISSION_GRADE} from '../../../src/constants/band';
import Loading from '../../../components/common/Loading';
import OGMetaHead from '../../../components/OGMetaHead';
import Avatar from '../../../components/AvatarDynamic';
import Feed from '../../../components/Feed';
import Story from '../../../components/story/Story';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import {followUser} from "../../../src/reducers/orm/user/follow/thunks";
import useSetPageNavigation from '../../../src/hooks/useSetPageNavigation';
import OnClassApi from '../../../src/apis/OnClassApi';
import userTypeRequired from '../../../hocs/userTypeRequired';
import {MAIN_USER_TYPES} from '../../../src/constants/users';
import OnClassNoticeBoard from '../../../components/onClass/OnClassLeftArea/OnClassNoticeBoard';
import OnClassQABoard from '../../../components/onClass/OnClassLeftArea/OnClassQABoard';
import OnClassRecommendAd from '../../../components/onClass/OnClassRecommendAd';

const DetailTitleDiv = styled.div<{avatar: string;}>`
  width: 1035px;
  margin: 0 auto;
  padding-top: 40px;
  position: relative;
  display: flex;
  -ms-display: flexbox;

  .onclass-thumb-wrapper {
    flex: 0 0 300px;
    -ms-flex: 0 0 300px;
    height: 200px; 
    margin-right: 26px;
    ${({avatar}) => backgroundImgMixin({
      img: avatar || staticUrl('/static/images/icon/onclass-detail-default-avatar.png'),
    })};
  }

  .onclass-info-wrapper {
    -ms-flex: 1 auto;

    h2 {
      box-sizing: border-box;
      line-height: 1.34;
      ${fontStyleMixin({
        size: 29,
        weight: '300'
      })};
    }

    ul {
      margin-top: 10px;

      li {
        position: relative;
        display: inline-block;
        font-size: 13px;
        padding-right: 8px;
        margin-right: 4px;
        vertical-align: middle;

        &::after {
          content: '·';
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          color: ${$THIN_GRAY};
        }

        &.admin::after,
        &:last-child::after {
          display: none;
        }

        .avatar {
          display: inline-block;

          .cropped-image {
            margin-right: 7px;
          }
        }

        .follow-btn {
          margin-left: 7px;
        }

        .no-pointer {
          cursor: auto;
        }

        span {
          color: ${$POINT_BLUE};
          letter-spacing: 0;
        }
      }
    }
  
    p {
      margin-top: 12px;
      line-height: 1.7;
      ${fontStyleMixin({
        size: 13,
        color: $GRAY
      })};
    }
  }
`;

const OnClassBoardMenu = styled.div`
  max-width: 1035px;
  margin: 30px auto 0;

  ul {
    display: inline-block;
    border: 1px solid ${$BORDER_COLOR};
    box-sizing: border-box;

    li {
      display: inline-block;
      border-right: 1px solid #eee;
      box-sizing: border-box;

      &:last-child {
        border-right: 0;
      }

      a {
        display: block;
        padding: 0 20px;
      }
  
      span {
        position: relative;
        ${heightMixin(46)};
        ${fontStyleMixin({
          size: 15,
          weight: '600',
          color: $GRAY,
        })};
      }
  
      &.on {
        background: linear-gradient(115deg, #69cdf6, #7aabf8);
  
        span {
          color: ${$WHITE};
        }

        &.new {
          span::after {
            background-color: ${$WHITE};
          }
        }
      }

      &:not(.on):hover {
        span {
          text-decoration: underline;
        }
      }

      &.new {
        span::after {
          content: '';
          position: absolute;
          top: 2px;
          right: -5px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: ${$POINT_BLUE};
        }
      }
    }
  }
`;

const StudySection = styled.section`
  width: 1035px;
  padding: 47px 0 100px;
  margin: auto;

  &.in-hone {
    padding-top: 30px;
  }
`;

const LeftStudyArea = styled.div`
  position: relative;
  width: 680px;
  float: left;

  .title-introduction-wrapper {
    margin: 28px 0 18px;

    p {
      display: inline-block;
      ${fontStyleMixin({
        size: 14,
        weight: '600',
      })};

      ~ p {
        position: relative;
        padding-left: 8px;
        margin-left: 6px;
        color: #8d8d8d;

        &::before {
          content: '';
          position: absolute;
          top: 2px;
          left: 0;
          width: 1px;
          height: 16px;
          background-color: #d8d8d8;
        }
      }

      span {
        color: ${$POINT_BLUE};
      }
    }
  }

  .board-pagination {
    margin-top: 27px;
  }

  .no-content {
    padding: 36px 0 40px;
    border-top: 1px solid ${$BORDER_COLOR};
    border-bottom: 1px solid ${$BORDER_COLOR};

    p {
      margin-bottom: 8px;
      font-size: 14px;
    }
  }
`;

export const OnClassBoardWrapper = styled.section`
  position: relative;

  .total-story {
    position: absolute;
    top: -33px;
    left: 0;
    ${fontStyleMixin({
      size: 13,
      color: $TEXT_GRAY,
    })};

    span {
      color: ${$FONT_COLOR};
    }
  }

  .qa-category {
    position: absolute;
    top: -34px;
    right: 0;

    .check-box {
      display: inline-block;
      vertical-align: middle;

      label {
        padding-left: 22px;
      }
    }

    ul {
      display: inline-block;
      margin-left: 23px;
      vertical-align: middle;

      li {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        ${fontStyleMixin({
          size: 14,
          weight: '600',
        })};
    
        &.on {
          color: ${$POINT_BLUE};
          text-decoration: underline;
        }
    
        & ~ li {
          padding-left: 9px;
          margin-left: 9px;
    
          &::after {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 1px;
            height: 9px;
            background-color: ${$BORDER_COLOR};
          }
        }
      }
    }
  }

  .write-btn {
    position: absolute;
    right: 0;
    margin-top: 15px;
  }
`;

export const WriteButton = styled(Button)`
  img {
    width: 20px;
    margin-right: 2px;
    vertical-align: middle;
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

const RightContent = styled.div`
  width: 320px;
  float: right;

  .study-btn-wrapper {
    display: flex;
    -ms-display: flexbox;
    margin-bottom: 20px;

    p {
      flex: 1 0 200px;
      ${heightMixin(36)};
      text-align: center;
      background-color: #f9f9f9;
      ${fontStyleMixin({
        size: 14,
        color: '#999'
      })};
    }
  }

  > ul {
    margin: 0 0 20px;
  }
  
  .onclass-guide-btn {
    margin-bottom: 20px;
  
    img {
      width: 18px;
      vertical-align: bottom;
    }
  }

  .onclass-review {
    height: 130px;
    margin-bottom: 20px;
    ${backgroundImgMixin({
      img: staticUrl('/static/images/banner/onclass-review.png'),
    })};
  }

  .onclass-lecture-request {
    height: 130px;
    ${backgroundImgMixin({
      img: staticUrl('/static/images/banner/onclass-detail-lecture-request.png'),
    })};
  }
`;

const StyledButton = styled(Button)`
  flex: 1 0 auto;
  min-width: 120px;

  &.application {
    color: ${$WHITE};
    background-color: #499aff;
  }

  img {
    width: 15px;
    margin: -2px 0 0 5px;
    vertical-align: middle
  }
`;

const OnClassDetail = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {query: {slug, ...search}} = router;
  const {timeline: timelineParams} = search;
  const [video, setVideo] = React.useState({avatar: '', media_content_key: '', title: '', body: ''});
  const {avatar: videoThumnail, media_content_key, title: videoTitle, body: videoBody} = video;
  const fileRef = React.useRef(null);

  const {system: {session: {access}}, me, navs, band} = useSelector(
    ({
      system,
      orm,
      navs
    }: RootState) => ({
      system,
      me: pickUserSelector(system.session.id)(orm) || {} as any,
      band: pickBandSelector(slug)(orm),
      navs
    }),
    shallowEqual,
  );

  const onClassApi: OnClassApi = useCallAccessFunc(access => new OnClassApi(access));

  React.useEffect(() => {
    dispatch(fetchBandThunk(onClassApi, slug));
  }, [slug]);



  useSetPageNavigation('/onclass');

  const {
    name,
    avatar,
    category,
    body,
    timelines,
    write_range,
    extension,
    created_at,
    member_count,
    story_count,
    new_story_count,
    band_member_grade,
  } = band || {} as any;

  const {
    story,
    remaining_days,
    learning_status,
    periods = [],
    total_progress_rate = 0,
    total_retrieve_count = 0,
    total_contents_count = 0,
  } = extension || {} as any;

  const roundTotalProgress = (total_progress_rate || 0).toFixed(0);
  const isVisitor = band_member_grade === 'visitor';
  const {avatar_on, avatar_off, name: avatar_name} = category || {};
  const {id: storyId, title, user: owner, receipt_range, meetup_status} = story || {} as any;

  const lastDate = band_member_grade === 'normal'
    ? !isEmpty(periods) && periods[periods.length - 1].end_at
    : (receipt_range || [])[1];

  const [isOwnerFollow, setIsOwnerFollow] = React.useState((owner || {}).is_follow || false);
  const isActive = lastDate && moment(lastDate).isAfter();
  const hasPermissionToWrite = React.useMemo(() => {
    if (!timelineParams) return false;
    const currentTimeline = timelines?.filter(item => item.id === timelineParams)[0];
    if (isEmpty(currentTimeline)) return false;

    const {writable_user_types, writable_member_grades} = currentTimeline;
    return writable_user_types?.includes(me.user_type)
      && writable_member_grades?.includes(band_member_grade);
  }, [timelines, timelineParams, band_member_grade, me]);

  const communityOnlineId = (navs.filter(({name}) => name === '온·오프 강의후기')[0])?.id;
  const communityOnlineId2 = (navs.filter(({name}) => name === '온·오프 강의요청')[0])?.id;

  if (isEmpty(band)) {
    return <Loading />
  }

  return (
    <>
      <OGMetaHead title={videoTitle || name}/>
      <DetailTitleDiv avatar={avatar}>
        <div className="onclass-thumb-wrapper" />
        <div className="onclass-info-wrapper">
          <h2>
            {name}
          </h2>
          <ul>
            {!isEmpty(owner) && (
              <li className="admin">
                <Avatar
                  src={owner.avatar}
                  size={28}
                  name={owner.name}
                  userExposeType="real"
                  {...owner}
                />
                {(!!owner.name && (owner.id !== me.id)) && (
                  <UserFollowInfo className="pointer follow-btn">
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
              </li>
            )}
            <li>
              <Link
                href="/onclass/[slug]/member"
                as={`/onclass/${slug}/member`}
              >
                <a
                  className={cn({'no-pointer': !ADMIN_PERMISSION_GRADE.includes(band_member_grade)})}
                  onClick={e => {
                    if (!ADMIN_PERMISSION_GRADE.includes(band_member_grade)) {
                      e.preventDefault();
                    } 
                  }}
                >
                  수강생 <span>{member_count}</span>명
                </a>
              </Link>            
            </li>
            <li>
              총 게시글 <span>{story_count}</span>
            </li>
          </ul>
          <p className="pre-wrap">
            {body}
          </p>
        </div>
      </DetailTitleDiv>
      <OnClassBoardMenu>
        <ul>
          <li
            className={cn({on: !timelineParams})}
          >
            <Link
              href={`/onclass/[slug]`}
              as={`/onclass/${slug}`}
            >
              <a>
                <span>강의실 홈</span>
              </a>
            </Link>
          </li>
          {timelines.map(({id, name, new_story_count}) =>
            <li
              className={cn({on: timelineParams === id, new: !!new_story_count})}
            >
              <Link
                href={`/onclass/[slug]?timeline=${id}`}
                as={`/onclass/${slug}?timeline=${id}`}
                replace
                passHref
              >
                <a>
                  <span>{name}</span>
                </a>
              </Link>
            </li>
          )}
        </ul>
      </OnClassBoardMenu>
      <StudySection
        className={cn('clearfix', {'in-home': !timelineParams})}
      >
        <LeftStudyArea>
          {!timelineParams ? (
            <LeftStudyArea>
              <OnClassNoticeCard/>
              <div className="title-introduction-wrapper">
                <p>총 <span>{total_contents_count}</span>강의 동영상</p>
                <p>조회수 {total_retrieve_count}</p>
              </div>
              <OnClassVideoTable
                isActive={isActive}
              />
            </LeftStudyArea>
          ) :
            (timelines.filter(({name}) => name === '공지사항 및 학습자료실')[0] || {}).id === timelineParams
            ? <OnClassNoticeBoard hasPermissionToWrite={hasPermissionToWrite}/>
            : (timelines.filter(({name}) => name === '질문 및 답변')[0] || {}).id === timelineParams
              ? <OnClassQABoard hasPermissionToWrite={hasPermissionToWrite}/>
              : <Feed
                  className={cn({'no-write': !hasPermissionToWrite})}
                  fetchURI={
                    timelineParams ?
                      `${BASE_URL}/timeline/${timelineParams}/story/` :
                      `${BASE_URL}/band/${slug}/story/`
                  }
                  fetchType="overwrite"
                  component={Story}
                />
        }
        </LeftStudyArea>
        <RightContent>
          {!timelineParams && ( // 강의실 홈에서만 보여야 함
            <>
              {!ADMIN_PERMISSION_GRADE.includes(band_member_grade) && (
                <div className="study-btn-wrapper">
                  {(!isVisitor && !isActive) && (
                    <p>
                      학습 기간이 종료되었습니다
                    </p>
                  )}
                  {(learning_status === 'normal_avail' || isActive) && (
                    <StyledButton
                      className={cn({application: learning_status === 'normal_avail'})}
                      size={{
                        height: '36px'
                      }}
                      border={{
                        width: '0',
                        radius: '0'
                      }}
                      font={{
                        size: '14px',
                        color: $POINT_BLUE
                      }}
                      backgroundColor="#edf5ff"
                      onClick={() => {
                        learning_status === 'normal_avail'
                          ? router.push('/story/[id]', `/story/${storyId}`)
                          : onClassApi.onclassProgress(slug)
                            .then(({status, data: {result}}) => {
                              if (status === 200) {
                                const {story: {content: {media_content_key}}} = result;
                                window.open(
                                  `/onclass/${slug}/lecture/${media_content_key}`,
                                  '_blank'
                                );
                              }
                            });
                      }}
                    >
                      {(meetup_status !== 'end' && learning_status === 'normal_avail') ? (
                        <>
                          수강 신청
                          <img
                            src={staticUrl('/static/images/icon/arrow/arrow-double-white.png')}
                            alt=""
                          />
                        </>
                      ) : (
                        <>
                          {roundTotalProgress > 0 ? '마지막 학습 이어보기' : '학습 시작'}
                          <img
                            src={staticUrl('/static/images/icon/arrow/arrow-double-blue.png')}
                            alt=""
                          />
                        </>
                      )}
                    </StyledButton>
                  )}
                </div>
              )}
              <MyClassInfo
                learning_status={learning_status}
                band_member_grade={band_member_grade}
                periods={periods}
                remainingDay={remaining_days}
                receipt_range={receipt_range}
                total_progress_rate={roundTotalProgress}
              />
              <Button
                className="onclass-guide-btn"
                size={{width: '320px', height: '40px'}}
                font={{size: '12px', weight: '600', color: $FONT_COLOR}}
                border={{radius: '0', width: '1px', color: $BORDER_COLOR}}
                onClick={() => router.push('/guide')}
              >
                온라인 강의 이용가이드
                <img
                  src={staticUrl('/static/images/icon/icon-help-btn.png')}
                  alt="온라인 강의 이용가이드"
                />
              </Button>
            </>
          )}
          <OnClassRecommendAd/>
          <Link
            href={`/community?category=${communityOnlineId}`}
          >
            <a target='_blank'>
              <div className="onclass-review"/>
            </a>
          </Link>
          <Link
            href={`/community?category=${communityOnlineId2}`}
          >
            <a target='_blank'>
              <div className="onclass-lecture-request"/>
            </a>
          </Link>
        </RightContent>
      </StudySection>
    </>
  )
};

OnClassDetail.displayName = 'OnClassDetail';
export default loginRequired(
  userTypeRequired(
    React.memo(OnClassDetail),
    [...MAIN_USER_TYPES, 'hani']
  )
);
