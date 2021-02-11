import * as React from 'react';
import {Div} from '../UI/ResponsiveLi/ResponsiveLi';
import styled from 'styled-components';
import {$BORDER_COLOR, $FONT_COLOR, $WHITE, $POINT_BLUE} from '../../styles/variables.types';
import isEmpty from 'lodash/isEmpty';
import {staticUrl} from '../../src/constants/env';
import {fontStyleMixin, backgroundImgMixin} from '../../styles/mixins.styles';
import Loading from '../common/Loading';
import StyledButton from './style/StyledButton';
import SearchBaseInput from '../inputs/Input/SearchBaseInput';
import AutoCompleteList from '../AutocompleteList/index';
import {HospitalItem} from '../hospital/HospitalItem';
import HospitalItem2 from '../hospital/HospitalItem2';
import NoContentText from './style/NoContentText';
import useProfileHospital from './hooks/useProfileHospital';
import Pagination from '../UI/Pagination';
import queryString from 'query-string';
import {ISearchParam} from '../../src/@types/search';

const StyledPagination = styled(Pagination)`
  padding: 30px 0 36px;
`;

const HospitalUl = styled.ul`
  width: 680px;
  margin: 15px auto auto;
  padding: 20px 0 57px;
  border-top: 1px solid ${$BORDER_COLOR};

  ${Div} {
    padding-left: 106px;
  }

  li > h3 {
    top: 22px;
  }
`;

const HospitalDiv = styled.div`
  width: 680px;
  margin: 22px auto 190px;

  h2 {
    margin-top: 17px;
    ${fontStyleMixin({
      size: 19,
      weight: '300'
    })}
  }

  .search-result {
    width: 680px;
    margin-top: 30px;
    text-align: center;

    & > h2 {
      text-align: left;
      padding-bottom: 8px;
      border-bottom: 1px solid ${$FONT_COLOR};
    }

    .search-null {
      padding: 56px 0;

      img {
        width: 65px;
        height: 65px;
      }

      p {
        font-size: 15px;

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
    margin-top: 30px;

    & > h2 {
      text-align: left;
      padding-bottom: 8px;
      border-bottom: 1px solid ${$FONT_COLOR};
    }

    div {
      .working-hospital-list {
        margin-top: -1px;
        text-align: left;
        border-top: none;

        a {
          border: none;
        }
      }
    }
  }

  & > .hospital-job-info {
    border: 1px solid ${$BORDER_COLOR};
    border-top-color: ${$FONT_COLOR};
    position: relative;
    padding: 26px 20px 20px 96px;

    & > img {
      width: 60px;
      position: absolute;
      left: 20px;
      top: 22px;
    }

    h3 {
      padding-bottom: 7px;
      ${fontStyleMixin({
        size: 17,
        weight: '600'
      })}
    }

    p {
      padding-bottom: 25px;
      ${fontStyleMixin({
        size: 13,
        color: '#999'
      })}

      img {
        width: 9px;
        display: inline-block;
        vertical-align: middle;
        margin: -2px 2px 0 0;
      }
    }

    ul {
      border-top: 1px solid ${$BORDER_COLOR};
      padding-top: 9px;
  
      & > li {
        padding: 5px 0 0 84px;
        position: relative;
        font-size: 15px;
  
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

  ${HospitalUl} {
    border-top: 1px solid ${$BORDER_COLOR};
    padding-top: 9px;

    & > li {
      padding: 5px 0 0 84px;
      position: relative;
      font-size: 15px;

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
`;

const StyledSearchBaseInput = styled(SearchBaseInput)`
  width: 535px;
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
    font-size: 13px;
    margin-left: 0;
    position: absolute;
    top: -1px;
    right: -145px;
  }

  img.clear-button {
    top: 10px;
    right: 14px;
  }
`;

const StyledAutoCompleteList = styled(AutoCompleteList)`
  position: absolute;
  width: 533px;
  border: 1px solid ${$BORDER_COLOR};
  margin-top: -1px;

  li {
    height: 35px;
    padding: 6.6px 0 8.4px 15px;
    ${fontStyleMixin({
      size: 14
    })}
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
    count,
    pending, 
    router,
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
                  <HospitalItem {...hospitalData}/>
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
                한의원 검색
              </StyledButton>
            }
          />

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
                          <HospitalItem2
                            key={data.slug}
                            bandData={data}
                            hasHospital={!!hospitalData}
                            hospitalData={hospitalData}
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
                      <HospitalItem2
                        key={slug}
                        hasHospital
                        showAdditionalBtn
                        hospitalData={data}
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
