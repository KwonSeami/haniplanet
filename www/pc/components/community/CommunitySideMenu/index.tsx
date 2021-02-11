import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$GRAY, $TEXT_GRAY, $WHITE, $POINT_BLUE, $FONT_COLOR} from '../../../styles/variables.types';
import {TYPE_GRADIENT} from '../common';
import {staticUrl} from '../../../src/constants/env';
import cn from 'classnames';
import {useRouter} from 'next/router';
import GuideTootip from './GuideTootip';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../src/reducers';
import {fetchCategoriesThunk} from '../../../src/reducers/categories';
import {isCategoriesFetched} from '../../../src/lib/categories';
import Loading from '../../common/Loading';
import {HashId} from '@hanii/planet-types';
import {COMMUNITY_ROOT_PATH} from '../../../src/constants/community';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';

const CommunitySideMenuDiv = styled.div<Props>`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 240px;
  height: 100%;
  border-right: 1px solid #eee;
  background-color: #f9f9f9;
  box-sizing: border-box;
  z-index: 10;
  transition: all 0.3s;

  .menu-box {
    ${({isOnPosition}) => isOnPosition ? ` 
        position: absolute;
        width: 100%;
        bottom: 0;
    ` : `
        position: fixed;
        width: 239px;
    `};
    background-color: #f9f9f9;
  }

  h3 {
    padding: 13px 35px 11px;
    line-height: normal;
    ${fontStyleMixin({
      size: 15,
      weight: '600',
      color: $TEXT_GRAY
    })};
    border-top: 1px solid ${$GRAY};
    border-bottom: 1px solid #eee;
    background-color: ${$WHITE};
    user-select: none;
  }

  .write-btn {
    display: block;
    width: 200px;
    height: 50px;
    margin: 20px auto;
    padding: 1px 10px 0 0;
    ${fontStyleMixin({
      size: 16,
      weight: 'bold'
    })};
    border: 1px solid #eee;
    background-color: ${$WHITE};
    cursor: pointer;

    img {
      vertical-align: middle;
      width: 23px;
      margin-top: -3px;
    }
  }

  .toggle-switch {
    position: fixed;
    left: 239px;
    top: 50%;
    width: 32px;
    height: 50px;
    transform: translateY(-50%);
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    background-color: ${$FONT_COLOR};
    transition: all 0.3s;
    cursor: pointer;

    img {
      vertical-align: middle;
      width: 8px;
      margin-top: -3px;
    }
  }

  &.fold {
    left: -240px;

    .tootip {
      left: 17px;
    }

    .toggle-switch {
      left: 0;

      img {
        transform: rotate(-180deg);
      }
    }
  }
`;

const Ul = styled.ul<{bgColor?: string;}>`
  background-color: ${$WHITE};
  overflow: hidden;

  li {
    padding: 4px 35px;

    &:first-child {
      margin-top: 6px;

      &.on {
        margin: 0 0 6px;
      }
    }
    
    &:last-child {
      margin-bottom: 12px;

      &.on {
        margin: 6px 0 0;
      }
    }

    &.on:not(:first-child):not(:last-child) {
      margin: 6px 0;
    }
    
    &.on:first-child:nth-last-child(1) {
      margin: 0;
    }

    &.on {
      padding: 12px 35px;
      background: ${({bgColor}) => bgColor};

      &.new p::after {
        background-color: ${$WHITE};
      }

      p {
        color: ${$WHITE};
      }
    }

    &.new {
      p::after {
        content: '';
        position: absolute;
        top: 2px;
        right: -5px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: ${$POINT_BLUE};
      }
    }

    p {
      position: relative;
      display: inline-block;
      ${fontStyleMixin({
        size: 15,
        weight: '600',
        color: $GRAY
      })};
      cursor: pointer;
    }

    &:hover {
      p {
        text-decoration: underline;
      }
    }
  }
`;

interface Props {
  category?: HashId;
  isOnPosition: boolean;
  isFetchingCallback: () => void;
}

const CommunitySideMenu: React.FC<Props> = React.forwardRef(({
  category: categoryFromProps,
  isOnPosition,
  isFetchingCallback = () => null,
}, ref) => {
  // Router
  const router = useRouter();
  const {
    asPath,
    query: {category: categoryFromQuery},
  } = router;
  const category = categoryFromProps || categoryFromQuery as string;
  const [, path, query] = asPath.split('/');

  const [isFetchingCategories, setIsFetchingCategories] = React.useState(false);
  const [fold, setFold] = React.useState(false);

  const dispatch = useDispatch();
  const {categories, me} = useSelector(
    ({categories, orm, system: {session: {id}}}: RootState) => ({
      categories,
      me: pickUserSelector(id)(orm),
    }),
    shallowEqual
  );
  const {categoriesById, categoryIdsByUserType} = categories;
  const {is_admin} = me || {} as any;

  // 플래닛 PICK 카테고리는 관리자만 글 작성이 가능합니다.
  const canWrite = React.useMemo(() => (
    categoriesById[category]?.name !== '플래닛 PICK' || is_admin
  ), [category, categoriesById]);

  React.useEffect(() => {
    setFold(`/${path}` === COMMUNITY_ROOT_PATH.href && !!query);
  }, [path, query]);

  React.useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, []);

  React.useEffect(() => {
    const isFetching = isCategoriesFetched(categories);
    setIsFetchingCategories(isFetching);
  }, [categories]);

  React.useEffect(() => {
    if (isFetchingCategories) {
      isFetchingCallback();
    }
  }, [isFetchingCategories, isFetchingCallback]);

  return (
    <CommunitySideMenuDiv
      ref={ref}
      className={cn({fold})}
      isOnPosition={isOnPosition}
    >
      <div className="menu-box">
        {!isFetchingCategories ? (
          <Loading/>
        ) : (
          <>
            <Ul bgColor={TYPE_GRADIENT.default}>
              <li
                className={cn({on: category === undefined})}
              >
                <Link
                  href="/community"
                >
                  <a>
                    <p>커뮤니티 홈</p>
                  </a>
                </Link>
              </li>
              {categoryIdsByUserType.default.map(id => {
                const {name, new_stories_count} = categoriesById[id];

                return (
                  <li
                    key={id}
                    className={cn({
                      on: id === category,
                      new: !!new_stories_count
                    })}
                  >
                    <Link
                      href={`/community${id ? `?category=${id}` : ''}`}
                      replace
                    >
                      <a>
                        <p>{name}</p>
                      </a>
                    </Link>
                  </li>
                )
              })}
            </Ul>
            <h3>한의사공간</h3>
            <Ul bgColor={TYPE_GRADIENT.doctor}>
              {categoryIdsByUserType.doctor.map(id => {
                const {name, new_stories_count} = categoriesById[id];

                return (
                  <li
                    key={id}
                    className={cn({
                      on: id === category,
                      new: !!new_stories_count
                    })}
                  >
                    <Link
                      href={`/community?category=${id}`}
                      replace
                    >
                      <a>
                        <p>{name}</p>
                      </a>
                    </Link>
                  </li>
                )
              })}
            </Ul>
            <h3>한의대생공간</h3>
            <Ul bgColor={TYPE_GRADIENT.student}>
              {categoryIdsByUserType.student.map(id => {
                const {name, new_stories_count} = categoriesById[id];

                return (
                  <li
                    key={id}
                    className={cn({
                      on: id === category,
                      new: !!new_stories_count
                    })}
                  >
                    <Link
                      href={`/community?category=${id}`}
                      replace
                    >
                      <a>
                        <p>{name}</p>
                      </a>
                    </Link>
                  </li>
                )
              })}
            </Ul>
          </>
        )}
        {canWrite && (
          <button
            type="button"
            className="write-btn pointer"
            onClick={() => router.push(`/community/new${category ? `?category=${category}` : ''}`)}
          >
            <img
              src={staticUrl('/static/images/icon/icon-write.png')}
              alt="글쓰기"
            />
            글쓰기
          </button>
        )}
      </div>
      <GuideTootip />
      <button
        type="button"
        className="toggle-switch"
        onClick={() => {
          setFold(curr => !curr);
        }}
      >
        <img
          src={staticUrl('/static/images/icon/arrow/icon-white-left-arrow.png')}
          alt="메뉴 토글"
        />
      </button>
    </CommunitySideMenuDiv>
  );
});

CommunitySideMenu.displayName = 'CommunitySideMenu';

export default React.memo(CommunitySideMenu);
