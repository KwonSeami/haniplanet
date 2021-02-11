import * as React from 'react';
import Tag from './Tag';
import styled from 'styled-components';
import Button from '../../inputs/Button/ButtonDynamic';
import {staticUrl} from '../../../src/constants/env';

interface Props {
  tags: ITag[];
  onClick: (id: HashId, rest: any) => void;
}

const TagLi = styled.li`
  display: inline-block;
  vertical-align: middle;

  button.tag-delete {
    position: relative;
    top: 8px;
    margin: 0 13px 0 -8px;
  }
`;

const TagList = React.memo<Props>(({tags, onClick}) => (
  <ul className="tag-list">
    {tags.map(({id, ...rest}) => (
      <TagLi key={id}>
        <Tag name={rest.name}/>
        <Button
          className="tag-delete"
          size={{
            width: '16px',
            height: '17px'
          }}
          border={{
            width: '0',
            radius: '50%'
          }}
          onClick={() => onClick(id, rest)}
        >
          <img
            src={staticUrl('/static/images/icon/icon-tag-delete.png')}
            alt="태그 삭제"
          />
        </Button>
      </TagLi>
    ))}
  </ul>
));

TagList.displayName = 'TagList';
export default TagList;
