// @잔혜연: 스타일 수정이 필요합니다.

import * as React from 'react';
import Link from 'next/link';
import Input from '../../../inputs/Input';
import ButtonGroup from '../../../inputs/ButtonGroup';
import styled from 'styled-components';
import {$BORDER_COLOR, $POINT_BLUE, $WHITE} from '../../../../styles/variables.types';
import {staticUrl} from '../../../../src/constants/env';

const AddCategoryDiv = styled.div`
  position: relative;
  margin-top: -1px;
  height: 45px;
  padding: 0 100px 0 10px;
  border: 1px solid ${$BORDER_COLOR};
  background-color: #f9f9f9;
  box-sizing: border-box;
`;

const StyledInput = styled(Input)`
  background-color: transparent;
  width: 100%;
  height: 43px;
`;

const StyledButtonGroup = styled(ButtonGroup)`
  position: absolute;
  right: 10px;
  top: 10px;

  &.edit {
    top: 10px;
  }

  li {
    margin-left: 4px;
  }
  
  button {
    width: 40px;
    height: 25px;
    border-radius: 0;
    box-sizing: border-box;
    border: 1px solid ${$BORDER_COLOR};
    background-color: ${$WHITE};
    font-size: 12px;

    &.right-button {
      color: ${$POINT_BLUE};
    }
  }
`;

interface Props {
  hasAdminPermission: boolean;
  name: string;
  id: HashId;
  editTimeline: (id: HashId, category: string) => void;
  deleteTimeline: (id: HashId) => void;
  new_story_count: number;
}

interface State {
  category: string;
  isHover: boolean;
  editing: boolean;
}

const WritingCategory = (
  {
    name,
    hasAdminPermission,
    editTimeline,
    deleteTimeline,
    id,
    new_story_count,
  },
) => {
  const [state, setState] = React.useState({
    category: name,
    isHover: false,
    editing: false,
  });

  const {
    editing,
    category,
    isHover,
  } = state;

  return (
    editing ? (
      <AddCategoryDiv>
        <StyledInput
          value={category}
          maxLength={15}
          onChange={e => {
            setState(curr => ({...curr, category: e.target.value}));
          }}
        />
        <StyledButtonGroup
          leftButton={{
            children: '확인',
            onClick: () => {
              editTimeline(id, category);
              setState(curr => ({...curr, editing: false}));
            },
          }}
          rightButton={{
            children: '취소',
            onClick: () => {
              setState(curr => ({...curr,
                editing: false,
                category: name,
              }));
            },
          }}
        />
      </AddCategoryDiv>
    ) : (
      <Link
        href={`/band/[slug]?timeline=${id}`}
        as={`?timeline=${id}`}
        replace
        passHref
      >
        <a
          onMouseOver={() => {
            setState(curr => ({...curr, isHover: true}));
          }}
          onMouseLeave={() => {
            setState(curr => ({...curr, isHover: false}));
          }}
        >
          <span>{category}</span>
          {!!new_story_count && (
            <img
              src={staticUrl('/static/images/icon/icon-new.png')}
              alt="new"
            />
          )}
          {(isHover && hasAdminPermission) && (
            <StyledButtonGroup
              leftButton={{
                children: '수정',
                onClick: e => {
                  e.preventDefault();
                  setState(curr => ({...curr, editing: true}));
                },
              }}
              rightButton={{
                children: '삭제',
                onClick: e => {
                  e.preventDefault();
                  deleteTimeline(id);
                },
              }}
            />
          )}
        </a>
      </Link>
    )
  );
};

export default WritingCategory;
