import * as React from 'react';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import {$BORDER_COLOR, $FONT_COLOR, $WHITE} from '../../styles/variables.types';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {staticUrl} from '../../src/constants/env';
import {pushPopup} from '../../src/reducers/popup';
import UrlPopup from '../layout/popup/UrlPopup';
import {useDispatch} from 'react-redux';

const FloatingMenuDiv = styled.div`
  position: fixed;
  z-index: 1;
  top: 178px;
  width: 90px;

  ul {
    padding: 5px 9px;
    background-color: ${$WHITE};
    border-radius: 10px;
    box-sizing: border-box;
    box-shadow: 1px 2px 6px 0 rgba(0, 0, 0, 0.1);
    margin-bottom: 8px;

    &:last-child {
      padding: 1px 15px;
      background-color: ${$FONT_COLOR};
      border: 1px solid #eee;

      &:hover {
        opacity: 0.9;

        li {
          opacity: 1;
        }
      }

      li {
        ${fontStyleMixin({
          size: 12,
          weight: '600',
          color: $WHITE
        })};
      }
    }

    li {
      position: relative;
      width: 100%;
      height: 75px;
      padding-top: 10px;
      box-sizing: border-box;
      text-align: center;
      letter-spacing: -0.1px;
      ${fontStyleMixin({
        size: 12,
        weight: '600'
      })};

      & ~ li::after {
        position: absolute;
        top: 0;
        left: 50%;
        width: 56px;
        height: 1px;
        background-color: ${$BORDER_COLOR};
        transform: translateX(-50%);
        content: '';
      }

      &:hover {
        opacity: 0.8;
      }

      img {
        display: block;
        width: 30px;
        margin: 0 auto 4px;
      }
    }
  }
`;

interface Props {
  menuList : Array<{
    imgSrc?: string;
    name?: string;
    title: string;
  }>
  onClick?: (name: string) => void;
  canShare?: boolean;
}
const FloatingMenu = React.memo<Props>((
  {menuList, onClick, canShare}
  ) => {
    const router = useRouter();
    const {route, asPath} = router;
    const dispatch = useDispatch();
    
    return (
      <>
        <FloatingMenuDiv>
          <ul>
            {menuList.map(({imgSrc, name, title}) => (
              <li 
                className="pointer"
                onClick={() => {
                  onClick
                    ? onClick(name)
                    : router.push(`${route}#${name}`, `${route}#${name}`);
                }}
              >
                {imgSrc && (
                  <img
                    src={imgSrc}
                    alt={`${title} 항목으로 이동`}
                  />
                )}
                {title}
              </li>
            ))}
          </ul>
          {canShare && (
            <ul>
              <li
                className="pointer"
                onClick={() => dispatch(pushPopup(UrlPopup, {url:`https://www.haniplanet.com${asPath}`}))}
              >
                <img
                  src={staticUrl('/static/images/icon/icon-hospital-share.png')}
                  alt="공유하기"
                />
                공유하기
              </li>
            </ul>
          )}
        </FloatingMenuDiv>
      </>
    )
  }
);

FloatingMenu.displayName = 'FloatingMenu';

export default FloatingMenu;