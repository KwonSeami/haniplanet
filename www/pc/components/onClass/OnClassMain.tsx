import React from 'react';
import styled from 'styled-components';
import MountOnEnter from '../../components/common/MountOnEnter';
import loginRequired from '../../hocs/loginRequired';
import OnClassTopDiv from './list/OnClassTop/OnClassTopDiv';
import OnClassGathering from './OnClassGathering';
import {backgroundImgMixin} from '../../styles/mixins.styles';
import {staticUrl} from '../../src/constants/env';
import Button from '../inputs/Button';
import {$WHITE} from '../../styles/variables.types';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import A from '../UI/A';
import OnClassRecommendCard from './list/OnclassRecommendList';
import OnClassApplyPopup from '../layout/popup/OnClassApplyPopup';
import {pushPopup} from '../../src/reducers/popup';
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import Link from 'next/link';
import {RootState} from '../../src/reducers';
import {isCategoriesFetched, findCategoryIdsByName} from '../../src/lib/categories';
import {fetchCategoriesThunk} from '../../src/reducers/categories';

const Section = styled.section`
  min-height: 700px;

  > div:first-of-type {
    width: 100%;
    background-color: #f0f2f8;
    min-height: 400px;
  }
`;

const OnClassRequestBanner = styled.div`
  padding: 50px 0 100px;
  background-color: #f9f9f9;

  > div {
    max-width: 1090px;
    margin: auto;
  }

  .lecture-request {
    position: relative;
    width: 531px;
    height: 371px;
    margin-right: 27px;
    vertical-align: top;
    display: inline-block;
    overflow: hidden;
    ${backgroundImgMixin({
      img: staticUrl('/static/images/banner/onclass-lecture-request.png'),
    })};

    img.graphic {
      position: absolute;
      z-index: 1;
      bottom: -21px;
      right: 0;
      width: 229px;
      transition: 0.3s;
    }

    img.graphic-bg {
      width: 531px;
      opacity: 0;
      transition: 0.3s;
    }

    .button {
      position: absolute;
      bottom: 30px;
      left: 38px;

      img {
        width: 7px;
        margin: -4px 0 0 4px;
        vertical-align: middle;
      }
    }

    &:hover {
      img.graphic {
        transform: translateY(-10px);
      }

      img.graphic-bg {
        opacity: 1;
      }
    }
  }

  .tutor-request {
    width: 531px;
    vertical-align: top;
    display: inline-block;

    .img-box {
      position: relative;
      height: 371px;
      margin-bottom: 27px;
      overflow: hidden;
      ${backgroundImgMixin({
        img: staticUrl('/static/images/banner/onclass-tutor-request.png'),
      })};

      .button {
        position: absolute;
        bottom: 74px;
        left: 38px;

        img {
          width: 7px;
          margin: -4px 0 0 4px;
          vertical-align: middle;
        }

        &.onclass-proposal-btn {
          bottom: 30px;
          left: 38px;

          img {
            width: 17px;
            margin-left: 6px;
            vertical-align: sub;
          }
        }
      }

      img.graphic {
        position: absolute;
        z-index: 1;
        bottom: -66px;
        right: 12px;
        width: 218px;
        transition: 0.3s;
      }
  
      img.graphic-bg {
        width: 531px;
        opacity: 0;
        transition: 0.3s;
      }
  
      &:hover {
        img.graphic {
          transform: translateY(-10px);
        }
  
        img.graphic-bg {
          opacity: 1;
        }
      }
    }
  }
`;

const OnClassMain = () => {
  const dispatch = useDispatch();
  const [lazy, setLazy] = React.useState(false);

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
    setTimeout(() => setLazy(true), 1000);
    dispatch(fetchCategoriesThunk());
  }, []);

  const communityOnlineId = (navs.filter(({name}) => name === '온·오프 강의요청')[0])?.id;

  return (
    <Section>
      <div>
        <OnClassTopDiv/>
      </div>
      <OnClassRecommendCard
        title="추천 강의"
      />
      {lazy && (
        <>
          <MountOnEnter>
            <OnClassGathering
              title='온라인 강의 모아보기'
            />
          </MountOnEnter>
        </>
      )}
      {lazy && (
        <>
          <MountOnEnter>
            <OnClassRequestBanner>
              <div>
                <Link
                  href={`/community?category=${communityOnlineId}`}
                >
                  <a>
                    <div className="lecture-request">
                      <img
                        className="graphic"
                        src={staticUrl('/static/images/graphic/lecture-request.png')}
                        alt="온라인강의 강의요청, 후기"
                      />
                      <img
                        className="graphic-bg"
                        src={staticUrl('/static/images/graphic/lecture-request-bg.png')}
                      />
                      <A
                        to="https://bit.ly/2VdM1KI"
                        newTab
                      >
                        <Button
                          size={{
                            width: '132px',
                            height: '38px',
                          }}
                          border={{
                            radius: '0',
                            width: '1px',
                            color: $WHITE,
                          }}
                          font={{
                            size: '13px',
                            color: $WHITE,
                          }}
                        >
                          바로가기
                          <img
                            src={staticUrl('/static/images/icon/arrow/arrow-white-triangle.png')}
                            alt="강의 요청,후기 바로가기"
                          />
                        </Button>
                      </A>
                    </div>
                  </a>
                </Link>
                <div className="tutor-request">
                  <div className="img-box">
                    <img
                      className="graphic"
                      src={staticUrl('/static/images/graphic/tutor-request.png')}
                      alt="온라인강의 강사 신청"
                    />
                    <img
                      className="graphic-bg"
                      src={staticUrl('/static/images/graphic/tutor-request-bg.png')}
                    />
                    <A
                      to="https://bit.ly/2VdM1KI"
                      newTab
                    >
                      <Button
                        size={{
                          width: '132px',
                          height: '38px',
                        }}
                        border={{
                          radius: '0',
                          width: '1px',
                          color: $WHITE,
                        }}
                        font={{
                          size: '13px',
                          color: $WHITE,
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
                    </A>
                    <A
                      to="https://hani-public.s3.ap-northeast-2.amazonaws.com/files/onclass/%EB%B2%84%ED%82%A4+%EC%98%A8%EB%9D%BC%EC%9D%B8%EA%B0%95%EC%9D%981.1+%EC%A0%9C%EC%95%88%EC%84%9C-0506.pdf"
                      newTab
                    >
                      <Button
                        className="onclass-proposal-btn"
                        size={{
                          width: '160px',
                          height: '38px'
                        }}
                        border={{
                          radius: '0',
                          width: '1px',
                          color: $WHITE,
                        }}
                        font={{
                          size: '13px',
                          color: $WHITE,
                        }}
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
                  </div>
                </div>
              </div>
            </OnClassRequestBanner>
          </MountOnEnter>
        </>
      )}
    </Section>
  );
};

OnClassMain.displayName = 'OnClassMain';
export default loginRequired(React.memo(OnClassMain));

