import * as React from 'react';
import cn from 'classnames';
import {staticUrl} from '../../../../src/constants/env';
import {
  blockStoryThunk,
  deleteStoryThunk,
  fetchStoryThunk,
  sendStoryReportThunk,
  blockUserThunk, fetchTimelineStoryThunk,
} from '../../../../src/reducers/orm/story/thunks';
import {pushPopup} from '../../../../src/reducers/popup';
import ReportPopup from '../../../layout/popup/ReportPopup';
import Avatar from '../../../Avatar';
import {timeSince} from '../../../../src/lib/date';
import {under} from '../../../../src/lib/numbers';
import Label from '../../../UI/tag/Label';
import {$BORDER_COLOR, $WHITE, $TEXT_GRAY, $POINT_BLUE, $FONT_COLOR, $GRAY} from '../../../../styles/variables.types';
import {UrlCard} from '../../embeds';
import WaterMark from '../../../watermark';
import Tag from '../../../UI/tag/Tag';
import StoryReaction from '../../StoryReaction';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {
  DetailFeedTitle,
  InfoLi,
  LayerPopUpUl,
  MoreBtn,
  ShowDetailContentByBodyType,
  DictUl,
  UserFollowInfo,
  StyledTitleCard,
  StoryLabelP,
  FeedFoldBtn} from '../../common';
import TransBg from '../../../TransBg';
import DictCard from '../../../dict/DictCard';
import FileList from '../../../editor/external/FileList';
import Router, {useRouter} from "next/router";
import Loading from '../../../common/Loading';
import Link from "next/link";
import UrlPopup from '../../../layout/popup/UrlPopup';
import GuideLabel from '../GuideLabel';
import ReceivedPoint from '../../extension/point/ReceivedPoint';
import {followUser} from '../../../../src/reducers/orm/user/follow/thunks';
import {RootState} from '../../../../src/reducers';
import {pickUserSelector} from '../../../../src/reducers/orm/user/selector';
import useLocation from '../../../../src/hooks/router/useLocation';
import {StoryBlind} from '../../StoryBlind';
import {Query} from "@apollo/react-components";
import isEmpty from 'lodash/isEmpty';
import {INFO_UPLOAD_WIKIS} from '../../../../src/gqls/wiki';
import styled from 'styled-components';
import {USER_TYPE_TO_KOR} from '../../../../src/constants/users';
import {checkOnlinePage} from '../../../../src/lib/community';
import {heightMixin, fontStyleMixin} from '../../../../styles/mixins.styles';
import Button from '../../../inputs/Button';
import moment from 'moment';
import {pickStorySelector} from '../../../../src/reducers/orm/story/selector';
import {fetchUserThunk} from '../../../../src/reducers/orm/user/thunks';
import {pickBandSelector} from '../../../../src/reducers/orm/band/selector';
import {ONCLASS_MEMBER} from '../../../../src/constants/meetup';

const TitleActionWrapper = styled.div`
  position: relative;
  border-bottom: 1px solid ${$BORDER_COLOR};

  ${DetailFeedTitle} {
    margin-right: 40px;

    &.wide {
      margin-right: 0;
    }

    .onclass-user {
      color: ${$GRAY};
      font-size: 13px;
      margin: 0 4px;
    }
    h2 {
      .onclass-notice-label {
        display: inline-block;
        width: 33px;
        ${heightMixin(22)};
        margin-right: 8px;
        border-radius: 11px;
        background-color: #f32b43;
        box-sizing: border-box;
        text-align: center;
        vertical-align: middle;
        ${fontStyleMixin({
          size: 12,
          weight: '600',
          color: $WHITE,
        })};
      }
  
      .onclass-subject {
        display: inline-block;
        margin-right: 3px;
        ${fontStyleMixin({
          size: 18,
          color: $TEXT_GRAY,
        })};
      }

      .qa-status {
        display: inline-block;
        width: 46px;
        height: 16px;
        line-height: 16px;
        margin-right: 8px;
        text-align: center;
        background-color: #eee;
        vertical-align: middle;
        ${fontStyleMixin({
          size: 11,
          color: '#999'
        })};

        &.on {
          color: ${$POINT_BLUE};
          background-color: ${$WHITE};
          border: 1px solid #499aff;
        }
      }
    }
  }
`;

const OnClassAnswerButton = styled(Button)`
  position: absolute;
  top: 9px;
  right: 13px;

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

const StoryDefaultDetail = props => {
  const {
    id,
    title,
    user,
    created_at,
    retrieve_count,
    tags,
    down_count,
    is_notice,
    is_follow,
    is_report,
    reaction_type,
    extend_to,
    className,
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
    access,
    isWriter,
    waterMarkProps,
    open_range,
    received_point,
    status,
    blind_reason,
    can_give_points,
    onClick,
    storyType = 'story',
    shareUrl,
    detail = false,
    has_my_comments,
    menu_tag,
    timeline: timelineObject,
    isNotice,
    isQnA,
    band_member_grade
  } = props;
  const router = useRouter();
  const {route, query: {slug, timeline: timelineId}} = router;
  const extension = _extension || {};
  const {location: {pathname}} = useLocation();

  const {id: timeline} = (timelineObject || {});
  const isOnClass = route.includes('onclass');

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
  const [canComment, setCanComment] = React.useState(false);
  const [isAnswerOpen, setAnswerOpen] = React.useState(false);

  // Redux
  const dispatch = useDispatch();
  const {writer, story, onclass} = useSelector(
    ({orm}: RootState) => ({
      writer: (pickUserSelector((user || {}).id)(orm) || {}),
      story: (pickStorySelector(id)(orm) || {}),
      onclass: (pickBandSelector(slug)(orm) || {})
  }), shallowEqual,);

  const {body_type, body, comment_count, up_count, category, is_answered} = story || {};
  const {timelines} = onclass || {};
  const {is_follow: isWriterFollow} = writer || {};
  // API

  React.useEffect(() => {
    if (user) {
      dispatch(fetchUserThunk((user || {}).id));
    }
    !!timelineId ? dispatch(fetchTimelineStoryThunk(timelineId, id)) : dispatch(fetchStoryThunk(id));
  }, [id, (user || {}).id]);

  const isAnswered = React.useMemo(() =>
    (!!is_answered || moment(created_at).isBefore("20200616")) && comment_count > 0
  ,[created_at, is_answered, comment_count]);
  const isNoticeBoard = isOnClass && ((timelines || []).filter(({name}) => name === "공지사항 및 학습자료실")[0] || {}).id === timelineId;
  const canCheckReceivedPoint = !!user && (!!user.name || !!user.nick_name);

  React.useEffect(() => {
    if (band_member_grade !== 'admin') {
      setCanComment(can_comment);
    } else {
      setCanComment(!isAnswered);
    }
  }, [can_comment, isAnswered]);

  // 블라인드 boolean
  const isBlind = status === 'blinded';
  const {name} = category || {};

  return (
    <>
      <StyledTitleCard className={cn('', [className])}>
        <TitleActionWrapper>
          {!detail && (
            <FeedFoldBtn
              className="close"
              onClick={onClick}
            >
              <img
                src={staticUrl('/static/images/icon/arrow/icon-story-fold-arrow.png')}
                alt="접기"
              />
            </FeedFoldBtn>
          )}
          <DetailFeedTitle
            user={user}
            className={cn({
              wide: detail
            })}
          >
            <MoreBtn onClick={() => setShowOption(true)}>
              <img
                src={staticUrl('/static/images/icon/icon-more-btn.png')}
                alt="더보기"
              />
            </MoreBtn>
            {showOption && (
              <>
                <TransBg onClick={() => setShowOption(false)} />
                <LayerPopUpUl>
                  {!!access && (
                    <>
                      {isWriter && (
                        <>
                          <li onClick={() => dispatch(deleteStoryThunk(id, extend_to === 'meetup' && `등록하신 ${title}이(가) 삭제됩니다.`))}>
                            <img
                              src={staticUrl('/static/images/icon/icon-delete.png')}
                              alt="삭제"
                            />
                            삭제
                            <span>해당 글을 삭제합니다.</span>
                          </li>
                          {body_type === 'froala' && (
                            !(extend_to === 'meetup' && extension.status === 'end') && (
                              <li
                                onClick={() => {
                                  if (isOnClass) {
                                    Router.push(
                                      {pathname: '/onclass/[slug]/edit', query: {timeline: timelineId, id}},
                                      {pathname: `/onclass/${slug}/edit`, query: {timeline: timelineId, id}},
                                    );
                                  } else if (timeline) {
                                    Router.push(
                                      {pathname: '/story/[id]/edit', query: {timeline}},
                                      {pathname: `/story/${id}/edit`, query: {timeline}},
                                    );
                                  } else {
                                    Router.push(`/${extend_to}/[id]/edit`, `/${extend_to}/${id}/edit`);
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
                            )
                          )}
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
                                onClick={() => dispatch(blockStoryThunk(id))}
                              >
                                <img
                                  src={staticUrl('/static/images/icon/icon-story-hiding.png')}
                                  alt="이 게시글 숨기기"
                                />
                                이 게시글 숨기기
                                <span>이 게시글을 메인에 표시하지 않습니다.</span>
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
            <TitleLabel />
            <h2>
              {isNoticeBoard && (
                <>
                  {isNotice && (
                    <span className="onclass-notice-label">
                      중요
                    </span>
                  )}
                  <p className="onclass-subject">[{name}]</p>
                </>
              )}
              {!!isQnA && (
                <>
                  <span
                    className={cn('qa-status', {on: isAnswered})}
                  >
                    {isAnswered  ? '답변완료' : '답변대기'}
                  </span>
                </>
              )}
              {(detail || isOnClass)
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
              {stickers.map(({additional_data, ...props}) => (
                <GuideLabel
                  className={cn('pointer')}
                  bgColor={additional_data.bcColor}
                  {...props}
                />
              ))}
            </h2>
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
                    size={40}
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
                {(!!user &&!!user.name && !isWriter) && (
                  <UserFollowInfo className="pointer">
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
        </TitleActionWrapper>
        <div className="no-select">
          {isBlind ? (
            <StoryBlind reason={blind_reason} />
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
          )}
        </div>
        {(url_card && (url_card.title || url_card.description)) && (
          <UrlCard
            highlightKeyword={highlightKeyword}
            url_card={url_card}
          />
        )}
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
        <div className="action-box">
          <span
            id={id}
            className="hash-target"
          />
          {(!isOnClass && canCheckReceivedPoint) && (
            <ReceivedPoint
              storyPk={id}
              canSendPoint={can_give_points}
              receivedPoint={received_point}
              isWriter={isWriter}
            />
          )}
          {(isQnA && band_member_grade === 'admin') && (
            <OnClassAnswerButton
              className={cn({done: isAnswered})}
              size={{
                width: '116px',
                height: '35px'
              }}
              border={{
                radius: '4px',
              }}
              font={{
                size: '14px',
                weight: '600',
                color: $WHITE,
              }}
              backgroundColor={$FONT_COLOR}
              onClick={() => !isAnswered && setAnswerOpen(curr => !curr)}
            >
              {isAnswered ? (
                <>
                  <img
                    src={staticUrl('/static/images/icon/answer-off.png')}
                    alt=""
                  />
                  답변완료
                </>
              ) : (
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
          <StoryReaction
            storyPk={id}
            storyUser={user}
            up_count={up_count}
            down_count={down_count}
            comment_count={comment_count}
            is_writer={isWriter}
            is_follow={is_follow}
            reaction_type={reaction_type}
            can_comment={(isQnA && band_member_grade === 'admin') ? (canComment && isAnswerOpen) : canComment}
            can_reaction={can_reaction}
            can_follow={can_follow}
            user_expose_type={user_expose_type}
            has_my_comments={has_my_comments}
            can_save={!isOnClass}
            // for watermark
            openComment={isOnClass}
            placeholder={(isQnA && band_member_grade === 'admin') && '답변을 입력해주세요.'}
            open_range={open_range}
            waterMarkProps={waterMarkProps}
            is_online_community={checkOnlineTagName || isOnClass}
          />
        </div>
      </StyledTitleCard>
    </>
  );
};

export default React.memo(StoryDefaultDetail);
