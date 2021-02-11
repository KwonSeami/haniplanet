import React from 'react';
import {useSelector, useDispatch} from "react-redux";
import {IDefaultCommentListProps} from "./CommentList";
import {IDefaultCommentItemProps} from "../items/CommentItem";
import styled from 'styled-components';
import {$BORDER_COLOR, $GRAY, $FLASH_WHITE} from '../../../styles/variables.types';
import StoryCommentApi from '../../../src/apis/StoryCommentApi';
import {createGlobalState} from '../../../src/hooks/useGlobalStete';
import { shallowEqual } from 'recompose';
import { pickBandSelector } from '../../../src/reducers/orm/band/selector';
import { useRouter } from 'next/router';
import {pickTimelineSelector} from '../../../src/reducers/orm/timeline/selector';

export const {GlobalStateProvider, useGlobalState} = createGlobalState({replyCountMap: {}});

interface ICommentAreaProps<ItemProps, InputProps, ListProps> {
  itemComponent: React.ComponentType<ItemProps>;
  inputComponent: React.ComponentType<InputProps>;
  listComponent: React.ComponentType<ListProps>;
  caption?: React.ReactNode;
  sort?: React.ReactNode;
  apiPath: string;
  targetPk: string | number;
  targetName: string;
  maxDepth?: number;
  maxLength?: number;
  placeholder?: string;
  targetUserExposeType: 'nick' | 'anon' | 'real';
  commentType?: 'comment' | 'request' | 'share';
  children?: any;
  can_comment?:boolean;
}

interface IDefaultCommentInputProps {
  targetPk: string | number;
  parentPk: string;
  parentUserExposeType: 'nick' | 'anon' | 'real';
  access: string | null;
  onSave: () => void;
  depth?: number;
  maxLength: number;
  placeholder?: string;
}

const CommentWrapperDiv = styled.div`
  position: relative;
  background-color: ${$FLASH_WHITE};
  border-bottom: 1px solid ${$BORDER_COLOR};
`;

const CaptionP = styled.p`
  padding: 10px 15px 0;
  margin-bottom: -5px;
  line-height: 19px;
  color: ${$GRAY};
  font-size: 12px;
`;

const CommentArea = React.memo<ICommentAreaProps<IDefaultCommentItemProps, IDefaultCommentInputProps, IDefaultCommentListProps>>((
  {
    itemComponent: ItemComp,
    listComponent: ListComp,
    inputComponent: InputComp,
    caption,
    sort,
    targetPk,
    targetName,
    depth = 0,
    maxDepth = 1,
    targetUserExposeType,
    commentType = 'comment',
    maxLength = 500,
    placeholder,
    children,
    can_comment = true
  }
) => {
  const {asPath, pathname, query:{timeline: timelineId, slug}} = useRouter();
  const isOnClass = pathname.includes('onclass');
  
  const {access, onClassBand, timeline} = useSelector(
    ({orm, system: {session: {access}}}) => ({
      access,
      onClassBand: pickBandSelector(slug)(orm) || {},
      timeline: pickTimelineSelector(timelineId)(orm) || {}
  }), shallowEqual);

  const {band_member_grade} = onClassBand || {};
  const isAdmin = isOnClass && band_member_grade === 'admin';
  const isQnA = isOnClass && (timeline || {}).name === "질문 및 답변";

  return (
    <GlobalStateProvider>
      <CommentWrapperDiv className="comment-area">
        {typeof caption === 'string' ? <CaptionP>{caption}</CaptionP> : caption}
        <ListComp
          commentType={commentType}
          parentUserExposeType={targetUserExposeType}
          access={access}
          targetPk={targetPk}
          targetName={targetName}
          maxDepth={maxDepth}
          maxLength={maxLength}
          placeholder={(isQnA && isAdmin) ? '답변을 입력해주세요.' : placeholder}
          itemCompFunc={() => ItemComp}
          inputCompFunc={() => InputComp}
          depth={depth}
          Sort={sort}
          children={children}
          can_comment={can_comment}
        />
      </CommentWrapperDiv>
    </GlobalStateProvider>
  );
});

export const reaction = (access, setData) =>
  (storyPk: HashId, commentPk: HashId, reactionType: 'up' | 'down') => {
    if (access) {
      const api = new StoryCommentApi(access);
      api.reaction(storyPk, commentPk, reactionType)
        .then(({status, data: {result: {reaction_type}}}) => {
          if (status === 200) {
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

CommentArea.displayName = 'CommentArea';

export default CommentArea;
