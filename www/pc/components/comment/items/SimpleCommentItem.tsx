import React from 'react';
import {$FONT_COLOR, $TEXT_GRAY, $BORDER_COLOR} from "../../../styles/variables.types";
import StoryCommentApi from "../../../src/apis/StoryCommentApi";
import {updateStory} from "../../../src/reducers/orm/story/storyReducer";
import {useDispatch} from "react-redux";
import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';

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
  display: table;
  width: 100%;
  height: 59px;
  padding: 10px 20px;
  box-sizing: border-box;

  & ~ & {
    border-top:1px solid ${$BORDER_COLOR};
  }

  & > div {
    display: table-cell;
    vertical-align: middle;

    & + div {
      width: 15%;
      text-align:right;
    }
  }

  p {
    width:100%;
    ${fontStyleMixin({
      size: 14,
      weight: '600',
      color: $FONT_COLOR
    })};
  }

  span {
    cursor:pointer;
    ${fontStyleMixin({
      size: 13,
      color: $TEXT_GRAY
    })};
  }
`

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


const CommentItem = React.memo<IDefaultCommentItemProps>((
  {
    access,
    targetPk,
    parentPk,
    data,
    // state from commentlist
    setData,
    setIds,
    setReplyCount,
  }
) => {
  const item = data;
  if (!item) {
    return null;
  }

  const dispatch = useDispatch();
  const {user, created_at, did_report, ...commentData} = item;
  const {id, text} = commentData;
  const {is_writer} = user || {};
  
  return (
    <CommentItemLi
      id={`comment-${id}`}
      className="comment-item"
    >
      <div>
        <p>{text}</p>
      </div>
      {is_writer && (
      <div>
        <span onClick={() => deleteComment(
          access,
          dispatch,
          setData,
          setIds,
          targetPk,
          () => parentPk && setReplyCount(parentPk, -1),
        )(id)}>
          삭제
        </span>
      </div>  
      )}
      
    </CommentItemLi>
  );
});
CommentItem.displayName = 'CommentItem';

export default CommentItem;
