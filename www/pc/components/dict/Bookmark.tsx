import * as React from 'react';
import {Dispatch} from 'redux';
import cn from 'classnames';
import styled from 'styled-components';
import {staticUrl} from '../../src/constants/env';

interface Props {
  className?: string;
  isBookmark: boolean;
  as?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Div = styled.div`
  cursor: pointer;

  img {
    width: 30px;
  }
`;

const Bookmark: React.FC<Props> = React.memo(({
  className,
  onClick,
  as,
  isBookmark = true
}) => {
  return (
    <Div 
      as={as}
      className={className}
      onClick={() => onClick && onClick()}
    >
      {isBookmark ? (
        <img
          src={staticUrl('/static/images/icon/icon-bookmark-on.png')}
          alt="북마크"
        />
      ) : (
        <img
          src={staticUrl('/static/images/icon/icon-bookmark.png')}
          alt="북마크"
        />
      )}
    </Div>
  );
});

export default Bookmark;
