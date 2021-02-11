import React from 'react';
import styled from 'styled-components';
import {fontStyleMixin, radiusMixin } from '../../../styles/mixins.styles';
import {$THIN_GRAY, $GRAY, $WHITE, $POINT_BLUE} from '../../../styles/variables.types';
import {useDispatch, useSelector} from 'react-redux';
import isEqual from 'lodash/isEqual';
import StoryCommentApi from '../../../src/apis/StoryCommentApi';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';

const CommentInputArticle = styled.article`
  position: relative;
  padding: 13px 15px;
  background-color: #f5f7f9;

  input {
    display: inline-block;
    vertical-align: middle;
    width: calc(100% - 38px);
    height: 35px;
    width:100%;
    padding: 0 17px;
    ${fontStyleMixin({
      size: 14,
      color: $GRAY,
    })};
    ${radiusMixin('17.5px', $THIN_GRAY)};
  }
  .comment-input {
    background-color: ${$WHITE};
    ${radiusMixin('17px', $THIN_GRAY)};
    padding: 9px 15px 0;

    textarea {      
      min-height: 60px;
      ${fontStyleMixin({
        size: 14,
        color: $GRAY,
      })};

      &::placeholder {
        color: ${$THIN_GRAY};
      }
    }
  }

  button {
    padding-bottom: 1px;
    
    ${fontStyleMixin({
      size: 13,
      weight: '600',
      color: $POINT_BLUE,
    })};
  }

  & ~ ul {
    .comment-list {
      article {
        border-bottom: 0;
      }
    }
  }
`;

const CommentWriteUtilDiv = styled.div`
  text-align: right;
  padding-bottom: 8px;

  li {
    display: inline-block;
    vertical-align: middle;
    padding-left: 11px;
  }

  img {
    vertical-align: middle;
    width: 26px;
  }
`;

// interface IComment {
//   targetPk: ;
//   parentPk: ;
//   hideWriter: ;
//   access: ;
//   onSave: ;
// }

const SimpleCommentInput = React.memo(({targetPk, parentPk, access, commentType, onSave, parentUserExposeType='real', maxLength, placeholder}: IComment) => {
  const DEFAULT_ON = false;
  const DEFAULT_TEXT = '';
  const DEFAULT_HEIGHT = 'auto';
  
  // /State
  const [on, setOn] = React.useState(DEFAULT_ON);
  const [text, setText] = React.useState(DEFAULT_TEXT);
  const [height, setHeight] = React.useState(DEFAULT_HEIGHT);
  const [userExposeType, setUserExposeType] = React.useState(parentUserExposeType || 'real');

  // Ref
  const textAreaRef = React.useRef(null);

  // Redux
  const me = useSelector(
    ({orm, system: {session: {id}}}) => pickUserSelector(id)(orm) || {} as any,
    (prev, curr) => isEqual(prev, curr),
  );
  const dispatch = useDispatch();
  return (
    <CommentInputArticle className="comment-write">
      {on ? (
        <div className="comment-input">
          <textarea
            placeholder={placeholder || '댓글을 입력해주세요.'}
            ref={textAreaRef}
            onChange={e => {
              const {value} = e.target;
              setText(value);
              setHeight(textAreaRef.current.scrollHeight);
            }}
            value={text}
            maxLength={maxLength}
            style={{
              height: typeof height === 'number' ? `${height}px` : height,
            }}
          />
          <CommentWriteUtilDiv>
            <ul className="btn-list">
              <li>
                <button
                  onClick={() => {
                    const api = new StoryCommentApi(access);
                    const form = new FormData();
                    form.append('text', text);
                    form.append('comment_type', commentType);
                    form.append('user_expose_type', userExposeType);

                    (parentPk 
                      ? api.createReply(targetPk, parentPk, form) 
                      : api.create(targetPk, form))
                      .then(({data: {result}}) => {
                        if (!!result) {
                          onSave(result);
                          setOn(DEFAULT_ON);
                          setText(DEFAULT_TEXT);
                          setHeight(DEFAULT_HEIGHT);
                        }
                      }
                    );
                  }}
                >
                  등록
                </button>
              </li>
            </ul>
          </CommentWriteUtilDiv>
        </div>
      ) : (
        <div>
          <input
            onClick={() => {
              setOn(true);
              setTimeout(() => textAreaRef.current.focus(), 300);
            }}
            placeholder={placeholder || '댓글을 입력해주세요.'}
          />
        </div>
      )}
    </CommentInputArticle>
  );
});

SimpleCommentInput.displayName = 'SimpleCommentInput';

export default SimpleCommentInput;
