import React from 'react';
import CommentArea from './wrappers/CommentArea';
import SimpleCommentItem from './items/SimpleCommentItem';
import SimpleCommentInput from './inputs/SimpleCommentInput';
import CommentList from "./wrappers/CommentList";

const DefaultComment = (props) => {
    return (
      <CommentArea 
        itemComponent={SimpleCommentItem}
        listComponent={CommentList}
        inputComponent={SimpleCommentInput}
        {...props}
      />
  )
};

export default DefaultComment;
