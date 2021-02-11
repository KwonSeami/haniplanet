import React from 'react';
import styled from 'styled-components';
import {useSelector, shallowEqual, useDispatch} from 'react-redux';
import {RootState} from '../src/reducers';
import {pickUserSelector} from '../src/reducers/orm/user/selector';
import usePrevious from '../src/hooks/usePrevious';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import OGMetaHead from '../components/OGMetaHead';
import MainHospitalStory from '../components/mainContent/HospitalStory/';
import MainPlanetNews from '../components/mainContent/PlanetNews/';
import SearchRank from '../components/mainContent/SearchRank';
import {staticUrl} from '../src/constants/env';
import {backgroundImgMixin} from '../styles/mixins.styles';
import {$WHITE} from '../styles/variables.types';
import PlanetAdBanner from '../components/mainContent/PlanetAdBanner';
import PlanetBannerMenu from '../components/mainContent/PlanetBannerMenu';
import {fetchMainThunk} from '../src/reducers/main/thunk';
import Loading from '../components/common/Loading';
import WaypointHeader from '../components/layout/header/WaypointHeader';
import {HEADER_HEIGHT} from '../styles/base.types';
import PlanetPick from '../components/mainContent/PlanetPick';
import SearchLink from '../components/mainContent/SearchLink';

const FakeDiv = styled.div`
  height: ${HEADER_HEIGHT}px;
`;

const MainContentWrapper = styled.section`
  width: 100%;
  margin-top: -${HEADER_HEIGHT}px;
  overflow-x: hidden;
  background-color: #eee;

  .main-search-wrapper {
    position: relative;
    background-color: ${$WHITE};

    > div:first-of-type {
      position: absolute;
      top: -20px;
      left: 0;
      right: 0;
      max-width: 680px;
      margin: auto;
    }

    .main-search-btn {
      position: relative;
      padding: 0 16px;
      text-align: left;
      box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2);

      > img {
        position: absolute;
        top: 9px;
        right: 10px;
        width: 26px;
      }
    }
  }

  @media screen and (max-width: 680px) {
    .main-search-wrapper {
      > div:first-of-type {
       padding: 0 10px;
     }
    }
  }
`;

const MainBannerWrapper = styled.div`
  box-sizing: border-box;
  ${backgroundImgMixin({
    img: staticUrl('/static/images/banner/banner-main.jpg'),
  })};

  div {
    max-width: 680px;
    padding: 60px 0 33px;
    margin: 0 auto;
  }
`;

const Section = styled.section`
  padding: 6px 0 30px;

  @media screen and (max-width: 680px) {
    padding-bottom: 0;
  }
`;

const StyledLoading = styled(Loading)`
  position: relative;
  height: 100vh;

  img {
    position: absolute;
    padding: 0;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const Home = () => {
  const dispatch = useDispatch();

  const {
    me,
    access,
    main,
    myId
  } = useSelector(
    ({main, orm, system: {session: {id, access}}}: RootState) => ({
      me: pickUserSelector(id)(orm),
      access,
      main,
      myId: id
    }),
    shallowEqual
  );

  const prevMe = usePrevious(me);

  React.useEffect(() => {
    if (!isEmpty(me) && !isEqual(prevMe, me) && me.is_regular === false) {
      alert('정회원 승인 후에 정상적인 서비스 이용이 가능합니다.');
    }
  }, [me]);

  React.useEffect(() => {
    dispatch(fetchMainThunk(myId));
  }, [myId]);

  if (Object.values(main).every(isEmpty)) {
    return <StyledLoading/>;
  }

  const {
    searchRanks,
    banners,
    hospitalStory,
    planetNews,
    planetPick
  } = main;

  return (
    <>
      <OGMetaHead title="메인"/>
      <WaypointHeader
        themetype="white"
        headerComp={
          <FakeDiv/>
        }
      >
        <MainContentWrapper>
          <MainBannerWrapper>
            <div>
              <PlanetBannerMenu/>
            </div>
          </MainBannerWrapper>
          <div className="main-search-wrapper">
            <SearchLink/>
            <SearchRank ranks={searchRanks}/>
          </div>
          <Section>
            <PlanetPick
              data={planetPick}
              isUserLogined={!!access}
            />
            <PlanetAdBanner data={banners}/>
            <MainPlanetNews data={planetNews}/>
            <MainHospitalStory data={hospitalStory}/>
          </Section>
        </MainContentWrapper> 
      </WaypointHeader>
    </>
  );
};

export default React.memo(Home);
