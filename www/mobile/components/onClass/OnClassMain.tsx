import * as React from 'react';
import styled from 'styled-components';
import OnClassCollect from './list/OnClassCollect';
import OnClassTopDiv from './list/OnClassTop/OnClassTopDiv';
import loginRequired from '../../hocs/loginRequired';
import {backgroundImgMixin, fontStyleMixin} from '../../styles/mixins.styles';
import {$BORDER_COLOR, $WHITE} from '../../styles/variables.types';
import OnClassRecommendList from './list/OnClassRecommendList';
import {staticUrl} from '../../src/constants/env';
import Button from '../inputs/Button';
import A from '../UI/A';
import {pushPopup} from '../../src/reducers/popup';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import OnClassApplyPopup from '../layout/popup/OnClassApplyPopup';
import Link from 'next/link';
import {RootState} from '../../src/reducers';
import {fetchCategoriesThunk} from '../../src/reducers/categories';
import { setLayout, clearLayout } from '../../src/reducers/system/style/styleReducer';

const Div = styled.div`
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 8px;
    background-color: #f2f3f7;
  }

  @media screen and (min-width: 680px) {
    padding-top: 21px;

    &::after {
      top: 21px;
    }
  }
`;

const OnClassRequestBanner = styled.div`
  border-bottom: 50px solid #f6f7f9;

  > div {
    div {
      position: relative;
      height: 191px;
      padding: 20px 16px;
      box-sizing: border-box;

      p {
        margin-bottom: 9px;
        ${fontStyleMixin({
          size: 19,
          weight: '700',
          color: $WHITE
        })};
      }

      span {
        ${fontStyleMixin({
          size: 11,
          color: $WHITE
        })};
      }

      .button {
        position: absolute;
        bottom: 42px;
        left: 17px;

        img {
          width: 6px;
          margin: -3px 0 0 4px;
          vertical-align: middle;
        }
      }

      &.lecture-request {
        ${backgroundImgMixin({
          img: staticUrl('/static/images/graphic/lecture-request.png'),
          size: '140px auto',
          position: '100% 100%',
          color: '#f29330',
        })};
      }
    
      &.tutor-request {
        ${backgroundImgMixin({
          img: staticUrl('/static/images/graphic/tutor-request.png'),
          size: '140px auto',
          position: '100% 100%',
          color: '#14327d',
        })};
      }
    }
  }

  .onclass-proposal-btn {
    border-left: 0;
    border-right: 0;

    img {
      width: 17px;
      margin: -3px 0 0 5px;
      vertical-align: middle;
    }
  }

  
  @media screen and (min-width: 680px) {
    > div {
      display: flex;

      a {
        width: 50%;
      }
    }
  }
`;

const OnClassMain = () => {
  const dispatch = useDispatch();

  const {me, navs} = useSelector(
    ({
      orm,
      navs,
      system: {session: {id}}
    }: RootState) => ({
      me: pickUserSelector(id)(orm) || {} as any,
      navs
    }),
    shallowEqual
  );

  const {user_type} = me || {};
  React.useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, []);

  React.useEffect(() => {
    dispatch(setLayout({
      headerDetail: '온라인강의'
    }));

    return () => {
      dispatch(clearLayout());
    }
  }, []);

  const communityOnlineId = (navs.filter(({name}) => name === '온·오프 강의요청')[0])?.id;

  return (
  <>
    <OnClassTopDiv />
    <Div>
      <OnClassRecommendList
        title="추천 강의"
      />
    </Div>
    <OnClassCollect
      title="온라인 강의 모아보기"
    />
    <OnClassRequestBanner>
      <div>
        <Link
          href={`/community?category=${communityOnlineId}`}
        >
          <a>
            <div className="lecture-request">
              <p>
                온라인강의 강의요청/후기
              </p>
              <span>
                다양한 온라인 강의에 대한 후기를 확인하시고,<br/>
                듣고싶은? 원하는!<br/>
                주제에 대한 강의를 자유롭게 요청해주세요
              </span>
              <Button
                size={{
                  width: '122px',
                  height: '28px'
                }}
                border={{
                  radius: '0',
                  width: '1px',
                  color: $WHITE
                }}
                font={{
                  size: '11px',
                  color: $WHITE
                }}
              >
                바로가기
                <img
                  src={staticUrl('/static/images/icon/arrow/arrow-white-triangle.png')}
                  alt="강의 요청,후기 바로가기"
                />
              </Button>
            </div>
          </a>
        </Link>
        <A
          to="https://bit.ly/2VdM1KI"
          newTab
        >
          <div className="tutor-request">
            <p>
              온라인강의 강사신청
            </p>
            <span>
              한의플래닛에서는 자신만의 컨텐츠로<br/>
              온라인강의를 진행하실 수 있는<br/>
              열정적인 강사님을 상시모집하고 있습니다!
            </span>
            <Button
              size={{
                width: '122px',
                height: '28px'
              }}
              border={{
                radius: '0',
                width: '1px',
                color: $WHITE
              }}
              font={{
                size: '11px',
                color: $WHITE
              }}
              onClick={e => {
                if (user_type !== 'doctor'){
                  e.preventDefault();
                  dispatch(pushPopup(OnClassApplyPopup))
                }
              }}
            >
              강사신청 바로가기
              <img
                src={staticUrl('/static/images/icon/arrow/arrow-white-triangle.png')}
                alt="강사신청 바로가기"
              />
            </Button>
          </div>
        </A>
      </div>
      <A
        to="https://hani-public.s3.ap-northeast-2.amazonaws.com/files/onclass/%EB%B2%84%ED%82%A4+%EC%98%A8%EB%9D%BC%EC%9D%B8%EA%B0%95%EC%9D%981.1+%EC%A0%9C%EC%95%88%EC%84%9C-0506.pdf"
        newTab
      >
        <Button
          className="onclass-proposal-btn"
          size={{
            width: '100%',
            height: '63px'
          }}
          border={{
            radius: '0',
            width: '1px',
            color: $BORDER_COLOR
          }}
          font={{
            size: '15px',
          }}
          backgroundColor={$WHITE}
          onClick={e => {
            if (user_type !== 'doctor'){
              e.preventDefault();
              dispatch(pushPopup(OnClassApplyPopup))
            }
          }}
        >
          강의제안서 다운로드
          <img
            src={staticUrl('/static/images/icon/download.png')}
            alt="강의제안서 다운로드"
          />
        </Button>
      </A>
    </OnClassRequestBanner>
  </>
)};

export default loginRequired(OnClassMain);
