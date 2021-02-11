import * as React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import {staticUrl} from '../../src/constants/env';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {saveTheme} from '../../src/reducers/theme';
import ReactGA from 'react-ga';
import {useRouter} from "next/router";
import { $WHITE, $BORDER_COLOR } from '../../styles/variables.types';
import {RootState} from '../../src/reducers';

const ViewTabDiv = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  text-align: right;
  background-color: ${$WHITE};
  z-index: 2;
  box-sizing: border-box;

  &.fixed {
    position: fixed !important;
    top: 55px;
    left: 0;
    bottom: initial;
    width: 100%;
    max-width: initial;
    border-bottom: 1px solid ${$BORDER_COLOR};

    ul {
      max-width: 680px;
      margin: auto;
    }
  }

  ul {
    font-size: 0;

    li {
      display: inline-block;
      width: 32px;
      height: 32px;
    }
  }

  @media screen and (max-width: 680px) {
    padding-right: 15px;
  }
`;

interface Props {
  className?: string;
}

const FeedTheme: React.FC<Props> = ({className, children}) => {
  const {asPath} = useRouter();

  const dispatch = useDispatch();
  const {theme: {type}} = useSelector(
    ({theme}: RootState) => ({theme}),
    shallowEqual,
  );

  return (
    <>
      <ViewTabDiv className={cn('feed-theme', className)}>
        <ul>
          <li onClick={() => {
            dispatch(saveTheme('title'));
            ReactGA.event({
              category: '목록 뷰 테마',
              action: '목록 뷰 테마 > 제목 뷰 선택',
              label: `목록 뷰 테마 > ${asPath}`
            });
          }}>
            <img
              src={staticUrl(type === 'title'
                ? '/static/images/icon/icon-btn-title-on.png'
                : '/static/images/icon/icon-btn-title-off.png'
              )}
              alt="제목으로 보는 중"
            />
          </li>
          <li onClick={() => {
            dispatch(saveTheme('preview'));
            ReactGA.event({
              category: '목록 뷰 테마',
              action: '목록 뷰 테마 > 미리보기 뷰 선택',
              label: `목록 뷰 테마 > ${asPath}`
            });
          }}>
            <img
              src={staticUrl(type === 'preview'
                ? '/static/images/icon/icon-btn-feed-on.png'
                : '/static/images/icon/icon-btn-feed-off.png'
              )}
              alt="피드로 보는 중"
            />
          </li>
        </ul>
        {children}
      </ViewTabDiv>
    </>
  );
};

export default React.memo(FeedTheme);
