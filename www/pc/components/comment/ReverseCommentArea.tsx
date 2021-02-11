import React from 'react';
import CommentArea from './wrappers/CommentArea';
import CommentItem from './items/CommentItem';
import CommentInput from './inputs/CommentInput';
import SortOrderMenu from "../UI/SortOrderMenu";
import styled from 'styled-components';
import {$BORDER_COLOR} from '../../styles/variables.types';
import ReverseCommentCountList from "./wrappers/ReverseCommentCountList";

const Div = styled.div`
  .comment-area {
    border-left: 1px solid ${$BORDER_COLOR};
    border-right: 1px solid ${$BORDER_COLOR}; 
  }

  .header + .comment-list {
    margin-top: -14px;
  } 
`;

const ReverseCommentArea = (props) => {
  return (
    <Div>
      <CommentArea 
        itemComponent={CommentItem}
        listComponent={ReverseCommentCountList}
        sort={SortOrderMenu}
        inputComponent={CommentInput}
        {...props}
      />
    </Div>
  )
};

export default ReverseCommentArea;
