import React from 'react';
import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$GRAY, $TEXT_GRAY} from '../../../styles/variables.types';
import Link from 'next/link';

const Li = styled.li`
  padding: 4px 0;

  a {
    ${fontStyleMixin({
      size: 13,
      color: $GRAY,
    })};
  }

  span {
    margin-right: 2px;
    ${fontStyleMixin({
      size: 13,
      color: $TEXT_GRAY,
    })};
  }

  &:hover {
    a {
      text-decoration: underline;
    }
  }
`;

interface Props {
  id: HashId;
  title: string;
  menu_tag?: string; // 추가 되어야 하는 데이터
  isUserLogined: boolean;
}

const NoticeItem: React.FC<Props> = ({
  id,
  title,
  menu_tag,
  isUserLogined
}) => {
  const moveTo = isUserLogined
    ? `/guide#${id}`
    : '/guide';

  return (
    <Li className="ellipsis">
      {menu_tag && (
        // 추후 말머리 글들 모아보는 기능이 생기면 이 span을 <Link>로 감싸야함(주석 지우지 말아주세요)
        <span>
          [{menu_tag}]
        </span>
      )}
      <Link href={moveTo}>
        <a>
          {title}
        </a>
      </Link>
    </Li>
  );
};

export default React.memo(NoticeItem);
