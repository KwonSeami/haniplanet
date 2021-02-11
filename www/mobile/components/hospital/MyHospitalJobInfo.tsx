import React from 'react';
import styled, {keyframes} from 'styled-components';
import cn from 'classnames';
import {$POINT_BLUE, $FONT_COLOR, $WHITE, $BORDER_COLOR} from '../../styles/variables.types';
import {heightMixin, fontStyleMixin, backgroundImgMixin} from '../../styles/mixins.styles';
import {staticUrl} from '../../src/constants/env';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';
import {fetchUserHospital} from '../../src/reducers/hospital';
import {RootState} from '../../src/reducers';
import {useRouter} from 'next/router';
import isEmpty from 'lodash/isEmpty';
import Link from 'next/link';
import Button from '../inputs/Button/ButtonDynamic';
import {CSSTransition} from 'react-transition-group';

const DoctalkLogo = styled.span`
  display: inline-block;
  width: 59px;
  ${heightMixin(20)};
  margin-left: 4px;
  border-radius: 10px;
  background-color: #40b044;
  box-sizing: border-box;
  text-align: center;
  vertical-align: middle;

  img {
    width: 46px;
  }
`;

const SubmenuUlAni = keyframes`
  from {
    transform: translateY(-25px);
  }

  to {
    transform: translateY(0);
  }
`;

const Ul = styled.ul`
  display: table;
  width: 100%;

  > li {
    position: relative;
    z-index: 1;
    display: table-cell;
    width: 50%;

    &.expanded {
      width: 100%;
    }

    &:first-child {
      button {
        border-bottom-left-radius: 7px;
      }

      &.on {
        button {
          background-color: ${$POINT_BLUE};
        }
      }
    }

    &.on > button {
      background-color: ${$FONT_COLOR};
      color: ${$WHITE};
    }

    button {
      position: relative;
      z-index: 1;
    }

    .sub-menu-ani-enter {
      opacity: 0;
      transform: translateY(-10px);
    }

    .sub-menu-ani-enter-active {
      opacity: 1;
      transform: translateY(0);
      transition: 0.2s;
    }

    .sub-menu-ani-exit {
      opacity: 1;
      transform: translateY(0);
    }

    .sub-menu-ani-exit-active {
      opacity: 0;
      transform: translateY(-10px);
      transition: 0.2s;
    }

    div {
      position: absolute;
      top: 44px;
      left: 0;
      width: 200%;
      border-radius: 5px;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
      background-color: ${$WHITE};

      ul.info-sub-menu {
        animation: ${SubmenuUlAni} 0.3s forwards;
  
        li {
          height: 44px;
          margin: 0 14px;
          border-bottom: 1px solid ${$BORDER_COLOR};
  
          &:last-child {
            border-bottom: none;
          }
  
          a {
            display: inline-block;
            width: 100%;
            ${heightMixin(44)};
            box-sizing: border-box;
            ${backgroundImgMixin({
              img: staticUrl('/static/images/icon/arrow/icon-arrow-right4.png'),
              size: '5px',
              position: '100%'
            })};

            p {
              max-width: calc(100% - 95px);
              display: inline-block;
              vertical-align: middle;
              ${fontStyleMixin({
                size: 14,
                weight: 'bold',
                color: $FONT_COLOR
              })};
            }
  
            > img {
              width: 15px;
              vertical-align: middle;
              margin: -2px 4px 0 0;
            }
          }
        }
      }
    }
  }
`;

interface IMyHospitalCompProps {
  name: string;
  slug: string;
  hasDoctalkDoctor: boolean;
}

const MyHospitalComp = React.memo<IMyHospitalCompProps>(({
  name,
  slug,
  hasDoctalkDoctor
}) => (
  <li>
    <Link
      href="/band/[slug]"
      as={`/band/${slug}`}
    >
      <a>
        <img
          src={staticUrl('/static/images/icon/icon-search-hospital.png')}
          alt={name}
        />
        <p className="ellipsis">{name}</p>
        {hasDoctalkDoctor && (
          <DoctalkLogo>
            <img
              src={staticUrl('/static/images/logo/img-doctalk-logo.png')}
              alt="닥톡 로고"
            />
          </DoctalkLogo>
        )}
      </a>
    </Link>
  </li>
));

const MyHospitalJobInfo = React.memo(() => {
  const dispatch = useDispatch();

  const router = useRouter();

  const [showSubmenu, setShowSubmenu] = React.useState(false);

  const {myId, hospital} = useSelector(
    ({system: {session: {id}}, hospital}: RootState) => ({
      hospital,
      myId: id
    }),
    shallowEqual
  );

  React.useEffect(() => {
    dispatch(fetchUserHospital(myId));
  }, [myId]);

  const myHospital = hospital[myId];
  const hasBelongingHospital = !isEmpty(myHospital);

  return (
    <Ul>
      {hasBelongingHospital && (
        <li
          className={cn('pointer', {
            on: showSubmenu
          })}
        >
          <Button
            size={{
              width: '100%',
              height: '44px'
            }}
            border={{
              width: '0',
              radius: '0 0 0 7px'
            }}
            font={{
              size: '14px',
              weight: 'bold',
              color: $WHITE
            }}
            backgroundColor='#499aff'
            onClick={() => setShowSubmenu(curr => !curr)}
          >
            나의 한의원
          </Button>
          <CSSTransition
            classNames="sub-menu-ani"
            in={showSubmenu}
            timeout={300}
            unmountOnExit
          >
            <div>
              <ul
                className="info-sub-menu"
              >
                {Object.values(myHospital).map(({
                  id,
                  name,
                  slug,
                  has_doctalk_doctor
                }) => (
                  <MyHospitalComp
                    key={id}
                    name={name}
                    slug={slug}
                    hasDoctalkDoctor={has_doctalk_doctor}
                  />
                ))}
              </ul>
            </div>
          </CSSTransition>
        </li>
      )}
      <li
        className={cn('pointer', {
          expanded: !hasBelongingHospital
        })}
      >
        <Button
          size={{
            width: '100%',
            height: '44px'
          }}
          border={{
            width: '0',
            radius: '0 0 7px 0'
          }}
          font={{
            size: '14px',
            weight: 'bold',
            color: $WHITE
          }}
          backgroundColor={$FONT_COLOR}
          onClick={() => {
          if (hasBelongingHospital) {
            router.push({
              pathname: '/user/profile/edit',
              query: {
                tab: 'hospital'
              }
            });
          } else {
            confirm('등록된 재직정보가 없습니다.\n나의 한의원에서 재직정보를 추가해주세요.') && router.push({
              pathname: '/user/profile/edit',
              query: {
                tab: 'hospital'
              }
            });
          }
        }}>
          나의 재직정보
        </Button>
      </li>
    </Ul>
  );
});

export default MyHospitalJobInfo;
