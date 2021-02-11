import React from 'react';
import styled from 'styled-components';
import HospitalButtonGroupWrapper from './ButtonGroupWrapper';
import cn from 'classnames';
import {$WHITE, $BORDER_COLOR, $FONT_COLOR} from '../../styles/variables.types';
import {fontStyleMixin, heightMixin} from '../../styles/mixins.styles';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {fetchRegionThunk} from '../../src/reducers/region';
import isEmpty from 'lodash/isEmpty';
import {convertRegionListToData, initializeCurrRegion} from '../../src/lib/region';
import CheckBox from '../UI/Checkbox1/CheckBox';
import {RootState} from '../../src/reducers';

const Div = styled.div`
  .region-select-wrapper {
    .buttons {
      top: 254px;
    }

    .select-area {
      width: 100%;
      margin: 10px 0 7px;

      > div:not(:last-of-type) {
        display: inline-block;
        height: 320px;
        border-bottom: 1px solid ${$BORDER_COLOR};
        box-sizing: border-box;
        overflow-y: scroll;

        > h3 {
          margin-bottom: 15px;
          ${fontStyleMixin({
            size: 12,
            weight: 'bold',
            color: $FONT_COLOR
          })};
        }

        &.select-city {
          width: 90px;
          padding-left: 15px;

          ul {
            li {
              display: inline-block;
              width: 60px;
              ${heightMixin(40)};
              text-align: center;
              border: 1px solid ${$BORDER_COLOR};
              ${fontStyleMixin({
                size: 14,
              })};
              box-sizing: border-box;
              transition: 0.3s;
      
              &:nth-child(n+2) {
                margin-top: -1px;
              }
      
              &.on {
                background-color: #499aff;
                border: 1px solid #499aff;
                ${fontStyleMixin({
                  size: 14,
                  color: $WHITE
                })};
              }
            }
          }
        }
      
        &.select-gu {
          width: calc(100% - 90px);
          padding: 0 15px;
          border-left: 1px solid ${$BORDER_COLOR};

          ul {
            li {
              display: inline-block;
              width: 119px;
              margin-bottom: 13.5px;

              .checkbox {
                label {
                  ${fontStyleMixin({
                    size: 14,
                  })};
                }
              }
            }
          }
        }
      }

      > div:last-of-type {
        position: relative;
        width: 100%;
        padding: 11px 0 16px 0;
        border-bottom: 1px solid ${$BORDER_COLOR};
        box-sizing: border-box;
        overflow-x: auto;

        h2 {
          position: absolute;
          top: 12px;
          left: 0;
          display: inline-block;
          ${fontStyleMixin({
            size: 14,
            weight: 'bold',
          })};
        }
      
        ul {
          display: inline-block;
          margin-left: 102px;
          white-space: nowrap;
      
          li {
            display: inline-block;
            margin-right: 14px;
            text-decoration: underline;
            ${fontStyleMixin({
              size: 14,
            })};
          }
        }
      }

      .button-group {
        margin: 15px auto 0;
        text-align: center;
        
        li {
          display: inline-block;
          margin-left: 6px;

          .button {
            img {
              width: 15px;
              vertical-align: middle;
              margin-right: 2px;
            }
          }
        }
      }

      @media screen and (max-width: 680px) {
        > div:last-of-type {
      
          h2 {
            left: 15px;
          }
        }
      }
    }
  }
`;

interface Props {
  defaultRegionId?: Id;
  className?: string;
  maxSubRegionLength?: number;
  onApply: ({major, sub, regionForm}: {
    major: string;
    sub: string[];
    regionForm: IRegionFormState;
  }) => void;
  regions?: {
    major: string;
    sub: string[];
  }
}

interface IMajorRegions {
  label: string;
  value: string;
}

interface IRegionListState {
  majorRegions: IMajorRegions[];
  subRegionMap: {
    [key: string]: IMajorRegions[];
  };
  major: string;
  sub: string[];
}

interface IRegionFormState {
  regions: string[];
  regionIds: string[];
}

const DEFAULT_MAX_SUB_REGION_LENGTH = 5;

const HospitalRegionSelect = React.memo<Props>(({
  defaultRegionId,
  className,
  maxSubRegionLength: _maxSubRegionLength,
  onApply,
  regions: propsRegions
}) => {
  // Redux
  const dispatch = useDispatch();

  const regionData = useSelector(
    ({region: {data: regionData}}: RootState) => regionData,
    shallowEqual
  );
  
  // State
  const [regionForm, setRegionForm] = React.useState<IRegionFormState>({
    regions: [],
    regionIds: []
  });
  const [regionList, setRegionList] = React.useState<IRegionListState>({
    majorRegions: [],
    subRegionMap: {},
    major: null,
    sub: []
  });
  const {
    majorRegions,
    subRegionMap,
    major,
    sub
  } = regionList;

  // Methods
  const onChangeRegionList = React.useCallback((changedRegionList: IRegionListState) => {
    const {sub} = changedRegionList;
    const filteredRegionData = regionData.reduce((prev, curr) => {
      prev[curr.name] = curr;
      return prev;
    }, {});

    const regions = [];
    const regionIds = [];

    sub.forEach(name => {
      if (filteredRegionData[name]) {
        regionIds.push(filteredRegionData[name].id);
      } else {
        const [major] = name.split('/');
        regions.push(major);
      }
    });

    setRegionList(changedRegionList);
    setRegionForm({regions, regionIds});
  }, [regionData]);

  // Variables
  const maxSubRegionLength = _maxSubRegionLength || DEFAULT_MAX_SUB_REGION_LENGTH;

  React.useEffect(() => {
    dispatch(fetchRegionThunk());
  }, []);

  React.useEffect(() => {
    if (!isEmpty(regionData)) {
      const convertedRegionList = convertRegionListToData(regionData);
      const initializedCurrRegion = initializeCurrRegion(defaultRegionId, regionData);
      const {major, sub} = propsRegions;

      const regionList = {
        ...convertedRegionList,
        ...initializedCurrRegion,
        sub: !isEmpty(sub) ? sub : [],
        major: major || '서울'
      };

      onChangeRegionList(regionList);
    }
  }, [regionData, defaultRegionId, propsRegions]);

  return (
    <Div className={className}>
      <HospitalButtonGroupWrapper
        className={cn('region-select-wrapper', className)}
        hasResetBtn
        onClickResetBtn={() => {
          setRegionList(curr => ({
            ...curr,
            major: '서울',
            sub: []
          }));
          setRegionForm({
            regionIds: [],
            regions: []
          });
        }}
        rightBtnText="적용"
        onClickRightBtn={() => onApply({
          major,
          sub,
          regionForm
        })}
      >
        <div className="select-area">
          <div className="select-city">
            <h3>
              시/도
            </h3>
            <ul>
              {majorRegions.map(({label, value}, index) => (
                <li
                  key={`${value}-${index}`}
                  onClick={() => {
                    const changedRegionList = {
                      ...regionList,
                      major: value
                    };

                    onChangeRegionList(changedRegionList);
                  }}
                  className={cn('pointer', {
                    on: major === value
                  })}
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>
          <div className="select-gu">
            <h3>
              시/군/구
            </h3>
            <ul>
              {!isEmpty(subRegionMap[major]) && [{
                label: `${major}전체`,
                value: `${major}전체`
              }, ...subRegionMap[major]].map(({label, value}, index) => {
                const _value = `${major}/${value}`;

                return (
                  <li
                    key={`${label}-${_value}-${index}`}
                    className="pointer"
                  >
                    <CheckBox
                      checked={sub.includes(_value)}
                      onChange={() => {
                        let changedRegionList = {} as IRegionListState;

                        if (value === `${major}전체`) {
                          changedRegionList = {
                            ...regionList,
                            sub: sub.includes(_value)
                              ? sub.filter(s => s !== _value)
                              : [
                                ...sub.filter(s => !s.includes(`${major}/`)),
                                _value
                              ]
                          };
                        } else {
                          if (sub.includes(`${major}/${major}전체`)) {
                            return null;
                          }

                          changedRegionList = {
                            ...regionList,
                            sub: sub.includes(_value)
                              ? sub.filter(s => s !== _value)
                              : [...sub, _value]
                          };
                        }

                        changedRegionList.sub = changedRegionList.sub.slice(0, maxSubRegionLength);
                        onChangeRegionList(changedRegionList);
                      }}
                    >
                      {label}
                    </CheckBox>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <h2>선택한 지역</h2>
            <ul>
              {sub.map(s => {
                const _s = s.includes('전체')
                  ? s.split('/')[1]
                  : s;

                return (
                  <li
                    className="pointer"
                    key={_s}
                  >
                    {_s}
                  </li>
                );
              })}
            </ul>
          </div>
        </div> 
      </HospitalButtonGroupWrapper>
    </Div>
  )
});

export default HospitalRegionSelect;
