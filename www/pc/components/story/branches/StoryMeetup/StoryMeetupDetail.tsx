import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import StoryLabelCard2, {StoryLabelP} from '../../../UI/Card/StoryLabelCard2';
import cn from 'classnames';
import {
  MoreBtn, 
  LayerPopUpUl, 
  InfoLi, 
  UserFollowInfo, 
  StyledButton, 
  ShowDetailContentByBodyType} from '../../common2';
import {staticUrl} from '../../../../src/constants/env';
import TransBg from '../../../TransBg';
import {pushPopup} from '../../../../src/reducers/popup';
import {deleteStoryThunk, fetchStoryThunk} from '../../../../src/reducers/orm/story/thunks';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import UrlPopup from '../../../layout/popup/UrlPopup';
import {$WHITE, $POINT_BLUE, $BORDER_COLOR, $FONT_COLOR, $TEXT_GRAY} from '../../../../styles/variables.types';
import Avatar from '../../../AvatarDynamic';
import {followUser} from '../../../../src/reducers/orm/user/follow/thunks';
import {under} from '../../../../src/lib/numbers';
import {OPEN_RANGE_TO_KOR_LABEL} from '../../../../src/constants/users';
import Label from '../../../UI/tag/Label';
import {RootState} from '../../../../src/reducers';
import {pickUserSelector} from '../../../../src/reducers/orm/user/selector';
import {timeSince} from '../../../../src/lib/date';
import { fontStyleMixin } from '../../../../styles/mixins.styles';
import MeetupBasicInfo from '../../extension/meetup/MeetupBasicInfo';
import MeetupDetailInfo from '../../extension/meetup/MeetupDetailInfo';
import MeetupPaymentTable from '../../extension/meetup/MeetupPaymentTable';
import StoryReaction2 from '../../StoryReaction2';
import Tag from '../../../UI/tag/Tag';
import {useRouter} from 'next/router';
import MeetupApplyPopup from '../../MeetupApplyPopup';
import {UrlCard} from '../../embeds';
import {StoryBlind} from '../../StoryBlind';
import WaterMark from '../../../watermark';
import Loading from '../../../common/Loading';
import {fetchUserThunk} from '../../../../src/reducers/orm/user/thunks';
import {APPLIED_STATUS_LIST} from '../../../../src/constants/meetup';

const StyledStoryDetail = styled(StoryLabelCard2)`
  position: relative;
  width: 760px;
  margin: auto;
  box-sizing: border-box;
  padding: 20px 40px 40px;
  background-color: ${$WHITE};
  border: 0;
  cursor: default;

  > div.user-label-container { position: relative;}

  .show-label {
    top: 40px;
    right: 40px;
  }

  .user-label-wrapper {
    position: absolute;
    right: 42px;
    top: 22px;
    padding-top: 0;

    .label {
      margin-left: 2px;
    }
    li {
      display: inline-block;
      vertical-align: middle;
      padding-left: 4px;
    }
  }

  ${StoryLabelP} {
    margin: 0;
    padding: 24px 0 20px;
  }

  .wrapper-title {
    position: relative;
    height: 172px;
    padding: 14px 0 20px;
    border-top: 1px solid ${$BORDER_COLOR};
    box-sizing: border-box;

    h2 {
      padding-right: 130px;
      ${fontStyleMixin({
        size: 22,
        weight: '300',
      })};
    }

    .attrs {
      position: absolute;
      bottom: 24px;

      .avatar {
        margin: 0 0 -6px;
        
        & > div {
          margin: -2px 6px 0 0;
          vertical-align: middle;
        }
      }
    }

    .img-box {
      position: absolute;
      top: 20px;
      right: 0;
      width: 130px;
      height: 130px;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
`;

const StatusLabel = styled.span`
  display: inline-block;
  vertical-align: middle;
  width: 55px;
  height: 20px;
  margin: -3px 0 0 5px;
  text-align: center;
  line-height: 19px;
  background-color: ${$POINT_BLUE};
  ${fontStyleMixin({
    size: 11,
    weight: 'bold',
    color: $WHITE
  })};
`;

const StoryMeetup  = React.memo(({
  detail,
  label,
  access,
  id,
  title,
  tags,
  body,
  body_type,
  up_count,
  down_count,
  comment_count,
  reaction_type,
  is_follow,
  is_apply,
  className,
  user = {},
  user_types,
  created_at,
  retrieve_count,
  user_expose_type,
  extension,
  url_card,
  applies,
  payments,
  highlightKeyword,
  can_comment,
  can_reaction,
  can_follow,
  access_permission,
  questions,
  answers,
  has_my_comments,
  my_applies,
  onclass_periods,
  // >>> injected props
  isWriter,
  isMeetup,
  labelArr,
  waterMarkProps,
  open_range,
  received_point,
  can_give_points,
  blind_reason
}) => {
  const router = useRouter();
  const {query: {option}} = router;

  // Redux
  const dispatch = useDispatch();

  const writer = useSelector(
    ({orm}: RootState) => pickUserSelector((user || {}).id)(orm) || {},
    shallowEqual,
  );
  const {is_follow: isWriterFollow} = writer;

  // State
  const [showPaymentTable, setShowPaymentTable] = React.useState(false);
  const [showOption, setShowOption] = React.useState(false);

  // 블라인드 boolean
  const isBlind = status === 'blinded';

  // Fetch Story
  React.useEffect(() => {
    dispatch(fetchStoryThunk(id, 0, () => {
      setShowPaymentTable(is_apply && !isWriter);
    }));
  }, [id, is_apply, isWriter]);

  // Fetch User
  React.useEffect(() => {
    dispatch(fetchUserThunk(user.id));
  }, [user.id]);

  React.useEffect(() => {
    if (option === 'payment') {
      setShowPaymentTable(true);
    }
  }, [option]);

  return detail && (
    <StyledStoryDetail
      className={cn('', [className])}
      label={label}
    >
      <MoreBtn
        className="show-label"
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
            {!!isWriter && (
              <>
                {applies.length <= 0 && (
                  <li onClick={() => dispatch(deleteStoryThunk(id, `등록하신 ${title}이(가) 삭제됩니다.`, () => router.push('/meetup')))}>
                    <img
                      src={staticUrl('/static/images/icon/icon-delete.png')}
                      alt="삭제"
                    />
                    삭제
                    <span>해당 글을 삭제합니다.</span>
                  </li>
                )}
                {(body_type === 'froala' && extension.status !== 'end') && (
                  <li
                    onClick={() => router.push(`/meetup/${id}/edit`)}
                  >
                    <img
                      src={staticUrl('/static/images/icon/icon-edit.png')}
                      alt="수정"
                    />
                    수정
                    <span>해당 글을 수정합니다.</span>
                  </li>
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
      <div className="user-label-container">
        <div className="user-label-wrapper">
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
        </div>
        <StoryLabelP>
          {extension.category}
          {extension.is_online_meetup && (<span>&nbsp;&nbsp;·&nbsp;&nbsp;온라인 강의</span>)}
        </StoryLabelP>
        <div className="wrapper-title">
          <h2>
            {title}
            <StatusLabel
              style={{backgroundColor: APPLIED_STATUS_LIST[extension.status].color}}
            >
              {APPLIED_STATUS_LIST[extension.status].status}
            </StatusLabel>
          </h2>
          <div className="img-box">
            <img
              src={staticUrl(extension.avatar)}
              alt="세미나 이미지"
            />
          </div>
          <ul className="attrs">
            {user ? (
              <>
                <InfoLi userName={user.name}>
                  <Avatar
                    size={28}
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
          </ul>
        </div>
      </div>
      <section>
        <MeetupBasicInfo
          title={title}
          user_types={user_types}
          detail={detail}
          {...extension}
        />
        <MeetupDetailInfo
          {...extension}
          detail={detail}
          is_online_meetup={extension.is_online_meetup}
        />
      </section>
      <div className="no-select">
        {isBlind ? (
          <StoryBlind reason={blind_reason} />
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
        )}
      </div>
      {(url_card && (url_card.title || url_card.description)) && (
        <UrlCard
          highlightKeyword={highlightKeyword}
          url_card={url_card}
        />
      )}
      {showPaymentTable && (
        <MeetupPaymentTable
          id={id}
          title={title}
          products={extension.products}
          questions={questions}
          is_online_meetup={extension.is_online_meetup}
        />
      )}
      {(isMeetup && !showPaymentTable && !isBlind) && (
        isWriter ? (
          <StyledButton
            style={{margin: '50px auto 8px'}}
            size={{width: '240px', height: '39px'}}
            backgroundColor={$FONT_COLOR}
            font={{size: '15px', weight: '600', color: $WHITE}}
            border={{radius: '20px'}}
            onClick={() => (
              isEmpty(applies) ? (
                alert('아직 신청자 목록이 없습니다.')
              ) : (
                dispatch(pushPopup(MeetupApplyPopup, {
                  storyPk: id,
                  is_online_meetup: extension.is_online_meetup,
                }))
              )
            )}
          >
            신청자 목록 보기
          </StyledButton>
        ) : (
          ((extension.status === 'ongoing' || extension.status === 'deadline') && !extension.is_cancelled) && (
            <>
              <StyledButton
                style={{
                  margin: '50px auto 8px'
                }}
                size={{
                  width: '240px',
                  height: '39px'
                }}
                backgroundColor={
                  is_apply
                  ? $TEXT_GRAY
                  : $FONT_COLOR
                }
                font={{
                  size: '15px',
                  weight: '600',
                  color: $WHITE
                }}
                border={{radius: '20px'}}
                onClick={() => setShowPaymentTable(true)}
              >
                {(is_apply || (!is_apply && extension.onclass_learning_status === 'normal')) ? '결제 완료' : '세미나 신청하기'}
              </StyledButton>
            </>
          )
        )
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
        reaction_type={reaction_type}
        can_comment={can_comment}
        can_reaction={can_reaction}
        can_follow={can_follow}
        user_expose_type={user_expose_type}
        has_my_comments={has_my_comments}
        // for watermark
        isMeetup={isMeetup}
        open_range={open_range}
        waterMarkProps={waterMarkProps}
        variant="meetup"
      />
    </StyledStoryDetail>
  )
});

StoryMeetup.displayName = 'StoryMeetup';
export default StoryMeetup;
