import React from 'react';
import styled from 'styled-components';
import Avatar from '../../AvatarDynamic';
import {fontStyleMixin, radiusMixin} from '../../../styles/mixins.styles';
import {$THIN_GRAY, $GRAY, $WHITE, $POINT_BLUE} from '../../../styles/variables.types';
import UserExposeTypeSelector from '../../user/UserNameSelector';
import isEqual from 'lodash/isEqual';
import StoryCommentApi from '../../../src/apis/StoryCommentApi';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import {useSelector} from 'react-redux';

const CommentInputArticle = styled.article`
  position: relative;
  padding: 13px 15px;

  .user-name-selector {
    float: right;
    margin-top: 4px;

    &::after {
      content: '';
      clear: both;
      display: inline-block;
    }
  }

  input {
    display: inline-block;
    vertical-align: middle;
    width: calc(100% - 38px);
    height: 35px;
    padding: 0 17px;
    ${fontStyleMixin({
      size: 14,
      color: $GRAY,
    })};
    ${radiusMixin('17.5px', $THIN_GRAY)};
  }
  
  .avatar {
    display: inline-block;
    line-height: 35px;
    margin-bottom: 0;
    vertical-align: middle;
    
    & > div {
      margin: -2px 8px 0 0;
      vertical-align: middle;
    }
  }

  .comment-input {
    background-color: ${$WHITE};
    margin-top: 2px;
    padding: 9px 15px 0;
    ${radiusMixin('17px', $THIN_GRAY)};

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

const RequestCommentInput = React.memo(({targetPk, parentPk, commentType, access, onSave, parentUserExposeType='real', maxLength, placeholder}: IComment) => {
  const DEFAULT_ON = false;
  const DEFAULT_TEXT = '';
  const DEFAULT_HEIGHT = 'auto';

  // /State
  const [on, setOn] = React.useState(DEFAULT_ON);
  const [text, setText] = React.useState(DEFAULT_TEXT);
  const [height, setHeight] = React.useState(DEFAULT_HEIGHT);
  const [userExposeType, setUserExposeType] = React.useState(parentUserExposeType);
  
  // Ref
  const textAreaRef = React.useRef(null);

  // Redux
  const me = useSelector(
    ({orm, system: {session: {id}}}) => pickUserSelector(id)(orm) || {} as any,
    (prev, curr) => isEqual(prev, curr),
  );

  return (
    <CommentInputArticle className="comment-input">
      {on ? (
        <>
        <Avatar
          userExposeType={userExposeType}
          size={30}
          src={me.avatar}
          {...me}
        />
        {/*<p>{identifer}</p>*/}
        <UserExposeTypeSelector
          value={userExposeType}
          onChange={(_userExposeType) => setUserExposeType(_userExposeType)}
        />
        <div className="comment-input">
          <textarea
            placeholder={placeholder}
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
                    if (text.trim().length === 0) {
                      alert('내용을 입력해주세요');
                      return false;
                    }
                    const api = new StoryCommentApi(access);
                    const form = new FormData();
                    form.append('text', text);
                    form.append('user_expose_type', userExposeType);
                    form.append('comment_type', commentType);

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
        </>
      ) : (
        <div>
          <Avatar
            userExposeType={userExposeType}
            size={30}
            src={me.avatar}
            hideUserName
          />
          <input
            onClick={() => {
              setOn(true);
              setTimeout(() => textAreaRef.current.focus(), 300);
            }}
            placeholder={placeholder}
          />
        </div>
      )}
    </CommentInputArticle>
  );
});

RequestCommentInput.displayName = 'RequestCommentInput';

export default RequestCommentInput;
