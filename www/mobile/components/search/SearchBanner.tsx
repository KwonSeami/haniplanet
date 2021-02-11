import * as React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import Link from 'next/link';
import { fontStyleMixin } from '../../styles/mixins.styles';
import { $GRAY, $BORDER_COLOR } from '../../styles/variables.types';
import { staticUrl } from '../../src/constants/env';

const BannerWrapperDiv = styled.div`
  padding: 12px 0 15px;
  border-top: 1px solid ${$BORDER_COLOR};
  background-color: #f9f9f9;

  @media screen and (max-width: 680px) {
    padding: 12px 15px 15px;
  }

  > div {
    max-width: 680px;
    margin: 0 auto;
  }

  h4 {
    font-size: 16px;
    
    img {
      vertical-align: middle;
      width: 19px;
      height: 19px;
      margin-top: -3px;
    }
  }

  p {
    display: -webkit-box;
    margin: 6px 0 5px;
    ${fontStyleMixin({
      size: 12,
      weight: '300',
      color: $GRAY
    })};
  }

  button {
    ${fontStyleMixin({
      size: 12,
      weight: '300',
      color: $GRAY
    })};

    img {
      vertical-align: middle;
      width: 12px;
      height: 12px;
      margin: -2px 0 0 4px;
    }
  }

  &.on {
    p {
      display: block; 
      display: -webkit-box;
      text-overflow: ellipsis;
      word-break: break-all;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    button img {
      transform: rotate(180deg);
    }
  }
`

interface Props {
  title: string;
  direct_url: string;
  content: string;
}

const SearchBanner: React.FC<Props> = ({
  title,
  direct_url,
  content
}) => {
  const [toggle, setToggle] = React.useState(false);
  return (
    <BannerWrapperDiv 
      className={cn('explanation', {
        on: !toggle
      })}
    >
      <div>
        <a>
          <h4>
            {title}
            <Link
              as={direct_url}
              href={direct_url}
            >
              <a>
                <img 
                  src={staticUrl('/static/images/icon/arrow/icon-feed-more.png')}
                  alt="바로가기"
                />
              </a>
            </Link>
          </h4>
        </a>
        <p>{content}</p>
        <button onClick={() => setToggle(curr => !curr)}>
          {!toggle ? ('더보기') : ('접기')}
          <img 
            src={staticUrl('/static/images/icon/arrow/icon-feed-arrow.png')} 
            alt="화살표"
          />
        </button>
      </div>
    </BannerWrapperDiv>
  )
};

SearchBanner.displayName = 'SearchBanner';

export default React.memo(SearchBanner);