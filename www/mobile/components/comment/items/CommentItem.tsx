import React from 'react';
import {Query} from "@apollo/react-components";
import {staticUrl} from "../../../src/constants/env";
import Label from "../../UI/tag/Label";
import {USER_TYPE_TO_KOR} from "../../../src/constants/users";
import {$FONT_COLOR, $TEXT_GRAY, $POINT_BLUE, $BORDER_COLOR, $WHITE, $GRAY} from "../../../styles/variables.types";
import {toDateFormat} from "../../../src/lib/date";
import StoryCommentApi from "../../../src/apis/StoryCommentApi";
import {updateStory} from "../../../src/reducers/orm/story/storyReducer";
import Avatar from '../../AvatarDynamic';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import {under} from '../../../src/lib/numbers';
import {inlineBlockMixin, fontStyleMixin, backgroundImgMixin} from '../../../styles/mixins.styles';
import Linkify from "react-linkify";
import blindReasonText from "../commentUtils";
import A from "../../UI/A";
import DictCard from '../../dict/DictCard';
import {pushPopup} from '../../../src/reducers/popup';
import ReportPopup from '../../layout/popup/ReportPopup';
import {INFO_UPLOAD_WIKIS} from '../../../src/gqls/wiki';
import {useRouter} from 'next/router';
import HashReload from "../../HashReload";
import {HEADER_HEIGHT} from "../../../styles/base.types";
import useWindowSize from '../../../src/hooks/useWindowSize';
import {HashId} from '@hanii/planet-types';
import cn from 'classnames';
import {ONCLASS_MEMBER} from '../../../src/constants/meetup';
import {pickBandSelector} from '../../../src/reducers/orm/band/selector';
import {pickTimelineSelector} from '../../../src/reducers/orm/timeline/selector';

export interface IDefaultCommentItemProps {
  access: string | null;
  depth: number;
  targetPk: string | number;
  targetName: string;
  parentPk: string;
  reaction: (parentPk: string, reactionType: string) => void;
  data: any;
  maxDepth?: number;
  on?: boolean;
}

const CommentItemLi = styled.li`
  position: relative;
  margin-bottom: 0;
  padding: 14px 15px 13px 55px;

  &.onclass-answer {
    margin-top: 12px;
    border-top: 1px solid ${$BORDER_COLOR};
    background-color: #edf7ff;

    .user .owner-mark::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 18px;
      width: 14px;
      height: 14px;
      ${backgroundImgMixin({
        img: staticUrl('/static/images/icon/onclass-owner.png'),
        size: '100% 100%'
      })};
    }

    .comment-write {
      background-color: #edf7ff;
    }
  }

  & ~ & {
    border-top: 1px solid ${$BORDER_COLOR};
  }

  .anchor-position {
    position: absolute;
    top: -${HEADER_HEIGHT + 2}px;
    left: 0;
    height: 0;
  }
  
  h2 {
    &.user {
      a {
        display: inline-block;
      }

      .onclass-status {
        margin-left: 2px;
        ${fontStyleMixin({
          size: 14,
          color: $GRAY,
        })};
      }
      
      .onclass-owner {
        vertical-align: middle;
      }
    }

    .avatar {
      position: relative;
      display: inline-block;
      margin: 0 0 -6px -40px;
      
      > div {
        margin-right: 10px;
        vertical-align: middle;
      }

      .comment-item div & {
        & > div {
          top: 0;
          left: 0;
        }
      }
    }
  }
  .pre-line {
    margin-top: 9px;
    ${fontStyleMixin({
      size: 14,
      color: $GRAY,
    })};
  }
  
  .add-picture,
  .dict-wrap {
    margin-top: 9px;
  }
  
  .label {
    margin-left: 4px;
  }

  .date {
    margin-left: 4px;
    ${fontStyleMixin({
      size: 12,
      color: $TEXT_GRAY
    })}
  }

  .qa-status {
    display: inline-block;
    vertical-align: middle;
    height: 16px;
    line-height: 15px;
    margin: -1px 0 0 7px;
    padding: 0 3px;
    text-align: center;
    ${fontStyleMixin({
      size: 11,
      color: '#999'
    })};
    color: ${$POINT_BLUE};
    border: 1px solid #499aff;
  }
  
  .blind {
    color: ${$TEXT_GRAY};

    img {
      vertical-align: -2px;
      width: 19px;
      height: 12px;
    }
  }
  /* 대댓글 Input(대댓글)영역 */
  article {
    padding: 0;
    margin-top: 14px;
    border-bottom: 0;

    &::before {
      content: '';
      position: absolute;
      left: -15px;
      width: 1px;
      height: 100%;
      border-left: 1px solid ${$BORDER_COLOR};
    }
  }
   /* 대댓글 아이템 */
  .comment-item {
    padding: 0 0 0 40px;
    margin-top: 16px;
    border-top: 0;

    & ~ .comment-item:last-child {
      margin-bottom: 7px;
    }

    &::before {
      content: '';
      position: absolute;
      left: -15px;
      width: 1px;
      height: 100%;
      border-left: 1px solid ${$BORDER_COLOR};
    }

    button {
      top: 0;
      right: 0;
    }
  }

  @media screen and (max-width: 680px) {
    padding-left: 15px;

    &.onclass-answer {
      .user .avatar::after {
        bottom: -3px;
        left: 13px;
      }
    }

    h2 .avatar {
      margin: 0 0 -6px;
      
      div {
        position: relative;
        top: auto;
        left: auto;
      }
    }
    /* 대댓글 wrapper */
    .comment-list {
      padding-left: 15px;
    }
    /* 대댓글 아이템 */
    .comment-item {
      padding: 0;
    }
  }
`;

const UserBtnUl = styled.ul`
  float: left;
  margin-left: -3px;

  &:last-child {
    float: right;
    margin: 0;
  }

  @media screen and (max-width: 680px) {
    &:last-child {
      float: none;
    }
  }
`;

const UserBtnLi = styled.li<Pick<IDefaultCommentItemProps, 'on'>>`
  display: inline-block;
  vertical-align: middle;
  
  padding: 9px 15px 0 0;
  font-size: 13px;
  color: ${props => props.on ? $FONT_COLOR : $TEXT_GRAY};

  img {
    margin: -5px 3px 0 0;
    ${inlineBlockMixin(17)};

    &.img-on {
      display: none;
    }
  }

  span {
    color: ${props => props.on ? $POINT_BLUE : $TEXT_GRAY};
  }

  &:hover {
    color: ${$FONT_COLOR};

    .img-off {
      display: none;
    }

    .img-on {
      display: inline-block !important;
    }

    span {
      color: ${$POINT_BLUE};
    }
  }
`;

const LayerPopUpUl = styled.ul`
  position: absolute;
  right: 9px;
  top: 14px;
  z-index: 2;
  background-color: ${$WHITE};
  border-bottom: 1px solid ${$BORDER_COLOR};

  li {
    position: relative;
    width: 230px;
    padding: 13px 15px 12px 45px;
    box-sizing: border-box;
    border: 1px solid ${$BORDER_COLOR};
    border-bottom: 0;
    font-size: 14px;
    

    span {
      display: block;
      color: #999;
      font-size: 12px;
    }

    img {
      position: absolute;
      left: 15px;
      top: 16px;
      width: 24px;
    }

    &:active, &:hover {
      background-color: #f9f9f9;
    }
  }
`;

const MoreBtn = styled.button`
  position: absolute;
  right: 14px;
  top: 12px;
  z-index: 1;
  

  img {
    width: 27px;
  }
`;

const TransBg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const StyledA = styled(A)`
  color: ${$POINT_BLUE} !important;
`;

const deleteComment = (access, dispatch, setData, setIds, targetPk, callback) => (id: HashId) => {
  new StoryCommentApi(access).destroy(targetPk, id).then(({status}) => {
    if (Math.floor(status / 100) !== 4) {
      setData(curr => {
        const comm = curr[id];
        if (comm.reply_count > 0) {
          comm.status = 'inactive';
        } else {
          delete curr[id];
        }
        return curr;
      });
      // 해당 댓글 삭제
      setIds(curr => curr.filter(currId => currId !== id));

      // 대댓글 삭제
      callback();

      // 스토리의 댓글 개수 수정
      dispatch(
        updateStory(
          targetPk,
          ({comment_count, ...curr}) =>
            ({...curr, comment_count: comment_count - 1}),
        ),
      );
    }
  });
};

const CommentOption = React.memo(({storyPk, setData, access, isWriter, deleteComment, id, did_report}) => {
  const [isOptionOn, setIsOptionOn] = React.useState(false);
  const dispatch = useDispatch();

  return (
    <>
      <MoreBtn onClick={() => setIsOptionOn(true)}>
        <img
          src={staticUrl('/static/images/icon/icon-more-btn.png')}
          alt="더보기"
        />
      </MoreBtn>
      {isOptionOn && (
        <>
          <TransBg
            onClick={() => setIsOptionOn(false)}
          />
          <LayerPopUpUl>
            {isWriter && (
              <li onClick={() => {
                deleteComment(id);
                setIsOptionOn(false);
              }}>
                <img
                  src={staticUrl('/static/images/icon/icon-delete.png')}
                  alt="삭제"
                />
                삭제
                <span>해당 댓글을 삭제합니다.</span>
              </li>
            )}
            {!isWriter && (
              <li
                onClick={() => {
                  if (did_report) {
                    alert('이미 신고한 댓글입니다.');
                  } else {
                    dispatch(pushPopup(ReportPopup, {
                      onClick: (form) => {
                        new StoryCommentApi(access)
                          .report(storyPk, id, form)
                          .then(({status}) => {
                            if (Math.floor(status / 100) !== 4) {
                              setData(curr => ({
                                ...curr,
                                [id]: {...curr[id], did_report: true},
                              }));
                              setIsOptionOn(false);
                              alert('신고되었습니다.');
                            }
                          });
                      },
                    }));
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
            )}
          </LayerPopUpUl>
        </>
      )}
    </>
  );
});

const Comment = React.memo((
  {
    depth,
    data: {
      text,
      images = [],
      wikis,
      status,
      blind_reason
    },
  },
) => {
  // 실제 댓글
  switch (status) {
    case 'blinded':
      return (
        <p className="pre-line">
          <div className="blind">
            <img
              src={staticUrl('/static/images/icon/icon-blind.png')}
              alt="블라인드"
            />
            {blindReasonText(blind_reason, depth === 0 ? '댓' : '답')}
          </div>
        </p>
      );
    case 'inactive':
      return (
        <p className="pre-line">
          <div className="blind">
            <img
              src={staticUrl('/static/images/icon/icon-blind.png')}
              alt="삭제된 댓글"
            />
            작성자에 의해 삭제되었습니다.
          </div>
        </p>
      );
    default:
      return (
        <>
          <ul className="add-picture">
            {(images || []).map(src => (
              <li key={src}>
                <img src={src} alt=""/>
              </li>
            ))}
          </ul>
          <p className="pre-line">
            <Linkify component={StyledA} properties={{newTab: true}}>
              {text}
            </Linkify>
          </p>
          {wikis && (
            <Query
              query={INFO_UPLOAD_WIKIS}
              variables={{codes: wikis}}
            >
              {({data, loading}) => {
                if(loading) return null;

                const {
                  wikis: {nodes} = {wikis: {nodes: []}}
                } = data;

                return (
                  <ul className="dict-wrap">
                    {nodes.map(item => (
                      <li key={item.code}>
                        <DictCard data={item}/>
                      </li>
                    ))}
                  </ul>
                )
              }}
            </Query>
          )}
        </>
      );
  }
});



const CommentItem = React.memo<IDefaultCommentItemProps>((
  {
    access,
    depth,
    maxDepth,
    targetPk,
    parentPk,
    targetName,
    parentUserExposeType,
    listCompFunc,
    inputCompFunc,
    commentType,
    data,
    // state from commentlist
    setData,
    setIds,
    setReplyCount,
    replyCountMap,
    reaction
  }
) => {
  const item = data;
  if (!item) {
    return null;
  }

  const router = useRouter();
  const {asPath, pathname, query:{slug, timeline: timelineId}} = router;
  const isOnClass = pathname.includes('onclass');
  const dispatch = useDispatch();

  const {user, created_at, did_report, status, is_band_manager_comment, ...commentData} = item;
  const {avatar, is_writer, member_grade} = user || {};
  const {id, user_expose_type, reaction_type, up_count, down_count} = commentData;
  const replyCount = replyCountMap[id];
  const query = asPath.split('#')[1] || '';
  const commentId = depth !== 0 ? `comment-${parentPk}-${id}` : `comment-${id}`;
  const timeline = useSelector(({orm}) => pickTimelineSelector(timelineId)(orm) || {}, shallowEqual);
  const isOnClassQA = isOnClass && (timeline || {}).name === '질문 및 답변';
  const [isOpen, setOpen] = React.useState(!isOnClassQA);

  const {innerWidth: windowWidth} = useWindowSize();

  return (
    <CommentItemLi
      className={cn(
        'comment-item', {
          'onclass-answer': depth === 0 && (isOnClassQA && member_grade === 'admin'),
          'onclass-owner': isOnClass && member_grade === 'admin'
        }
      )}
    >
      <span
        className="anchor-position"
        id={commentId}
      />
      {status === 'active'
        ? <>
            <h2 className="user">
              <Avatar
                className={cn({'owner-mark': isOnClass && (member_grade !== 'normal')})}
                {...user}
                userExposeType={user_expose_type}
                size={windowWidth <= 680 ? 24 : 30}
                src={avatar}
              />
              {isOnClass && (
                <span className="onclass-status">{ONCLASS_MEMBER[member_grade]}</span>
              )}
              {user && user.user_type && (
                <Label
                  name={USER_TYPE_TO_KOR[user.user_type]}
                  color={$FONT_COLOR}
                  borderColor="#999"
                />
              )}
              <span className="date">
                {toDateFormat(created_at, 'YY. MM. DD. HH:mm')}
              </span>
              {(isOnClassQA && member_grade === 'admin') && (
                <span
                  className={cn('qa-status')}
                >
                  답변
                </span>
              )}
            </h2>
            <CommentOption
              storyPk={targetPk}
              targetPk={id}
              setData={setData}
              access={access}
              isWriter={is_writer}
              deleteComment={deleteComment(
                access,
                dispatch,
                setData,
                setIds,
                targetPk,
                () => parentPk && setReplyCount(parentPk, -1),
              )}
              id={id}
              did_report={did_report}
            />
          </>
        :
          <h2>
            <Avatar
              {...user}
              userExposeType={user_expose_type}
              size={windowWidth <= 680 ? 24 : 30}
              src={avatar}
            />
          </h2>
      }
      <Comment
        access={access}
        targetPk={targetPk}
        userExposeType={user_expose_type}
        data={{
          ...commentData,
          status,
          reply_count: replyCountMap[id],
        }}
        depth={depth}
      />
      <div className="clearfix">
        <UserBtnUl>
          <UserBtnLi
            on={reaction_type === 'up'}
            onClick={() => status === 'active' && reaction(targetPk, id, 'up')}
          >
            {reaction_type === 'up' ?
              <img
                src={staticUrl('/static/images/icon/icon-mini-like-on.png')}
                alt="좋아요"
              />
              :
              <>
                <img
                  src={staticUrl('/static/images/icon/icon-mini-like.png')}
                  className="img-off"
                  alt="좋아요"
                />
                <img
                  src={staticUrl('/static/images/icon/icon-mini-like-on.png')}
                  className="img-on"
                  alt="좋아요"
                />
              </>
            }
            좋아요 <span>{under(up_count)}개</span>
          </UserBtnLi>
          {!isOnClass && (
            <UserBtnLi
              on={reaction_type === 'down'}
              onClick={() => status === 'active' && reaction(targetPk, id, 'down')}
            >
              {reaction_type === 'down' ?
                <img
                  src={staticUrl('/static/images/icon/icon-mini-unlike-on.png')}
                  alt="별로예요"
                />
                :
                <>
                  <img
                    src={staticUrl('/static/images/icon/icon-mini-unlike.png')}
                    className="img-off"
                    alt="별로예요"
                  />
                  <img
                    src={staticUrl('/static/images/icon/icon-mini-unlike-on.png')}
                    className="img-on"
                    alt="별로예요"
                  />
                </>
              }
              별로예요 <span>{under(down_count)}개</span>
            </UserBtnLi>
          )}
        </UserBtnUl>
        <UserBtnUl>
          {depth === 0 && (
            <UserBtnLi
              on={isOpen}
              onClick={() => setOpen(curr => !curr)}
            >
              대댓글 {isOpen ? '숨기기' : '보기'} <span>{under(replyCount, 99)}개</span>
            </UserBtnLi>
          )}
        </UserBtnUl>
      </div>
      {(maxDepth > depth && isOpen) && (function(){
        const List = listCompFunc();
        // const comp = (props) => {
        //   return (
        //     <div className="left-border">
        //       <CommentItem {...props} />
        //     </div>
        //   )
        // }
        return (
          <List
            access={access}
            depth={depth + 1}
            maxDepth={maxDepth}
            targetPk={targetPk}
            parentPk={id}
            targetName={targetName}
            commentType={commentType}
            parentUserExposeType={user_expose_type}
            inputCompFunc={inputCompFunc}
            // itemCompFunc={() => comp}
            itemCompFunc={() => CommentItem}
            can_comment={true}
          />
        );
      })()}
      {(query === commentId) && <HashReload/>}
    </CommentItemLi>
  );
});
CommentItem.displayName = 'CommentItem';

export default CommentItem;
