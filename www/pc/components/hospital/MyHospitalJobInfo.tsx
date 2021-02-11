import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import {staticUrl} from '../../src/constants/env';
import {heightMixin, fontStyleMixin, backgroundImgMixin} from '../../styles/mixins.styles';
import {$WHITE, $FONT_COLOR, $POINT_BLUE, $BORDER_COLOR} from '../../styles/variables.types';
import {useSelector, shallowEqual, useDispatch} from 'react-redux';
import {RootState} from '../../src/reducers';
import {fetchUserHospital} from '../../src/reducers/hospital';
import isEmpty from 'lodash/isEmpty';
import cn from 'classnames';
import Button from '../inputs/Button/ButtonDynamic';
import {useRouter} from 'next/router';

const Ul = styled.ul`
  width: 100%;
  margin-top: 8px;
  display: table;
  table-layout: fixed;

  & > li {
    position: relative;
    display: table-cell;
    padding-left: 2px;

    &.on > button.my-hospital-btn {
      text-decoration: underline;
      background-color: ${$POINT_BLUE} !important; //hover효과와 겹쳐서 important
    }

    &:hover button {
      text-decoration: underline;

      &.my-hospital-btn {
        background-color: #1f9aff;
      }
    }

    &:first-child {
      padding-left: 0;
    }
  }

  .info-sub-menu {
    position: absolute;
    z-index: 1;
    top: 46px;
    left: 0;
    width: 300px;
    border-radius: 5px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
    background-color: ${$WHITE};

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
        ${heightMixin(45)};
        box-sizing: border-box;
        ${backgroundImgMixin({
          img: staticUrl('/static/images/icon/arrow/icon-arrow-right4.png'),
          size: '5px',
          position: '100%'
        })};
  
        &:hover p {
          text-decoration: underline;
        }

        > p {
          max-width: 178px;
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
          vertical-align: text-bottom;
          margin: -2px 4px 0 0;
        }
      }
    }
  }
`;

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

  const [isOpened, setIsOpened] = React.useState(false);

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
            on: isOpened
          })}
        >
          <Button
            className="my-hospital-btn"
            size={{
              width: '100%',
              height: '44px'
            }}
            border={{
              radius: '5px'
            }}
            font={{
              size: '14px',
              weight: 'bold',
              color: $WHITE
            }}
            backgroundColor={$POINT_BLUE}
            onClick={() => setIsOpened(curr => !curr)}
          >
            나의 한의원
          </Button>
          {isOpened && (
            <ul className="info-sub-menu">
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
          )}
        </li>
      )}
      <li>
        <Button
          size={{
            width: '100%',
            height: '44px'
          }}
          border={{
            radius: '5px'
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
          }}
        >
          나의 재직정보
        </Button>
      </li>
    </Ul>
  );
});

MyHospitalJobInfo.displayName = 'MyHospitalJobInfo';

export default MyHospitalJobInfo;
