import React from 'react';
import CommentArea from './wrappers/CommentArea';
import ChatItem from './items/ChatItem';
import CommentCountList from './wrappers/CommentCountList';
import RequestCommentInput from './inputs/RequestCommentInput';
import SortOrderMenu from '../UI/SortOrderMenu';

const DEFAULT_CAPTION_MESSAGE = '교수님께 요청하고 싶은 내용을 한줄로 작성해보세요.';

const RequestComment = (props) => {
  return (
    <CommentArea 
    itemComponent={ChatItem}
    listComponent={CommentCountList}
    inputComponent={RequestCommentInput}
    commentType="request"
    caption={props.caption || DEFAULT_CAPTION_MESSAGE}
    sort={SortOrderMenu}
    maxLength={100}
    placeholder="교수님께 요청하고 싶은 한줄 요청은 무엇인가요? 100자 이내로만 입력해주세요"
    {...props}
    />
  )
};

export default RequestComment;
