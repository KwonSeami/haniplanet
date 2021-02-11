import React from 'react';
import styled from 'styled-components';
import HospitalButtonGroupWrapper from './ButtonGroupWrapper';
import cn from 'classnames';
import {$WHITE, $BORDER_COLOR, $GRAY} from '../../styles/variables.types';
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
      width: 603px;
      min-height: 302px;
      background-color: ${$WHITE};
      box-sizing: border-box;

      .select-city, .select-gu {
        display: inline-block;
        height: 225px;
        padding-top: 10px;
        border-bottom: 1px solid ${$BORDER_COLOR};
        box-sizing: border-box;
        overflow-y: scroll;
      }

      .select-city {
        width: 194px;
        padding-left: 10px;
        vertical-align: top;
    
        ul {
    
          li {
            position: relative;
            display: inline-block;
            width: 80px;
            ${heightMixin(44)};
            text-align: center;
            border: 1px solid ${$BORDER_COLOR};
            box-sizing: border-box;
            ${fontStyleMixin({
              size: 14,
            })};
    
            &:nth-child(2n) {
              margin-left: -1px;
            }
    
            &:nth-child(n+3) {
              margin-top: -1px;
            }
    
            &:hover {
              z-index: 1;
              border: 1px solid ${$GRAY};
            }
    
            &.on {
              background-color: #499aff;
              border-color: #499aff;
              ${fontStyleMixin({
                size: 14,
                color: $WHITE
              })};
            }
          }
        }
      }
    
      .select-gu {
        width: calc(100% - 194px);
        padding: 5px 0 0 24px;
        border-left: 1px solid ${$BORDER_COLOR};
        vertical-align: top;
    
        ul {
          li {
            display: inline-block;
            width: 120px;
            margin-bottom: 14px;
    
            .checkbox {
              ${fontStyleMixin({
                size: 14,
              })};
            }
          }
        }
      }
    
      > div:last-of-type {
        padding: 16px 10px 0;
        display: inline-block;
    
        h2 {
          display: inline-block;
          vertical-align: top;
          ${fontStyleMixin({
            size: 14,
            weight: 'bold',
          })};
        }
      
        ul {
          display: inline-block;
          width: 311px;
          margin-left: 25px;
          vertical-align: top;
      
          li {
            display: inline-block;
            margin: 0 14px 10px 0;
            text-decoration: underline;
            ${fontStyleMixin({
              size: 14,
            })};
          }
        }
      }
    
      > ul {
        display: inline-block;
        margin-left: 13px;
        
        li {
          display: inline-block;
          margin-left: 6px;
    
          &:first-child {
            margin-left: 0;
          }
    
          .button {
            img {
              width: 15px;
              vertical-align: middle;
              margin-right: 2px;
            }
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
    setRegionForm({
      regions,
      regionIds
    });
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
    <Div>
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
