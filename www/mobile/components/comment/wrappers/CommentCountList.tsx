import React from 'react';
import styled from 'styled-components';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import StoryCommentApi from "../../../src/apis/StoryCommentApi";
import {useGlobalState, reaction} from "./CommentArea";
import {axiosInstance} from "@hanii/planet-apis";
import {updateStory} from "../../../src/reducers/orm/story/storyReducer";
import {BASE_URL} from "../../../src/constants/env";
import {fontStyleMixin} from '../../../styles/mixins.styles';
import Button from '../../inputs/Button';
import {$POINT_BLUE, $BORDER_COLOR} from '../../../styles/variables.types';
import {HashId} from '@hanii/planet-types';
import {useRouter} from 'next/router';
import {pickBandSelector} from '../../../src/reducers/orm/band/selector';
import {pickTimelineSelector} from '../../../src/reducers/orm/timeline/selector';

const CommentWrapperDiv = styled.div`
  .list-container {
    position: relative;
    border-top: 1px solid ${$BORDER_COLOR};

    .list-container {
      border-top: 0;
    }
  }

  .header {
    position: relative;
    padding: 13px 15px;
    ${fontStyleMixin({
      size: 13,
      weight: 'bold',
    })};

    & + .comment-list {
      overflow: hidden;
    }

    span {
      ${fontStyleMixin({
        weight: 'bold',
        color: $POINT_BLUE
      })};
    }

    p {
      display: inline-block;
    }
  }

  .sort {
    position: absolute;
    right: 20px;
    top: 13px;
    line-height: 1;
  }
`;

const MoreButton = styled(Button)`
  width: 100%;
  height: 50px;
  border-top: 1px solid ${$BORDER_COLOR};
  border-radius: 0;
  background-color: #f5f7f9;
  ${fontStyleMixin({
    size: 14,
    color: '#999'
  })};
`;

export interface IDefaultCommentListProps {
  access: string;
  className?: string;
  depth: number;
  targetPk: string | number;
  parentPk?: string | null;
  targetName: string;
  parentUserExposeType: 'nick' | 'anon' | 'real';
  maxDepth?: number;
  maxLength?: number;
  placeholder?: string;
  commentType?: string;
  Sort?: React.ComponentType;
  itemCompFunc: () => React.ComponentType;
  inputCompFunc: () => React.ComponentType;
  can_comment: boolean;
}

const CommentCountList = React.memo<IDefaultCommentListProps>((
  {
    access,
    className,
    depth,
    maxDepth,
    targetPk,
    parentPk,
    targetName,
    commentType,
    parentUserExposeType,
    itemCompFunc,
    inputCompFunc,
    Sort,
    maxLength,
    placeholder,
    can_comment,
  }
) => {
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
  const [sort, setSort] = React.useState('created_at');

  // Redux
  const dispatch = useDispatch();
  const {pathname, query: {slug, timeline: timelineId}} = useRouter();
  const isOnClass = pathname.includes('onclass');
  const {onClassBand, timeline} = useSelector(({orm}) => ({
    timeline: pickTimelineSelector(timelineId)(orm) || {},
    onClassBand: pickBandSelector(slug)(orm) || {}
  }),shallowEqual);

  const {band_member_grade} = onClassBand || {};
  const isOwner = isOnClass && band_member_grade !== 'normal';
  const isQnA = isOnClass && (timeline || {}).name === "질문 및 답변";

  // Re-Use
  const saveComment = ({data: {results, ...rest}}, more = false) => {
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
      more
        ? setIds(curr => [...curr, ...ids])
        : setIds(ids);
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
    const params = {order_by: sort, comment_type: commentType};
    (parentPk ?
        api.replyList(targetPk, parentPk, params) :
        api.list(targetPk, params)
    ).then(saveComment);
  }, [access, sort, commentType, parentPk, targetPk]);

  const Item = itemCompFunc();
  const Input = inputCompFunc();

  return (
    <CommentWrapperDiv className="comment-list">
      {(isOwner ? (depth > 0 || can_comment) : can_comment) &&
        <Input
          targetPk={targetPk}
          parentPk={parentPk}
          commentType={commentType}
          parentUserExposeType={parentUserExposeType}
          access={access}
          maxLength={maxLength}
          placeholder={(isQnA && isOwner) ? '답변을 입력해주세요.' : placeholder}
          onSave={(data) => {
            setIds(curr => [data.id, ...curr]);
            setData(curr => ({...curr, [data.id]: {...data, is_band_manager_comment: isOwner}}));

            // 답글인 경우 원글의 대댓글 개수 증가, 원글인 경우 대댓글 개수를 0개로 초기화
            parentPk
              ? setReplyCount(parentPk, 1)
              : setReplyCountMap(curr => ({...curr, [data.id]: 0}));

            dispatch(
              updateStory(
                targetPk,
                ({comment_count, is_answered, ...curr}) => ({
                  ...curr,
                  is_answered: isOwner,
                  comment_count: comment_count + 1,
                }),
              ),
            );
          }}
        />
      }
      {ids.length > 0 && (
        <div className="list-container">
          {(!!rest.count && depth === 0) && (
          <div className="header">
            <p>
              <span>{rest.count}개</span>
              의 목록
            </p>
            {Sort && (
              <div className="sort">
                <Sort sort={sort} setSort={setSort}/>
              </div>
            )}
          </div>
          )}
          <ul className="comment-list">
            {ids.map(id => {
              const item = data[id];
              if (!item) {
                return null;
              }
              return (
                <Item
                  commentType={commentType}
                  data={item}
                  access={access}
                  depth={depth}
                  maxDepth={maxDepth}
                  targetPk={targetPk}
                  parentPk={parentPk}
                  targetName={targetName}
                  parentUserExposeType={parentUserExposeType}
                  listCompFunc={() => CommentCountList}
                  inputCompFunc={inputCompFunc}
                  setIds={(...args) => setIds(...args)}
                  setData={(...args) => setData(...args)}
                  setReplyCountMap={(...args) => setReplyCountMap(...args)}
                  setReplyCount={setReplyCount}
                  replyCountMap={replyCountMap}
                  reaction={reaction(access, setData)}
                />
              );
            })}
          </ul>
          {(depth === 0 && rest.next) && (
            <MoreButton type="button" onClick={() => {
              axiosInstance({token: access, baseURL: BASE_URL}).get(rest.next).then(response => {saveComment(response, true)});
            }}>더보기</MoreButton>
          )}
        </div>
      )}
    </CommentWrapperDiv>
  );
});
CommentCountList.displayName = 'CommentCountList';

export default CommentCountList;

