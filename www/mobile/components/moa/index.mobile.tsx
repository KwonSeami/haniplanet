import * as React from 'react';
import styled from 'styled-components';
import {$BORDER_COLOR, $FONT_COLOR, $TEXT_GRAY, $WHITE} from '../../styles/variables.types';
import MoaListMobile from './list/moaList/MoaList/MoaListMobile';
import {backgroundImgMixin, fontStyleMixin, heightMixin} from '../../styles/mixins.styles';
import AppliedMoaListMobile from './list/moaList/ApplicatedMoaList/AppliedMoaListMobile';
import MoaCollectMobile from './list/moaList/MoaCollect/MoaCollectMobile';
import {staticUrl} from '../../src/constants/env';
import MoaTopBoxMobile from './list/MoaTopDiv/MoaTopBoxMobile';
import BandApi from '../../src/apis/BandApi';
import useSaveApiResult from '../../src/hooks/useSaveApiResult';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import Link from 'next/link';
import loginRequired from "../../hocs/loginRequired";
import {useDispatch} from 'react-redux';
import {setLayout, clearLayout} from '../../src/reducers/system/style/styleReducer';

interface Props {
}

const MoaBottomDiv = styled.div`
  width: 100%;
  padding-top: 117px;
  margin-top: -85px;
  box-sizing: border-box;
  background-color: ${$WHITE};

  .moa-status {
    max-width: 680px;
    box-sizing: border-box;
    position: relative;
    margin: auto;

    & > h2 {
      padding: 28px 0 21px;
      text-align: center;
      ${fontStyleMixin({
        size: 16,
        weight: '300'
      })}
    }

    .moa-introduce {
      padding-bottom: 33px;
      text-align: center;
      border-bottom: 1px solid ${$BORDER_COLOR};

      li {
        display: inline-block;
        vertical-align: top;
        width: 145px;
        box-sizing: border-box;
        letter-spacing: -1.2px;
        ${fontStyleMixin({
          size: 13,
          weight: '600',
          color: $TEXT_GRAY
        })}

        a {
          ${fontStyleMixin({
            weight: '600',
            color: $FONT_COLOR
          })}
        }
      }

      img {
        width: 65px;
        display: block;
        margin: auto auto 10px;
      }
    }
  }

  @media screen and (max-width: 680px) {
    .moa-status {
      & > h2 {
        padding-bottom: 13px;
        border-top: 8px solid #f2f3f7;
        font-size: 18px;

        span {
          position: relative;
          z-index: 1;

          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 50%;
            background-color: #f8f6ee;
            z-index: -1;
          }
        }
      }

      .moa-introduce {
        padding: 13px 0 15px;
        border-bottom: 0;

        li {
          width: 91px;
          margin: 0 11px;

          img {
            width: 65px;
          }
          
          &:last-child {
            width: calc(100% - 30px);
            margin: 17px auto 0;
            ${heightMixin(45)};
            ${backgroundImgMixin({
              img: '/static/images/icon/icon-more.png',
              size: '11px',
              position: '39% 47%',
              color: '#f8f6ee'
            })}

            a {
              display: block;
              width: 100%;
              height: 100%;
              font-size: 14px;

              img {
                display: none;
              }
            }
          }
        }
      }
    }
  }
`;

const AdvertisingDiv = styled.div`
  background-color: #f8f6ee;

  div {
    max-width: 680px;
    height: 185px;
    padding-top: 15px;
    margin: auto;
    box-sizing: border-box;
    position: relative;
    ${backgroundImgMixin({
      img: '/static/images/banner/img-moa-benner.png',
      position: '100% 100%',
      size: '187px 170px'
    })}

    h2 {
      padding-top: 40px;
      letter-spacing: -1.3px;
      ${fontStyleMixin({
        size: 21,
        weight: '300',
        color: '#6d6660'
      })}
    }

    li {
      display: inline-block;
      vertical-align: middle;
      padding-right: 7px;
      font-size: 13px;
    }
  }

  @media screen and (max-width: 680px) {
    padding: 0 15px;
    ${backgroundImgMixin({
      img: '/static/images/banner/img-moa-bg.png',
      size: '360px',
      position: '100% 100%'
    })}

    div {
      background: none;
      height: auto;

      h2 {
        padding-bottom: 50px;
      }
    }
  }
`;

const RecommendMoaCard = styled(MoaListMobile)`
  max-width: 680px;
  position: relative;
  margin: auto;
  padding: 24px 0;
  border: 0;
  box-sizing: border-box;


  & > h2 {
    padding-bottom: 13px;
    ${fontStyleMixin({
      size: 16,
      weight: 'bold'
    })}
  }

  @media screen and (max-width: 680px) {
    padding: 22px 15px 24px;
    border-top: 8px solid #f2f3f7;
  }
`;

const ConsultantMoaCard = styled(MoaListMobile)`
  max-width: 680px;
  margin: auto;
  padding: 22px 0 105px;
  border: 0;

  & > h2 {
    padding-bottom: 10px;
    ${fontStyleMixin({
      size: 16,
      weight: 'bold'
    })}
  }

  @media screen and (max-width: 680px) {
    padding: 23px 13px 99px;

    & > h2 {
      padding-bottom: 13px;
    }
  }
`;

const MoaMainMobile = React.memo<Props>(() => {
  const categoryApi: BandApi['category'] = useCallAccessFunc(access => (
    access ? form => new BandApi(access).category(form) : null
  ));
  const {resData: categoryList} = useSaveApiResult(
    () => categoryApi && categoryApi({band_type: 'consultant'})
  );

  const dispatch = useDispatch();
  
  React.useEffect(() => {
    dispatch(setLayout({
      headerDetail: 'MOA'
    }));

    return () => {
      dispatch(clearLayout());
    }
  }, []);

  return (
    <>
      <MoaTopBoxMobile />
      <MoaBottomDiv>
        <div className="moa-status">
          <AppliedMoaListMobile />
          <h2>이런 <span>MOA</span>를 만들어보세요!</h2>
          <ul className="moa-introduce">
            <li>
              <img
                src={staticUrl('/static/images/icon/icon-moa-expert.png')}
                alt="전문 정보를 공유하는 MOA"
              />
              전문 정보를 공유하는 MOA
            </li>
            <li>
              <img
                src={staticUrl('/static/images/icon/icon-moa-friendship.png')}
                alt="친목을 위한  MOA"
              />
              친목을 위한  MOA
            </li>
            <li>
              <img
                src={staticUrl('/static/images/icon/icon-moa-interest.png')}
                alt="취미를 공유하는 MOA"
              />
              취미를 공유하는 MOA
            </li>
            <li>
              <Link href="/band/new">
                <a>
                  <img
                    src={staticUrl('/static/images/icon/icon-make-moa.png')}
                    alt="개설하기"
                  />
                  개설하기
                </a>
              </Link>
            </li>
          </ul>
        </div>
        <RecommendMoaCard
          title="추천MOA"
          bandType="moa"
        />
        <MoaCollectMobile
          band_type='moa'
        />
        <AdvertisingDiv>
          <div>
            <ul>
              {categoryList && categoryList.map(({id, name}) => (
                <li key={`consultant-list-${id}`}>#{name}</li>
              ))}
            </ul>
            <h2>다양한 분야별 맞춤 전문가<br />MOA입니다.</h2>
          </div>
        </AdvertisingDiv>
        <ConsultantMoaCard
          title="전문가MOA"
          bandType="consultant"
          showMoaLength
        />
      </MoaBottomDiv>
    </>
  );
});

MoaMainMobile.displayName = 'MoaMainMobile';

export default loginRequired(MoaMainMobile);
