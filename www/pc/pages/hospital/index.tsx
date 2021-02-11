import React from 'react';
import {staticUrl} from '../../src/constants/env';
import {useRouter} from "next/router";
import {useSelector, shallowEqual, useDispatch} from "react-redux";
import OGMetaHead from "../../components/OGMetaHead";
import styled from 'styled-components';
import {$WHITE, $FONT_COLOR} from '../../styles/variables.types';
import {fontStyleMixin, backgroundImgMixin}  from '../../styles/mixins.styles';
import HospitalNewBtn from '../../components/hospital/HospitalNewBtn';
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import ReactCustomSlick from '../../components/common/ReactCustomSlick';
import WaypointHeader from '../../components/layout/header/WaypointHeader';
import HospitalSearchInput from '../../components/hospital/HospitalSearchInput';
import {fetchMedicalField} from '../../src/reducers/medicalField';
import {RootState} from '../../src/reducers';
import isEmpty from 'lodash/isEmpty';
import {numberWithCommas} from '../../src/lib/numbers';
import BandApi from '../../src/apis/BandApi';
import MyHospitalJobInfo from '../../components/hospital/MyHospitalJobInfo';
import DoctalkConnectBtn from '../../components/doctalk/Button/connect';

const FAKE_SCROLL_HEIGHT = 200;

const FakeDiv = styled.div`
  width: 100%;
  height: ${FAKE_SCROLL_HEIGHT}px;
`;

const Li = styled.li<Pick<IMedicalFieldCompProps, 'avatar'>>`
  position: relative;
  display: inline-block;
  width: 170px;
  height: 130px;
  margin-top: 17px;
  margin-left: 14px;
  box-sizing: border-box;
  border-radius: 12px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2);
  vertical-align: middle;
  cursor: pointer;
  ${({avatar}) => backgroundImgMixin({
    img: avatar
  })};

  &:first-child, &:nth-child(7) {
    margin-left: 0;
  }

  &:hover {
    > div {
      img {
        transform: scale(0);
        opacity: 0;
      }

      span {
        transform: translateY(-27px);
        color: ${$WHITE};
      }
    }

    p {
      &::after {
        opacity: 1;

        @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
          opacity: 0.8;
        }
      }

      div span {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }

  > div {
    position: relative;
    padding: 10px 0 0 10px;
    box-sizing: border-box;
    
    img {
      display: block;
      width: 28px;
      transform-origin: top left;
      transition: 0.3s;
    }

    span {
      position: absolute;
      z-index: 1;
      top: 40px;
      display: block;
      ${fontStyleMixin({
        size: 14,
        weight: 'bold',
        color: $FONT_COLOR
      })};
      transition: color 0.3s;
      transition: transform 0.3s;
    }
  }

  p {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #499aff;
      border-radius: 12px;
      mix-blend-mode: multiply;
      transition: 0.3s;
      opacity: 0;
    }

    div {
      position: relative;
      z-index: 1;
      display: block;
      width: 100%;
      height: 100%;
      padding: 32px 10px 19px 10px;
      box-sizing: border-box;
      overflow: hidden;

      span {
        display: inline-block;
        width: 140px;
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid rgba(255, 255, 255, 0.3);
        word-break: keep-all;
        transform: translateY(30px);
        transition: 0.3s;
        opacity: 0;

        small {
          display: inline-block;
          mix-blend-mode: normal;
          ${fontStyleMixin({
            size: 12,
            weight: 'normal',
            color: $WHITE
          })};
        }
      }
    }
  }
`;

const HospitalBannerSlider = styled(ReactCustomSlick)`
  width: 100%;
  height: 600px;
  margin-top: -${FAKE_SCROLL_HEIGHT}px;

  div {
    height: 600px;

    &:nth-child(1) .img-wrapper {
      ${backgroundImgMixin({
        img: staticUrl('/static/images/banner/img-hospital-banner1.jpg')
      })};
    }

    &:nth-child(2) .img-wrapper {
      ${backgroundImgMixin({
        img: staticUrl('/static/images/banner/img-hospital-banner2.jpg')
      })};
    }

    &:nth-child(3) .img-wrapper {
      ${backgroundImgMixin({
        img: staticUrl('/static/images/banner/img-hospital-banner3.jpg')
      })};
    }
  }
`;

const HospitalContentDiv = styled.div`
  width: 1090px;
  margin: -593px auto 0;
  padding-top: 176px;

  .main-top {
    position: relative;
    z-index: 2;

    .content-title {
      display: inline-block;

      h2 {
        margin-top: -5px;
        ${fontStyleMixin({
          size: 34,
          weight: '300',
          color: $WHITE
        })};
      }
  
      p {
        margin-top: 8px;
        ${fontStyleMixin({
          size: 18,
          weight: '300',
          color: $WHITE
        })};
  
        span {
          ${fontStyleMixin({
            size: 19,
            weight: '600',
            color: $WHITE,
            family: 'Montserrat'
          })};
        }
      }
    }

    .my-hospital-job-info {
      position: absolute;
      top: 0;
      right: 0;
      width: 300px;
    }
  }

  .main-bottom {
    position: relative;
    margin: 214px 0 150px;

    .search-category {
      margin-top: 33px;

      h3 {
        text-align: center;
        margin-bottom: 4px;
        ${fontStyleMixin({
          size: 14,
          weight: 'bold',
          color: $WHITE
        })};
      }

      ul li {
        &:nth-child(1) a span small {
          width: 105px;
        }
        
        &:nth-child(2) a span small {
          width: 120px;
        }

        &:nth-child(3) a span small {
          width: 95px;
        }

        &:nth-child(4) a span small {
          width: 85px;
        }

        &:nth-child(5) a span small {
          width: 90px;
        }

        &:nth-child(6) a span small {
          width: 130px;
        }

        &:nth-child(7) a span small {
          width: 120px;
        }

        &:nth-child(8) a span small {
          width: 140px;
        }

        &:nth-child(9) a span small {
          width: 130px;
        }

        &:nth-child(10) a span small {
          width: 120px;
        }

        &:nth-child(11) a span small {
          width: 130px;
        }

        &:nth-child(12) a span small {
          width: 120px;
        }
      }
    }
  }
`;

interface IMedicalFieldCompProps {
  avatar: string;
  name: string;
  icon: string;
  tags: string[];
  onClick: () => void;
}

const MedicalFieldComp = React.memo<IMedicalFieldCompProps>(({
  avatar,
  name,
  icon,
  tags,
  onClick
}) => (
  <Li
    avatar={avatar}
    onClick={onClick}
  >
    <div>
      <img
        src={icon}
        alt={name}
      />
      <span>{name}</span>
    </div>
    <p>
      <div>
        <span>
          <small>{tags}</small>
        </span>
      </div>
    </p>
  </Li>
));

const sliderSettings = {
  className: 'banner-slider',
  autoplay: true,
  autoplaySpeed: 8000,
  fade: true,
  speed: 1500,
  arrows: false,
  slidesToScroll: 1,
  slidesToShow: 1
};

const HospitalMainPage = React.memo(() => {
  const dispatch = useDispatch();

  const router = useRouter();

  const [hospitalCount, setHospitalCount] = React.useState(0);

  const {me, medicalField} = useSelector(
    ({system: {session: {id}}, orm, medicalField}: RootState) => ({
      me: pickUserSelector(id)(orm),
      medicalField
    }),
    shallowEqual
  );

  const fetchHospitalCount = React.useCallback(() => {
    BandApi.bandCount({
      band_type: 'hospital'
    }).then(({data: {result}}) => {
      const {count} = result;

      if (count) {
        setHospitalCount(count);
      }
    });
  }, []);

  const searchHospital = React.useCallback((query: Indexable) => {
    router.push({
      pathname: '/hospital/search',
      query
    });
  }, []);

  const countOnClickHandler = () => router.push({pathname: '/hospital/search'});
  
  React.useEffect(() => {
    dispatch(fetchMedicalField());
    fetchHospitalCount();
  }, [fetchHospitalCount]);

  return (
    <WaypointHeader
      themetype="white"
      headerComp={
        <>
          <OGMetaHead title="한의원 메인"/>
          <FakeDiv/>
        </>
      }
    >
      <HospitalBannerSlider {...sliderSettings}>
        <div className="img-wrapper"/>
        <div className="img-wrapper"/>
        <div className="img-wrapper"/>
      </HospitalBannerSlider>
      <HospitalContentDiv>
        <div className="main-top clearfix">
          <div className="content-title">
            <h2>어떤 한의원을 찾으시나요?</h2>
            <p>한의플래닛에는&nbsp;
              <a
                onClick={countOnClickHandler}
              >
                <span>{numberWithCommas(hospitalCount)}</span>
              </a>
              개의 한의원이 등록되어 있습니다.
            </p>
          </div>
          {(!isEmpty(me) && me.user_type === 'doctor') && (
            <div className="my-hospital-job-info">
              <HospitalNewBtn/>
              <MyHospitalJobInfo/>
              {!me.is_doctalk_doctor && (
                <DoctalkConnectBtn/>
              )}
            </div>
          )}
        </div>
        <div className="main-bottom">
          <HospitalSearchInput
            onSearch={searchHospital}
            onSelect={searchHospital}
          />
          <div className="search-category">
            <h3>어떤 진료를 원하세요?</h3>
            <ul>
              {!isEmpty(medicalField) && Object.values(medicalField).map(({
                id,
                name,
                image,
                tags,
                icons
              }, index) => {
                const tagLastIndex = tags.length - 1;
                const _tags = tags.map((tag, index) => index !== tagLastIndex
                  ? `${tag}, `
                  : tag
                );

                return (
                  <MedicalFieldComp
                    key={`${id}-${index}`}
                    avatar={image}
                    name={name}
                    icon={icons.normal}
                    tags={_tags}
                    onClick={() => searchHospital({
                      category_id: JSON.stringify([{
                        id,
                        name
                      }])
                    })}
                  />
                );
              })}
            </ul>
          </div>
        </div>
      </HospitalContentDiv>
    </WaypointHeader>
  );
});

export default HospitalMainPage;
