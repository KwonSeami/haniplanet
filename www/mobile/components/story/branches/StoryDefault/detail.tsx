import * as React from 'react';
import cn from 'classnames';
import {staticUrl} from '../../../../src/constants/env';
import {
  blockStoryThunk,
  blockUserThunk,
  deleteStoryThunk,
  fetchStoryThunk, fetchTimelineStoryThunk,
  sendStoryReportThunk,
} from '../../../../src/reducers/orm/story/thunks';
import {pushPopup} from '../../../../src/reducers/popup';
import ReportPopup from '../../../layout/popup/ReportPopup';
import Avatar from '../../../AvatarDynamic';
import {timeSince} from '../../../../src/lib/date';
import {under} from '../../../../src/lib/numbers';
import {USER_TYPE_TO_KOR} from '../../../../src/constants/users';
import Label from '../../../UI/tag/Label';
import {StoryPreview, UrlCard} from '../../embeds';
import WaterMark from '../../../watermark';
import Tag from '../../../UI/tag/Tag';
import StoryReaction from '../../StoryReaction';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {
  DetailFeedTitle,
  InfoLi,
  UserFollowInfo,
  LayerPopUpUl,
  MoreBtn,
  ShowDetailContentByBodyType,
  DictUl,
  StyledTitleCard,
  StoryLabelP,
  CenterWrapper
} from '../../common';
import TransBg from '../../../TransBg';
import DictCard from '../../../dict/DictCard';
import FileList from '../../../editor/external/FileList';
import {useRouter} from "next/router";
import Loading from '../../../common/Loading';
import Link from "next/link";
import UrlPopup from '../../../layout/popup/UrlPopup';
import GuideLabel from "../GuideLabel";
import ReceivedPoint from '../../extension/point/ReceivedPoint';
import useLocation from '../../../../src/hooks/router/useLocation';
import {RootState} from '../../../../src/reducers';
import {pickUserSelector} from '../../../../src/reducers/orm/user/selector';
import {followUser} from '../../../../src/reducers/orm/user/follow/thunks';
import {StoryBlind} from '../../StoryBlind';
import {Query} from "@apollo/react-components";
import isEmpty from 'lodash/isEmpty';
import {INFO_UPLOAD_WIKIS} from '../../../../src/gqls/wiki';
import Button from '../../../inputs/Button';
import {checkOnlinePage} from '../../../../src/lib/community';
import {$FONT_COLOR, $WHITE} from '../../../../styles/variables.types';
import styled from 'styled-components';
import moment from 'moment';
import {pickStorySelector} from '../../../../src/reducers/orm/story/selector';
import {fetchUserThunk} from '../../../../src/reducers/orm/user/thunks';
import {pickBandSelector} from '../../../../src/reducers/orm/band/selector';
import {ONCLASS_MEMBER} from '../../../../src/constants/meetup';

const OnClassAnswerButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;

  img {
    width: 14px;
    margin: -3px 3px 0 0;
    vertical-align: middle;
  }

  &.done {
    color: #999;
    background-color: #eee;
  }
`;

const StoryDefault = (
  {
    id,
    title,
    user,
    created_at,
    retrieve_count,
    summary,
    tags,
    down_count,
    is_notice,
    is_follow,
    is_report,
    reaction_type,
    extend_to,
    className,
    detail,
    extension: _extension,
    url_card,
    highlightKeyword,
    can_comment,
    can_reaction,
    can_follow,
    wikis,
    files,
    stickers = [],
    user_expose_type,
    // >>> injected props
    access,
    isWriter,
    waterMarkProps,
    open_range,
    images,
    video,
    received_point,
    blind_reason,
    status,
    can_give_points,
    isNotice,
    isQnA,
    category,
    band_member_grade,
    onClick,
    shareUrl,
    has_my_comments,
    menu_tag,
    storyType = 'story',
    timeline: timelineObject
  },
) => {
  const router = useRouter();
  const {route, query: {slug, timeline: timelineId}} = router;
  const extension = _extension || {};
  const {location: {pathname}} = useLocation();
  const isOnClass = route.includes('onclass');
  const {id: timeline} = (timelineObject || {});

  const checkOnlineTagName = checkOnlinePage(menu_tag?.name);

  const TitleLabel = React.useCallback<React.FC>(() => {
    if (is_notice && !isNotice) {
      return <StoryLabelP>공지사항</StoryLabelP>;
    }

    switch (extend_to) {
      case 'meetup':
        return <StoryLabelP>세미나/모임</StoryLabelP>;
      default:
        return null;
    }
  }, [is_notice, extend_to]);

  // State
  const [showOption, setShowOption] = React.useState(false);
  const [isPreview, setIsPreview] = React.useState(detail || true);
  const [canComment, setCanComment] = React.useState(false);
  const [isAnswerOpen, setAnswerOpen] = React.useState(false);

  // Redux
  const dispatch = useDispatch();
  const {writer, story, onclass} = useSelector(
    ({orm}: RootState) => ({
      writer: (pickUserSelector((user || {}).id)(orm) || {}),
      story: (pickStorySelector(id)(orm) || {}),
      onclass: (pickBandSelector(slug)(orm) || {})
  }), shallowEqual);

  const {body_type, body, comment_count, up_count, is_answered} = story || {};
  const {timelines} = onclass || {};
  const {is_follow: isWriterFollow} = writer || {};

  React.useEffect(() => {
    if (detail) {
      dispatch(fetchUserThunk((user || {}).id));
      setIsPreview(false);
      timelineId && dispatch(fetchTimelineStoryThunk(timelineId, id));
    }
  }, [detail, id, user]);

  const isAnswered = React.useMemo(() =>
    (!!is_answered || moment(created_at).isBefore("20200616")) && comment_count > 0
    ,[created_at, is_answered, comment_count]);

  React.useEffect(() => {
    if (band_member_grade !== 'admin') {
      setCanComment(can_comment);
    } else {
      setCanComment(!isAnswered);
    }
  }, [can_comment, isAnswered]);

  const {name} = category || {};
  const canCheckReceivedPoint = !!user && (!!user.name || !!user.nick_name);

  // 블라인드 boolean
  const isBlind = status === 'blinded';
  return (
    <>
      <StyledTitleCard className={cn([className], {open: !isPreview})}>
        <CenterWrapper>
          <DetailFeedTitle user={user}>
            {!isPreview && (
              <Button
                className="fold-icon-btn"
                onClick={() => {
                  onClick && onClick();
                  setIsPreview(true);
                }}
              >
                <img
                  src={staticUrl('/static/images/icon/arrow/icon-arrow-gray-top.png')}
                  alt="접기"
                />
              </Button>
            )}
            <TitleLabel />
            <div className={cn({
              'label-exist': stickers.length > 0,
              'cardview-title': !isPreview,
            })}>
              <h2>
                {isNotice && ( //@경희님: 온라인강의 공지사항/자료실 스토리 '중요' 라벨
                  <>
                    <span className="onclass-notice-label">
                      중요
                    </span>
                    <p className="onclass-subject">[{name}]</p>
                  </>
                )}
                {!!isQnA && ( //@경희님: 온라인강의 질문및답변 스토리 '답변' 관련 라벨
                  <>
                    <span
                      className={cn('qa-status', {on: isAnswered})}
                    >
                      {isAnswered  ? '답변완료' : '답변대기'}
                    </span>
                  </>
                )}
                {detail
                  ? title
                  : (
                    <Link
                      href="/[storyType]/[id]"
                      as={`/${storyType}/${id}`}
                    >
                      <a>{title}</a>
                    </Link>
                  )
                }
                {!isPreview && (
                  stickers.map(({additional_data, ...props}) => (
                    <GuideLabel
                      className={cn('pointer')}
                      bgColor={additional_data.bcColor}
                      {...props}
                    />
                  ))
                )}
              </h2>
              {isPreview &&
              stickers.map(({additional_data, ...props}) => (
                <GuideLabel
                  className={cn('pointer')}
                  bgColor={additional_data.bcColor}
                  {...props}
                />
              ))}
            </div>
            <div className="info-box">
              <ul className="attrs">
                <InfoLi>
                  {(isOnClass && (user || {}).member_grade !== 'normal') && ( //@경희님: 강사 이름 앞에 붙는 아이콘
                    <img
                      className="onclass-owner-icon"
                      src={staticUrl('/static/images/icon/onclass-owner.png')}
                      alt=""
                    />
                  )}
                  <Avatar
                    name={user?.name || '익명의 유저'}
                    src={user?.avatar}
                    {...user}
                    userExposeType={user_expose_type}
                    size={33}
                  />
                  {isOnClass && <span className="onclass-user">{ONCLASS_MEMBER[(user || {}).member_grade]}</span>}
                </InfoLi>
                {user && user.user_type && (
                  <InfoLi>
                    <Label
                      name={USER_TYPE_TO_KOR[user.user_type]}
                      color={user.user_type === 'doctor' ? '#7fc397' : '#9586d0'}
                    />
                  </InfoLi>
                )}
                {(!!user && !!user.name && !isWriter) && (
                  <UserFollowInfo>
                    <div
                      className={cn(isWriterFollow ? 'follow-cancel' : 'follow-add')}
                      onClick={() => {
                        dispatch(followUser(user.id));
                      }}
                    >
                      <img
                        src={staticUrl(`/static/images/icon/icon-${isWriterFollow ? ('plus-gray') : ('check-blue-small')}.png`)}
                        alt="팔로우"
                      />
                      팔로우
                    </div>
                  </UserFollowInfo>
                )}
              </ul>
              <span>
                {timeSince(created_at)}&nbsp;·
              </span>
              <span>
                조회 {under(retrieve_count, 9999)}
              </span>
            </div>
          </DetailFeedTitle>
          <div className="no-select story-body">
            {isBlind ? (
              <StoryBlind reason={blind_reason}/>
            ) : (
              isPreview ? (
                <StoryPreview
                  contentPreview={summary}
                  hasMoreBtn
                  onClick={() => {
                    setIsPreview(false);
                    dispatch(fetchStoryThunk(id));
                  }}
                  highlightKeyword={highlightKeyword}
                  video={video}
                  images={images}
                />
              ) : (
                (typeof window !== 'undefined' && body_type) ? (
                  open_range !== 'human' ? (
                    <WaterMark {...waterMarkProps}>
                      <ShowDetailContentByBodyType
                        bodyType={body_type}
                        data={body}
                        highlightKeyword={highlightKeyword}
                      />
                    </WaterMark>
                  ) : (
                    <ShowDetailContentByBodyType
                      bodyType={body_type}
                      data={body}
                      highlightKeyword={highlightKeyword}
                    />
                  )
                ) : <Loading/>
              )
            )}
          </div>
          {(url_card && (url_card.title || url_card.description)) && (
            <UrlCard
              highlightKeyword={highlightKeyword}
              url_card={url_card}
            />
          )}
          {(!isPreview && !isBlind) && (
            <>
              {!isEmpty(wikis) && (
                <DictUl>
                  <Query
                    query={INFO_UPLOAD_WIKIS}
                    variables={{codes: wikis}}
                  >
                    {({data, loading}) => {
                      if(loading) return null;
                      const {wikis: {nodes: wikiList} = {} as any} = data || {} as any;

                      return (
                        <>
                          {wikiList.map(item => (
                            <li key={item.code}>
                              <DictCard
                                data={item}
                                type="medi"
                              />
                            </li>
                          ))}
                        </>
                      )
                    }}
                  </Query>
                </DictUl>
              )}
              {files && (
                <FileList
                  fileList={files}
                />
              )}
            </>
          )}
          {(tags.length > 0) && (
            <ul className="tag">
              {tags && tags.map(({id, name, is_follow}) => (
                <li key={id} style={{display: 'inline-block'}}>
                  <Tag
                    name={name}
                    highlighted={is_follow}
                    textHighlighted={highlightKeyword === name}
                    detail
                    onClick={() => router.push(`/tag/${id}`)}
                  />
                </li>
              ))}
            </ul>
          )}
          {(!isOnClass && canCheckReceivedPoint) && (
            <ReceivedPoint
              storyPk={id}
              canSendPoint={can_give_points}
              receivedPoint={received_point}
              isWriter={isWriter}
            />
          )}
          <div className="reaction-more-wrap">
            <StoryReaction
              storyPk={id}
              storyUser={user}
              up_count={up_count}
              down_count={down_count}
              comment_count={comment_count}
              is_writer={isWriter}
              is_follow={is_follow}
              isPreview={isPreview}
              reaction_type={reaction_type}
              can_comment={(isQnA && band_member_grade === 'admin') ? (canComment && isAnswerOpen) : canComment}
              can_reaction={can_reaction}
              can_follow={can_follow}
              can_save={!isOnClass}
              user_expose_type={user_expose_type}
              has_my_comments={has_my_comments}
              // for watermark
              openComment={isOnClass}
              placeholder={(isQnA && band_member_grade === 'admin') && '답변을 입력해주세요.'}
              open_range={open_range}
              waterMarkProps={waterMarkProps}
              is_online_community={checkOnlineTagName || isOnClass}
            />
            {!isOnClass && (
              <MoreBtn onClick={() => setShowOption(true)}>
                <img
                  src={staticUrl('/static/images/icon/icon-more-btn.png')}
                  alt="더보기"
                />
              </MoreBtn>
            )}
            {(isQnA && band_member_grade === 'admin') && (
              <OnClassAnswerButton
                className={cn({done: isAnswered})}
                size={{
                  width: '116px',
                  height: '49px'
                }}
                border={{
                  radius: '0',
                }}
                font={{
                  size: '14px',
                  weight: '600',
                  color: $WHITE,
                }}
                backgroundColor={$FONT_COLOR}
                onClick={() => !isAnswered && setAnswerOpen(curr => !curr)}
              >
                {isAnswered ? ( // @경희님: 답변이 달린 글에서
                  <>
                    <img
                      src={staticUrl('/static/images/icon/answer-off.png')}
                      alt=""
                    />
                    답변완료
                  </>
                ) : ( // @경희님: 답변이 안 달린 글에서
                  <>
                    <img
                      src={staticUrl('/static/images/icon/answer-on.png')}
                      alt=""
                    />
                    답변달기
                  </>
                )}

              </OnClassAnswerButton>
            )}
            {showOption && (
              <>
                <TransBg
                  onClick={() => setShowOption(false)}
                />
                <LayerPopUpUl>
                  {!!access && (
                    <>
                      {isWriter && (
                        <>
                          <li onClick={() => dispatch(deleteStoryThunk(id))}>
                            <img
                              src={staticUrl('/static/images/icon/icon-delete.png')}
                              alt="삭제"
                            />
                            삭제
                            <span>해당 글을 삭제합니다.</span>
                          </li>
                          <li
                            onClick={() => {
                              if (isOnClass) {
                                router.push(
                                  {pathname: '/onclass/[slug]/edit', query: {timeline: timelineId, id}},
                                  {pathname: `/onclass/${slug}/edit`, query: {timeline: timelineId, id}},
                                );
                              } else if(extend_to === 'community' && !timeline) {
                                router.push(`/community/[id]/edit`, `/community/${id}/edit`)
                              } else {
                                router.push({pathname: `/story/${id}/edit`, query: {timeline}})
                              }

                            }}
                          >
                            <img
                              src={staticUrl('/static/images/icon/icon-edit.png')}
                              alt="수정"
                            />
                            수정
                            <span>해당 글을 수정합니다.</span>
                          </li>
                        </>
                      )}
                      {!isWriter && (
                        <>
                          <li
                            onClick={() => {
                              if (is_report) {
                                alert('이미 신고되었습니다.');
                              } else {
                                dispatch(pushPopup(
                                  ReportPopup,
                                  {
                                    onClick: (form) => dispatch(sendStoryReportThunk(id, form)),
                                  },
                                ))
                              }
                              }}
                          >
                            <img
                              src={staticUrl('/static/images/icon/icon-report.png')}
                              alt="신고하기"
                            />
                            신고하기
                            <span>해당 글을 신고합니다.</span>
                          </li>
                          {(pathname === '/' && !!user) && (
                            <>
                              {!!user.name && (
                                <li
                                  onClick={() => dispatch(blockUserThunk(user.id, pathname))}
                                >
                                  <img
                                    src={staticUrl('/static/images/icon/icon-story-menu-2.png')}
                                    alt="글 보지 않기"
                                  />
                                  {user.name}님 글 보지 않기
                                  <span>이 회원의 글을 메인에 표시하지 않습니다.</span>
                                </li>
                              )}
                              <li
                                onClick={() => dispatch(blockStoryThunk(id))
                              }>
                                <img
                                  src={staticUrl('/static/images/icon/icon-story-hiding.png')}
                                  alt="이 게시글 숨기기"
                                />
                                  이 게시글 숨기기
                                <span>해당 게시글을 표시하지 않습니다.</span>
                              </li>
                            </>
                          )}
                          </>
                      )}
                    </>
                  )}
                  <li onClick={() => dispatch(pushPopup(UrlPopup, {
                    storyPK: id,
                    url: shareUrl || ''
                  }))}>
                    <img
                      src={staticUrl('/static/images/icon/icon-option-share.png')}
                      alt="공유하기"
                    />
                    공유하기
                    <span>해당 글의 URL을 복사합니다.</span>
                  </li>
                </LayerPopUpUl>
              </>
            )}
          </div>
        </CenterWrapper>
        {!isPreview && (
          <Button
            className="fold-btn"
            onClick={() => {
              onClick && onClick();
              setIsPreview(true);
            }}
            border={{radius: '0'}}
            backgroundColor={'#f2f3f7'}
            size={{width: '100%', height: '50px'}}
            font={{size: '14px', color: '#999'}}
          >
            접기
            <img
              src={staticUrl('/static/images/icon/arrow/icon-story-fold-arrow.png')}
              alt="접기"
            />
          </Button>
        )}
      </StyledTitleCard>
    </>
  );
};

export default StoryDefault;
