import * as React from 'react';
import {staticUrl} from '../../src/constants/env';
import Link from 'next/link';
import styled from 'styled-components';
import {fontStyleMixin, backgroundImgMixin, radiusMixin} from '../../styles/mixins.styles';
import {$TEXT_GRAY, $POINT_BLUE, $BORDER_COLOR, $WHITE, $FONT_COLOR, $GRAY} from '../../styles/variables.types';
import Button from '../../components/inputs/Button/ButtonDynamic';
import {IMedicalFieldPayload} from '../../src/reducers/medicalField';
import {useDispatch} from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import HospitalSearchInput from '../../components/hospital/HospitalSearchInput';
import {pushPopup} from '../../src/reducers/popup';
import HospitalSetupPopup from '../../components/layout/popup/HospitalSetupPopup';
import Loading from '../../components/common/Loading';
import SimplePaginator from '../../components/dict/SimplePaginator';
import cn from 'classnames';
import {filterCategoryIcons} from '../../src/lib/hospital';
import useHospitalSearch from '../../src/hooks/hospital/useHospitalSearch';

const SEARCH_INPUT_HEIGHT = 50;

const Div = styled.div`
  position: relative;
  width: 100%;
  height: calc(100vh - 55px);
  overflow: hidden;

  .search-container {
    position: fixed;
    z-index: 1;
    width: 100%;

    .search-hospital-input {
      width: 100%;
      height: ${SEARCH_INPUT_HEIGHT}px;
      padding: 0 37px;
      box-sizing: border-box;
      background-color: ${$WHITE};
      border-radius: 0;
      border: 0;
      border-bottom: 1px solid ${$BORDER_COLOR};
  
      .input {
        ${fontStyleMixin({
          size: 14
        })};
  
        ::placeholder {
          ${fontStyleMixin({
            size: 14,
            color: $TEXT_GRAY
          })};
        }
      }
  
      .button {
        position: absolute;
        top: 0;
        right: 0;
      }
  
      img {
        position: absolute;
        top: calc(50% - 10px);
        left: 14px;
        width: 20px;
      }
    }

    ul.filter-btn-group {
      position: absolute;
      z-index: 20;
      bottom: -43px;
      right: 7px;

      li {
        display: inline-block;
        margin-left: 4px;

        .button {
          box-shadow: 0 2px 5px  rgba(0, 0, 0, 0.2);
    
          img {
            width: 17px;
            margin: 0 2px -3px 0;
          }
        }
      }
    } 
  }

  .map-list-wrapper {
    height: calc(100vh - ${SEARCH_INPUT_HEIGHT}px);
    overflow: hidden;
    transform: translateY(50px);
  }
`;

const HospitalMap = styled.div`
  width: 100%;
  height: 100vh;
  transition: 0.3s;
`;

const HospitalListDiv = styled.div`
  position: fixed;
  z-index: 100;
  width: 100%;
  height: calc(100% - 211px);
  bottom: 0;
  padding-bottom: 20px;
  background-color: ${$WHITE};
  border-radius: 16px 16px 0 0;
  box-sizing: border-box;
  transition: 0.3s;
  transform: translateY(0);

  &.folded {
    transform: translateY(calc(100% - 100px));
  }

  &.touched {
    transform: translateY(calc(100% - 205px));
  }

  div.top-text {
    padding: 8px 15px 15px;

    > span {
      display: block;
      width: 30px;
      height: 4px;
      margin: 0 auto 6px;
      ${radiusMixin('2px', '#eee')};
      background-color: #ecedef;
    }

    > h3 {
      ${fontStyleMixin({
        size: 12,
        weight: 'bold',
        color: $FONT_COLOR
      })};
  
      p {
        position: relative;
        display: inline-block;
        margin-left: 16px;
        ${fontStyleMixin({
          size: 12,
          weight: 'bold',
          color: $FONT_COLOR
        })};
  
        &::before {
          content: '';
          position: absolute;
          top: 50%;
          left: -8px;
          width: 1px;
          height: 9px;
          margin-top: -4px;
          background-color: ${$BORDER_COLOR};
        }
  
        span {
          ${fontStyleMixin({
            size: 13,
            weight: '600',
            color: $POINT_BLUE,
            family: 'Montserrat'
          })};

          &.count-null {
            color: ${$TEXT_GRAY};
          }
        }
      }
    }

    > p {
      margin-top: -2px;
      text-align: center;
      ${fontStyleMixin({
        size: 12,
        weight: 'bold',
        color: $TEXT_GRAY
      })};
    }
  }

  > div.list-wrapper {
    height: 100%;
    overflow-y: hidden;

    &.default {
      overflow-y: auto;
    }

    > ul.hospital-list {
      max-width: 680px;
      margin: 0 auto;
      padding: 0 15px;
    }

    div.hospital-paginator {
      padding: 5px 0 100px;
  
      ul {
        li {
          &.paginate-btn {
            border: 1px solid ${$BORDER_COLOR};
          }

          a {
            ${fontStyleMixin({
              size: 12,
              weight: '600',
              family: 'Montserrat',
              color: $TEXT_GRAY
            })};
          }
    
          &.on {
            border: none;

            a {
              position: relative;
              color: ${$FONT_COLOR};
      
              &:after {
                content: '';
                position: absolute;
                bottom: 5px;
                left: 1px;
                width: 13px;
                border-width: 0 0 1px;
                border-style: solid;
              }
            }
          }
        }
      }
    }
  }
`;

const HospitalNoContentText = styled.div`
  height: 100%;
  padding-top: 50px;
  box-sizing: border-box;
  overflow-y: auto;

  > img {
    display: block;
    margin: 0 auto 10px;
    width: 65px;
  }

  > p {
    text-align: center;
    line-height: 23px;
    margin-bottom: 200px;
    ${fontStyleMixin({
      size: 14,
      weight: 'normal',
      color: $TEXT_GRAY,
    })};
  }
`;

const SearchedHospitalLi = styled.li<Pick<ISearchedHospitalCompProps, 'avatar'>>`
  margin-bottom: 14px;

  a {
    position: relative;
    display: block;
    width: 100%;
    height: 88px;

    .hospital-img {
      display: inline-block;
      width: 100px;
      height: 88px;
      border: 1px solid #eee;
      box-sizing: border-box;
      vertical-align: top;
      ${({avatar}) => backgroundImgMixin({
        img: staticUrl(avatar || '/static/images/banner/img-hospital-default.png')
      })};
    }

    div:not(.hospital-img) {
      position: relative;
      display: inline-block;
      width: calc(100% - 100px);
      height: 88px;
      padding: 0 10px 0 12px;
      box-sizing: border-box;
      vertical-align: top;

      h3 {
        ${fontStyleMixin({
          size: 17,
          weight: '600',
          color: '#000'
        })};
      }
      
      p {
        ${fontStyleMixin({
          size: 12,
          color: '#999'
        })};
      }

      ul {
        position: absolute;
        bottom: 4px;
        left: 13px;

        li {
          display: inline-block;
          width: 28px;
          height: 28px;
          line-height: 24px;
          margin-right: 5px;
          ${radiusMixin('7px', $BORDER_COLOR)};
          text-align: center;

          img {
            width: 22px;
            vertical-align: middle;
          }
        }
      }
    }

    > img {
      position: absolute;
      top: 0;
      right: 0;
      width: 7px;
    }
  }
`;

interface ICategory {
  category: IMedicalFieldPayload & {
    is_filtered: boolean;
  }
}

interface ISearchedHospitalCompProps {
  slug: string;
  name: string;
  address: string;
  avatar: string;
  categories: ICategory[];
  listRefs: React.RefObject<HTMLLIElement>;
}

const SearchedHospitalComp = React.memo<ISearchedHospitalCompProps>(({
  slug,
  name,
  address,
  avatar,
  categories,
  listRefs
}) => (
  <SearchedHospitalLi
    avatar={avatar}
    ref={r => {
      if (r !== null) {
        listRefs[slug] = r;
      }
    }}
  >
    <Link
      href="/band/[slug]"
      as={`/band/${slug}`}
    >
      <a target="_blank">
        <div className="hospital-img"/>
        <div>
          <h3 className="ellipsis">{name}</h3>
          <p>{address}</p>
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
        <img
          src={staticUrl('/static/images/icon/arrow/icon-hospital-shortcut.png')}
          alt="한의원 바로가기"
        />
      </a>
    </Link>
  </SearchedHospitalLi>
));

const PAGINATE_SIZE = 20;
const PAGINATE_GROUP_SIZE = 5;

const SearchHospital = React.memo(() => {
  const dispatch = useDispatch();

  const {
    searchHospital,
    routerQuery,
    type,
    setType,
    searchedCount,
    searchedHospitals,
    listContainerRef,
    listRefs,
    pending
  } = useHospitalSearch();

  return (
    <Div>
      <div className="search-container">
        <HospitalSearchInput
          className="search-hospital-input"
          onSearch={searchHospital}
          onSelect={searchHospital}
          initialKeyword={routerQuery.q as string} 
        />
        <ul className="filter-btn-group">
          <li>
            <Button
              size={{
                width: '96px',
                height: '35px'
              }}
              font={{
                size: '14px',
                weight: '600',
                color: $GRAY
              }}
              border={{
                radius: '18px'
              }}
              backgroundColor={$WHITE}
              onClick={() => dispatch(
                pushPopup(HospitalSetupPopup)
              )}
            >
              <img
                src={staticUrl('/static/images/icon/icon-filter.png')}
                alt="조건 설정"
              />
              조건 설정
            </Button>
          </li>
        </ul>
      </div>

      <div className="map-list-wrapper">
        <HospitalMap id="map"/>
        <HospitalListDiv
          className={cn({
            folded: type === 'FOLD',
            touched: type === 'TOUCH_PIN'
          })}
        >
          <div
            className="top-text pointer"
            onClick={() => setType(curr => curr === 'DEFAULT'
              ? 'FOLD'
              : 'DEFAULT'
            )}
          >
            <span/>
            {type === 'FOLD' ? (
              <p>
                목록보기
              </p>
            ) : (
              <h3>
                검색결과
                <p>
                  <span
                    className={cn({
                      'count-null': searchedCount === 0
                    })}
                  >
                    {searchedCount}
                  </span>
                  개의 한의원
                </p>
              </h3>
            )}
          </div>
          {pending ? (
            <Loading/>
          ) : (
            !isEmpty(searchedHospitals) ? (
              <div
                className={cn('list-wrapper', {
                  default: type === 'DEFAULT'
                })}
                ref={listContainerRef}
              >
                <ul className="hospital-list">
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
                      address={address}
                      categories={categories}
                      avatar={avatar}
                      listRefs={listRefs as React.RefObject<HTMLLIElement>}
                    />
                  ))}
                </ul>
                <SimplePaginator
                  className="hospital-paginator"
                  currentPage={parseInt(routerQuery.page as string, 10) || 1}
                  pageSize={PAGINATE_SIZE}
                  totalCount={searchedCount}
                  pageGroupSize={PAGINATE_GROUP_SIZE}
                  prefixZero
                  generateTo={page => ({
                    href: '',
                    onClick: () => searchHospital({
                      ...routerQuery,
                      page
                    })
                  })}
                />
              </div>
            ) : (
              <HospitalNoContentText>
                <img
                  src={staticUrl('/static/images/icon/icon-hospital-null.png')}
                  alt="작성된 글이 없습니다."
                />
                <p>
                  해당 조건에 일치하는 한의원이 없습니다.<br />
                  검색 조건을 다시 설정해주세요.
                </p>
              </HospitalNoContentText>
            )
          )}
        </HospitalListDiv>
      </div>
    </Div>
  );
});

SearchHospital.displayName = 'SearchHospital';
export default SearchHospital;
