import React from 'react';
import {useRouter} from "next/router";
import {staticUrl} from '../../src/constants/env';
import {useSelector, shallowEqual, useDispatch} from "react-redux";
import OGMetaHead from "../../components/OGMetaHead";
import {$WHITE, $FONT_COLOR} from '../../styles/variables.types';
import styled from 'styled-components';
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import {backgroundImgMixin, fontStyleMixin} from '../../styles/mixins.styles';
import ReactCustomSlick from '../../components/common/ReactCustomSlick';
import HospitalSearchInput from '../../components/hospital/HospitalSearchInput';
import {fetchMedicalField} from '../../src/reducers/medicalField';
import {RootState} from '../../src/reducers';
import BandApi from '../../src/apis/BandApi';
import {numberWithCommas} from '../../src/lib/numbers';
import isEmpty from 'lodash/isEmpty';
import HospitalNewBtn from '../../components/hospital/HospitalNewBtn';
import MyHospitalJobInfo from '../../components/hospital/MyHospitalJobInfo';
import DoctalkConnectButton from '../../components/doctalk/Button/connect';
import {setLayout, clearLayout} from '../../src/reducers/system/style/styleReducer';

const HospitalContentDiv = styled.div`
  width: 100%;
  height: 1059px;
  margin-top: -2px;

  .content-title {
    max-width: 680px;
    padding: 30px 15px 90px;
    margin: auto;
    box-sizing: border-box;

    h2 {
      ${fontStyleMixin({
        size: 28,
        weight: '300',
        color: $WHITE
      })};

      p {
        margin-bottom: 10px;
        ${fontStyleMixin({
          size: 14,
          color: $WHITE
        })};
      }
      
      span {
        ${fontStyleMixin({
          size: 28,
          weight: '600',
          family: 'Montserrat',
          color: $WHITE
        })};
      }
    }
  }

  .my-hospital-job-info {
    max-width: 680px;
    margin: -76px auto 10px;
    padding: 0 10px;
    box-sizing: border-box;
  }

  .input-wrapper {
    position: relative;
    max-width: 680px;
    padding: 0 10px;
    margin: 10px auto 0 auto;
    box-sizing: border-box;

    .hospital-autocomplete-list {
      top: 45px;
      left: 10px;
      width: calc(100% - 20px);
      height: auto;
      border-radius: 7px;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
    }
  }

  .search-category {
    margin-top: 27px;
    text-align: center;

    h3 {
      ${fontStyleMixin({
        size: 12,
        weight: 'bold',
        color: $WHITE
      })};
    }

    ul {
      margin-top: 10px;
      overflow-x: auto;
      white-space: nowrap;

      li:first-child {
        margin-left: 10px;
      }
    }
  }

  @media screen and (max-width: 680px) {
    height: 683px;

    .doctalk-wrapper {
      padding: 0 10px;
      box-sizing: border-box;
    }
  }
`;

const HospitalBannerSlider = styled(ReactCustomSlick)`
  position: absolute;
  width: 100%;
  height: 1059px;
  z-index: -1;

  div {
    height: 100%;

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

  @media screen and (max-width: 680px) {
    height: 683px;
  }
`;

const Li = styled.li<Pick<IMedicalFieldCompProps, 'avatar'>>`
  position: relative;
  display: inline-block;
  width: 160px;
  height: 200px;
  margin-left: 6px;
  border-radius: 7px;
  box-sizing: border-box;
  vertical-align: middle;
  ${({avatar}) => backgroundImgMixin({
    img: avatar
  })};

  &:last-child {
    margin-right: 10px;
  }

  div {
    padding: 12px 17px 0;
    box-sizing: border-box;
    word-break: keep-all;
    
    img {
      width: 28px;
    }

    p {
      ${fontStyleMixin({
        size: 15,
        weight: 'bold',
        color: $FONT_COLOR
      })};
    }

    span {
      width: 120px;
      line-height: 15px;
      white-space: normal;
      display: inline-block;
      ${fontStyleMixin({
        size: 11,
        color: '#999'
      })};
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
      <p>{name}</p>
      <span>
        {tags}
      </span>
    </div>
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
    BandApi.bandCount({band_type: 'hospital'})
      .then(({data: {result}}) => {
        const {count} = result;

        if (count) {
          setHospitalCount(count);
        }
      });
  }, []);

  const searchHospital = React.useCallback((query: Indexable) => {    
    router.push({pathname: '/hospital/search', query})
  }, []);

  const countOnclickHandlear = () => router.push({pathname: '/hospital/search'});
  
  React.useEffect(() => {
    dispatch(fetchMedicalField());
    fetchHospitalCount();
  }, []);


  React.useEffect(() => {
    dispatch(setLayout({
      headerDetail: '한의원'
    }));

    return () => {
      dispatch(clearLayout());
    }
  }, []);

  return (
    <HospitalContentDiv>
      <OGMetaHead title="한의원 메인"/>
      <HospitalBannerSlider {...sliderSettings}>
        <div className="img-wrapper"/>
        <div className="img-wrapper"/>
        <div className="img-wrapper"/>
      </HospitalBannerSlider>
      <div className="content-title">
        <h2>
          <p>한의플래닛에는</p>
          <a
            onClick={countOnclickHandlear}
          >
            <span>{numberWithCommas(hospitalCount)}</span>
          </a>
          개의 한의원이<br/>
          등록되어 있습니다.
        </h2>
      </div>
      {(!isEmpty(me) && me.user_type === 'doctor') && (
        <div className="my-hospital-job-info">
          <HospitalNewBtn/>
          <MyHospitalJobInfo/>
        </div>
      )}
      <div className="input-wrapper">
        <HospitalSearchInput
          onSearch={searchHospital}
          onSelect={searchHospital}
        />
      </div>
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
      {(!isEmpty(me) && !me.is_doctalk_doctor) && (
        <div className="doctalk-wrapper">
          <DoctalkConnectButton/>
        </div>
      )}
    </HospitalContentDiv>
  );
});

export default HospitalMainPage;
