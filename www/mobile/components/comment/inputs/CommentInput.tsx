import React from 'react';
import styled from 'styled-components';
import Avatar from '../../AvatarDynamic';
import {fontStyleMixin, radiusMixin, backgroundImgMixin} from '../../../styles/mixins.styles';
import {$THIN_GRAY, $GRAY, $WHITE, $POINT_BLUE} from '../../../styles/variables.types';
import UserExposeTypeSelector from '../../user/UserNameSelector';
import {staticUrl} from '../../../src/constants/env';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {pushPopup} from '../../../src/reducers/popup';
import DictCard, {IDictCard} from '../../dict/DictCard';
import uniqBy from 'lodash/uniqBy';
import StoryCommentApi from '../../../src/apis/StoryCommentApi';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import {checkValidImage} from '../../../src/lib/file';
import ApolloDictPopup from "../../dict/ApolloDictPopup";
import cn from 'classnames';
import {ONCLASS_MEMBER} from '../../../src/constants/meetup';
import {pickBandSelector} from '../../../src/reducers/orm/band/selector';
import { useRouter } from 'next/router';
import { updateStory } from '../../../src/reducers/orm/story/storyReducer';
import {pickTimelineSelector} from '../../../src/reducers/orm/timeline/selector';

const CommentInputArticle = styled.article`
  position: relative;
  padding: 13px 15px;
  background-color: #f5f7f9;

  &.onclass-answer .avatar::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 18px;
    width: 14px;
    height: 14px;
    ${backgroundImgMixin({
      img: staticUrl('/static/images/icon/onclass-owner.png'),
      size: '100% 100%'
    })};
  }

  .onclass-status {
    margin-left: 2px;
    vertical-align: middle;
    ${fontStyleMixin({
      size: 14,
      color: $GRAY,
    })};
  }
      
  .user-name-selector {
    float: right;
    margin-top: 4px;

    &::after {
      content: '';
      clear: both;
      display: inline-block;
    }
  }

  .add-picture {
    position: relative;

    & > img, li > img {
      margin: 5px 0 10px;
    }

    span {
      position: absolute;
      right: 10px;
      top: 10px;

      img {
        width: 24px;
      }
    }
  }
  
  .avatar {
    position: relative;
    display: inline-block;
    line-height: 35px;
    margin-bottom: 0;
    vertical-align: middle;
  
    & > div {
      margin: -2px 8px 0 0;
      vertical-align: middle;
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

const CommentInput = React.memo(({targetPk, parentPk, access, commentType, onSave, parentUserExposeType='real', maxLength, placeholder}: IComment) => {
  const DEFAULT_ON = false;
  const DEFAULT_TEXT = '';
  const DEFAULT_HEIGHT = 'auto';
  const DEFAULT_IMAGE = null;
  const DEFAULT_THUMBNAIL = null;
  const DEFAULT_WIKIS = [];
  const MAX_DICT_ATTACH = 10;
  
  // /State
  const [on, setOn] = React.useState(DEFAULT_ON);
  const [text, setText] = React.useState(DEFAULT_TEXT);
  const [height, setHeight] = React.useState(DEFAULT_HEIGHT);
  const [image, setImage] = React.useState(DEFAULT_IMAGE);
  const [thumbnail, setThumbnail] = React.useState(DEFAULT_THUMBNAIL);
  const [wikis, setWikis] = React.useState(DEFAULT_WIKIS);
  const [pending, setPending] = React.useState(false);
  const {pathname, query: {slug, id: storyId, timeline: timelineId}} = useRouter();
  const isOnClass = pathname.includes('onclass');
  const [userExposeType, setUserExposeType] = React.useState(isOnClass ? 'real' : parentUserExposeType || 'real');
  // Ref
  const textAreaRef = React.useRef(null);
  const fileRef = React.useRef(null);
  const dispatch = useDispatch();

  // Redux
  const {me, onClassBand, timelines} = useSelector(
    ({orm, system: {session: {id}}}) => ({
      me: pickUserSelector(id)(orm) || {} as any,
      onClassBand: pickBandSelector(slug)(orm) || {},
      timelines: pickTimelineSelector(timelineId)(orm) || {}
    }), shallowEqual
  );

  const {band_member_grade} = onClassBand || {};
  const isOwner = isOnClass && band_member_grade !== 'normal';
  const isOnClassQA = isOnClass && (timelines || {}).name === '질문 및 답변';

  React.useEffect(() => {
    if (isOnClassQA && band_member_grade === 'admin') {
      setOn(true);
    }
    if (isOnClass) {
      setUserExposeType('real');
    }
  }, [isOnClass, isOnClassQA, band_member_grade]);

  // 처방사전 첨부
  const setDictAttaches = React.useCallback((dict: IDictCard) => {
    if(wikis.length > MAX_DICT_ATTACH) {
      alert(`사전 첨부는 ${MAX_DICT_ATTACH}개 까지만 가능합니다.`);
      return false;
    }
    
    setWikis(curr => uniqBy([...curr, dict], obj => obj.code))
  }, [wikis]);

  // 처방사전 제거
  const deleteDictAttaches = React.useCallback((code: String) => {
    setWikis(curr => curr.filter(({code:_code}) => _code !== code));
  }, []);

  const buttonOnClickHandler = () => {
    const api = new StoryCommentApi(access);
    const form = new FormData();
    form.append('text', text);
    form.append('image', image);
    form.append('comment_type', commentType);
    form.append('user_expose_type', userExposeType);
    wikis.forEach(({ code }) => form.append('wikis', code));
    
    setPending(true);
    (parentPk
      ? api.createReply(targetPk, parentPk, form)
      : api.create(targetPk, form))
      .then(({ data: { result } }) => {
        if (!!result) {
          onSave(result);
          setOn(DEFAULT_ON);
          setText(DEFAULT_TEXT);
          setHeight(DEFAULT_HEIGHT);
          setImage(DEFAULT_IMAGE);
          setThumbnail(DEFAULT_THUMBNAIL);
          setWikis(DEFAULT_WIKIS);
          dispatch(updateStory(storyId, ({is_answered, ...rest}) => ({
            ...rest,
            is_answered: true
          })))
        }
        setPending(false)
      }
    )
    .catch(() => setPending(false));
  }

  return (
    <CommentInputArticle
      // @경희님: 여기 확인 부탁드려요.
      className={cn('comment-write', {'onclass-answer': isOwner})}
    >
      {on ? (
        <>
        <Avatar
          size={30}
          userExposeType={userExposeType}
          src={me.avatar}
          {...me}
        />
        {isOnClass && (
          <span className="onclass-status">{ONCLASS_MEMBER[band_member_grade]}</span>
        )}
        <UserExposeTypeSelector
          value={userExposeType}
          onChange={(_userExposeType) => setUserExposeType(_userExposeType)}
          types={isOnClass
            ? band_member_grade !== 'normal'
              ? [['real', '실명']]
              : [['real', '실명'], ['anon', '익명']]
            : [['real', '실명'], ['nick', '닉네임'], ['anon', '익명']]
          }
        />
        <div className="comment-input">
          {thumbnail && (
            <div className="add-picture">
              <span
                onClick={() => {
                  setImage(DEFAULT_IMAGE);
                  setThumbnail(DEFAULT_THUMBNAIL);
                }}
              >
                <img
                  src={staticUrl('/static/images/icon/icon-delete-picture.png')}
                  alt="이미지 닫기"
                />
              </span>
              <img
                src={thumbnail}
                alt="댓글 이미지"
              />
            </div>
          )}
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
          <ul className="dict-wrap">
            {wikis.map(item => (
              <li key={item.code}>
                <DictCard
                  data={item}
                  onDelete={() => {
                    deleteDictAttaches(item.code)
                  }}
                />
              </li>
            ))}
          </ul>
          <CommentWriteUtilDiv>
            <ul className="btn-list">
              <li
                onClick={() => dispatch(pushPopup(
                  ApolloDictPopup, {setDictList: setDictAttaches},
                ))}
              >
                <img
                  src={staticUrl('/static/images/icon/icon-add-dict.png')}
                  alt="처방사전 첨부"
                />
              </li>
              <li
                onClick={() => fileRef.current.click()}
              >
                <img
                  src={staticUrl('/static/images/icon/icon-add-picture.png')}
                  alt="이미지 첨부"
                />
                <input
                  type="file"
                  style={{display: 'none'}}
                  ref={fileRef}
                  onChange={e => {
                    checkValidImage(e, file => {
                      setImage(file);
                      const reader = new FileReader();
                      reader.readAsDataURL(file);

                      reader.onload = () => {
                        setThumbnail(reader.result);
                      };
                    })
                  }}
                />
              </li>
              <li>
                <button
                  onClick={buttonOnClickHandler}
                  disabled={pending}
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
            size={30}
            userExposeType={userExposeType} 
            src={me.avatar}
            hideUserName
            {...me}
          />
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

CommentInput.displayName = 'CommentInput';

export default CommentInput;
