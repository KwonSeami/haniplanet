import React from 'react';
import {staticUrl} from "../../../src/constants/env";
import {$BORDER_COLOR, $FONT_COLOR, $GRAY, $TEXT_GRAY} from "../../../styles/variables.types";
import StoryCommentApi from "../../../src/apis/StoryCommentApi";
import {updateStory} from "../../../src/reducers/orm/story/storyReducer";
import {useDispatch} from "react-redux";
import styled from 'styled-components';
import {fontStyleMixin, backgroundImgMixin} from '../../../styles/mixins.styles';
import {formatBytes} from "../../../src/lib/numbers";
import A from "../../UI/A";
import {pushPopup} from "../../../src/reducers/popup";
import ReportPopup from "../../layout/popup/ReportPopup";
import {FileListUl} from '../inputs/FileCommentInput';
import isEmpty from 'lodash/isEmpty';

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
  & > div {
    position: relative;
    padding: 12px 160px 12px 20px;
    
    &:hover {
      background-color: #eceff3;
    }
  }

  & ~ & {
    border-top: 1px solid ${$BORDER_COLOR};
  }

  h2 {
    line-height: 20px;
    ${fontStyleMixin({
      size: 14,
      weight: '600'
    })};
  }

  .pre-line {
    margin-top: 4px;
    line-height: 22px;
    ${fontStyleMixin({
      size: 14,
      color: $GRAY,
    })};

    span {
      ${fontStyleMixin({
        size: 13,
        color: $TEXT_GRAY,
      })};
    }
  }
  
  .comment-button {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

const FileButton = styled.button`
	position: relative;
	width: auto;
	height: 34px;
	padding: 0 20px 0 13px;
	border: 1px solid ${$BORDER_COLOR};
	background-color: #fff;
	vertical-align: middle;
	line-height: 32px;
	
	${ props => {
		if( props.is_open ) return `border-color: ${$GRAY}`;
	}}
	
	${fontStyleMixin({
		size: 11,
		color: $FONT_COLOR
	})};
	
	& > i {
		position: absolute;
		right: 9px;
		top: 50%;
		width: 8px;
		height: 4px;
    font-size: 0;
		transform: translateY(-50%);
    ${backgroundImgMixin({
      img: staticUrl('/static/images/icon/arrow/icon-story-select-arrow.png'),
      size: '100% auto'
    })}
		
		${ props => {
			if( props.is_open ) return `transform:translateY(-50%) rotate(180deg);`
		}}
	}
`

const FileWrapperDiv = styled.div`
	padding: 5px 17px;
	background-color: #eceff3;
	border-top: 1px solid ${$BORDER_COLOR};

	& .file-item {
		margin: 5px 3px;
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

const CommentFileList = React.memo(({files = []}) => {
  return (
    <FileWrapperDiv>
      <FileListUl>
        {files.map(({id, original_name, name, file, size}) => (
          <li className="file-item" key={id}>
            <A to={file} download newTab>
              <span>{original_name || name}</span>
              <span>{formatBytes(size)}</span>
            </A>
          </li>
        ))}
      </FileListUl>
    </FileWrapperDiv>
  )
})

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

const FileCommentItem = React.memo<IDefaultCommentItemProps>((
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
  const item = data;
  if (!item) {
    return null;
  }

  const dispatch = useDispatch();

  const [isOpen, setOpen] = React.useState(false);

  const {user, created_at, did_report, ...commentData} = item;
  const {is_writer} = user || {};
  const {id, user_expose_type, reaction_type, up_count, text, files, down_count} = commentData;
  const replyCount = replyCountMap[id];

  return (
    <CommentItemLi
      className="comment-item"
      id={`comment-${id}`}
    >
      <div>
        <h2>
          {getUserIdentifier(user_expose_type, user || {})}
          {/*user && user.user_type && (
            <Label
              name={ USER_TYPE_TO_KOR[user.user_type]}
              color={$FONT_COLOR}
              borderColor="#999"
            />
          )*/}
        </h2>
        <p className="pre-line">
          {text} {is_writer && (
          <span
            onClick={() => deleteComment(
              access,
              dispatch,
              setData,
              setIds,
              targetPk,
              () => parentPk && setReplyCount(parentPk, -1),
            )(id)}
            className="pointer"
          >
            삭제
          </span>
        )}
        </p>
        
        { !isEmpty(files) && (
          <div className="comment-button">
            <FileButton is_open={isOpen} onClick={() =>setOpen(curr => !curr)}>
              {files.length}개의 첨부파일
              <i>닫기</i>
            </FileButton>
          </div>
        )}
      </div>
      {isOpen && (
        <CommentFileList files={files}/>
      )}
    </CommentItemLi>
  );
});
FileCommentItem.displayName = 'FileCommentItem';

export default FileCommentItem;
