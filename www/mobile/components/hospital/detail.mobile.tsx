import * as React from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import {backgroundImgMixin, fontStyleMixin, heightMixin} from '../../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR, $WHITE, $POINT_BLUE, $TEXT_GRAY, $GRAY} from '../../styles/variables.types';
import {staticUrl} from '../../src/constants/env';
import {useRouter} from "next/router";
import useLocation from "../../src/hooks/router/useLocation";
import OGMetaHead from "../OGMetaHead";
import ReactCustomSlick from '../common/ReactCustomSlick';
import {ADMIN_PERMISSION_GRADE} from '../../src/constants/band';
import A from '../UI/A';
import cn from 'classnames';
import Button from '../inputs/Button/ButtonDynamic';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {fetchUserHospital} from '../../src/reducers/hospital';
import isEmpty from 'lodash/isEmpty';
import {fetchProfileInfo} from '../../src/reducers/profile';
import Tag from '../UI/tag/Tag';
import HospitalTimeTable, {ScheduleTable} from '../HospitalTimeTable';
import UrlPopup from '../layout/popup/UrlPopup';
import {pushPopup} from '../../src/reducers/popup';
import {DEFAULT_DAY_OF_RECESS} from '../../src/hooks/hospital/useHospitalRegister';
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import HospitalMedicalTeam from './HospitalMedicalTeam';
import {Waypoint} from 'react-waypoint';
import useMultipleRef from "../../src/hooks/element/useMultipleRef";
import NoContent from '../NoContent/NoContent';
import {filterCategoryIcons} from '../../src/lib/hospital';
import DoctalkButton from '../doctalk/Button';
import HospitalFaq from './HospitalFaq';

const HospitalTopDiv = styled.div`
  position: relative;

  > div.hospital-working {
    > p {
      ${heightMixin(41)};
      padding: 0 15px;
      box-sizing: border-box;

      > img {
        width: 18px;
        margin-right: 2.3px;
        vertical-align: middle;
      }

      .button {
        margin-top: 6px;
        float: right;

        img {
          width: 5px;
          margin: -3px 0 0 4px;
          vertical-align: middle;
        }
      }
    }
  }

  > div.hospital-banner-wrapper {
    position: relative;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    box-sizing: border-box;

    div {
      font-size: 0;

      .slick-next, .slick-prev {
        position: absolute;
        width: 46px !important;
        height: 46px !important;
    
        &.slick-prev {
          z-index: 2;
          left: 0;
          ${backgroundImgMixin({
            img: staticUrl('/static/images/icon/arrow/icon-slide-prev2.png'),
          })};
        }
    
        &.slick-next {
          right: 0;
          ${backgroundImgMixin({
            img: staticUrl('/static/images/icon/arrow/icon-slide-next2.png'),
          })};
        }
    
        ::before {
          display: none;
        }
      }
    }

    .current {
      position: absolute;
      bottom: 11px;
      left: 0;
      width: 100%;
      z-index: 2;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
      text-align: center;
      ${fontStyleMixin({
        size: 12,
        family: 'Montserrat',
        weight: '600',
        color: $WHITE
      })};
    }
  }

  .hospital-top {
    width: 100%;
    background-color: ${$WHITE};
    border-bottom: 1px solid ${$BORDER_COLOR};
    box-sizing: border-box;
    
    &.fixed {
      position: fixed;
      z-index: 200; // 지도 카피라이트의 z-index(100)보다 높아야 함
      top: 54px;

      > div {
        h2 {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        ul.tag {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }

    > div {
      min-height: 84px;
      position: relative;
      padding: 13px 15px;
      box-sizing: border-box;

      h2 {
        padding-right: 60px;
        line-height: 30px;
        ${fontStyleMixin({
          size: 24,
          weight: '300',
          color: '#000'
        })};
      }

      ul.tag-list {
        margin-top: 3px;
        margin-right: 55px;

        &.ellipsis {
          li {
            display: inline;

            p {
              display: inline;
            }
          }
        }

        li {
          display: inline-block;

          p {
            padding-top: 2px;
            margin-right: 3px;
            ${fontStyleMixin({
              size: 12
            })};
          }
        }
      }

      .hospital-share {
        position: absolute;
        top: 14px;
        right: 1px;
        width: 63px;
        text-align: center;
        border-left: 1px solid #eee;
        box-sizing: border-box;

        img {
          width: 24px;
        }

        p {
          margin-top: 5px;
          ${fontStyleMixin({
            size: 12,
            weight: '600',
            color: $FONT_COLOR
          })}
        }
      }
    }

    ul.tab_title {
      position: relative;
      ${heightMixin(44)};
      padding: 0 15px;
      border-top: 1px solid #eee;
      box-sizing: border-box;

      .faq {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        padding: 0 16px;
        margin-right: 0;
        border-left: 1px solid #eee;
        vertical-align: middle;

        img {
          width: 20px;
          margin-right: 5px;
          vertical-align: middle;
        }

        span {
          ${fontStyleMixin({
          size: 15,
          color: $FONT_COLOR,
          weight: 'bold'
        })};
        }
      }
    }
  }
`;

const DoctalkLinkWrapper = styled.div`
  width: 100%;
  height: 50px;
  padding: 8px 15px;
  background-color: #f9f9f9;
  box-sizing: border-box;
  display: flex;
  align-items: center;

  .doctalk-btn {
    width: 130px;
    height: 34px;
    background-color: #40b044;
    border-radius: 5px; 
  }

  p {
    width: calc(100% - 130px);
    padding-right: 30px;
    display: inline-block;
    vertical-align: middle;
    box-sizing: border-box;
    ${fontStyleMixin({
      size: 11,
      weight: '300'
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

const StyledNoContent = styled(NoContent)`
  height: 76px;
  padding-left: 0;
  margin-top: 5px;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 7px;
  border: 1px solid #eee;
  
  img {
    display: block;
    width: 20px;
    margin: 0 auto 6px;
  }
  
  p {
    ${fontStyleMixin({
      size: 13,
      color: $TEXT_GRAY
    })};
  }
`;

const HospitalBannerDiv = styled.div<{backgroundImg: string}>`
  height: 240px;
  ${({backgroundImg}) => backgroundImgMixin({
    img: backgroundImg,
  })};
  box-sizing: border-box;
`;

const DoctalkLogo = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  width: 168px;
  height: 27px;
  line-height: 27px;
  background-color: #40b044;
  border-radius: 5px;
  text-align: center;
  ${fontStyleMixin({
    size: 11,
    weight: 'bold',
    color: $WHITE
  })};

  img {
    width: 52px;
    margin-right: 2px;
  }
`;

const TabLi = styled.li<{on: boolean;}>`
  display: inline-block;
  margin-right: 15px;

  span {
    display: block;
    text-align: center;
    width: 100%;
    height: 100%;
    ${fontStyleMixin({
      size: 15,
      weight: 'bold',
      color: $TEXT_GRAY
    })};
    box-sizing: border-box;
  }
  
  ${({on}) => on && `
    &:not(.faq) span {
      color: ${$POINT_BLUE};
      text-decoration: underline;
    }

    &.faq {
      background-color: #f9f9f9;
    }
  `}

  &:first-child > a {
    border-left: 0;
  }
`;

const Section = styled.section`
  width: 100%;
  padding-top: 8px;
  box-sizing: border-box;
  background-color: #f6f7f9;
  
  &.fixed {
    margin-top: 126px;
  }

  > div {
    width: 100%;
    max-width: 680px;
    margin: auto;
  }

  .hospital-title-content {
    padding: 15px 10px;
    background-color: ${$WHITE};
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    box-sizing: border-box;

    .hospital-title-info {
      padding-left: 5px;
      box-sizing: border-box;

      li {
        margin-top: 5px;
        ${fontStyleMixin({
          size: 12,
          color: $GRAY
        })};

        &:first-child {
          margin-top: 0;
        }

        img {
          width: 16px;
          margin-right: 7px;
          margin-bottom: -4px;
        }

        a {
          text-decoration: underline;
          ${fontStyleMixin({
            size: 12,
            color: $POINT_BLUE
          })};
        }
      }
    }

    > h3 {
      margin: 23px 0 0 5px;
      ${fontStyleMixin({
        size: 12,
        weight: 'bold',
        color: $GRAY
      })};
    }

    ul.hospital-category {
      width: auto;
      padding: 6px 8px;
      margin-top: 5px;
      border: 1px solid #eee;
      border-radius: 7px;
      box-sizing: border-box;
      display: inline-block;

      li {
        display: inline-block;
        width: 64px;
        height: 64px;
        padding-top: 5px;
        box-sizing: border-box;
        text-align: center;

        &:first-child {
          margin-left: 0;
        }

        img {
          width: 36px;
        }

        p {
          ${fontStyleMixin({
            size: 10,
            color: '#999'
          })};
        }
      }
    }

    .hospital-introduction {
      position: relative;
      padding: 0 5px 0 35px;
      margin-top: 20px;
      box-sizing: border-box;

      p {
        text-align: justify;
        white-space: pre-wrap;
        ${fontStyleMixin({
          size: 14,
          color: $GRAY
        })};

        img {
          position: absolute;
          top: 0;
          left: 5px;
          width: 24px;
        }
      }
    }
  }

  .hospital-info {
    margin-top: 8px;
    background-color: ${$WHITE};
    box-sizing: border-box;

    > ul {
      > li {
        position: relative;
        padding: 16px 15px 20px;
        border-top: 1px solid #eee;
        box-sizing: border-box;

        &:nth-child(4) {
          border-bottom: 1px solid #eee;
        }

        &:nth-child(5) {
          padding: 16px 0;
          border-top: 8px solid #f6f7f9;
          border-bottom: 8px solid #f6f7f9;

          > h3 {
            padding: 0 15px;
            ${heightMixin(21)};
            
            > span {
              display: inline-block;
              float: right;
              font-size: 0;
              vertical-align: middle;
  
              &.toggle {
                img {
                  transform: rotate(180deg);
                }
              }
  
              img {
                width: 15px;
                margin: 0;
              }
            }
          }
        }

        &:last-child {
          border-bottom: 1px solid #eee;
        }

        > h3 {
          ${fontStyleMixin({
            size: 14,
            weight: 'bold',
            color: $FONT_COLOR
          })};

          img {
            width: 24px;
            margin: -3px 6px 0 0;
            vertical-align: middle;
          }
        }

        > p {
          white-space: pre-wrap;
          padding-left: 30px;
          margin-top: 2px;
          ${fontStyleMixin({
            size: 14,
            color: $GRAY
          })};
        }

        > div.work-info-wrapper {
          margin-top: 16px;
          padding: 0 15px;
          border-top: 1px solid ${$WHITE};
        }

        table.schedule-time-list {
          margin: 9px 0 6px 30px;
          border-collapse: separate;
          border-spacing: 1px;
        }

        ${ScheduleTable} {
          border-collapse: separate;
          border-spacing: 1px;
          margin: 8px 0 6px 30px;

          tr {
            padding-bottom: 1px;
            width: 100%;

            th {
              width: 45px;
              ${heightMixin(32)};
              background-color: ${$TEXT_GRAY};
              border: none;
              ${fontStyleMixin({
                size: 14,
                color: $WHITE
              })};

              &.on {
                background-color: #90b0d7;
              }
            }

            td {
              width: 100%;
              height: 32px;
              padding-left: 14px;
              background-color: #f9f9f9;
              ${fontStyleMixin({
                size: 14,
                color: $TEXT_GRAY
              })};

              input {
                width: 55px;
                font-size: 16px;
                border: none;

                &:first-of-type {
                  margin-left: -5px;
                }
              }

              .line {
                width: 6px;
              }
            }
          }
        }

        > span {
          display: inline-block;
          padding-left: 30px;
          margin-top: 2px;
          ${fontStyleMixin({
            size: 14,
            color: $POINT_BLUE
          })};
        }

        .hospital-detail-map {
          width: 100%;
          height: 200px;
        }
      }
    }
  }
`;


export const MENU_LIST = [
  {name: "basicInfo",title: "기본정보"},
  {name: "treatment",title: "진료"},
  {name: "medicalTeam",title:"의료진"},
  {name: "locationMap",title: "위치"},
];

const scrollToRef = (ref, scrollMargin = 0) => {
  if (typeof window !== 'undefined') {
    window.scrollTo(0, ref.current.offsetTop + scrollMargin);
  }
};

const SCROLL_Y_MARGIN = -180;
let count = 0;

const HospitalDetailMobile = React.memo(props => {
  const {
    id,
    is_follow,
    band: {
      name,
      avatar,
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

  const dispatch = useDispatch();
  const router = useRouter();
  const {asPath, query: {slug: _, ...query}} = router;
  const {tab} = query;

  const mainSliderSettings = {
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    touchMove: true,
    className: 'main-slider',
    beforeChange: (_, nextSlide) => setCurrSliderIdx(nextSlide + 1)
  };
  const menuRef = useMultipleRef(MENU_LIST.map(item => item.name));
  const [heightFixed, setHeightFixed] = React.useState(!isEmpty(tab));
  const [toggle, setToggle] = React.useState(false);
  const [currSiderIdx, setCurrSliderIdx] = React.useState(1);
  const [openJobForm, setOpenJobForm] = React.useState(false);
  const [currMenu, setCurrMenu] = React.useState(tab || "basicInfo");

  const {
    history,
    location: {pathname, search} = {},
  } = useLocation();

  const {pathname: fileBasedPath} = router;
  const _window = typeof window === 'undefined' ? {} : window;
  const hasAdminPermission = ADMIN_PERMISSION_GRADE.includes(band_member_grade);

  const {profile, myId, hospital, me} = useSelector(
    ({orm, profile, hospital, system: {session: {id}}}) => ({
      profile,
      myId: id,
      hospital,
      me: (pickUserSelector(id)(orm) || {})
    }),
    shallowEqual
  );

  const myProfile = profile[myId];
  const hasEdu = !isEmpty(myProfile) && !isEmpty(myProfile.edu.ids);

  const mainSliderRef = React.useRef<Slider>();
  const map = React.useRef();

  const _recessDay = {...DEFAULT_DAY_OF_RECESS};

  Object.keys(_recessDay).forEach(day => {
    if (!work_day[`${day}_start_at`] || work_day[`${day}_start_at`] === '휴진') {
      _recessDay[day] = true;
    }
  });

  React.useEffect(() => {
    if(tab && tab !== 'faq') {
      scrollToRef(menuRef[currMenu], SCROLL_Y_MARGIN);
    }
  }, [tab, currMenu])

  React.useEffect(() => {
    if (myId) {
      dispatch(fetchUserHospital(myId));
      dispatch(fetchProfileInfo(myId, 'edu'));
      dispatch(fetchProfileInfo(myId, 'brief'));
      dispatch(fetchProfileInfo(myId, 'thesis'));
    }
  }, [myId]);

  const initMapPosition = React.useCallback((positionX: number, positionY: number) => {
    if(typeof window !== 'undefined') {
      const myaddr = new window.naver.maps.Point(positionX, positionY);

      map.current.setCenter(myaddr);

      new window.naver.maps.Marker({
        position: myaddr,
        map: map.current,
      });
    }
  }, []);

  //map
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
  }, [_window.naver, coordinates, initMapPosition]);

  const bannerImage = (!isEmpty(banners) && !isEmpty(banners[0]) && banners[0].image) || staticUrl('/static/images/banner/img-hospital-default.png');

  return (
    <>
      <OGMetaHead
        title={name}
        image={bannerImage}
      />
      <HospitalTopDiv>
        {(!isEmpty(me) && me.user_type === 'doctor') && (
          <div className="clearfix hospital-working">
            {band_member_grade !== 'visitor' ? (
              <>
                {!me.is_doctalk_doctor && (
                  <DoctalkLinkWrapper>
                    <p>
                      닥톡(doctalk)-<span>NAVER 지식iN</span>&nbsp;<b>한의사</b>로 개인과 한의원을 브랜딩하세요!
                    </p>
                    <DoctalkButton className="doctalk-btn"/>
                  </DoctalkLinkWrapper>
                )}
                <p>
                  <img
                    src={staticUrl('/static/images/icon/icon-hospital-working.png')}
                    alt="재직 중인 한의원"
                  />
                  현재 재직 중인 한의원입니다.
                  {hasAdminPermission && (
                    <Button
                      size={{
                        width: '81px',
                        height: '28px'
                      }}
                      font={{
                        size: '12px',
                        color: $FONT_COLOR
                      }}
                      border={{
                        width: '1px',
                        radius: '6px',
                        color: $BORDER_COLOR
                      }}
                      onClick={() => router.push(`/band/${slug}/edit`)}
                    >
                      한의원 관리
                      <img
                        src={staticUrl('/static/images/icon/arrow/icon-arrow-right4.png')}
                        alt="한의원 관리"
                      />
                    </Button>
                  )}
                </p>
              </>
            ) : (
              <p>
                <img
                  src={staticUrl('/static/images/icon/icon-hospital-not-working.png')}
                  alt="재직 중이지 않은 한의원"
                />
                해당 한의원에 재직 중이신가요?
                <Button
                  size={{
                    width: '92px',
                    height: '28px'
                  }}
                  font={{
                    size: '12px',
                    color: $WHITE
                  }}
                  border={{
                    width: '1px',
                    radius: '6px',
                    color: $BORDER_COLOR
                  }}
                  backgroundColor={$FONT_COLOR}
                  onClick={() => {
                    setToggle(true);
                    setOpenJobForm(true);
                    scrollToRef(menuRef.medicalTeam, SCROLL_Y_MARGIN);
                  }}
                >
                  의료진 등록
                  <img
                    src={staticUrl('/static/images/icon/arrow/icon-arrow-white.png')}
                    alt="한의원 관리"
                  />
                </Button>
              </p>
            )}
          </div>
        )}
        <Waypoint
          topOffset={55}
          onEnter={() => setHeightFixed(false)}
          onLeave={() => setHeightFixed(true)}
        >
          <div className="hospital-banner-wrapper">
            <ReactCustomSlick
              ref={mainSliderRef}
              {...mainSliderSettings}
            >
              {banners && banners.length > 0 ?
                banners.map(({id, image}) => (
                <HospitalBannerDiv
                  key={id}
                  backgroundImg={image}
                />
              )) : (
                  <HospitalBannerDiv
                    key="bannerImage"
                    backgroundImg={bannerImage}
                  />
                )}
            </ReactCustomSlick>
            <span className="current">
              {currSiderIdx} /{banners.length}
            </span>
            {has_doctalk_doctor && (
              <DoctalkLogo>
                <img
                  src={staticUrl('/static/images/logo/img-doctalk-logo.png')}
                  alt="닥톡 로고"
                />
                네이버 지식iN 한의사
              </DoctalkLogo>
            )}
          </div>
        </Waypoint>
        <div className={cn('hospital-top', {fixed: heightFixed})}>
          <div>
             <h2>{name}</h2>
            <ul className={cn('tag-list', {ellipsis: heightFixed})}>
              {tags && tags.map(({tag:{id, name, is_follow}}) => (
                <li key={id}>
                  <Tag
                    id={id}
                    name={name}
                    highlighted={is_follow}
                    is_follow={is_follow}
                  />
                </li>
              ))}
            </ul>
            <div
              className="hospital-share"
              onClick={() => dispatch(pushPopup(UrlPopup, {url:`https://www.haniplanet.com${asPath}`}))}
            >
              <img
                src={staticUrl('/static/images/icon/icon-share.png')}
                alt="공유하기"
              />
              <p>공유</p>
            </div>
          </div>
          <ul className="tab_title">
            {MENU_LIST.map(({name, title}) => (
              <TabLi
                className="pointer"
                on={name === currMenu}
                onClick={() => {
                  if(tab && tab === 'faq') {
                    router.replace({
                      pathname,
                      query: {
                        ...query,
                        tab: name
                      }
                    });
                  } else {
                    setCurrMenu(name);
                    scrollToRef(menuRef[name], SCROLL_Y_MARGIN);
                  }
                }}
              >
                <span>{title}</span>
              </TabLi>
            ))}
            <TabLi
              className="faq"
              on={currMenu === 'faq'}
              onClick={() => {
                router.replace({
                  pathname,
                  query: {
                    ...query,
                    tab: 'faq'
                  }
                });
              }}
            >
              <span>
                <img 
                  src={staticUrl('/static/images/icon/icon-doctalk-qna.png')}
                  alt="faq"
                />
                FAQ
              </span>
            </TabLi>
          </ul>
        </div>
      </HospitalTopDiv>
      {(tab && tab === 'faq') ? (
        <HospitalFaq members={members}/>
      ) : (
        <Section className={cn({fixed: heightFixed})}>
          <div>
            <Waypoint
              topOffset={183}
              onEnter={({currentPosition}) => {
                currentPosition === 'inside' && setCurrMenu('basicInfo');
              }}
            >
              <div className="hospital-title-content">
                <ul className="hospital-title-info">
                  <li ref={menuRef.basicInfo}>
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
                <h3>
                  대표분야
                </h3>
                {isEmpty(categories) ? (
                  <StyledNoContent>
                    <img
                      src={staticUrl('/static/images/icon/icon-nocontent-medical-field.png')}
                      alt="선택된 대표분야가 없습니다."
                    />
                    선택된 대표분야가 없습니다.
                  </StyledNoContent>
                ) : (
                  <ul className="hospital-category">
                    {categories.map(({category:{id, name, icons}}) => {
                      const {normal} = filterCategoryIcons(icons);

                      return (
                        <li
                          key={id}
                        >
                          <img
                            src={normal}
                            alt={name}
                          />
                          <p>{name}</p>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <div className="hospital-introduction">
                  <p>
                    <img
                      src={staticUrl('/static/images/icon/icon-hospital-introduction.png')}
                      alt="인사말"
                    />
                    {body}
                  </p>
                </div>
              </div>
            </Waypoint>
            <div
              className="hospital-info"
              ref={menuRef.treatment}
            >
              <ul>
                <Waypoint
                  topOffset={-245}
                  bottomOffset={870}
                  onEnter={({currentPosition}) => {
                    currentPosition === 'inside' && setCurrMenu('treatment');
                  }}
                >
                  <li>
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
                </Waypoint>
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
                  <HospitalTimeTable
                    workDayObj={work_day}
                    isEdit={false}
                    recessDay={_recessDay}
                  />
                  <p>
                    {no_accept_text}
                  </p>
                </li>
                <li>
                  <h3>
                    <img
                      src={staticUrl('/static/images/icon/check/icon-hospital-reservation.png')}
                      alt="예약안내"
                    />
                    예약 및 안내
                  </h3>
                  <p>
                    {reservation_text}<br/>
                    {etc}
                  </p>
                </li>
                <Waypoint
                  bottomOffset={870}
                  onEnter={({currentPosition}) => {
                    currentPosition === 'inside' && setCurrMenu('medicalTeam');
                  }}
                >
                  <li
                    className="clearfix"
                    ref={menuRef.medicalTeam}
                  >
                    <HospitalMedicalTeam
                      members={members}
                      isJobFormOpened={openJobForm}
                      band={{slug, id}}
                      band_member_grade={band_member_grade}
                      hasAdminPermission={hasAdminPermission}
                    />
                  </li>
                </Waypoint>
                <Waypoint
                  bottomOffset={870}
                  onEnter={({currentPosition}) => {
                    currentPosition === 'inside' && setCurrMenu('locationMap');
                  }}
                  onLeave={() => {
                    setCurrMenu('medicalTeam');
                  }}
                >
                  <li ref={menuRef.locationMap}>
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
                </Waypoint>
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
                  <div id="map" className="hospital-detail-map"/>
                </li>
              </ul>
            </div>
          </div>
        </Section>
      )}
    </>
  );
});

HospitalDetailMobile.displayName = 'HospitalDetailMobile';

export default HospitalDetailMobile;
