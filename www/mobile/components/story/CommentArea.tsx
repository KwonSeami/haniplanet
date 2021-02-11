import * as React from 'react';
import styled from 'styled-components';
import Avatar from '../Avatar';
import {fontStyleMixin, inlineBlockMixin, radiusMixin} from '../../styles/mixins.styles';
import {
  $BORDER_COLOR,
  $FLASH_WHITE,
  $FONT_COLOR,
  $GRAY,
  $POINT_BLUE,
  $TEXT_GRAY,
  $THIN_GRAY,
  $WHITE,
} from '../../styles/variables.types';
import Label from '../UI/tag/Label';
import {BASE_URL, staticUrl} from '../../src/constants/env';
import {useDispatch, useSelector} from 'react-redux';
import StoryCommentApi from '../../src/apis/StoryCommentApi';
import {USER_TYPE_TO_KOR} from '../../src/constants/users';
import {under} from '../../src/lib/numbers';
import {updateStory} from '../../src/reducers/orm/story/storyReducer';
import {pushPopup} from '../../src/reducers/popup';
import ReportPopup from '../layout/popup/ReportPopup';
import {createGlobalState} from '../../src/hooks/useGlobalStete';
import {axiosInstance} from '@hanii/planet-apis';
import DictCard, {IDictCard} from '../dict/DictCard';
import {isEqual, uniqBy} from 'lodash';
import {toDateFormat} from '../../src/lib/date';
import Linkify from "react-linkify";
import A from "../UI/A";
import { DictUl } from './common2';
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import classNames from 'classnames';
import UserNameSelector from '../user/UserNameSelector';
import ApolloDictPopup from "../dict/ApolloDictPopup";

/**************************
 * CommentArea Context
 */
export const {GlobalStateProvider, useGlobalState} = createGlobalState({replyCountMap: {}});


// TODO: 임시로 지정해놓은 인터페이스입니다.
interface IComment {
  count: number;
  next: string;
  previous: string;
  results: any[];
  onclick?: boolean;
  on?: boolean;
}

export const CommentDiv = styled.div`
  background-color: ${$FLASH_WHITE};
  border-left: 1px solid ${$BORDER_COLOR};
  border-right: 1px solid ${$BORDER_COLOR};

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

  .dict-wrap > li:first-child {
    margin-top: 10px;
  }

  @media screen and (max-width: 680px) {
    border: 0;
  }
`;

export const WriteCommentDiv = styled.div`
  position: relative;
  padding: 13px 15px 15px 55px;
  border-bottom: 1px solid ${$BORDER_COLOR};

  .avatar {
    img {
      position: absolute;
      top: 15px;
      left: 15px;
    }
  }
`;

export const WriteCommentDivUnfold = styled.div`
  position: relative;
  padding: 13px 15px 6px;
  border-bottom: 1px solid ${$BORDER_COLOR};

  .avatar {
    display: inline-block;
    margin: 0 0 5px;

    img {
      margin-top: 0;
    }
  }

  > p {
    display: inline-block;
    vertical-align: -1px;
    ${fontStyleMixin({
      size: 14,
      weight: '600',
    })};
  }

  > .user-name-selector {
    position: absolute;
    top: 15px;
    right: 15px;
  }
`;

export const StyledAvatar = styled(Avatar)`
  margin: 0;

  img {
    position: absolute;
    top: 15px;
    left: 15px;
  }
`;

const StyledInput = styled.input`
  ${radiusMixin('18px', $THIN_GRAY)};
  width: 100%;
  height: 35px;
  padding: 0 17px;
  ${fontStyleMixin({
    size: 14,
    color: $GRAY,
  })};
`;

export const TextAreaDiv = styled.div`
  margin-bottom: 5px;
  background-color: ${$WHITE};
  ${radiusMixin('12px', $THIN_GRAY)};
  padding: 9px 17px 0;

  @media screen and (max-width: 680px) {
    padding: 9px 11px 0;
  }
`;

const TextArea = styled.textarea`
  min-height: 60px;
  ${fontStyleMixin({
  size: 14,
  color: $GRAY,
})};

  &::placeholder {
    color: ${$THIN_GRAY};
  }
`;

const WriteCommentUl = styled.ul`
  text-align: right;
  padding-bottom: 5px;

  li {
    display: inline-block;
    vertical-align: middle;
    padding-left: 8px;
  }

  img {
    vertical-align: middle;
    width: 26px;
  }
`;

const Btn = styled.button`
  ${fontStyleMixin({
  size: 13,
  weight: '600',
  color: $POINT_BLUE,
})};
  cursor: pointer;
`;

export const CommentLi = styled.li`
  padding: 19px 12px 0 55px;
  position: relative;
  border-bottom: 1px solid ${$BORDER_COLOR};

  &.more {
    padding: 15px 0;
    text-align: center;

    p {
      color: #999;
    }
  }

  & > h2 {
    padding-bottom: 11px;
    ${fontStyleMixin({
      size: 14,
      weight: '600',
    })};

    span {
      margin: -3px 0 0 5px;
      display: inline-block;
      vertical-align: middle;

      &.date {
        letter-spacing: -0.2px;
        ${fontStyleMixin({
          size: 12,
          color: $TEXT_GRAY,
        })};
      }
    }
  }

  & > p {
    line-height:1.5;
    ${fontStyleMixin({
      size: 14,
      color: $GRAY,
    })}
  }
  
  .user-name-selector {
    top: 1px;
    right: 0;
  }

  ${WriteCommentDivUnfold} {
    padding-right: 0;

    @media screen and (max-width: 680px) {
      .avatar img {
        width: 24px;
        height: 24px;
      }
    }
  }

  .blind {
    margin-left: -4px;
    ${fontStyleMixin({
      size: 14,
      color: $TEXT_GRAY
    })}

    img {
      width: 19px;
      height: 13px;
      margin-bottom: -2px;
    }
  }

  @media screen and (max-width: 680px) {
    padding: 16px 15px 0;

    &::before {
      height: 84%;
      left: -15px;
    }

    & > h2 {
      padding-left: 0;
    }

    ${StyledAvatar} img {
      position: static;
      width: 24px;
      height: 24px;
    }

    ${WriteCommentDiv} {
      ${StyledAvatar} img {
        position: absolute;
        top: 7px;
      }
    }
  }
`;

export const MoreBtn = styled.button`
  position: absolute;
  right: 14px;
  top: 12px;
  z-index: 1;
  cursor: pointer;

  img {
    width: 27px;
  }
`;

const TransBg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

export const LayerPopUpUl = styled.ul`
  position: absolute;
  right: 9px;
  top: 14px;
  z-index: 2;
  background-color: ${$WHITE};
  border-bottom: 1px solid ${$BORDER_COLOR};

  li {
    position: relative;
    width: 230px;
    padding: 13px 15px 12px 45px;
    box-sizing: border-box;
    border: 1px solid ${$BORDER_COLOR};
    border-bottom: 0;
    font-size: 14px;
    cursor: pointer;

    span {
      display: block;
      color: #999;
      font-size: 12px;
    }

    img {
      position: absolute;
      left: 14px;
      top: 16px;
      width: 24px;
    }

    &:active, &:hover {
      background-color: #f9f9f9;
    }
  }
`;

const UserBtnUl = styled.ul`
  float: left;
  margin-left: -3px;

  &:last-child {
    float: right;
    margin: 0;
  }
`;

const UserBtnLi = styled.li<Pick<IComment, 'on'>>`
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
  padding: 9px 15px 15px 0;
  font-size: 13px;
  color: ${props => props.on ? $FONT_COLOR : $TEXT_GRAY};

  img {
    ${inlineBlockMixin(17)};
    margin: -5px 3px 0 0;

    &.img-on {
      display: none;
    }
  }

   span {
    color: ${props => props.on ? $POINT_BLUE : $TEXT_GRAY};
  }

  &:hover {
    color: ${$FONT_COLOR};

    .img-off {
      display: none;
    }

    .img-on {
      display: inline-block !important;
    }

    span {
      color: ${$POINT_BLUE};
    }
  }
`;

export const LeftBorder = styled.div`
  padding-bottom: 7px;

  ${CommentDiv} {
    border: 0;
  }

  .comment-list {
    > div::before {
      content: '';
      position: absolute;
      top: 0;
      left: -20px;
      width: 1px;
      height: 93%;
      background-color: #d8d8d8;

      @media screen and (max-width: 680px) {
        left: -15px;
      }
    }
  }

  ${WriteCommentDiv} {
    border: none;
    padding: 0 0 5px 40px;

    @media screen and (max-width: 680px) {
      margin: 0 0 2px;
      padding: 0 0 0 38px;

      &::before {
        top: 3px;
        left: -15px;
        height: 90%;
      }
    }
  }

  ${WriteCommentDivUnfold} {
    border: none;
    padding: 0 0 5px 0;

    &::before {
      left: -15px;
    }
  }

  ${StyledAvatar} img {
    top: 0;
    left: -1px;
    margin-top: 0;
  }

  ${WriteCommentDiv} ${StyledAvatar} img {
    top: 5px;
    left: 0;
  }

  ${CommentLi} {
    padding: 6px 20px 0 40px;
    margin-top: 11px;
    border-bottom: 0;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -20px;
      width: 1px;
      height: 84%;
      background-color: #d8d8d8;
    }

    @media screen and (max-width: 680px) {
      padding: 0 15px 0 0;
    }
  }

  @media screen and (max-width: 680px) {
    margin-left: 15px;
  }
`; // 대댓글 영역에는 왼쪽에 보더가 들어가니깐

const DEFAULT_ON = false;
const DEFAULT_TEXT = '';
const DEFAULT_HEIGHT = 'auto';
const DEFAULT_IMAGE = null;
const DEFAULT_THUMBNAIL = null;
const DEFAULT_MEDICINES = [];
const DEFAULT_HERBS = [];
const MAX_DICT_ATTACH = 10;

const WriteComment = React.memo(({storyPk, parentPk, access, hideWriter, onCreate}: IComment) => {
  // /State
  const [on, setOn] = React.useState(DEFAULT_ON);
  const [text, setText] = React.useState(DEFAULT_TEXT);
  const [height, setHeight] = React.useState(DEFAULT_HEIGHT);
  const [image, setImage] = React.useState(DEFAULT_IMAGE);
  const [thumbnail, setThumbnail] = React.useState(DEFAULT_THUMBNAIL);
  const [medicines, setMedicines] = React.useState(DEFAULT_MEDICINES);
  const [herbs, setHerbs] = React.useState(DEFAULT_HERBS);

  // Ref
  const textAreaRef = React.useRef(null);
  const fileRef = React.useRef(null);

  // Redux
  const me = useSelector(
    ({orm, system: {session: {id}}}) => pickUserSelector(id)(orm) || {} as any,
    (prev, curr) => isEqual(prev, curr),
  );
  const dispatch = useDispatch();

  const {avatar} = me || {} as any;

  const FUNC_MAP = {
    medi: setMedicines,
    herb: setHerbs,
  };

  // 처방사전 첨부
  const setDictAttaches = React.useCallback(({type, ...dict}: IDictCard) => {
    if (medicines.length + herbs.length > MAX_DICT_ATTACH) {
      alert(`사전 첨부는 ${MAX_DICT_ATTACH}개 까지만 가능합니다.`);
      return false;
    }

    const func = FUNC_MAP[type];
    func && func(curr => uniqBy([...curr, dict], obj => obj.id));
  }, [medicines, herbs]);

  // 처방사전 제거
  const deleteDictAttaches = React.useCallback((type: string) => (dictId: HashId) => {
    const func = FUNC_MAP[type];
    func && func(curr => curr.filter(({id}) => id !== dictId));
  }, []);

  return ( // 댓글 작성 영역
     <>
      {on ? (
        <WriteCommentDivUnfold>
          <Avatar />
          <p>일이삼사오육칠팔구십</p>
          <UserNameSelector />
          <TextAreaDiv>
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
            <TextArea
              placeholder="댓글을 입력해주세요."
              ref={textAreaRef}
              onChange={e => {
                const {value} = e.target;
                setText(value);
                setHeight(textAreaRef.current.scrollHeight);
              }}
              value={text}
              style={{
                height: typeof height === 'number' ? `${height}px` : height,
              }}
              onTouchStart={(e) => {
                e.touches.length > 1 && e.preventDefault();
              }}
            />
            <DictUl>
              {medicines.map(item => (
                <li key={item.id}>
                  <DictCard
                    data={item}
                    type="medi"
                    onDelete={deleteDictAttaches('medi')}
                  />
                </li>
              ))}
              {herbs.map(item => (
                <li key={item.id}>
                  <DictCard
                    data={item}
                    type="herb"
                    onDelete={deleteDictAttaches('herb')}
                  />
                </li>
              ))}
            </DictUl>
            <WriteCommentUl>
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
                    const file = e.target.files[0];
                    if (!file.type.includes('image')) {
                      alert('잘못된 파일 타입입니다.');
                      return false;
                    }
                    setImage(file);
                    const reader = new FileReader();
                    reader.readAsDataURL(file);

                    reader.onload = () => {
                      setThumbnail(reader.result);
                    };
                  }}
                />
              </li>
              <li>
                <Btn
                  onClick={() => {
                    const api = new StoryCommentApi(access);
                    const form = new FormData();
                    form.append('text', text);
                    form.append('image', image);
                    medicines.forEach(({id}) => form.append('medicine_ids', id) );
                    herbs.forEach(({id}) => form.append('herb_ids', id) );

                    (parentPk ?
                      api.createReply(storyPk, parentPk, form) :
                      api.create(storyPk, form))
                      .then(({data: {result}}) => {
                        if (!!result) {
                          onCreate(result);
                          setOn(DEFAULT_ON);
                          setText(DEFAULT_TEXT);
                          setHeight(DEFAULT_HEIGHT);
                          setImage(DEFAULT_IMAGE);
                          setThumbnail(DEFAULT_THUMBNAIL);
                          setHerbs(DEFAULT_HERBS);
                          setMedicines(DEFAULT_MEDICINES);
                        }
                      });
                  }}
                >
                  등록
                </Btn>
              </li>
            </WriteCommentUl>
          </TextAreaDiv>
        </WriteCommentDivUnfold>
      ) : (
        <WriteCommentDiv>
          <StyledAvatar
            src={!hideWriter
              ? avatar
              : staticUrl('/static/images/icon/icon-default-anony.png')
            }
          />
          <StyledInput
            onClick={() => {
              setOn(true);
              setTimeout(() => textAreaRef.current.focus(), 300);
            }}
            onTouchStart={(e) => {
              e.touches.length > 1 && e.preventDefault();
            }}
            placeholder="댓글을 입력해주세요."
            readOnly
          />
        </WriteCommentDiv>
      )}
    </>
  );
});

const StyledA = styled(A)`
  color: ${$POINT_BLUE} !important;
`;

const blindReasonText = (blindReason, prefix) => {
  switch(blindReason){
    case 'privy':
      return `당사자 요청에 의해 블라인드 처리된 ${prefix}글입니다.`;
    case 'reported':
      return `신고 누적 3건으로, 블라인드 처리된 ${prefix}글입니다.`;
    case 'admin':
      return `관리자에 의해 블라인드 처리된 ${prefix}글입니다.`;
    default:
      return `블라인드 처리된 ${prefix}글입니다.`;
  }
};

export const Comment = React.memo((
  {
    access,
    depth,
    storyPk,
    hideWriter,
    reaction,
    data: {
      id,
      up_count,
      down_count,
      reaction_type,
      reply_count,
      text,
      images = [],
      medicines,
      herbs,
      status,
      blind_reason
    },
  },
) => {
  const [isOpen, setOpen] = React.useState(false);

  return ( // 실제 댓글
    <>
      {status === 'blinded' ? (
        <p className="pre-line">
          <div className="blind">
            <img
              src={staticUrl('/static/images/icon/icon-blind.png')}
              alt="블라인드"
            />
            {blindReasonText(blind_reason, depth === 0 ? '댓' : '답')}
          </div>
        </p>
      ) : (
        <>
          <ul className="add-picture">
            {images.map(src => (
              <li key={src}>
                <img src={src} alt=""/>
              </li>
            ))}
          </ul>
          <p className="pre-line">
            <Linkify component={StyledA} properties={{newTab: true}}>
              {text}
            </Linkify>
          </p>
          <ul className="dict-wrap">
            {medicines.map(item => (
              <li key={item.id}>
                <DictCard data={item} type="medi" />
              </li>
            ))}
            {herbs.map(item => (
              <li key={item.id}>
                <DictCard data={item} type="herb" />
              </li>
            ))}
          </ul>
        </>
        )}
    </>
  );
});

export const reaction = (access, setData) =>
  (storyPk: HashId, commentPk: HashId, reactionType: 'up' | 'down') => {
    if (access) {
      const api = new StoryCommentApi(access);
      api.reaction(storyPk, commentPk, reactionType)
        .then(res => {
          if (res.status === 200) {
            const {data: {result: {reaction_type}}} = res;
            setData(data => {
              const {up_count, down_count, reaction_type: oldReactionType} = data[commentPk];
              return {
                ...data,
                [commentPk]: {
                  ...data[commentPk],
                  reaction_type,
                  up_count: reactionType === 'up' ?
                    reaction_type === 'up' ?
                      up_count + 1 :
                      up_count - 1 :
                    oldReactionType === 'up' ?
                      up_count - 1 :
                      up_count,
                  down_count: reactionType === 'down' ?
                    reaction_type === 'down' ?
                      down_count + 1 :
                      down_count - 1 :
                    oldReactionType === 'down' ?
                      down_count - 1 :
                      down_count,
                },
              };
            });
          }
        });
    } else {
      alert('리액션은 로그인 후 가능합니다.');
    }
  };

export const CommentOption = React.memo(({storyPk, setData, access, isWriter, deleteComment, id, did_report}) => {
  const [isOptionOn, setIsOptionOn] = React.useState(false);
  const dispatch = useDispatch();

  return (
    <>
      <MoreBtn onClick={() => setIsOptionOn(true)}>
        <img
          src={staticUrl('/static/images/icon/icon-more-btn.png')}
          alt="더보기"
        />
      </MoreBtn>
      {isOptionOn && (
        <>
          <TransBg
            onClick={() => setIsOptionOn(false)}
          />
          <LayerPopUpUl>
            {isWriter && (
              <li onClick={() => deleteComment(id)}>
                <img
                  src={staticUrl('/static/images/icon/icon-delete.png')}
                  alt="삭제"
                />
                삭제
                <span>해당 댓글을 삭제합니다.</span>
              </li>
            )}
            {!isWriter && (
              <li
                onClick={() => {
                  if (did_report) {
                    alert('이미 신고한 댓글입니다.');
                  } else {
                    dispatch(pushPopup(ReportPopup, {
                      onClick: (form) => {
                        new StoryCommentApi(access)
                          .report(storyPk, id, form)
                          .then(({status}) => {
                            if (Math.floor(status / 100) !== 4) {
                              setData(curr => ({
                                ...curr,
                                [id]: {...curr[id], did_report: true},
                              }));
                              setIsOptionOn(false);
                              alert('신고되었습니다.');
                            }
                          });
                      },
                    }));
                  }
                }}
              >
                <img
                  src={staticUrl('/static/images/icon/icon-report.png')}
                  alt="신고하기"
                />
                신고하기
                <span>해당 글을 신고합니다.</span>
              </li>
            )}
          </LayerPopUpUl>
        </>
      )}
    </>
  );
});
const deleteComment = (access, dispatch, setData, setIds, storyPk, callback) => (id: HashId) => {
  new StoryCommentApi(access).destroy(storyPk, id).then(({status}) => {
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
          storyPk,
          ({comment_count, ...curr}) =>
            ({...curr, comment_count: comment_count - 1}),
        ),
      );
    }
  });
};

const CommentList = React.memo(({className, depth, parentPk, hideWriter, storyPk, access}) => {
  // Context
  const [replyCountMap, setReplyCountMap] = useGlobalState('replyCountMap');
  const setReplyCount = (id: HashId, diff) => setReplyCountMap(curr => ({
    ...curr,
    [id]: curr[id] + diff,
  }));

  // State
  const [ids, setIds] = React.useState([]);
  const [data, setData] = React.useState({});
  const [rest, setRest] = React.useState({});

  // Redux
  const dispatch = useDispatch();
  const myId = useSelector(({system: {session: {id}}}) => id);

  // Re-Use
  const saveComment = ({data: {results, ...rest}}) => {
    if (!!results) {
      const ids = [];
      const data = {};
      const replyCountMap = {};
      results.forEach(comment => {
        const {id: commentId, reply_count, ...rest} = comment;
        ids.push(commentId);
        data[commentId] = {id: commentId, ...rest};
  
        // 대댓글 개수를 컨텍스트에 저장하기 위해 분리 보관
        replyCountMap[commentId] = reply_count;
      });
      setIds(curr => [...curr, ...ids]);
      setData(curr => ({...curr, ...data}));
      setRest(rest);
  
      // 대댓글 개수를 컨텍스트에 저장
      setReplyCountMap(curr => ({
        ...curr,
        ...replyCountMap,
      }));
    }
  };

  // Fetch Data
  React.useEffect(() => {
    const api = new StoryCommentApi(access);
    (parentPk ?
        api.replyList(storyPk, parentPk) :
        api.list(storyPk)
    ).then(saveComment);
  }, [access, storyPk, parentPk]);

  return ( // 댓글 리스트. 대댓글 리스트이기도 함
    <CommentDiv className={classNames('comment-list', className)}>
      <WriteComment
        storyPk={storyPk}
        hideWriter={hideWriter}
        parentPk={parentPk}
        access={access}
        onCreate={(data) => {
          setIds(curr => [data.id, ...curr]);
          setData(curr => ({...curr, [data.id]: data}));

          // 답글인 경우 원글의 대댓글 개수 증가, 원글인 경우 대댓글 개수를 0개로 초기화
          parentPk
            ? setReplyCount(parentPk, 1)
            : setReplyCountMap(curr => ({...curr, [data.id]: 0}));

          dispatch(
            updateStory(
              storyPk,
              ({comment_count, ...curr}) => ({
                ...curr,
                comment_count: comment_count + 1,
              }),
            ),
          );
        }}
      />
      <ul>
        {ids.map(id => {
          const item = data[id];
          if (!item) {
            return null;
          }

          const {user, created_at, did_report, ...commentData} = item;
          const isWriter = user && user.id === myId;

          return (
            <CommentLi key={id}>
              <h2>
                  <div style={{display: 'inline-block'}}>
                    <StyledAvatar
                      {...user}
                      src={user
                        ? user.avatar 
                        : staticUrl('/static/images/icon/icon-default-anony.png')
                       }
                    />
                  </div>  
                {/* TODO: 한의사 === 학생, 관리자, 작성자 스타일이 다릅니다! 개발 후 스타일 추가하겠습니다! 조건문 추가부탁드립니다:) */}
                {user ?
                  <Label
                    name={USER_TYPE_TO_KOR[user.user_type]}
                    color={$FONT_COLOR}
                    borderColor="#999"
                  />
                  : "익명의 유저"
                }
                <span className="date">
                  {toDateFormat(created_at, 'YY. MM. DD. HH:mm')}
                </span>
              </h2>
              <CommentOption
                storyPk={storyPk}
                setData={setData}
                access={access}
                isWriter={isWriter}
                deleteComment={deleteComment(
                  access,
                  dispatch,
                  setData,
                  setIds,
                  storyPk,
                  () => parentPk && setReplyCount(parentPk, -1),
                )}
                id={id}
                did_report={did_report}
              />
              <Comment
                access={access}
                storyPk={storyPk}
                hideWriter={hideWriter}
                data={{
                  ...commentData,
                  reply_count: replyCountMap[id],
                }}
                depth={depth}
              />
            </CommentLi>
          );
        })}
        {depth === 0 && rest.next && (
          <CommentLi
            className="more"
            onClick={() => {
              axiosInstance({token: access, baseURL: BASE_URL}).get(rest.next).then(saveComment);
            }}
          >
            <p>댓글 보기({rest.count - ids.length}개)</p>
          </CommentLi>
        )}
      </ul>
    </CommentDiv>
  );
});


const CommentArea = React.memo((props) => {
  const {access} = useSelector(({system: {session: {access}}}) => ({access}));

  return (
    <GlobalStateProvider>
      <CommentList
        {...props}
        depth={0}
        access={access}
      />
    </GlobalStateProvider>
  );
});

CommentArea.displayName = 'CommentArea';
export default CommentArea;
