import * as React from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useRouter} from 'next/router';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import CommunityNavigationItem from './item';
import styled from 'styled-components';
import {$BORDER_COLOR, $WHITE, $POINT_BLUE} from '../../../styles/variables.types';
import {USER_TYPE_COLOR, MaxWidthWrapper, USER_TYPE_GRADIENT} from '../common';
import cn from 'classnames';
import {RootState} from '../../../src/reducers';
import {HashId} from '../../../../../packages/types';
import Loading from '../../common/Loading';
import {fontStyleMixin, backgroundImgMixin} from '../../../styles/mixins.styles';
import {USER_TYPE_TO_KOR} from '../../../src/constants/users';
import {staticUrl} from '../../../src/constants/env';
import {fetchCategoriesThunk} from '../../../src/reducers/categories';
import {isCategoriesFetched} from '../../../src/lib/categories';

interface Props {
  className?: string;
}

const Div = styled.div<{color: string}>`
  position: relative;
  height: 47px;
  border-top: 1px solid ${$BORDER_COLOR}; 
  border-bottom: 2px solid #f2f3f7;
  box-sizing: border-box;

  & > div {
    height: 100%;
    overflow: hidden;
  
    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 20px;
      ${backgroundImgMixin({
        img: staticUrl('/static/images/icon/icon-white-more-bg.png')
      })}
    }
  }

  ul {
    padding: 0 9px;
    font-size: 0;
    white-space: nowrap;
    overflow-x: auto;

    @media screen and (min-width: 680px) {
      margin-left: -6px;
      padding-left: 0;
    }

    .user-type-menu {
      display: inline-block;
      margin-left: 8px;
      padding: 9px 0 11px;
      overflow: inherit;
      border-left: 1px solid #eee;
    }
  }

  .loading {
    margin-top: -10px;

    img {
      width: 25px;
    }
  }
`;

const UserTypeSpan = styled.span<{color: string}>`
  display: inline-block;
  vertical-align: middle;
  height: 24px;
  margin: 0 6px 0 14px;
  padding: 0 4px;
  ${fontStyleMixin({
    size: 15,
    weight: 'bold',
    color: $WHITE
  })}
  background: ${({color}) => color};
`;

interface IChangeMenuParam {
  category: HashId;
}

const CommunityNavigation: React.FC<Props> = ({
  className
}) => {
  const router = useRouter();
  const {pathname, query: {category}} = router;

  const dispatch = useDispatch();

  // Redux
  const {categories, me} = useSelector(
    ({
      orm,
      categories,
      system: {session: {id}}
    }: RootState) => ({
      categories,
      me: pickUserSelector(id)(orm)
    }),
    shallowEqual
  );
  const {categoriesById, categoryIdsByUserType} = categories;
  const {user_type} = me || {};

  // useCallback
  const changeMenu = React.useCallback((query: IChangeMenuParam) => {
    const url = {pathname, query};
    router.replace(url, url, {shallow: true});
  }, [pathname]);

  React.useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, []);

  return (
    <Div
      className={className}
    >
      <MaxWidthWrapper>
        {isCategoriesFetched(categories) ? (
          <ul>
            <CommunityNavigationItem
              className={cn({
                on: category === undefined
              })}
              name="전체 글"
              onClick={() => changeMenu()}
            />
            {categoryIdsByUserType.default.map(id => {
              const {name, new_stories_count} = categoriesById[id];

              return (
                <CommunityNavigationItem
                  key={id}
                  id={id}
                  className={cn({
                    on: id === category,
                    new: !!new_stories_count
                  })}
                  name={name}
                  color={$POINT_BLUE}
                  onClick={() => changeMenu(id && {
                    category: id
                  })}
                />
              )
            }
            )}
            <li className="user-type-menu">
              <UserTypeSpan
                color={USER_TYPE_GRADIENT.doctor}
              >
                {USER_TYPE_TO_KOR.doctor} 공간
              </UserTypeSpan>
            </li>
            {categoryIdsByUserType.doctor.map(id => {
              const {name, new_stories_count} = categoriesById[id];

              return (
                <CommunityNavigationItem
                  key={id}
                  id={id}
                  color={USER_TYPE_COLOR.doctor}
                  className={cn({
                    on: id === category,
                    new: !!new_stories_count
                  })}
                  name={name}
                  onClick={() => changeMenu(id && {
                    category: id
                  })}
                />
              )
            })}
            <li className="user-type-menu">
              <UserTypeSpan
                color={USER_TYPE_GRADIENT.student}
              >
                {USER_TYPE_TO_KOR.student} 공간
              </UserTypeSpan>
            </li>
            {categoryIdsByUserType.student.map(id => {
              const {name, new_stories_count} = categoriesById[id];

              return (
                <CommunityNavigationItem
                  key={id}
                  id={id}
                  color={USER_TYPE_COLOR.student}
                  className={cn({
                    on: id === category,
                    new: !!new_stories_count
                  })}
                  name={name}
                  onClick={() => changeMenu(id && {
                    category: id
                  })}
                />
              )
            })}
          </ul>
        ): (
          <Loading className="loading"/>
        )}
      </MaxWidthWrapper>
    </Div>
  )
};

CommunityNavigation.displayName = 'CommunityNavigation';

export default React.memo<Props>(CommunityNavigation);