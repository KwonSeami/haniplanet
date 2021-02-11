import * as React from 'react';
import styled from 'styled-components';
import {staticUrl} from '../../src/constants/env';
import Link from 'next/link';
import {communityUserTypeColor} from '../../src/lib/community';

const BreadcrumbsFrame = styled.nav`
  height: 34px;
  background: #fbfbfc;
  border-bottom: 1px solid #eee;
  
  ol {
    height: 34px;
    list-style: none;
  }
`;

const Li = styled.li<{color?: string}>`
  float: left;
  height: 34px;
  line-height: 34px;
  border-left: 1px solid #eee;
  font-size: 12px;
  
  &:first-child {
    background: #fff;
    border: none;
    
    a {
      padding: 0 15px;
    }
  }
  
  a, span {
    ${({color}) => `color: ${color || '#999'};`}
    height: inherit;
    width: inherit;
    padding: 0 10px;
    display: block;
  }
  
  img {
    width: auto;
    height: 14px;
    margin-top: 10px;
  }
`;

interface Props {
  userType?: string;
  menuId?: HashId;
  menuName?: string;
}

const Breadcrumbs: React.FC<Props> = ({userType, menuId, menuName}) => {

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
          <Li color={communityUserTypeColor(userType)}>
            <Link 
              href={`/community?category=${menuId}`}
            >
              <a>
                {menuName}
              </a>
            </Link>
          </Li>
        )}
      </ul>
    </BreadcrumbsFrame>
  );
};

export default Breadcrumbs;
