import * as React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import {staticUrl} from '../../src/constants/env';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {saveTheme} from '../../src/reducers/theme';
import {useRouter} from 'next/router';
import ReactGA from 'react-ga';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {$WHITE} from '../../styles/variables.types';
import {RootState} from '../../src/reducers';

interface Props {
  children: React.ReactNode;
  className?: string;
  titleViewOnly?: boolean;
}

const ViewTabUl = styled.ul`
  &.tag-page {
    position: absolute;
    right: 0;
    margin-right: 5px;
  }
  position: relative;
  z-index: 2;
  text-align: right;
  margin: 12px 0 -33px;

  li {
    position: relative;
    display: inline-block;
    width: 32px;
    height: 32px;
    cursor: pointer;

    div {
      position: absolute;
      top: -27px;
      left: 50%;
      padding: 6px 11px 7px 12px;
      transform: translate(-50%);
      text-align: center;
      white-space: nowrap;
      line-height: 12px;
      ${fontStyleMixin({
        size: 10,
        weight: '600',
        color: $WHITE
      })};
      border-radius: 14.5px;
      background-color: #2a3242;
      opacity: 0;
      visibility: hidden;

      &:before {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 50%;
        transform: translateX(-50%);
        border-left: 3px solid transparent;
        border-right: 3px solid transparent;
        border-top: 5px solid #2a3242;
      }
    }

    &:hover {
      div {
        opacity: 1;
        visibility: visible;
      }
    }
  }
`;

const FeedTheme: React.FC<Props> = (({
  children,
  className,
  titleViewOnly = false
}) => {
  const dispatch = useDispatch();

  const {type} = useSelector(
    ({theme}: RootState) => theme,
    shallowEqual
  );

  const router = useRouter();

  return (
    <>
      {!titleViewOnly && (
        <ViewTabUl className={cn('feed-theme', className)}>
          <li
            onClick={() => {
              dispatch(saveTheme('title'));
              ReactGA.event({
                category: '목록 뷰 테마',
                action: '목록 뷰 테마 > 제목 뷰 선택',
                label: `목록 뷰 테마 > ${router.asPath}`
              });
            }}
          >
            <img
              src={staticUrl(type === 'title'
                ? '/static/images/icon/icon-btn-title-on.png'
                : '/static/images/icon/icon-btn-title-off.png'
              )}
              alt="제목으로 보는 중"
            />
            <div>제목 형태로 보기</div>
          </li>
          <li
            onClick={() => {
              dispatch(saveTheme('preview'));
              ReactGA.event({
                category: '목록 뷰 테마',
                action: '목록 뷰 테마 > 미리보기 뷰 선택',
                label: `목록 뷰 테마 > ${router.asPath}`
              });
            }}
          >
            <img
              src={staticUrl(type === 'preview'
                ? '/static/images/icon/icon-btn-feed-on.png'
                : '/static/images/icon/icon-btn-feed-off.png'
              )}
              alt="피드로 보는 중"
            />
            <div>카드 형태로 보기</div>
          </li>
        </ViewTabUl>
      )}
      {children}
    </>
  );
});
export default React.memo(FeedTheme);
