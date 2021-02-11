import React from 'react';
import styled from 'styled-components';
import {backgroundImgMixin, fontStyleMixin, heightMixin, radiusMixin} from '../../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR, $WHITE, $POINT_BLUE, $GRAY} from '../../styles/variables.types';
import {staticUrl} from '../../src/constants/env';
import {useRouter} from 'next/router';
import A from '../UI/A';
import OGMetaHead from "../OGMetaHead";
import ReactCustomSlick from '../common/ReactCustomSlick';
import {ADMIN_PERMISSION_GRADE} from '../../src/constants/band';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import {fetchProfileInfo} from '../../src/reducers/profile';
import WaypointHeader from '../layout/header/WaypointHeader';
import Tag from '../UI/tag/Tag';
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import FloatingMenu from '../common/FloatingMenu';
import MedicalTeam from './medicalTeam';
import Link from 'next/link';
import {fetchUserHospital} from '../../src/reducers/hospital';
import Button from '../inputs/Button/ButtonDynamic';
import range from 'lodash/range';
import {filterCategoryIcons} from '../../src/lib/hospital';
import DoctalkButton from '../doctalk/Button';
import {HEADER_HEIGHT} from '../../styles/base.types';
import TimeRangeTable from "./common/TimeRangeTable";

export const floatMenuList = [
  {
    imgSrc: '/static/images/icon/icon-hospital-treatment.png',
    name: "treatment",
    title: "진료"
  },
  {
    imgSrc: '/static/images/icon/icon-hospital-medicalteam.png',
    name: "medicalTeam",
    title:"의료진 & FAQ"
  },
  {
    imgSrc: '/static/images/icon/icon-hospital-location-map.png',
    name: "location-map",
    title: "위치"
  },
];

const SLIDE_SHOW_LENGTH = 7;

const HospitalBannerDiv = styled.div<{bannerImg: string}>`
  position: relative;
  height: 410px;
  background-blend-mode: multiply;
  ${({bannerImg}) => backgroundImgMixin({
    img: bannerImg,
    color: 'rgba(0, 0, 0, 0.7)'
  })};

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #000;
      opacity: 0.7;
    }
  }
`;

const Div = styled.div`
  position: relative;
  width: 1280px;
  margin: 0 auto 100px;
`;

const HospitalDetailDiv = styled.div`
  width: 1000px;
  margin: -232px auto 0;

  .hospital-top {
    position: relative;

    div.hospital-state {
      position: absolute;
      top: -46px;
      width: 100%;

      > p {
        float: right;
        ${heightMixin(34)};
        ${fontStyleMixin({
          size: 14,
          color: $WHITE
        })};
  
        > img {
          width: 17px;
          margin: 0 4px -3px 0;
        }
  
        span {
          display: inline-block;
          ${heightMixin(34)};
          padding: 0 10px 0 14px;
          margin-left: 11px;
          box-sizing: border-box;
          border: 1px solid rgba(255, 255, 255, 0.3);
          text-align: center;
          ${fontStyleMixin({
            size: 13,
            color: $WHITE
          })};
          
          a {
           ${fontStyleMixin({
              size: 13,
              color: $WHITE
            })};
          }
  
          img {
            width: 10px;
          }
  
          &:hover {
            border: 1px solid #d8d8d8;
            background-color: rgba(255, 255, 255, 0.1);
          }
        }
      }
    }

    .hospital-title-content {
      background-color: ${$WHITE};

      .info-area {
        position: relative;
        display: inline-block;
        width: 535px;
        height: 100%;
        padding: 22px 31px 0;
        background-color: ${$WHITE};
        box-sizing: border-box;
        vertical-align: middle;

        > div:first-of-type {
          min-height: 208px;

          h2 {
            ${fontStyleMixin({
              size: 30,
              weight: '300'
            })};
          }
  
          .tag-list {
            margin-top: 1px;
  
            li {
              display: inline-block;
  
              p {
                margin-right: 8px;
                padding-left: 0;
                ${fontStyleMixin({
                  size: 15,
                  weight: '300'
                })};
              }
  
              &:last-child {
                p {
                  margin-right: 0;
                }
              }
            }
          }
  
          ul.hospital-title-info {
            margin: 20px 0;
  
            li {
              margin-top: 7px;
              ${fontStyleMixin({
                size: 13,
                color: $GRAY
              })};
  
              &:first-child {
                margin-top: 0;
              }
  
              img {
                width: 16px;
                margin-right: 7px;
                margin-bottom: -2px;
              }
  
              a {
                text-decoration: underline;
                ${fontStyleMixin({
                  size: 13,
                  color: $POINT_BLUE
                })};
              }
            }
          }
        }

        .hospital-category {
          li {
            display: inline-block;
            width: 80px;
            height: 80px;
            padding: 10px 0 10px;
            margin-left: 6px;
            ${radiusMixin('15px', '#eee')};
            text-align: center;

            &:first-child {
              margin-left: 0;
            }

            img {
              width: 38px;
            }

            p {
              ${fontStyleMixin({
                size: 12,
                color: '#999'
              })};
            }
          }
        }
      }
    }
  }

  .hospital-introduction {
    margin: 30px 0;
    padding: 20px 30px 20px 60px;
    border: 1px solid ${$BORDER_COLOR};
    border-top: 1px solid ${$FONT_COLOR};
    box-sizing: border-box;

    p {
      position: relative;
      white-space: pre-wrap;
      ${fontStyleMixin({
        size: 15,
        color: $GRAY
      })}

      img {
        position: absolute;
        top: 0;
        left: -30px;
        width: 24px;
      }
    }
  }

  .hospital-info {
    border: 1px solid ${$BORDER_COLOR};
    border-top: 1px solid ${$FONT_COLOR};
    box-sizing: border-box;

    > ul {
      > li {
        position: relative;
        min-height: 62px;
        padding: 20px 0;
        margin: 0 30px;
        border-bottom: 1px solid #eeeee0;
        box-sizing: border-box;

        table {
          width: 710px;
          margin: 0 0 12px 230px;
          caption {
            display: none;
          }
        }
        
        &:nth-child(5) {
          padding: 0;
          margin: 0;
          border-top: 1px solid ${$FONT_COLOR};
          border-bottom: 1px solid ${$FONT_COLOR};

          &:after {
            content: '';
            position: absolute;
            z-index: 1;
            top: 60px;
            left: 0;
            width: 100%;
            height: 1px;
            background-color: #eee;
          }

          > h3 {
            left: 30px;
          }

          > span {
            position: absolute;
            top: 20px;
            right: 30px;
            width: inherit;
            ${fontStyleMixin({
              size: 14
            })};

            &.isOpened {
              img {
                transform: rotate(180deg);
              }
            }

            img {
              width: 15px;
              margin-left: 5px;
              vertical-align: middle;
            }
          }
        }

        > h3 {
          position: absolute;
          top: 22px;
          left: 0;
          ${fontStyleMixin({
            size: 14,
            weight: 'bold'
          })};

          img {
            width: 24px;
            margin: -3px 6px 0 0;
            vertical-align: middle;
          }
        }

        > p {
          white-space: pre-wrap;
          display: inline-block;
          width: 708px;
          margin-left: 230px;
          ${fontStyleMixin({
            size: 15,
            color: $GRAY
          })};
        }

        > span {
          display: inline-block;
          width: 708px;
          margin-left: 230px;
          ${fontStyleMixin({
            size: 15,
            color: $POINT_BLUE
          })};
        }

        #map {
          width: 940px;
          height: 530px;
          margin: 10px 0;
        }

        > ul {
          margin-top: 60px;
        }
      }
    }
  }
`;

const DoctalkLinkWrapper = styled.div`
  display: inline-block;

  .doctalk-btn {
    display: inline-block;
    vertical-align: middle;

    button {
      width: 133px;
      height: 34px;
      border: 1px solid #00b430;
      border-radius: 5px;
      background-color: #40b044;

      span {
        font-size: 12px;
        font-weight: bold;
      }
    }
  }

  p {
    display: inline-block;
    padding: 8px 15px;
    margin-left: 5px;
    border-radius: 5px;
    background-color: #000;
    vertical-align: middle;
    ${fontStyleMixin({
      size: 11,
      weight: '300',
      color: 'rgba(255, 255, 255, 0.8)'
    })};

    span {
      opacity: 0.8;
      ${fontStyleMixin({
        weight: 'bold',
        color: '#52e257'
      })};
    }
  }
`;

const ThumbImg = styled.div<{bgImg?: string}>`
  display: inline-block;
  width: 465px;
  height: 310px;
  vertical-align: top;
  border: 1px solid ${$BORDER_COLOR};
  box-sizing: border-box;
  background-color: #f6f7f9;
  ${({bgImg}) => !!bgImg && backgroundImgMixin({
    img: staticUrl(bgImg)
  })};
`;

const DoctalkLogo = styled.span`
  display: inline-block;
  width: 168px;
  height: 28px;
  line-height: 28px;
  margin: 9px 0 0 10px;
  background-color: #40b044;
  border-radius: 5px;
  text-align: center;
  ${fontStyleMixin({
    size: 11,
    weight: 'bold',
    color: $WHITE
  })};

  img {
    width: 53px;
    margin-right: 1px;
  }
`;

const HospitalDetailSlider = styled(ReactCustomSlick)`
  width: 100%;
  height: 94px;
  margin: 30px 0 0;

  .slick-slide {
    width: 139px !important;
    margin-left: 4px;

    &:first-child {
      margin-left: 0;
    }
  }

  .slick-arrow {
    width: 38px;
    height: 38px;

    &::before {
      display: none;
    }

    &.slick-prev {
      left: -50px;
      ${backgroundImgMixin({
        img: staticUrl('/static/images/icon/icon-hospital-arrow-left.png')
      })};
    }

    &.slick-next {
      right: -49px;
      ${backgroundImgMixin({
        img: staticUrl('/static/images/icon/icon-hospital-arrow-right.png')
      })};
    }
  }
`;

const DetailSliderImg = styled.div<{bgImg: string}>`
  height: 94px;
  border: 1px solid #eee;
  box-sizing: border-box;
  ${({bgImg}) => backgroundImgMixin({
    img: staticUrl(bgImg),
    color: '#f6f7f9'
  })};
`;

const SliderZoom = styled(ReactCustomSlick)`
  position: fixed;
  z-index: 200000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 40px 80px;
  box-sizing: border-box;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: 0.5;
  }

  div:not(.current) :not(.slider-zoom-img) {
    width: 100%;
    height: 100%;
  }

  .slick-arrow {
    z-index: 1;
    width: 31px;
    height: 79px;

    &::before {
      display: none;
    }

    &.slick-prev {
      left: 20px;
      ${backgroundImgMixin({
        img: staticUrl('/static/images/icon/arrow/icon-slide-arrow-left.png')
      })};
    }

    &.slick-next {
      right: 20px;
      ${backgroundImgMixin({
        img: staticUrl('/static/images/icon/arrow/icon-slide-arrow-right.png')
      })};
    }
  }

  .slick-slide {
    > div {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`;

const SliderZoomImg = styled.div<{bgImg: string}>`
  position: relative;
  width: auto !important;
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
  box-sizing: border-box;

  > button {
    position: absolute;
    top: 0;
    right: 0;
    
    img {
      width: 25px;
      height: 25px;
    }
  }

  .current {
    position: absolute;
    bottom: 0;
    left: 0;
    ${fontStyleMixin({
      size: 14,
      weight: '600',
      family: 'Montserrat',
      color: $WHITE
    })};
  }
`;

const HospitalDetailPC = React.memo(props => {
  const sliderSettings = {
    className: 'banner-slider',
    autoplay: false,
    speed: 300,
    arrows: true,
    slidesToScroll: 1,
    slidesToShow: SLIDE_SHOW_LENGTH,
    infinite: false
  };

  const sliderZoomSettings = {
    autoplay: false,
    speed: 300,
    arrows: true,
    slidesToScroll: 1,
    slidesToShow: 1,
    infinite: false,
  };

  const dispatch = useDispatch();
  const {myId, me} = useSelector(
    ({orm, hospital, system: {session: {id}}}) => ({
      hospital,
      myId: id,
      me: (pickUserSelector(id)(orm) || {})
    }),
    shallowEqual
  );

  const map = React.useRef();
  const router = useRouter();
  const {query} = router;
  const {
    id,
    band: {
      name,
      categories,
      tags,
      body,
      banners = [],
      band_member_grade,
      slug,
      extension: {
        coordinates,
        work_day,
        telephone,
        address,
        detail_address,
        link,
        no_accept_text,
        reservation_text,
        etc,
        subject_text,
        expertise,
        directions,
        can_park,
        has_doctalk_doctor
      } = {} as any,
      members = [],
    },
  } = props;
  const [currIdx, setCurrIdx] = React.useState(-1);
  const [openJobForm, setOpenJobForm] = React.useState(false);

  const _window = typeof window === 'undefined' ? {} : window;

  React.useEffect(() => {
    if (!!myId) {
      dispatch(fetchUserHospital(myId));
      dispatch(fetchProfileInfo(myId, 'edu'));
      dispatch(fetchProfileInfo(myId, 'brief'));
      dispatch(fetchProfileInfo(myId, 'thesis'));
    }
  }, [myId]);

  React.useEffect(() => {
    if (query.medicalTeam === 'edit') {
      const {current} = floatMenuTargetRef['medicalTeam'];
      const targetOffset = current.getBoundingClientRect().top;
      const scrollPosition = (targetOffset + window.pageYOffset) - HEADER_HEIGHT;

      window.scrollTo(0, scrollPosition);
      setOpenJobForm(true);
    }
  }, [query]);

  const initMapPosition = React.useCallback((positionX: number, positionY: number) => {
    if (typeof window !== 'undefined') {
      const myaddr = new window.naver.maps.Point(positionX, positionY);

      map.current.setCenter(myaddr);

      new window.naver.maps.Marker({
        position: myaddr,
        map: map.current,
      });
    }
  }, []);

  React.useEffect(() => {
    const {longitude: x, latitude: y} = coordinates;

    setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && _window.naver) {
          map.current = new _window.naver.maps.Map('map', {
            useStyleMap: true
          });
          initMapPosition(x, y);
        }
      } catch (err) {
        //pass
      }
    }, 1000);
  }, [coordinates, _window.naver, initMapPosition]);

  const hasAdminPermission = ADMIN_PERMISSION_GRADE.includes(band_member_grade);

  const floatMenuTargetRef = {};
  floatMenuList.forEach(({name}) => {
    floatMenuTargetRef[`${name}`] = React.useRef(null);
  });

  const bannerImage = !isEmpty(banners)
    ? banners[0].image
    : staticUrl('/static/images/banner/img-hospital-default.png');

  return (
    <WaypointHeader
      themetype="white"
      headerComp={
        <>
          <OGMetaHead
            title={name}
            image={bannerImage}
          />
          <HospitalBannerDiv bannerImg={bannerImage}/>
        </>
      }
    >
      <Div>
        <FloatingMenu
          menuList={floatMenuList}
          onClick={(name) => {
            const {current} = floatMenuTargetRef[`${name}`];
            const targetOffset = current.getBoundingClientRect().top;
            const scrollPosition = (targetOffset + window.pageYOffset) - HEADER_HEIGHT;

            window.scrollTo(0,scrollPosition)
          }}
          canShare
        />
        <HospitalDetailDiv>
          <div className="hospital-top">
            {(!isEmpty(me) && me.user_type === 'doctor') && (
              <div className="hospital-state clearfix">
                {band_member_grade !== 'visitor' ? (
                  <>
                    {!me.is_doctalk_doctor && (
                      <DoctalkLinkWrapper>
                        <DoctalkButton
                          className="doctalk-btn"
                          text="doctalk 연동하기"
                        />
                        <p>
                          닥톡(doctalk)-<span>NAVER 지식iN</span>&nbsp;<b>한의사</b>로 개인과 한의원을 브랜딩하세요!
                        </p>
                      </DoctalkLinkWrapper>
                    )}
                    <p>
                      <img
                        src={staticUrl('/static/images/icon/icon-hospital-working.png')}
                        alt="현재 재직 중인 한의원입니다."
                      />
                      현재 재직 중인 한의원입니다.
                      {hasAdminPermission && (
                        <Link
                          href="/band/[slug]/edit"
                          as={`/band/${slug}/edit`}
                        >
                          <a>
                            <span className="pointer">
                              한의원 관리
                              <img
                                src={staticUrl('/static/images/icon/arrow/icon-white-arrow.png')}
                                alt="한의원 관리"
                              />
                            </span>
                          </a>
                        </Link>
                      )}
                    </p>
                  </>
                ) : (
                  <p>
                    <span
                      className="pointer"
                      onClick={() => setOpenJobForm(true)}
                    >
                      <a href="#medicalTeam">
                        의료진 등록
                        <img
                          src={staticUrl('/static/images/icon/arrow/icon-white-arrow.png')}
                          alt="한의원 관리"
                        />
                      </a>
                    </span>
                  </p>
                )}
              </div>
            )}
            <div className="hospital-title-content">
              <ThumbImg bgImg={bannerImage}>
                {has_doctalk_doctor && (
                  <DoctalkLogo>
                    <img
                      src={staticUrl('/static/images/logo/img-doctalk-logo.png')}
                      alt="닥톡 로고"
                    />
                    네이버 지식iN 한의사
                  </DoctalkLogo>
                )}
              </ThumbImg>
              <div className="info-area">
                <div>
                  <h2>{name}</h2>
                  <ul className="tag-list">
                    {tags && tags.map(({tag:{id, name, is_follow}}) => (
                      <li key={id}>
                        <Tag
                          id={id}
                          name={name}
                          highlighted={is_follow}
                          is_follow={is_follow}
                          onClick={() => router.push(`/tag/${id}`)}
                        />
                      </li>
                    ))}
                  </ul>
                  <ul className="hospital-title-info">
                    <li>
                      <img
                        src={staticUrl('/static/images/icon/icon-hospital-location.png')}
                        alt="한의원 위치"
                      />
                      {address} {detail_address}
                    </li>
                    <li>
                      <img
                        src={staticUrl('/static/images/icon/icon-hospital-phone.png')}
                        alt="한의원 번호"
                      />
                      {telephone}
                    </li>
                    {!!link && (
                      <li>
                        <img
                          src={staticUrl('/static/images/icon/icon-hospital-homepage.png')}
                          alt="한의원 홈페이지"
                        />
                        <A to={link} newTab>
                          {link}
                        </A>
                      </li>
                    )}
                  </ul>
                </div>
                <ul className="hospital-category">
                  {categories.map(({category:{id, name, icons}}) => {
                    const {normal} = filterCategoryIcons(icons);

                    return (
                      <li key={id}>
                        <img
                          src={normal}
                          alt={name}
                        />
                        <p>{name}</p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            {!isEmpty(banners.slice(1)) && (
              <HospitalDetailSlider
                {...sliderSettings}
              >
                {banners.length < SLIDE_SHOW_LENGTH + 1 ? (
                  range(1, SLIDE_SHOW_LENGTH + 1).map(value =>
                    value < banners.length
                      ? <DetailSliderImg
                          key={`banner-slider-img-${value}`}
                          bgImg={banners[value].image}
                          onClick={() => setCurrIdx(value - 1)}
                        />
                      : <DetailSliderImg
                          key={`banner-slider-img-${value}`}
                        />
                  )
                ) : (
                  (banners.slice(1)).map(({image, order}, index) =>
                    <DetailSliderImg
                      key={`banner-detail-img-${order}`}
                      bgImg={image}
                      onClick={() => setCurrIdx(index)}
                    />
                  )
                )}
              </HospitalDetailSlider>
            )}
            {currIdx > -1 && (
              <SliderZoom
                initialSlide={currIdx}
                {...sliderZoomSettings}
              >
                {(banners.slice(1)).map((image, index) =>
                  <SliderZoomImg
                    className="slider-zoom-img"
                  >
                    <img
                      src={image.image}
                    />
                    <Button
                      size={{
                        width: '25px',
                        height: '25px'
                      }}
                      border={{
                        radius: '50%',
                        width: '0'
                      }}
                      onClick={() => setCurrIdx(-1)}
                    >
                      <img
                        src={staticUrl('/static/images/icon/icon-delete-picture.png')}
                        alt="닫기"
                      />
                    </Button>
                    <div className="current">
                      <span>{index + 1}/{banners.slice(1).length}</span>
                    </div>
                  </SliderZoomImg>
                )}
              </SliderZoom>
            )}
          </div>
          <div className="hospital-introduction" id="treatment">
            <p>
              <img
                src={staticUrl('/static/images/icon/icon-hospital-introduction.png')}
                alt="인사말"
              />
              {body}
            </p>
          </div>
          <div className="hospital-info clearfix">
            <ul>
              <li ref={floatMenuTargetRef.treatment}>
                <h3>
                  <img
                    src={staticUrl('/static/images/icon/icon-hospital-subject.png')}
                  />
                  진료과목
                </h3>
                <p>
                  {subject_text}
                </p>
              </li>
              <li>
                <h3>
                  <img
                    src={staticUrl('/static/images/icon/icon-hospital-expertise.png')}
                    alt="전문분야"
                  />
                  전문분야
                </h3>
                <p>
                  {expertise}
                </p>
              </li>
              <li>
                <h3>
                  <img
                    src={staticUrl('/static/images/icon/icon-hospital-time.png')}
                    alt="진료시간 및 휴진여부"
                  />
                  진료시간 및 휴진여부
                </h3>
                <TimeRangeTable
                  isEdit={false}
                  defaultTimeList={work_day}
                />
                <p id="medicalTeam">
                  {no_accept_text}
                </p>
              </li>
              <li>
                <h3>
                  <img
                    src={staticUrl('/static/images/icon/icon-hospital-reservation.png')}
                    alt="예약안내"
                  />
                  예약 및 안내
                </h3>
                <p>
                  {reservation_text}<br/>
                  {etc}
                </p>
              </li>
              <li ref={floatMenuTargetRef.medicalTeam}>
                <MedicalTeam
                  members={members}
                  openJobForm={openJobForm}
                  band={{slug, id}}
                  band_member_grade={band_member_grade}
                  hasAdminPermission={hasAdminPermission}
                />
              </li>
              <li ref={floatMenuTargetRef['location-map']} id="location-map">
                <h3>
                  <img
                    src={staticUrl('/static/images/icon/icon-hospital-map.png')}
                    alt="찾아오시는 길"
                  />
                  찾아오시는 길
                </h3>
                <p>
                  {directions}
                </p>
              </li>
              <li>
                <h3>
                  <img
                    src={staticUrl('/static/images/icon/icon-hospital-parking.png')}
                    alt="주차 가능 여부"
                  />
                  주차 가능 여부
                </h3>
                <span>
                  {can_park ? '주차 가능' : '주차 불가능'}
                </span>
              </li>
              <li>
                <div id="map"/>
              </li>
            </ul>
          </div>
        </HospitalDetailDiv>
      </Div>
    </WaypointHeader>
  );
});

HospitalDetailPC.displayName = 'HospitalDetailPC';

export default HospitalDetailPC;
