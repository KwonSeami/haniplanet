import React from 'react';
import styled from 'styled-components';
import Avatar from '../../AvatarDynamic';
import {fontStyleMixin, radiusMixin, backgroundImgMixin} from '../../../styles/mixins.styles';
import {$FONT_COLOR, $GRAY, $POINT_BLUE, $TEXT_GRAY, $THIN_GRAY, $WHITE} from '../../../styles/variables.types';
import UserExposeTypeSelector from '../../user/UserNameSelector';
import {staticUrl} from '../../../src/constants/env';
import {useSelector} from 'react-redux';
import {isEqual} from 'lodash';
import StoryCommentApi from '../../../src/apis/StoryCommentApi';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import {formatBytes} from "../../../src/lib/numbers";

export const FileListUl = styled.ul`
  margin: -5px -3px;
  font-size: 0;

	& > li {
    position: relative;
    display: inline-block;
    vertical-align: top;
    height: 30px;
    margin: 5px 3px;
    padding: 0 10px 0 28px;
    line-height: 30px;
    border-radius: 15px;
    background-color: #f6f7f9;
    
    &::before {
      content: '';
      position: absolute;
      display: inline-block;
      top: 50%;
      left: 12px;
      width: 11px;
      height: 11px;
      transform: translateY(-50%);
      ${backgroundImgMixin({
        img: staticUrl('/static/images/icon/icon-file.png'),
        position: 'center',
        size: '100% auto'
      })}
    }
    
    span {
      display: inline-block;
      vertical-align: middle;
      ${fontStyleMixin({
        size: 12,
        color: $TEXT_GRAY
      })};
      
      & ~ span {
        margin-left: 20px;
      }
    }
    
    i {
      display: inline-block;
      vertical-align: middle;
      width: 16px;
      height: 100%;
      margin-left: 5px;
      font-size: 0;
      cursor: pointer;
      ${backgroundImgMixin({
        img: staticUrl('/static/images/icon/icon-file-close.png'),
        position: 'center',
        size: '17px auto'
      })}
    }
	}
`;

const CommentWriteArticle = styled.article`
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
    margin-bottom: 0;
    vertical-align: middle;
    line-height: 35px;
  
    & > div {
      margin: -3px 8px 0 0;
      vertical-align: middle;
    }
  }

  .comment-input {
    background-color: ${$WHITE};
    margin-top: 4px;
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
    cursor: pointer;
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
	display: flex;
	align-items: flex-end;
	flex-direction: row;
	padding-bottom: 8px;

	ul {
		flex: 1;
		font-size: 0;

		& ~ ul {
			text-align: right;
			flex: initial;
		}
		
		li {
			display: inline-block;
			margin-right: 10px;
			vertical-align: middle;
			font-size: 13px;
		}
  }

  .btn-list {
    width: 25%;
	}

	.btn-file {
		width:auto;
		${fontStyleMixin({
      size: 13,
      color: $FONT_COLOR,
      weight: '600'
    })};
		
		img {
			width: 9px;
			margin-right: 3px;
		}
	}
`;

const FileCommentInput = React.memo(({targetPk, parentPk, commentType, access, onSave, parentUserExposeType='real', maxLength, placeholder}: IComment) => {
  const DEFAULT_ON = false;
  const DEFAULT_TEXT = '';
  const DEFAULT_HEIGHT = 'auto';

  // /State
  const [on, setOn] = React.useState(DEFAULT_ON);
  const [text, setText] = React.useState(DEFAULT_TEXT);
  const [height, setHeight] = React.useState(DEFAULT_HEIGHT);
  const [userExposeType, setUserExposeType] = React.useState(parentUserExposeType);
  const [files, setFiles] = React.useState([]);

  // Ref
  const textAreaRef = React.useRef(null);
  const fileRef = React.useRef(null);

  // Redux
  const me = useSelector(
    ({orm, system: {session: {id}}}) => pickUserSelector(id)(orm) || {} as any,
    (prev, curr) => isEqual(prev, curr),
  );

  const api = new StoryCommentApi(access);

  return (
    <CommentWriteArticle className="comment-write">
      {on ? (
        <>
          <Avatar
            userExposeType={userExposeType}
            size={30}
            src={me.avatar}
            {...me}
          />
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
              <FileListUl className="file-list">
                {files.map(({size, uid, original_name}) => {
                  return (
                    <li key={uid}>
                      <span>{original_name}</span>
                      <span>{formatBytes(size)}</span>
                      <i onClick={() => setFiles(curr => (
                        curr.filter(item => uid !== item.uid)
                      ))}>
                        삭제
                      </i>
                    </li>
                  )
                })}
              </FileListUl>
              <ul className="btn-list">
                <li>
                  <button className="btn-file" onClick={() => fileRef.current.click()}>
                    <img
                      src={staticUrl('/static/images/icon/icon-more.png')}
                      alt="이미지 첨부"
                    />
                    파일첨부
                    <input
                      type="file"
                      style={{display: 'none'}}
                      ref={fileRef}
                      onChange={e => {
                        const file = e.target.files[0];
                        const form = new FormData();
                        form.append('file', file);

                        api.upload(form).then(({status, data: {results}}) => {
                          if(status === 201) {
                            setFiles(curr => [...curr, ...results]);
                          }
                        });
                      }}
                    />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      const form = new FormData();
                      form.append('text', text);
                      form.append('user_expose_type', userExposeType);
                      form.append('comment_type', commentType);
                      files.forEach(({uid}) => form.append('file_uids', uid));

                      (parentPk 
                        ? api.createReply(targetPk, parentPk, form) 
                        : api.create(targetPk, form))
                        .then(({data: {result}}) => {
                            if (!!result) {
                              onSave(result);
                              setOn(DEFAULT_ON);
                              setText(DEFAULT_TEXT);
                              setHeight(DEFAULT_HEIGHT);
                              setFiles([]);
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
            {...me}
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
    </CommentWriteArticle>
  );
});

FileCommentInput.displayName = 'FileCommentInput';

export default FileCommentInput;
