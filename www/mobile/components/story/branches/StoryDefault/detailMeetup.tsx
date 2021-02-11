import cn from 'classnames';
import {staticUrl} from '../../../../src/constants/env';
import {
  blockStoryThunk,
  blockUserThunk,
  deleteStoryThunk,
  fetchStoryThunk,
  sendStoryReportThunk,
} from '../../../../src/reducers/orm/story/thunks';
import {pushPopup} from '../../../../src/reducers/popup';
import ReportPopup from '../../../layout/popup/ReportPopup';
import Avatar from '../../../Avatar';
import {timeSince} from '../../../../src/lib/date';
import {under} from '../../../../src/lib/numbers';
import {OPEN_RANGE_TO_KOR_LABEL} from '../../../../src/constants/users';
import Label from '../../../UI/tag/Label';
import {$FONT_COLOR, $POINT_BLUE, $WHITE} from '../../../../styles/variables.types';
import MeetupBasicInfo from '../../extension/meetup/MeetupBasicInfo';
import {StoryPreview, UrlCard} from '../../embeds2';
import WaterMark from '../../../watermark';
import MeetupDetailInfo from '../../extension/meetup/MeetupDetailInfo';
import Tag from '../../../UI/tag/Tag';
import StoryReaction from '../../StoryReaction2';
import * as React from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {FeedTitle, InfoLi, UserFollowInfo, LayerPopUpUl, MoreBtn, ShowDetailContentByBodyType, StyledButton, DictUl, PointDiv, PointButton} from '../../common2';
import TransBg from '../../../TransBg';
import DictCard from '../../../dict/DictCard';
import FileList from '../../../editor/FileList';
import MeetupPaymentTable from '../../extension/meetup/MeetupPaymentTable';
import {useRouter} from "next/router";
import Loading from '../../../common/Loading';
import Link from "next/link";
import UrlPopup from '../../../layout/popup/UrlPopup';
import GuideLabel from "../GuideLabel";
import ReceivedPoint from '../../extension/point/ReceivedPoint/index2';
import useLocation from '../../../../src/hooks/router/useLocation';
import {RootState} from '../../../../src/reducers';
import {pickUserSelector} from '../../../../src/reducers/orm/user/selector';
import {followUser} from '../../../../src/reducers/orm/user/follow/thunks';
import {StoryBlind} from '../../StoryBlind';
import {Query} from "@apollo/react-components";
import isEmpty from 'lodash/isEmpty';
import {INFO_UPLOAD_WIKIS} from '../../../../src/gqls/wiki';
import styled from 'styled-components';
import {CenterWrapper, StoryLabelP} from '../../common';
import TitleCard from '../../../UI/Card/TitleCard';

const StyledTitleCard = styled(TitleCard)`
  padding: 12px 0;
  border-top: 0;
  border-bottom: 10px solid #f2f5f7;

  @media screen and (max-width: 680px) {
    ${StoryLabelP} {
      padding: 0 15px;
    }
  }
`;


const StoryDefault = React.memo((
  {
    id,
    title,
    user,
    user_types,
    created_at,
    retrieve_count,
    summary,
    body,
    body_type,
    tags,
    up_count,
    down_count,
    comment_count,
    images,
    is_notice,
    is_follow,
    is_report,
    reaction_type,
    extend_to,
    className,
    preview,
    detail,
    extension: _extension,
    url_card,
    applies,
    payments,
    highlightKeyword,
    can_comment,
    can_reaction,
    can_follow,
    can_reply,
    wikis,
    files,
    is_payment,
    is_apply,
    access_permission,
    additional_data,
    stickers = [],
    user_expose_type,
    has_my_comments,
    // >>> injected props
    access,
    isWriter,
    isMeetup,
    labelArr,
    waterMarkProps,
    open_range,
    video,
    received_point,
    blind_reason,
    status,
    can_give_points
  },
) => {
  const router = useRouter();
  const extension = _extension || {};
  const {
    status: extensionStatus,
    products: extensionProducts = []
  } = extension;
  const {location: {pathname}} = useLocation();

  const TitleLabel = React.useCallback<React.FC>(() => {
    if (is_notice) {
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
  const [showPaymentTable, setShowPaymentTable] = React.useState(false);
  const [isPreview, setIsPreview] = React.useState(detail || true);

  // Redux
  const dispatch = useDispatch();
  const writer = useSelector(
    ({orm}: RootState) => (pickUserSelector((user || {}).id)(orm) || {}),
    shallowEqual,
  );

  const {is_follow: isWriterFollow} = writer;

  React.useEffect(() => {
    if (detail) {
      setIsPreview(false);
      dispatch(fetchStoryThunk(id));
    }
  }, [detail, id]);

  const canCheckReceivedPoint = !!user && (!!user.name || !!user.nick_name);

  // 블라인드 boolean
  const isBlind = status === 'blinded';

  return (
    <>
      <StyledTitleCard className={cn('', [className])}>
        <CenterWrapper>
          <TitleLabel />
          <MoreBtn onClick={() => setShowOption(true)}>
            <img
              src={staticUrl('/static/images/icon/icon-more-btn.png')}
              alt="더보기"
            />
          </MoreBtn>
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
                            router.push('/story/[id]/edit', `/story/${id}/edit`)
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
                    {/*{can_reply && (*/}
                    {/*  <li*/}
                    {/*    onClick={() => {*/}
                    {/*      dispatch(pushPopup(EditorPopup, {*/}
                    {/*        writeType: 'reply',*/}
                    {/*        writeStoryApi: formData => storyApi.reply(id, formData),*/}
                    {/*        defaultTitle: `RE: ${title}`,*/}
                    {/*        openRangeList: [*/}
                    {/*          {label: '전체공개', value: 'human'},*/}
                    {/*          {label: '회원공개', value: 'user_all'},*/}
                    {/*          {label: '나만보기', value: 'only_me'},*/}
                    {/*        ],*/}
                    {/*      }));*/}
                    {/*    }}*/}
                    {/*  >*/}
                    {/*    <img*/}
                    {/*      src={staticUrl('/static/images/icon/icon-edit.png')}*/}
                    {/*      alt="답글"*/}
                    {/*    />*/}
                    {/*    답글*/}
                    {/*    <span>해당 글을 수정합니다.</span>*/}
                    {/*  </li>*/}
                    {/*)}*/}
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
                <li onClick={() => dispatch(pushPopup(UrlPopup, {storyPK: id}))}>
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
          <FeedTitle user={user}>
            {stickers.map(props => (
              <GuideLabel {...props} />
            ))}
            <h2>
              <Link href="/story/[id]" as={`/story/${id}`}>
                <a>{title}</a>
              </Link>
            </h2>
            <ul className="attrs">
              {user ? (
                <>
                  <InfoLi userName={user.name}>
                    <Avatar
                      src={user.avatar}
                      {...user}
                      userExposeType={user_expose_type}
                    />
                  </InfoLi>
                  {(!!user.name && !isWriter) && (
                    <UserFollowInfo>
                      {!isWriterFollow ? (
                        <div
                          className="follow-add"
                          onClick={() => {
                            dispatch(followUser(user.id));
                          }}
                        >
                          <img
                            src={staticUrl('/static/images/icon/icon-story-follow-add.png')}
                            alt="팔로우"
                          />
                          팔로우
                        </div>
                      ) : (
                        <div
                          className="follow-cancel"
                          onClick={() => {
                            dispatch(followUser(user.id));
                          }}
                        >
                          <img
                            src={staticUrl('/static/images/icon/icon-story-follow-cancel.png')}
                            alt="팔로우 취소"
                          />
                          팔로우 취소
                        </div>
                      )}
                    </UserFollowInfo>
                  )}
                </>
              ) : (
                <InfoLi>익명의 유저</InfoLi>
              )}
              <InfoLi>
                {timeSince(created_at)}&nbsp;·
              </InfoLi>
              <InfoLi>
                조회 {under(retrieve_count)}
              </InfoLi>
              <li className="user-label-wrapper">
                <ul className="user-label">
                  {labelArr.map(label => {
                    const koreanLabel = OPEN_RANGE_TO_KOR_LABEL[label] || label;

                    return (
                      <li key={id + label}>
                        <Label
                          name={koreanLabel}
                          color={label === 'anonymous' ? $POINT_BLUE : '#999'}
                          borderColor={label === 'anonymous' ? $POINT_BLUE : '#ccc'}
                        />
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </FeedTitle>
          {(isMeetup && !isBlind) && (
            <MeetupBasicInfo user_types={user_types} {...extension} detail={!isPreview}/>
          )}
          {(isMeetup && !isBlind) && (
            <MeetupDetailInfo {...extension} detail={!isPreview}/>
          )}
          <div className="no-select story-body">
            {isBlind ? (
              <StoryBlind reason={blind_reason}/>
            ) : (
              isPreview ? (
                <StoryPreview
                  waterMarkProps={waterMarkProps}
                  contentPreview={summary}
                  previewImage={{
                    src: images.length ? images[0].image : '',
                    length: images.length,
                  }}
                  hasMoreBtn
                  onClick={() => {
                    setIsPreview(false);
                    dispatch(fetchStoryThunk(id));
                  }}
                  highlightKeyword={highlightKeyword}
                  video={video}
                />
              ) : (
                (typeof window !== 'undefined' && body_type && body) ? (
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
          {showPaymentTable && (
            <MeetupPaymentTable
              id={id}
              title={title}
              products={extensionProducts}
              access_permission={access_permission}
              is_apply={is_apply}
            />
          )}
          {(isMeetup && !showPaymentTable && !isBlind) && (
            (isWriter && !!applies) && (
              <StyledButton
                style={{marginBottom: '8px'}}
                size={{width: '240px', height: '39px'}}
                backgroundColor={$FONT_COLOR}
                font={{size: '15px', weight: '600', color: $WHITE}}
                border={{radius: '20px'}}
                onClick={() => (
                  isEmpty(applies) ? (
                    alert('아직 신청자 목록이 없습니다.')
                  ) : (
                    router.push('/story[id]/applicant', `/story/${id}/applicant`)
                  )
                )}
              >
                신청자 목록 보기
              </StyledButton>
            )
          )}
          {canCheckReceivedPoint && (
            <ReceivedPoint
              storyPk={id}
              canSendPoint={can_give_points}
              receivedPoint={received_point}
              isWriter={isWriter}
            />
          )}
          <ul className="tag">
            {tags && tags.map(({id, name, is_follow}) => (
              <li key={id} style={{display: 'inline-block'}}>
                <Tag
                  name={name}
                  highlighted={is_follow}
                  textHighlighted={highlightKeyword === name}
                  onClick={() => router.push(`/tag/${id}`)}
                />
              </li>
            ))}
          </ul>
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
            can_comment={can_comment}
            can_reaction={can_reaction}
            can_follow={can_follow}
            user_expose_type={user_expose_type}
            has_my_comments={has_my_comments}
            // for watermark
            open_range={open_range}
            waterMarkProps={waterMarkProps}
          />
        </CenterWrapper>
      </StyledTitleCard>
    </>
  );
});
StoryDefault.displayName = 'StoryDefault';

export default StoryDefault;
