import React from 'react';
import {staticUrl} from "../../../src/constants/env";
import {$FONT_COLOR, $POINT_BLUE, $TEXT_GRAY, $WHITE, $GRAY} from "../../../styles/variables.types";
import {timeSince} from "../../../src/lib/date";
import StoryCommentApi from "../../../src/apis/StoryCommentApi";
import {updateStory} from "../../../src/reducers/orm/story/storyReducer";
import {useDispatch} from "react-redux";
import styled from 'styled-components';
import {under} from '../../../src/lib/numbers';
import {inlineBlockMixin, fontStyleMixin} from '../../../styles/mixins.styles';
import {pushPopup} from "../../../src/reducers/popup";
import ReportPopup from "../../layout/popup/ReportPopup";
import classNames from "classnames";
import Linkify from "react-linkify";
import A from "../../UI/A";
import blindReasonText from "../commentUtils";

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

const UserBtnLi = styled.li<Pick<IDefaultCommentItemProps, 'on'>>`
  display: inline-block;
  vertical-align: middle;
  padding: 9px 15px 0 0;
  font-size: 13px;
  color: ${props => props.on ? $FONT_COLOR : $TEXT_GRAY};
  cursor: pointer;

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

const getUserIdentifier = (userExposeType, user) => {
  switch(userExposeType){
    case 'real':
      return user.name;
    case 'nick':
      return user.nick_name;
    case 'anon':
      return '익명의 유저';
    default:
      return '';
  }
};

const CommentItemLi = styled.li`
  padding:0 15px;

  & {
    & ~ & {
      margin-top:10px;
    }
    &:last-child {
      margin-bottom: 15px;
    }
  }

  &.me {
    .text-box {
      background-color: #edf5ff;
    }
  }

  &.blind {
    .text-box {
      background-color: rgba(255,255,255,0.5);
    }

    .blind {
      color: ${$TEXT_GRAY};
  
      img {
        vertical-align:-2px;
        width: 19px;
        height: 12px;
      }
    }
  }

  .text-box {
    position: relative;
    vertical-align: middle;
    display: inline-block;
    min-width: 160px;
    max-width: calc(100% - 100px);
    min-height: 67px;
    padding: 10px 15px 12px;
    background-color: ${$WHITE};
    border-radius: 17px;
    box-sizing: border-box;

    .text-box-title {
      display: flex;
      align-items: center;
      
      h3 {
        flex: 1 0 auto;
        white-space: nowrap;
        ${fontStyleMixin({
          size: 14,
          weight: '600'
        })};
      }

      span {
        flex: 1 0 auto;
        text-align: right;
        white-space: nowrap;
        padding-left: 3px;
        ${fontStyleMixin({
          size: 12,
          color: $TEXT_GRAY,
        })};
      }
    }

    p {
      margin-top: 5px;
      line-height: 22px;
      ${fontStyleMixin({
        size: 14,
        color: $GRAY,
      })};
    }
  }

  .option-box {
    position: absolute;
    right: -100px;
    bottom: 12px;
    width: 92px;
    margin-left: 9px;
    cursor: pointer;

    h3 {
      ${fontStyleMixin({
        size: 13,
        color: $TEXT_GRAY,
      })};

      &:hover {
        color: ${$FONT_COLOR}
      }
    }

    li {
      padding: 6px 0 0 0;

      & ~ li {
        margin-left: 7px;
      }
    }
  }
`

const ChatItem = React.memo<IDefaultCommentItemProps>((
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
    data,
    // state from commentlist
    setData,
    setIds,
    setReplyCount,
    replyCountMap,
    reaction,
  }
) => {
  if (!data) {
    return null;
  }

  const dispatch = useDispatch();

  const [isOpen, setOpen] = React.useState(false);

  const {user, created_at, did_report, status, blind_reason, ...commentData} = data;
  const {is_writer} = user;
  const {id, user_expose_type, reaction_type, up_count, text, down_count} = commentData;
  const replyCount = replyCountMap[id];

  return (
    // TODO: li(comment-item)에 className 'me'를 붙이면 본인이 작성한 댓글이 된다.
    <CommentItemLi
      id={`comment-${id}`}
      className={classNames('comment-item', {
        me: is_writer,
        blind: status === 'blinded'
      })}
    >
      <div className="text-box">
        <div className="text-box-title">
          <h3>{getUserIdentifier(user_expose_type, user || {})}</h3>
          <span>{timeSince(created_at, 'YY. MM. DD. HH:mm')}</span>
        </div>
        {status === 'blinded' ? (
          <p className="pre-line">
            <div className="blind">
              <img
                src={staticUrl('/static/images/icon/icon-blind.png')}
                alt="블라인드"
              />
              {blindReasonText(blind_reason, depth === 0 ? '댓' : '답')}
            </div>
          </p>
        ) : (
          <p>
            <Linkify component={StyledA} properties={{newTab: true}}>
              {text}
            </Linkify>
          </p>
        )}
        <div className="option-box">
          {is_writer ? (
            <h3
              onClick={() => deleteComment(
                access,
                dispatch,
                setData,
                setIds,
                targetPk,
                () => parentPk && setReplyCount(parentPk, -1),
              )(id)}
            >
              삭제
            </h3>
          ) : (
            <h3
              onClick={() => {
                if (did_report) {
                  alert('이미 신고한 댓글입니다.');
                } else {
                  dispatch(pushPopup(ReportPopup, {
                    onClick: (form) => {
                      new StoryCommentApi(access)
                        .report(targetPk, id, form)
                        .then(({status}) => {
                          if (Math.floor(status / 100) !== 4) {
                            setData(curr => ({
                              ...curr,
                              [id]: {...curr[id], did_report: true},
                            }));
                            alert('신고되었습니다.');
                          }
                        });
                    },
                  }));
                }
              }}
            >
              신고
            </h3>
          )}
          <ul>
            <UserBtnLi
              on={reaction_type === 'up'}
              onClick={() => reaction(targetPk, id, 'up')}
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
              <span>{under(up_count)}</span>
            </UserBtnLi>
            <UserBtnLi
              on={reaction_type === 'down'}
              onClick={() => reaction(targetPk, id, 'down')}
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
              <span>{under(down_count)}</span>
            </UserBtnLi>
          </ul>
        </div>
      </div>
    </CommentItemLi>
  );
});
ChatItem.displayName = 'ChatItem';

export default ChatItem;
