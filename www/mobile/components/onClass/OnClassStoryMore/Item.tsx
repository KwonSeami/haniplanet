import React from 'react';
import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$TEXT_GRAY, $FONT_COLOR} from '../../../styles/variables.types';
import {under} from '../../../src/lib/numbers';
import Link from 'next/link';
import {useRouter} from 'next/router';
import cn from 'classnames';
import {staticUrl} from '../../../src/constants/env';

const Div = styled.div`
  height: 40px;
  font-size: 0;
  border-bottom: 1px solid #eee;

  @media screen and (max-width: 680px) {
    padding: 0 15px;
  }

  a {
    display: flex;
    max-width: 100%;
    height: 100%;
    white-space: nowrap;
    align-items: center;
  }

  div {
    width: 30px;

    img {
      width: 20px;
      margin: 0 auto;
    }
  }

  .category {
    padding-right: 4px;
    ${fontStyleMixin({
      size: 12,
      color: $TEXT_GRAY
    })};
  }

  .on {
    text-decoration: underline;
  }

  h3 {
    padding-right: 4px;
    line-height: inherit;
    white-space: nowrap;
    text-overflow: ellipsis;
    ${fontStyleMixin({
      size: 14,
      color: $FONT_COLOR
    })};
    overflow: hidden;
  }

  .blue {
    ${fontStyleMixin({
      size: 11,
      color: '#499aff'
    })};
  }
`;

interface Props {
  id: HashId;
  title: string;
  comment_count: number;
  is_notice: boolean;
  isQnA?: boolean;
  category?: {
    name: string;
    avatar: string;
  }
}

const Item = ({
  id,
  title,
  comment_count,
  isQnA,
  category,
}: Props) => {
  const {query: {slug, id: storyId, timeline}} = useRouter();
  const {name} = category || {};
  return (
    <Div>
      <Link
        as={`/onclass/${slug}/timeline/${id}?timeline=${timeline}`}
        href={`/onclass/[slug]/timeline/[id]?timeline=${timeline}`}
        passHref

      >
        <a>
          {!isQnA && (
            (name === '공지')
              ? <span className='category'>[공지]</span>
              : <div>
                  <img
                    src={staticUrl('/static/images/icon/onclass-board-file.png')}
                    alt=""
                  />
                </div>
          )}
          <h3 className={cn({on: id === storyId})}>{title}</h3>
          {comment_count > 0 && (
            <span className="blue">({under(comment_count, 99)})</span>
          )}
        </a>
      </Link>
    </Div>  
  );
};

export default React.memo(Item);
