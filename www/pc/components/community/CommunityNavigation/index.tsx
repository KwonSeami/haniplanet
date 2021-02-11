import React from 'react';
import styled from 'styled-components';
import {$FONT_COLOR, $WHITE, $GRAY} from '../../../styles/variables.types';
import {useSelector} from 'react-redux';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import {shallowEqual} from 'recompose';
import {MaxWidthWrapper} from '../common';
import Button from '../../inputs/Button';
import {staticUrl} from '../../../src/constants/env';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {RootState} from '../../../src/reducers';
import ExploreApi from '../../../src/apis/ExploreApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import {useRouter} from 'next/router';
import cn from 'classnames';
import CommunityNavigationItem from './Item';
import Loading from '../../common/Loading';
import {communityUserTypeGradient} from '../../../src/lib/community';

const Div = styled.div`
  position: relative;
  border-bottom: 1px solid #eee;
  background-color: ${$WHITE};

  ul {
    max-width: 1035px;
    margin: 0 auto;
    padding: 22px 0 20px;
    text-align: center;
  }

  button {
    position: absolute;
    top: 11px;
    rihgt: 0;
    width: 180px;
    height: 42px;
    ${fontStyleMixin({
      size: 15,
      weight: 'bold',
      color: $GRAY
    })};
    border-radius: 0;
    border: 1px solid ${$GRAY};
    background-color: ${$WHITE};
    box-sizing: border-box;

    &:hover {
      color: ${$WHITE};
      border: 1px solid ${$FONT_COLOR};
      background-color: ${$FONT_COLOR};
    }

    img {
      vertical-align: middle;
      width: 22px;
    }
  }

  &.fixed {
    position: fixed;
    top: 120px;
    width: 100%;
    background-color: #f9f9f9;
    z-index: 200;
    
    > div {
      width: 1125px;
      max-width: initial;
    }

    ul {
      margin: 0 45px;
      text-align: left;
      li:first-child {
        margin-left: 0;
      }
    }

    button {
      right: 45px;
    }
  }
`;

interface Props {
  heightFixed: boolean;
}

const DEFAULT_STATE = {
  tag: {
    id: 'total',
    name: '전체 글'
  },
  new_stories_count: 0
};

const CommunityNavigation = ({heightFixed}: Props) => {
  // API
  const exploreApi: ExploreApi = useCallAccessFunc(access => new ExploreApi(access));

  // Router
  const router = useRouter();
  const {pathname, query} = router;
  const {type_limit} = query;
  // State
  const [isHover, setIsHover] = React.useState(false);
  const [{
    pending,
    navs
  }, setNav] = React.useState({
    pending: false,
    navs: [DEFAULT_STATE]
  });

  // Redux
  const {me} = useSelector(
    ({
      orm,
      system: {session: {id}}
    }: RootState) => ({
      me: pickUserSelector(id)(orm)
    }),
    shallowEqual
  );
  const {user_type} = me || {} as IUser;

  const changeMenu = React.useCallback((name: string, id: HashId) => {
    const url = {
      pathname,
      query: {
        tag_name: name,
        tag_id: id,
      }
    };
    router.replace(url, url, {shallow: true});
  }, [pathname]);

  React.useEffect(() => {
    setNav(curr => ({...curr, pending: true}));

    exploreApi.menu()
      .then(({data:{results}}) => {
        const newNav = [
          {
            ...DEFAULT_STATE,
            new_stories_count: results.reduce((prev, curr) => (
              prev + curr.new_stories_count
            ), 0)
          },
          ...results,
        ];
        setNav({pending: false, navs: newNav});
      });
  },[]);
  
  return (
    <Div className={cn({fixed: heightFixed})}>
      <MaxWidthWrapper>
        {pending ? (
          <Loading/>
        ) : (
          <ul>
            {navs.map(({tag: {id, name}, new_stories_count}) => (
              <CommunityNavigationItem
                key={id}
                id={id}
                className={cn('pointer', {
                  on: query.tag_name
                    ? query.tag_name === name
                    : name === '전체 글',
                  new: !!new_stories_count,
                })}
                name={name}
                color={communityUserTypeGradient(user_type)}
                onClick={changeMenu}
              />
            ))}
          </ul>
        )}
        {heightFixed && (
          <Button
            onClick={() => router.push(`/community/new?type_limit=${type_limit}&tag_id=${query.tag_id || ''}`)}
            onMouseOver={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            <img
              src={isHover
                ? staticUrl('/static/images/icon/icon-write-white.png')
                : staticUrl('/static/images/icon/icon-write.png')
              }
              alt="글쓰기"
            />
            글쓰기
          </Button>
        )}
      </MaxWidthWrapper>
    </Div>
  )
};

CommunityNavigation.displayName = 'CommunityNavigation';

export default React.memo(CommunityNavigation);
