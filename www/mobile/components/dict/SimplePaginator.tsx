import * as React from 'react';
import classNames from 'classnames';
import range from 'lodash/range';
import Link from 'next/link';
import {$POINT_BLUE, $WHITE, $TEXT_GRAY, $GRAY, $FONT_COLOR} from '../../styles/variables.types';
import {staticUrl} from '../../src/constants/env';
import {fontStyleMixin} from '../../styles/mixins.styles';

export const PAGINATE_SIZE = 10;
export const PAGINATE_GROUP_SIZE = 5;

export function getStartEnd(number: number, maximum: number, groupCount = 10) {
  const base = Math.floor(number / groupCount);
  const min = number % groupCount === 0
    ? number - groupCount + 1
    : base * groupCount + 1;
  const _max = number % groupCount === 0
    ? number
    : base * groupCount + groupCount;
  const max = _max > maximum ? maximum : _max;

  return [parseInt(min, 10), parseInt(max, 10)];
}

interface ScrollTopLinkProps {
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  href: string;
  className?: string;
}

const ScrollTopLink: React.FC<ScrollTopLinkProps> = React.memo((
  {
    onClick,
    className,
    children,
    href,
    ...props
  }
) => (
  <Link href={href} {...props}>
    <a
      className={className || ''}
      onClick={(e) => {
        onClick && e.preventDefault();
        onClick && onClick(e);
      }}
    >
      <style jsx>{`
        a {
          display: block;
          width: 100%;
          height: 100%;
          ${fontStyleMixin({
            family: 'Montserrat',
            weight: '600',
            size: 12,
            color: $FONT_COLOR
          })}
        }
      `}</style>
      {children}
    </a>
  </Link>
));
ScrollTopLink.displayName = 'ScrollTopLink';

type TGenerateToFunction = (
  page: number,
) =>
  | string
  | {
  href: string;
};

interface Props {
  pageGroupSize?: number;
  currentPage: number;
  totalCount: number;
  pageSize: number;
  generateTo: TGenerateToFunction;
  className?: string;
  style?: React.CSSProperties;
  router?: any;
  prefixZero?: boolean;
}

const SimplePaginator: React.FC<Props> = React.memo((
  {
    totalCount,
    pageGroupSize = 5,
    currentPage,
    pageSize = PAGINATE_SIZE,
    className,
    router,
    generateTo: _generateTo,
    prefixZero,
    ...otherProps
  }
) => {
  const unpackGenerateTo: TGenerateToFunction = (...args) => {
    const rst = _generateTo(...args);

    return typeof rst === 'string'
      ? {
        href: rst,
      }
      : rst;
  };

  const maxPage = Math.floor(totalCount / pageSize) + (totalCount % pageSize ? 1 : 0);
  const [start, end] = getStartEnd(currentPage, maxPage, pageGroupSize);
  const prevGroup = start > 1 ? start - pageGroupSize : 0;
  const nextGroup = maxPage > end ? end + 1 : 0;
  const last = maxPage;

  return (
    <div
      className={`paginator ${className}`}
      {...otherProps}
    >
      <style jsx>{`
      .paginator {
        margin-top: 30px;
        width: 100%;
        text-align: center;
      }

      .paginator li {
        display: inline-block;
        vertical-align: middle;
        margin: 0 2.5px;
        padding: 0 5px;
        min-width: 24px;
        height: 24px;
        line-height: 21px;
        border: 1px solid transparent;
        box-sizing: border-box;
      }

      .paginator li.on {
        border: 1px solid ${$GRAY};
      }

      .paginator li:hover img.off {
        display: none;
      }

      .paginator li:hover img.on {
        display: block;
      }

      .paginator li img {
        width: 100%;
      }
      
      .paginator li img.on {
        display: none;
      }

      .paginator li.paginate-btn {
        background-color: ${$WHITE};
        width: 24px;
        border: 0;
        padding: 0;
      }

      .paginator li.paginate-btn:hover {
        border: 1px solid ${$POINT_BLUE};
      }

      .paginator li a {
        display: block;
        width: 100%;
        height: 100%;
      }
      `}</style>
      <ul>
        {!!prevGroup && (
          <>
            <li className="paginate-btn">
              <ScrollTopLink {...unpackGenerateTo(1)}>
                <img
                  src={staticUrl('/static/images/icon/arrow/icon-arrow-first1.png')}
                  className="off"
                  alt="처음으로"
                />
                <img
                  src={staticUrl('/static/images/icon/arrow/icon-arrow-first2.png')}
                  className="on"
                  alt="처음으로"
                />
              </ScrollTopLink>
            </li>
            <li className="paginate-btn">
              <ScrollTopLink {...unpackGenerateTo(prevGroup)}>
                <img
                  src={staticUrl('/static/images/icon/arrow/icon-arrow-prev1.png')}
                  className="off"
                  alt="이전"
                />
                <img
                  src={staticUrl('/static/images/icon/arrow/icon-arrow-prev2.png')}
                  className="on"
                  alt="이전"
                />
              </ScrollTopLink>
            </li>
          </>
        )}
        {range(start, end + 1).map(page => {
          const _page = (prefixZero && page < 10)
            ? `0${page}`
            : page;

          return (
            <li
              key={page}
              className={classNames('pointer', {
                on: currentPage == page,
              })}
            >
              <ScrollTopLink {...unpackGenerateTo(page)}>
                {_page}
              </ScrollTopLink>
            </li>
          );
        })}
        {!!nextGroup && (
          <>
            <li className="paginate-btn">
              <ScrollTopLink {...unpackGenerateTo(nextGroup)}>
                <img
                  src={staticUrl('/static/images/icon/arrow/icon-arrow-next1.png')}
                  className="off"
                  alt="다음"
                />
                <img
                  src={staticUrl('/static/images/icon/arrow/icon-arrow-next2.png')}
                  className="on"
                  alt="다음"
                />
              </ScrollTopLink>
            </li>
            <li className="paginate-btn">
              <ScrollTopLink {...unpackGenerateTo(last)}>
                <img
                  src={staticUrl('/static/images/icon/arrow/icon-arrow-last1.png')}
                  className="off"
                  alt="마지막으로"
                />
                <img
                  src={staticUrl('/static/images/icon/arrow/icon-arrow-last2.png')}
                  className="on"
                  alt="마지막으로"
                />
              </ScrollTopLink>
            </li>
          </>
        )}
      </ul>
    </div>
  );
});

export default SimplePaginator;
