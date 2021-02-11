import React from 'react';
import {useSelector, shallowEqual, useDispatch} from 'react-redux';
import {RootState} from '../src/reducers';
import {pickUserSelector} from '../src/reducers/orm/user/selector';
import isEmpty from 'lodash/isEmpty';
import usePrevious from '../src/hooks/usePrevious';
import isEqual from 'lodash/isEqual';
import OGMetaHead from '../components/OGMetaHead';
import styled from 'styled-components';
import MainHospitalStory from '../components/mainContent/HospitalStory';
import MainPlanetNews from '../components/mainContent/PlanetNews';
import {fetchMainThunk} from '../src/reducers/main/thunk';
import Loading from '../components/common/Loading';
import PlanetAdBanner from '../components/mainContent/PlanetAdBanner';
import PlanetNotice from '../components/mainContent/PlanetNotice';
import {HEADER_HEIGHT} from '../styles/base.types';
import PlanetPick from '../components/mainContent/PlanetPick';
import {MILLI_SECOND} from '../src/constants/times';

const MainContentWrapper = styled.div`
  margin-bottom: 100px;

  .notice-banner-wrapper {
    max-width: 1090px;
    margin: 23px auto 0;
  }
`;

const StyledLoading = styled(Loading)`
  position: relative;
  height: calc(100vh - ${HEADER_HEIGHT}px);

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
    main,
    access,
    myId
  } = useSelector(
    ({main, orm, system: {session: {id, access}}}: RootState) => ({
      me: pickUserSelector(id)(orm),
      main,
      access,
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
    notices,
    banners,
    hospitalStory,
    planetNews,
    planetPick
  } = main;

  const isUserLogined = !!access;

  return (
    <>
      <OGMetaHead title="메인"/>
      <MainContentWrapper>
        <PlanetPick
          data={planetPick}
          isUserLogined={isUserLogined}
        />
        <div className="notice-banner-wrapper">
          <PlanetAdBanner data={banners}/>
          <PlanetNotice
            data={notices}
            isUserLogined={isUserLogined}
          />
        </div>
        <MainPlanetNews data={planetNews}/>
        <MainHospitalStory data={hospitalStory}/>
      </MainContentWrapper>
    </>
  );
};

Home.displayName = 'Home';

export default Home;
