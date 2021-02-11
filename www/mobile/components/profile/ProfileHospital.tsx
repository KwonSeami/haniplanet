import * as React from 'react';
import styled from 'styled-components';
import {$BORDER_COLOR, $WHITE, $FONT_COLOR, $POINT_BLUE} from '../../styles/variables.types';
import isEmpty from 'lodash/isEmpty';
import {staticUrl} from '../../src/constants/env';
import {fontStyleMixin, backgroundImgMixin} from '../../styles/mixins.styles';
import NoContentText from './style/NoContentText';
import Loading from '../common/Loading';
import StyledButton from './style/StyledButton';
import SearchBaseInput from '../inputs/Input/SearchBaseInput';
import AutoCompleteList from '../AutocompleteList/index';
import useProfileHospital from './hooks/useProfileHospital';
import ProfileHospitalItem2 from './ProfileHospitalItem2';
import ProfileHospitalItem from './ProfileHospitalItem';
import Pagination from '../UI/Pagination';
import {ISearchParam} from '../../src/@types/search';
import queryString from "query-string";

const StyledPagination = styled(Pagination)`
  padding: 30px 0 36px;
  
  ul {
    margin: 0;
  }
`;

const HospitalDiv = styled.div`
  max-width: 680px;
  margin: auto;
  padding: 15px 0 100px;

  .search-input-wrapper {
    position: relative;
    margin-bottom: 15px;
  }

  .search-result {
    text-align: center;
    margin-top: 14px;

    & > h2 {
      text-align: left;
      padding: 12px 0 3px 0;
      position: relative;
      ${fontStyleMixin({
        size: 14,
        weight: 'bold'
      })}

      &::before {
        content:'';
        width: calc(100% + 30px);
        height: 1px;
        position: absolute;
        top: 0;
        left: -15px;
        background-color: ${$BORDER_COLOR};
      }
    }

    .search-complete {

      .hospital-list {
        margin-top: -1px;
        text-align: left;
        padding-top: 0;
      }
    }

    .search-null {
      padding: 56px 0;

      img {
        width: 65px;
        height: 65px;
        margin-bottom: 5px;
      }

      p {
        font-size: 15px;
        line-height: 27px;

        span {
          width: 135px;
          display: inline-block;
          text-decoration: underline;
          ${fontStyleMixin({
            size: 14,
            weight: '600',
            color: $POINT_BLUE,
          })}
          ${backgroundImgMixin({
            img: staticUrl('/static/images/icon/arrow/icon-blue-shortcuts.png'),
            size: '12px',
            position: 'right 0 center'
          })}
        }
      }
    }
  }

  .working-hospital {

    & > h2 {
      text-align: left;
      padding: 21px 0 12px 0;
      position: relative;
      ${fontStyleMixin({
        size: 14,
        weight: 'bold'
      })}

      &::before {
        content:'';
        width: calc(100% + 30px);
        height: 8px;
        position: absolute;
        top: 0;
        left: -15px;
        background-color: #f6f7f9;
      }
    }

    div {

      .working-hospital-list {
        margin-top: -1px;
        text-align: left;
        border-top: none;

        & > li {
          position: relative;
          margin-bottom: 22px;

          &:last-child {
            margin-bottom: 0;
          }

          &::after {
            content: '';
            width: calc(100% + 30px);
            height: 8px;
            position: absolute;
            bottom: -8px;
            left: -15px;
            background-color: #f6f7f9;
          }

          & > span {
            display: inline-block;
            text-align: center;
            width: calc(100% + 30px);
            height: 31px;
            padding-top: 9px;
            margin: -1px 0 0 -15px;
            background-color: ${$WHITE};
            border-top: 1px solid ${$BORDER_COLOR};
            border-bottom: 1px solid ${$BORDER_COLOR};
            ${fontStyleMixin({
              size: 13,
              weight: 'bold',
              color: $FONT_COLOR
            })}
      
            img {
              margin: 0 0 -2px 4px ;
              width: 15px;
              height: 15px;
            }
          }
        }
      }
    }
  }

  .hospital-info {
    p {
      padding: 8px 0;
      ${fontStyleMixin({
        size: 13,
        color: '#999'
      })}
      border-bottom: 1px solid ${$BORDER_COLOR};

      img {
        width: 9px;
        display: inline-block;
        vertical-align: middle;
        margin: -3px 3px 0 0;
      }
    }

    & > ul {
      padding-top: 9px;

      & > li {
        min-height: 20px;
        padding: 5px 0 0 84px;
        position: relative;
        font-size: 15px;
        box-sizing: border-box;

        span {
          position: absolute;
          left: 0;
          top: 5px;
          ${fontStyleMixin({
            size: 13,
            color: '#999'
          })}
        }
      }
    }
  }

  @media screen and (max-width: 680px) {
    padding: 15px 15px 100px;
  }
`;

const StyledSearchBaseInput = styled(SearchBaseInput)`
  width: calc(100% - 65px);
  height: 40px;
  box-sizing: border-box;
  border: 1px solid ${$BORDER_COLOR};

  input {
    width: 100%;
    padding-left: 15px;
    font-size: 14px;
    display: inline-block;

    &.on {
      border: 1px solid ${$FONT_COLOR};
    }
  }

  ${StyledButton} {
    width: 65px;
    margin-left: 0;
    position: absolute;
    top: -1px;
    right: -65px;
  }

  img.clear-button {
    right: 12px;
  }
`;

const StyledAutoCompleteList = styled(AutoCompleteList)`
  position: absolute;
  width: calc(100% - 3px) !important;
  border: 1px solid ${$BORDER_COLOR};
  padding: 7px 0 5px !important;
  margin-top: -1px;

  li {
    height: 32px;
    padding: 6.6px 0 8.4px 15px;
    ${fontStyleMixin({
      size: 14
    })};
  }
`;

interface Props {
  id?: HashId;
}

const PAGE_GROUP_SIZE = 10;
export const HOSPITAL_LIST_SIZE = 20;
type TCallback = (param: ISearchParam) => ISearchParam;
type TSetUrl = (callback: TCallback) => void;

const ProfileHospital: React.FC<Props> = React.memo(({id}) => {
  const {
    pending,
    router,
    count,
    q,
    hospitalInfo,
    query,
    setQuery,
    throttledACFetch,
    acList,
    setAcList,
    searchHospital,
    dataList
  } = useProfileHospital(id);

  const {pathname} = router;
  const {page, tab, ...rest} = q || {};
  const currPage = Number(page) || 1;

  const setURL:TSetUrl = (callback) => {
    router.push({
      pathname, query: callback({
        query: q,
        tab,
        ...rest
      })
    });
  };

  return (
    <HospitalDiv>
      {id ? (
        !isEmpty(hospitalInfo) ? (
          <ul>
            {Object.values(hospitalInfo).map(data => {
              const {
                slug,
                address,
                detail_address,
                telephone,
                position
              } = data;
              const hospitalData = {
                ...data,
                position,
                extension: {
                  address,
                  detail_address,
                  telephone
                }
              };

              return (
                <li key={slug}>
                  <ProfileHospitalItem {...hospitalData}/>
                </li>
              );
            })}
          </ul>
        ) : (
          <NoContentText>
            <img
              src={staticUrl('/static/images/icon/icon-hospital-null.png')}
              alt="현재 등록된 한의원이 없습니다."
            />
            현재 등록된 한의원이 없습니다.
          </NoContentText>
        )
      ) : (
        <>
          <div className="search-input-wrapper">
            <StyledSearchBaseInput
              placeholder="한의원의 상호명을 입력 해주세요."
              value={query}
              onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
                const _value = value.trim();

                if (_value === query) {
                  return null;
                }

                if (_value.length >= 2) {
                  throttledACFetch(_value);
                }

                setQuery(value);
              }}
              onBlur={() => setAcList([])}
              autoList={{
                acList: query ? (acList || []) : [],
                acComp: StyledAutoCompleteList,
                queryKey: 'name',
                onSelect: value => {
                  const _value = value.name || value;
                  searchHospital(_value);
                }
              }}
              onReset={() => {
                setQuery('');
                setAcList([]);
              }}
              searchBtn={
                <StyledButton
                  size={{
                    width: '140px',
                    height: '40px'
                  }}
                  font={{
                    size: '13px',
                    weight: '600',
                    color: $WHITE
                  }}
                  border={{
                    radius: '0'
                  }}
                  backgroundColor={$FONT_COLOR}
                  onClick={() => searchHospital(query)}
                >
                  검색
                </StyledButton>
              }
            />
          </div>

          {/* 검색 결과 */}
          {q.query && (
            pending ? (
              <Loading/>
            ) : (
              <div className="search-result">
                <h2>검색결과</h2>
                {!isEmpty(dataList) ? (
                  <div className="search-complete">
                    <ul className="hospital-list">
                      {dataList.map(data => {
                        const hospitalData = hospitalInfo[data.slug];

                        return (
                          <ProfileHospitalItem2
                            key={data.slug}
                            bandData={data}
                            hasHospital={!!hospitalData}
                            showAdditionalBtn={!hospitalData}
                          />
                        );
                      })}
                    </ul>
                    <StyledPagination
                      className="pagination"
                      totalCount={count}
                      currentPage={currPage}
                      pageSize={HOSPITAL_LIST_SIZE}
                      pageGroupSize={PAGE_GROUP_SIZE}
                      onClick={page => {
                        if(page !== currPage) {
                          setURL(param => ({
                            ...param,
                            page
                          }))
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="search-null">
                    <img
                      src={staticUrl('/static/images/icon/icon-hospital-null.png')}
                      alt="한의플래닛에 등록되지 않은 한의원입니다."
                    />
                    <p>
                      한의플래닛에 등록되지 않은 한의원입니다. <br/>
                      <span
                        className="pointer"
                        onClick={() => router.push('/hospital/new')}
                      >
                        한의원 신규 등록하기
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )
          )}

          {/* 재직중인 한의원 */}
          {!isEmpty(hospitalInfo) && (
            <div className="working-hospital">
              <h2>재직중인 한의원</h2>
              <div>
                <ul className="working-hospital-list">
                  {Object.values(hospitalInfo).map(data => {
                    const {
                      slug,
                      address,
                      detail_address,
                      telephone
                    } = data;
                    const bandData = {
                      ...data,
                      extension: {
                        address,
                        detail_address,
                        telephone
                      }
                    };
                    
                    return (
                      <ProfileHospitalItem2
                        key={slug}
                        hasHospital
                        showAdditionalBtn
                        bandData={bandData}
                      />
                    );
                  })}
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </HospitalDiv>
  );
});

ProfileHospital.displayName = 'ProfileJob';
export default ProfileHospital;
