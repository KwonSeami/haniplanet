import * as React from 'react';
import {staticUrl} from '../../../src/constants/env';
import styled from 'styled-components';
import {fontStyleMixin, backgroundImgMixin} from '../../../styles/mixins.styles';
import {$GRAY, $WHITE} from '../../../styles/variables.types';
import Link from 'next/link';
import {communityUserTypeGradient} from '../../../src/lib/community';

const BreadcrumbsFrame = styled.nav`
  position: absolute;
  top: -29px;
`;

const Li = styled.li<{color?: string}>`
  display: inline-block;
  vertical-align: middle;

  & ~ li:before {
    content: '';
    display: inline-block;
    vertical-align: middle;
    width: 13px;
    height: 14px;
    margin: -2px 3px 0 2px;
    ${backgroundImgMixin({
      img: staticUrl('/static/images/icon/arrow/icon-gray-shortcuts.png'),
    })};
  }

  a {
    ${fontStyleMixin({
      size: 12,
      color: $GRAY
    })};

    &:hover {
      text-decoration: underline;

      span {
        text-decoration: underline;
      }
    }
  
    img {
      vertical-align: middle;
      width: 14px;
      margin-top: -2px;
    }
    
    span {
      display: inline-block;
      margin-left: 3px;
      padding: 1px 4px 2px;
      line-height: 14px;
      ${fontStyleMixin({
        size: 12,
        weight: '300',
        color: $WHITE
      })};
      border-radius: 4px;
      background: ${({color}) => color};
    }
  }
`;

interface Props {
  menuId?: HashId;
  menuName?: string;
  userType?: string;
}

const Breadcrumbs: React.FC<Props> = ({menuId, menuName, userType}) => {

  return (
    <BreadcrumbsFrame>
      <ul>
        <Li>
          <Link href="/">
            <a>
              <img
                alt="메인"
                src={staticUrl('/static/images/icon/icon-gray-root.png')}
              />
            </a>
          </Link>
        </Li>
        <Li>
          <Link href="/community">
            <a>
              커뮤니티
            </a>
          </Link>
        </Li>
        {(!!menuName && !!menuId && !!userType) && (
          <Li color={communityUserTypeGradient(userType)}>
            <Link 
              href={`/community?category=${menuId}`}
            >
              <a>
                <span>{menuName}</span>
              </a>
            </Link>
          </Li>
        )}
      </ul>
    </BreadcrumbsFrame>
  );
};

export default Breadcrumbs;
