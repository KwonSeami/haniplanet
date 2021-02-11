import * as React from 'react';
import cn from 'classnames';
import {staticUrl} from '../../../../src/constants/env';
import {
  blockStoryThunk,
  deleteStoryThunk,
  fetchStoryThunk,
  sendStoryReportThunk,
  blockUserThunk,
} from '../../../../src/reducers/orm/story/thunks';
import {pushPopup} from '../../../../src/reducers/popup';
import ReportPopup from '../../../layout/popup/ReportPopup';
import Avatar from '../../../AvatarDynamic';
import {timeSince} from '../../../../src/lib/date';
import {under} from '../../../../src/lib/numbers';
import {OPEN_RANGE_TO_KOR_LABEL} from '../../../../src/constants/users';
import Label from '../../../UI/tag/Label';
import {$FONT_COLOR, $POINT_BLUE, $WHITE} from '../../../../styles/variables.types';
import MeetupBasicInfo from '../../extension/meetup/MeetupBasicInfo';
import {StoryPreview, UrlCard} from '../../embeds';
import WaterMark from '../../../watermark';
import MeetupDetailInfo from '../../extension/meetup/MeetupDetailInfo';
import Tag from '../../../UI/tag/Tag';
import MeetupApplyPopup from '../../MeetupApplyPopup';
import StoryReaction2 from '../../StoryReaction2';
import StoryLabelCard2, {NoticeIcon, StoryLabelP} from '../../../UI/Card/StoryLabelCard2';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {FeedTitle, InfoLi, LayerPopUpUl, MoreBtn, ShowDetailContentByBodyType, StyledButton, DictUl, UserFollowInfo} from '../../common2';
import TransBg from '../../../TransBg';
import DictCard from '../../../dict/DictCard';
import useCallAccessFunc from '../../../../src/hooks/session/useCallAccessFunc';
import StoryApi from '../../../../src/apis/StoryApi';
import FileList from '../../../editor/external/FileList';
import MeetupPaymentTable from '../../extension/meetup/MeetupPaymentTable';
import {useRouter} from "next/router";
import Loading from '../../../common/Loading';
import Link from "next/link";
import UrlPopup from '../../../layout/popup/UrlPopup';
import GuideLabel from '../GuideLabel';
import ReceivedPoint from '../../extension/point/ReceivedPoint/index2';
import {followUser} from '../../../../src/reducers/orm/user/follow/thunks';
import {RootState} from '../../../../src/reducers';
import {pickUserSelector} from '../../../../src/reducers/orm/user/selector';
import useLocation from '../../../../src/hooks/router/useLocation';
import {StoryBlind} from '../../StoryBlind';
import styled from 'styled-components';
import {Query} from "@apollo/react-components";
import isEmpty from 'lodash/isEmpty';
import {INFO_UPLOAD_WIKIS} from '../../../../src/gqls/wiki';
import KollusApi from "../../../../src/apis/KollusApi";

const StyledAvatar = styled(Avatar)`
  margin: 0 0 -6px;
  
  & > div {
    margin: -2px 6px 0 0;
    vertical-align: middle;
  }
`;

const StoryDefaultDetail = React.memo((
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
    applies = [],
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
    my_applies,
    onclass_periods,
    // >>> injected props
    access,
    isWriter,
    isMeetup,
    questions,
    labelArr,
    waterMarkProps,
    open_range,
    video,
    received_point,
    status,
    blind_reason,
    can_give_points,
    is_lecture
  },
) => {
  const router = useRouter();
  const extension = _extension || {};
  const {
    status: extensionStatus,
    is_online_meetup,
    products: extensionProducts = []
  } = extension;
  const {location: {pathname}} = useLocation();

  const label = React.useMemo(() => {
    if (is_notice) {
      return <NoticeIcon/>;
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
  const [kollusVideo, setKollusVideo] = React.useState('');

  // Redux
  const dispatch = useDispatch();
  const writer = useSelector(
    ({orm}: RootState) => (pickUserSelector((user || {}).id)(orm) || {}),
    shallowEqual,
  );

  const {is_follow: isWriterFollow} = writer;
  // API
  const storyApi = useCallAccessFunc(access => new StoryApi(access));
  const kollusApi: KollusApi = useCallAccessFunc(access => new KollusApi(access));

  React.useEffect(() => {
    if (detail) {
      setIsPreview(false);
      dispatch(fetchStoryThunk(id));
    }
  }, [detail, id]);

  React.useEffect(() => {
    if (is_lecture) {
      kollusApi.jwtToken({story_id: id})
        .then(({data: {result}}) => {
          if (!!result) {
            const {token, kollus_custom_key} = result;

            setKollusVideo(`https://v.kr.kollus.com/s?jwt=${token}&custom_key=${kollus_custom_key}&player_version=v3`);
          }
        });
    }
  }, [is_lecture, id]);

  const canCheckReceivedPoint = !!user && (!!user.name || !!user.nick_name);

  // 블라인드 boolean
  const isBlind = status === 'blinded';

  return (
    <>
      <StoryLabelCard2
        className={cn('', [className])}
        label={label}
      >
        <MoreBtn
          className={cn({'show-label': label})}
          onClick={() => setShowOption(true)}
        >
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
                              extend_to === 'meetup'
                                ? router.push('/meetup/[id]/edit', `/meetup/${id}/edit`)
                                : router.push('/community/[id]/edit', `/community/${id}/edit`)
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
                  {/*      alt="대댓글"*/}
                  {/*    />*/}
                  {/*    대댓글*/}
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
                  <StyledAvatar
                    size={30}
                    src={user.avatar}
                    {...user}
                    userExposeType={user_expose_type}
                  />
                </InfoLi>
                {(!!user.name && !isWriter) && (
                  <UserFollowInfo>
                    {isWriterFollow ? (
                      <div
                        className="follow-cancel"
                        onClick={() => {
                          dispatch(followUser(user.id));
                        }}
                      >
                        <img
                          src={staticUrl('/static/images/icon/check/icon-story-follow-cancel.png')}
                          alt="팔로우 취소"
                        />
                        팔로우 취소
                      </div>
                    ) : (
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
                    <li>
                      <Label
                        key={id + label}
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
          <MeetupBasicInfo
            title={title}
            user_types={user_types}
            detail={!isPreview}
            {...extension}
          />
        )}
        {(isMeetup && !isBlind) && (
          <MeetupDetailInfo
            {...extension}
            title={title}
            detail={!isPreview}
          />
        )}
        {kollusVideo ? (
          <div>
            <iframe
              style={{width:'100%', height: '400px'}}
              src={kollusVideo}
              frameBorder="0"
              allowFullScreen
            />
          </div>
        ) : (
          <div>
            <div className="no-select">
              {isBlind ? (
                <StoryBlind reason={blind_reason} />
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
                    video={video}
                    highlightKeyword={highlightKeyword}
                    kollusVideo={kollusVideo}
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
                questions={questions}
                is_online_meetup={is_online_meetup}
                is_apply={is_apply}
                my_applies={my_applies}
                onclass_periods={onclass_periods}
                status={extension.onclass_learning_status || extension.status}
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
                      dispatch(pushPopup(MeetupApplyPopup, {
                        storyPk: id
                      }))
                    )
                  )}
                >
                  신청자 목록 보기
                </StyledButton>
              )
            )}
          </div>
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
        <StoryReaction2
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
      </StoryLabelCard2>
    </>
  );
});

StoryDefaultDetail.displayName = 'StoryDefaultDetail';

export default StoryDefaultDetail;
