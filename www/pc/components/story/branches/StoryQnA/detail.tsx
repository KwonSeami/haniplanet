import * as React from 'react';
import {useDispatch} from 'react-redux';
import StoryLabelCard2 from '../../../UI/Card/StoryLabelCard2';
import classNames from 'classnames';
import {CountSpan, FeedTitle, InfoLi, LayerPopUpUl, MoreBtn, ShowDetailContentByBodyType, DictUl} from '../../common2';
import {staticUrl} from '../../../../src/constants/env';
import TransBg from '../../../TransBg';
import {
  deleteStoryThunk,
  fetchStoryThunk,
  increaseQnaUpCountThunk,
  sendStoryReportThunk,
} from '../../../../src/reducers/orm/story/thunks';
import {pushPopup} from '../../../../src/reducers/popup';
import ReportPopup from '../../../layout/popup/ReportPopup';
import Avatar from '../../../AvatarDynamic';
import {timeSince} from '../../../../src/lib/date';
import {under} from '../../../../src/lib/numbers';
import {OPEN_RANGE_TO_KOR_LABEL} from '../../../../src/constants/users';
import Label from '../../../UI/tag/Label';
import {$POINT_BLUE} from '../../../../styles/variables.types';
import {StoryPreview, UrlCard} from '../../embeds';
import WaterMark from '../../../watermark';
import Tag from '../../../UI/tag/Tag';
import StoryReaction2 from '../../StoryReaction2';
import DictCard from '../../../dict/DictCard';
import FileList from '../../../editor/external/FileList';
import {useRouter} from 'next/router';
import Loading from '../../../common/Loading';
import useCallAccessFunc from '../../../../src/hooks/session/useCallAccessFunc';
import StoryApi from '../../../../src/apis/StoryApi';
import UrlPopup from '../../../layout/popup/UrlPopup';
import { StoryBlind } from '../../StoryBlind';
import styled from 'styled-components';
import isEmpty from "lodash/isEmpty";
import {Query} from "@apollo/react-components";
import {INFO_UPLOAD_WIKIS} from '../../../../src/gqls/wiki';

const StyledAvatar = styled(Avatar)`
  margin: 0 0 -6px;
  
  & > div {
    margin: -2px 6px 0 0;
    vertical-align: middle;
  }
`;

const StoryQnADetail = React.memo((
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
    extension,
    url_card,
    applies,
    payments,
    highlightKeyword,
    can_comment,
    can_reaction,
    can_follow,
    can_reply,
    parent,
    wikis,
    files,
    has_my_comments,
    // >>> injected props
    access,
    isWriter,
    isMeetup,
    labelArr,
    waterMarkProps,
    open_range,
    video,
    status,
    blind_reason,
  },
) => {
  // State
  const router = useRouter();
  const [showOption, setShowOption] = React.useState(false);
  const [isPreview, setIsPreview] = React.useState(detail || true);
  const dispatch = useDispatch();

  // API
  const storyApi = useCallAccessFunc(access => new StoryApi(access));

  React.useEffect(() => {
    if (detail) {
      setIsPreview(false);
      dispatch(fetchStoryThunk(id));
    }
  }, [detail, id]);

  // 블라인드 boolean
  const isBlind = status === 'blinded';

  return (
    <>
      <StoryLabelCard2
        className={classNames('no-select', [className])}
        is_notice={is_notice}
      >
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
                    </>
                  )}
                  {!isWriter && (
                      <li
                        onClick={() => {
                          if (is_report) {
                            alert("이미 신고되었습니다.");
                          } else {
                            dispatch(pushPopup(
                              ReportPopup,
                            {
                              onClick: (form) => dispatch(sendStoryReportThunk(id, form)),
                            },
                          ))}
                        }}
                    >
                      <img
                        src={staticUrl('/static/images/icon/icon-report.png')}
                        alt="신고하기"
                      />
                      신고하기
                      <span>해당 글을 신고합니다.</span>
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
        <FeedTitle user={user}>
          <h2>
            {title}
          </h2>
          <ul className="attrs">
            {user ? (
              <InfoLi userName={user.name}>
                <StyledAvatar
                  size={30}
                  src={user.avatar}
                  {...user}
                />
              </InfoLi>
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
        {isBlind ? (
          <StoryBlind reason={blind_reason}/>
        ) : (
          isPreview ? (
            <StoryPreview
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
          ) : ((typeof window !== 'undefined' && body_type && body) ? (
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
          up_count={up_count}
          down_count={down_count}
          comment_count={comment_count}
          is_writer={isWriter}
          is_follow={is_follow}
          reaction_type={reaction_type}
          can_comment={can_comment}
          can_reaction={can_reaction}
          can_follow={can_follow}
          has_my_comments={has_my_comments}
        >
          <li onClick={() => dispatch(increaseQnaUpCountThunk(id))}>
            <img
              src={staticUrl('/static/images/icon/icon-like.png')}
              alt="도움됐어요"
            />
            <p>{parent ? '도움됐어요' : '궁금해요'}</p>
            <CountSpan on={reaction_type === 'down'}>{under(extension.up_count)}</CountSpan>
          </li>
        </StoryReaction2>
      </StoryLabelCard2>
    </>
  );
});

StoryQnADetail.displayName = 'StoryQnADetail';

export default StoryQnADetail;
