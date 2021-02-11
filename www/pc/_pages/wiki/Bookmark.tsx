import * as React from 'react';
import styled from 'styled-components';
import {staticUrl} from '../../src/constants/env';

interface Props {
  className?: string;
  is_bookmarked?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const BookmarkSpan = styled.div`
  display: block;
  cursor: pointer;

  img {
    width: 13px;
  }
`;

const Bookmark = React.memo<Props>(({
  className,
  onClick,
  is_bookmarked,
}) => {
  const bookmarkImgFileName = is_bookmarked
    ? staticUrl('/static/images/icon/icon-bookmark-on.png')
    : staticUrl('/static/images/icon/icon-bookmark.png');

  return (
    <BookmarkSpan
      className={className}
      onClick={(e) => onClick && onClick(e)}
    >
      <img
        src={bookmarkImgFileName}
        alt="북마크"
      />
    </BookmarkSpan>
  );
});

export default Bookmark;
