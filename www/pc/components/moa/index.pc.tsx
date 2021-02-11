import * as React from 'react';
import styled from 'styled-components';
import {staticUrl} from '../../src/constants/env';
import BandList from '../band/common/list/BandList';
import BandApi from '../../src/apis/BandApi';
import MountOnEnter from '../common/MountOnEnter';
import useSaveApiResult from '../../src/hooks/useSaveApiResult';
import BandCollect from '../band/common/collectTab/BandCollect';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import {$FONT_COLOR, $TEXT_GRAY, $WHITE} from '../../styles/variables.types';
import {backgroundImgMixin, fontStyleMixin, heightMixin} from '../../styles/mixins.styles';
import Link from 'next/link';
import MoaTopDiv from './list/MoaTopDiv/MoaTopDivPC';
import loginRequired from '../../hocs/loginRequired';
import RecommendBandCard from '../band/common/RecommendBandList';

const Div = styled.div`
  min-height: 700px;

  & > section {
    width: 100%;
    background-color: #f8f6ee;
    min-height: 400px;
  }
`;

const MoaBottomDiv = styled.div`
  width: 1090px;
  box-sizing: border-box;
  border-radius: 21px;
  margin: -53px auto auto;
  background-color: ${$WHITE};

  .moa-introduce {
    padding: 25px 0px 36px;
    text-align: center;

    h2 {
      padding-bottom: 18px;
      margin-left: 15px;
      ${fontStyleMixin({
        size: 19,
        weight: '300',
      })}
    }

    img {
      width: 65px;
      display: block;
      margin: auto auto 10px;
    }

    ul {
      margin-left: 22px;

      li {
        display: inline-block;
        vertical-align: middle;
        width: 145px;
        letter-spacing: -1.2px;
        ${fontStyleMixin({
          size: 13,
          weight: '600',
          color: $TEXT_GRAY,
        })}

        a {
          ${fontStyleMixin({
            weight: '600',
            color: $FONT_COLOR,
          })}
        }
      }
    }
  }
`;

const AdvertisingDiv = styled.div`
  background-color: #f8f6ee;

  div {
    width: 1090px;
    box-sizing: border-box;
    margin: auto;
    position: relative;
    ${backgroundImgMixin({
      img: staticUrl('/static/images/banner/img-moa-benner.png'),
      position: '100%',
      size: '121px 74px',
    })}
  }
`;

const AdvertisingH2 = styled.h2`
  text-align: right;
  padding-right: 127px;
  letter-spacing: -1.3px;
  ${heightMixin(74)};
  ${fontStyleMixin({
    size: 20,
    weight: '300',
    color: '#6d6660',
  })}
`;

const AdvertisingUl = styled.ul`
  position: absolute;
  left: -2px;
  top: 25px;

  li {
    display: inline-block;
    vertical-align: middle;
    padding-right: 7px;
    font-size: 14px;
  }
`;

const ConsultantMoaCard = styled(BandList)`
  width: 1090px;
  margin: auto;
  padding-bottom: 102px;
  border-top: 0;

  & > h2 {
    padding-bottom: 26px;
  }
`;

const MoaMain = React.memo(() => {
  const categoryApi: BandApi['category'] = useCallAccessFunc(access => (
    access ? form => new BandApi(access).category(form) : null
  ));
  const {resData: categoryList} = useSaveApiResult(
    () => categoryApi && categoryApi({band_type: 'consultant'})
  );

  const [lazy, setLazy] = React.useState(false);
  React.useEffect(() => {
    setTimeout(() => setLazy(true), 1000);
  }, []);

  return (
    <Div>
      <section>
        <MoaTopDiv/>
      </section>
      <MoaBottomDiv>
        <div className="moa-introduce">
          <h2>이런 MOA를 만들어보세요!</h2>
          <ul>
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
              친목을 위한 MOA
            </li>
            <li>
              <img
                src={staticUrl('/static/images/icon/icon-moa-interest.png')}
                alt="취미를 공유하는 MOA"
              />
              취미를 공유하는 MOA
            </li>
            <li>
              <Link href="/band/new" as="/band/new">
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
        <RecommendBandCard
          title="추천MOA"
          bandType="moa"
        />
      </MoaBottomDiv>
      {lazy && (
        <>
          <MountOnEnter>
            <BandCollect
              band_type='moa'
              title='MOA모아보기'
            />
          </MountOnEnter>
          <AdvertisingDiv>
            <div>
              <AdvertisingH2>다양한 분야별 맞춤 전문가 MOA입니다.</AdvertisingH2>
              <AdvertisingUl>
                {categoryList && categoryList.map(({id, name}) => (
                  <li key={`consultant-list-${id}`}>#{name}</li>
                ))}
              </AdvertisingUl>
            </div>
          </AdvertisingDiv>
          <MountOnEnter>
            <ConsultantMoaCard
              title="전문가MOA"
              bandType="consultant"
              showMoaLength
            />
          </MountOnEnter>
        </>
      )}
    </Div>
  );
});

MoaMain.displayName = 'MoaMain';
export default loginRequired(MoaMain);
