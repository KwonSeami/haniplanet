import React from 'react';
import CommentArea from './wrappers/CommentArea';
import FileCommentItem from './items/FileCommentItem';
import FileCommentInput from './inputs/FileCommentInput';
import CommentList from './wrappers/CommentList';

const DEFAULT_CAPTION_MESSAGE = '관련 강의 자료를 업로드 하는 곳입니다. 파일명 클릭 시, 자동 다운로드 됩니다.';

const FileComment = (props) => {
  return (
    <CommentArea
      itemComponent={FileCommentItem}
      listComponent={CommentList}
      inputComponent={FileCommentInput}
      commentType="share"
      caption={props.caption || DEFAULT_CAPTION_MESSAGE}
      {...props}
      maxDepth={1}
      maxLength={50}
      placeholder="50자 이내의 제목을 입력해주세요. (10MB까지만 첨부가능)"
    />
  )
};

export default FileComment;
