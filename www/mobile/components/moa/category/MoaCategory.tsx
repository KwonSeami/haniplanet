import * as React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import useMultipleRef from '../../../src/hooks/element/useMultipleRef';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$FONT_COLOR, $LIGHT_BLUE} from '../../../styles/variables.types';

export const MoaCategoryDiv = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: 680px;
  height: 48px;
  overflow-x: auto;
  white-space: nowrap;
  
  a {
    position: relative;;
    margin-right: 16px;
    line-height: 48px;
    ${fontStyleMixin({
      size: 15,
      color: '#999'
    })};
    
    &.on {
      ${fontStyleMixin({
        color: $FONT_COLOR,
        weight: 'bold'
      })};
  
      &::after {
        content:'';
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: -1;
        width: 100%;
        height: 50%;
        background-color: ${$LIGHT_BLUE};
      }
    }
  }

  @media screen and (max-width: 680px) {
    padding-left: 15px;
  }
`;

interface Props {
  timelines: any;
  className?: string;
  mainPageName?: string;
  isOnClass?: boolean;
}

const MoaCategory = React.memo<Props>(({
  timelines,
  mainPageName = "전체 글",
  isOnClass
}) => {
  // Router
  const {query: {slug, timeline}, pathname, asPath} = useRouter();
  // State
  const categoryItemRef = useMultipleRef(['all', ...timelines.map(({id}) => id)]);

  const type = isOnClass ? 'onclass' : 'band';
  const _pathname = isOnClass ? '/onclass/[slug]/' : pathname;
  const _asPath = isOnClass ? `/onclass/${slug}/` : asPath;

  return (
    <MoaCategoryDiv
      className="category"
    >
      <Link
        href={`/${type}/[slug]`}
        as={`/${type}/${slug}`}
        replace
      >
        <a
          ref={categoryItemRef.all}
          className={cn({on: !timeline})}
        >
          {mainPageName}
        </a>
      </Link>
      {timelines.map(({id, name}) => (
        <Link
          key={id}
          href={{pathname: _pathname, query: {timeline: id}}}
          as={{pathname: _asPath.split('?')[0], query: {timeline: id}}}
          replace
          passHref
        >
          <a
            ref={categoryItemRef[id]}
            className={cn({on: id === timeline})}
          >
            {name}
          </a>
        </Link>
      ))}
    </MoaCategoryDiv>
  );
});

MoaCategory.displayName = 'MoaCategory';
export default MoaCategory;