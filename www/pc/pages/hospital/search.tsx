import React from 'react';
import cn from 'classnames';
import {staticUrl} from '../../src/constants/env';
import styled, {css, keyframes} from 'styled-components';
import {fontStyleMixin, backgroundImgMixin, radiusMixin, heightMixin} from '../../styles/mixins.styles';
import {$TEXT_GRAY, $POINT_BLUE, $BORDER_COLOR, $WHITE, $FONT_COLOR} from '../../styles/variables.types';
import {numberWithCommas} from '../../src/lib/numbers';
import Button from '../../components/inputs/Button';
import HospitalRegionSelect from '../../components/hospital/HospitalRegionSelect';
import HospitalMedicalFieldSelect from '../../components/hospital/HospitalMedicalFieldSelect';
import {LinkOverActionWrapper as HospitalItemWrapper} from '../../components/UI/OverAction';
import HospitalSearchInput from '../../components/hospital/HospitalSearchInput';
import isEmpty from 'lodash/isEmpty';
import Loading from '../../components/common/Loading';
import OGMetaHead from '../../components/OGMetaHead';
import useHospitalSearch, {ICategory} from '../../src/hooks/hospital/useHospitalSearch';
import {filterCategoryIcons} from '../../src/lib/hospital';
import useSetFooter from '../../src/hooks/useSetFooter';
import Pagination from '../../components/UI/Pagination';

const Div = styled.div`
  position: relative;
  width: 100%;
  height: calc(100vh - 120px);
  box-sizing: border-box;

  .left-hospital-list {
    position: relative;
    display: inline-block;
    width: 970px;
    height: 100%;
    padding: 17px 0 27px 35px;
    background-color: ${$WHITE};
    box-sizing: border-box;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
    vertical-align: top;

    &.spread {
      width: 556px;

      .hospital-list-div {
        > ul {
          margin-bottom: 40px;
        }
      }
    }

    .list-top {
      position: relative;
      padding-bottom: 16px;
      margin-right: 35px;
      border-bottom: 1px solid ${$BORDER_COLOR};
      box-sizing: border-box;

      h2 {
        margin-bottom: 8px;
        ${fontStyleMixin({
          size: 14,
          weight: 'bold',
        })};
  
        span {
          ${fontStyleMixin({
            size: 14,
            weight: 'bold',
            color: $POINT_BLUE
          })};
        }
      }

      .hospital-search-input {
        margin-bottom: 6px;

        & + ul {
          width: 100%;
          top: auto;
        }
      }
  
      .search-category {
        position: relative;
        display: inline-block;
        margin-left: 6px;
  
        &:nth-of-type(2) {
          margin-left: 0;
        }

        &:last-of-type {
          margin-left: 10px;
        }

        > button p {
          max-width: 162px;
          display: inline-block;
          vertical-align: top;
        }

        .select-area {
          .buttons {
            top: 254px;
          }
        }
      }
    }
  }

  .right-map-container {
    display: inline-block;
    width: calc(100% - 970px);
    height: 100%;
    vertical-align: top;

    &.spread {
      width: calc(100% - 556px);
    }

    #map {
      width: 100%;
      height: 100%;

      .marker-info-box {
        position: absolute;
        bottom: 22px;
        right: 50%;
        width: auto;
        padding: 0 12px;
        background-color: ${$WHITE};
        ${radiusMixin('7px', $FONT_COLOR)};
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2);
        transform: translateX(50%);
        overflow: hidden;
        ${props => props && css`
          animation: ${MarkerDivAni} 0.5s forwards;
        `};

        h3 {
          padding-top: 8px;
          white-space: nowrap;
          ${fontStyleMixin({
            size: 15,
            weight: '600'
          })};
          ${props => props && css`
            animation: ${MarkerH3Ani} 0.4s forwards;
          `};
        }

        ul {
          margin: 4px 0 10px;
          text-align: left;
          white-space: nowrap;
          ${props => props && css`
            animation: ${MarkerUlAni} 0.4s forwards;
          `};
    
          li {
            display: inline-block;
            width: 28px;
            ${heightMixin(28)};
            margin-right: 2px;
            text-align: center;
            ${radiusMixin('7px', '#eee')};
            box-sizing: border-box;
            
      
            &:last-child {
              margin-right: 0;
            }
      
            img {
              vertical-align: top;
              padding-top: 2px;
              width: 22px;
            }
          }
        }
      }
    }
  }
`;

const MarkerDivAni = keyframes`
  from {
    max-width: 0;
    max-height: 0;
  }

  to {
    max-width: 300px;
    max-height: 72px;
  }
`;

const MarkerH3Ani = keyframes`
  from {
    transform: translateY(20px);
  }

  to {
    transform: translateY(0);
  }
`;

const MarkerUlAni = keyframes`
  from {
    transform: translateY(20px);
  }

  to {
    transform: translateY(0);
  }
`;

const CategorySelectBox = styled.button<{isMapExpanded: boolean;}>`
  width: ${({isMapExpanded}) => isMapExpanded
    ? '195px'
    : '240px'
  };
  ${heightMixin(44)};
  padding-left: 14px;
  ${radiusMixin('7px', $BORDER_COLOR)};
  text-align: left;
  ${backgroundImgMixin({
    img: staticUrl('/static/images/icon/arrow/icon-story-select-arrow.png'),
    size: '11px',
    position: '95%'
  })};
  ${fontStyleMixin({
    size: 16,
    color: $TEXT_GRAY
  })};
  overflow: hidden;

  &.on {
    background-color: #f9f9f9;
  }

  img {
    width: 20px;
    margin-bottom: -4px;
    margin-right: 6px;
  }
`;

const HospitalListDiv = styled.div`
  height: calc(100% - 110px);
  padding-top: 16px;
  box-sizing: border-box;
  overflow-y: auto;

  div.hospital-paginator {
    margin: 0 0 90px;

    ul > li {
      border: 0 !important;

      &.on > a {
        position: relative;
        color: ${$FONT_COLOR};

        &:after {
          content: '';
          position: absolute;
          width: 18px;
          left: 4px;
          bottom: 5px;
          border-width: 0 0 1px;
          border-style: solid;
        }
      }
    }
  }
`;

const HospitalNoContentText = styled.p`
  padding: 140px 0 630px;
  box-sizing: border-box;
  text-align: center;
  line-height: 23px;
  ${fontStyleMixin({
    size: 14,
    color: $TEXT_GRAY,
  })};

  img {
    display: block;
    margin: 0 auto 10px;
    width: 65px;
  }
`;

const MapSpreadButton = styled(Button)`
  position: absolute;
  top: 15px;
  right: -145px;
  z-index: 10;

  &:hover {
    background-color: #3e4246;
  }

  img {
    width: 15px;
    margin-right: 6px;
    vertical-align: middle;
  }
`;

const SearchedHospitalLi = styled.li<Pick<ISearchedHospitalCompProps, 'avatar'>>`
  display: inline-block;
  vertical-align: top;
  width: 210px;
  margin: 0 20px 31px 0;

  &:nth-child(4n) {
    margin-right: 0;
  }

  &.spread {
    display: block;
    width: auto;
    margin: 0 0 17px 0;

    a {
      height: auto;
      
      div.hospital-img-wrapper {
        display: inline-block;
      }

      div.info {
        display: inline-block;
        width: 261px;
        padding: 0 0 0 15px;
        vertical-align: top;
      }

      div.see-more {
        right: 40px;
        bottom: 6px;
      }
    }
  }

  &.highlighted {
    a > div.info {
      h3, p {
        text-decoration: underline;
      }
    }

    .hospital-img-wrapper {
      box-shadow: 2px 4px 13px 0 rgba(0, 0, 0, 0.4);

      &::after {
        display: none;
      }

      .hospital-img {
        background-color: transparent;

        img.select-marker-img {
          display: inherit;
        }
      }
    }

    .see-more {
      &::after {
        width: 100%;
      }

      span {
        opacity: 1;
      }

      i {
        ${backgroundImgMixin({
          img: '/static/images/icon/icon-pick-more2.png',
        })};
      }
    }
  }

  > div a {
    div.hospital-img-wrapper {
      position: relative;
      width: 210px;
      height: 138px;
      border-radius: 6px;
      overflow: hidden;

      div.hospital-img {
        width: 100%;
        height: 100%;
        background-blend-mode: multiply;
        transition: 0.3s;
        ${({avatar}) => backgroundImgMixin({
          img: staticUrl(avatar || '/static/images/banner/img-hospital-default.png'),
          color: 'rgba(0, 0, 0, 0.3)',
          size: '100%'
        })};
  
        img.select-marker-img {
          width: 44px;
          display: none;
        }
  
        @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
          background-color: transparent;
  
          &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #000;
            opacity: 0.3;
          }
        }
  
        &:hover {
          box-shadow: 2px 4px 13px 0 rgba(0, 0, 0, 0.4);
          transform: scale(1.08);
        }
      }

      ul {
        position: absolute;
        z-index: 1;
        bottom: 9px;
        right: 0;
        padding-right: 10px;

        li {
          display: inline-block;
          width: 28px;
          height: 28px;
          padding-top: 3px;
          margin-left: 4px;
          border-radius: 7px;
          box-sizing: border-box;
          background-color: rgba(255, 255, 255, 0.8);
          text-align: center;

          img {
            width: 22px;
          }
        }
      }
    }

    div.info {
      padding: 11px 0 22px 0;

      h3 {
        margin-bottom: 1px;
        ${fontStyleMixin({
          size: 17,
          weight: '600',
        })};
      }

      p {
        ${fontStyleMixin({
          size: 13,
          color: '#999',
        })};
      }
    }
  }
`;

interface ISearchedHospitalCompProps {
  isMapExpanded: boolean;
  slug: string;
  name: string;
  address: string;
  avatar: string;
  isHighlighted: boolean;
  categories: ICategory[];
  listRefs: React.RefObject<HTMLLIElement>;
}

const SearchedHospitalComp = React.memo<ISearchedHospitalCompProps>(({
  isMapExpanded,
  slug,
  name,
  address,
  avatar,
  isHighlighted,
  categories,
  listRefs
}) => (
  <SearchedHospitalLi
    avatar={avatar}
    className={cn({
      spread: isMapExpanded,
      highlighted: isHighlighted
    })}
    ref={r => {
      if (r !== null) {
        listRefs[slug] = r;
      }
    }}
  >
    <HospitalItemWrapper
      href="/band/[slug]"
      as={`/band/${slug}`}
      text="자세히 보러가기"
    >
      <div className="hospital-img-wrapper">
        <div className="hospital-img">
          <img
            className="select-marker-img"
            src={staticUrl('/static/images/icon/icon-select-marker.png')}
            alt="선택된 한의원"
          />
        </div>
        <ul>
          {categories.map(({category: {
            id,
            is_filtered,
            icons,
            name
          }}, index) => {
            const {
              normal,
              blue
            } = filterCategoryIcons(icons);

            return (
              <li key={`${id}-${index}`}>
                <img
                  src={is_filtered
                    ? blue
                    : normal
                  }
                  alt={name}
                />
              </li>
            );
          })}
        </ul>
      </div>
      <div className="info">
        <h3>{name}</h3>
        <p>{address}</p>
      </div>    
    </HospitalItemWrapper>
  </SearchedHospitalLi>
));

const PAGINATE_SIZE = 20;
const PAGINATE_GROUP_SIZE = 10;

const SearchHospital = React.memo(() => {
  const {
    pending,
    isMapExpanded,
    setIsMapExpanded,
    searchedCount,
    searchHospital,
    routerQuery,
    isSelectingRegion,
    setIsSelectingRegion,
    selectedRegionName,
    onFilterRegion,
    regions,
    isSelectingCategory,
    setIsSelectingCategory,
    selectedCategoryName,
    onFilterCategory,
    categories,
    setRegions,
    setCategories,
    searchedHospitals,
    highlightedHospital,
    mapContainerRef,
    listRefs,
    listContainerRef
  } = useHospitalSearch();

  // Custom Hook
  useSetFooter(false);

  return (
    <Div>
      <OGMetaHead title="한의원 검색 결과"/>
      <div className={cn('left-hospital-list', 'clearfix', {
        spread: isMapExpanded
      })}>
        <div className="list-top">
          <h2>
            검색 결과&nbsp;
            <span>{numberWithCommas(searchedCount)}개</span>의 한의원
          </h2>
          <HospitalSearchInput
            className="hospital-search-input"
            onSearch={data => {
              searchHospital(data);

              setCategories([]);
              setRegions({
                major: '',
                sub: []
              });
            }}
            onSelect={data => {
              searchHospital(data);

              setCategories([]);
              setRegions({
                major: '',
                sub: []
              });
            }}
            initialKeyword={routerQuery.q as string} 
          />
          <div className="search-category">
            <CategorySelectBox
              type="button"
              className={cn('pointer', {
                on: isSelectingRegion
              })}
              isMapExpanded={isMapExpanded}
              onClick={() => {
                if (isSelectingCategory) {
                  setIsSelectingCategory(false);
                }

                setIsSelectingRegion(curr => !curr)
              }}
            >
              <img
                src={staticUrl('/static/images/icon/icon-location-gray.png')}
                alt="지역 선택"
              />
              {/* 검색 시 보여지는 지역 선텍 텍스트 */}
              {selectedRegionName ? (
                <p className="ellipsis">{selectedRegionName}</p>
              ) : '지역 선택'}
            </CategorySelectBox>
            {isSelectingRegion && (
              <HospitalRegionSelect
                onApply={onFilterRegion}
                regions={regions}
              />
            )}
          </div>
          <div className="search-category">
            <CategorySelectBox
              type="button"
              className={cn('pointer', {
                on: isSelectingCategory
              })}
              isMapExpanded={isMapExpanded}
              onClick={() => {
                if (isSelectingRegion) {
                  setIsSelectingRegion(false);
                }

                setIsSelectingCategory(curr => !curr)
              }}
            >
              <img
                src={staticUrl('/static/images/icon/icon-star-gray.png')}
                alt="진료분야 선택"
              />
              {/* 검색 시 보여지는 진료 분야 텍스트 */}
              {selectedCategoryName ? (
                <p className="ellipsis">{selectedCategoryName}</p>
              ) : '진료분야 선택'}
            </CategorySelectBox>
            {isSelectingCategory && (
              <HospitalMedicalFieldSelect
                onApply={onFilterCategory}
                categories={categories}
              />
            )}
          </div>
          <div className="search-category">
            <Button
              size={{
                width: '78px',
                height: '28px'
              }}
              font={{
                size: '12px',
                color: '#999'
              }}
              border={{
                radius: '0',
                width: '1px',
                color: $BORDER_COLOR
              }}
              backgroundColor="#f6f7f9"
              onClick={() => {
                setRegions({
                  major: '',
                  sub: []
                });
                setCategories([]);
              }}
            >
              필터 초기화
            </Button>
          </div>
        </div>
        <HospitalListDiv
          className="hospital-list-div"
          ref={listContainerRef}
        >
          {pending ? (
            <Loading/>
          ) : (
            !isEmpty(searchedHospitals) ? (
              <>
                <ul>
                  {searchedHospitals.map(({
                    name,
                    slug,
                    avatar,
                    extension: {
                      address
                    },
                    categories
                  }) => (
                    <SearchedHospitalComp
                      key={slug}
                      name={name}
                      slug={slug}
                      avatar={avatar}
                      address={address}
                      isMapExpanded={isMapExpanded}
                      isHighlighted={highlightedHospital === name}
                      categories={categories}
                      listRefs={listRefs as React.RefObject<HTMLLIElement>}
                    />
                  ))}
                </ul>
                <Pagination
                  className="hospital-paginator"
                  currentPage={parseInt(routerQuery.page as string, 10) || 1}
                  pageSize={PAGINATE_SIZE}
                  totalCount={searchedCount}
                  pageGroupSize={PAGINATE_GROUP_SIZE}
                  prefixZero
                  onClick={page => searchHospital({
                    ...routerQuery,
                    page
                  })}
                />
              </>
            ) : (
              <HospitalNoContentText>
                <img
                  src={staticUrl('/static/images/icon/icon-hospital-null.png')}
                  alt="작성된 글이 없습니다."
                />
                해당 조건에 일치하는 한의원이 없습니다.<br/>
                검색 조건을 다시 설정해주세요.
              </HospitalNoContentText>
            )
          )}
        </HospitalListDiv>
        <MapSpreadButton
          size={{
            width: '130px',
            height: '42px'
          }}
          font={{
            size: '14px',
            color: $WHITE 
          }}
          backgroundColor={$FONT_COLOR}
          onClick={() => setIsMapExpanded(curr => !curr)}
        >
          <img
            src={staticUrl(isMapExpanded
              ? '/static/images/icon/icon-map-shrink.png'
              : '/static/images/icon/icon-map-spread.png'
            )}
            alt={`지도 ${isMapExpanded ? '접어' : '펼쳐'}보기`}
          />
          지도 {isMapExpanded ? '접어' : '펼쳐'}보기
        </MapSpreadButton>
      </div>
      <div
        ref={mapContainerRef}
        className={cn('right-map-container', {
          spread: isMapExpanded
        })}
      >
        <div id="map"/>
      </div>
    </Div>
  );
});

SearchHospital.displayName = 'SearchHospital';
export default SearchHospital;
