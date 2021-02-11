import * as React from 'react';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import SelectBox from './SelectBox';
import {useSelector, useDispatch} from 'react-redux';
import {initializeCurrRegion, convertRegionListToData} from '../../src/lib/region';
import {fetchRegionThunk} from '../../src/reducers/region';

const Div = styled.div`
  width: 100%;
  box-sizing: border-box;

  .area-li {
    display: inline-block;

    .select-box {
      width: 130px;
      margin-right: 5px;
      appearance: none;

      &::-ms-expand {
        display: none;
      }
    }
  }
`;

interface Props {
  defaultRegionId?: Id;
  onChange: (regionId: Id) => void;
}

const RegionSelect = React.memo<Props>(
  (props) => {
    const {defaultRegionId} = props;

    // Redux
    const {regionData} = useSelector(
      ({region: {data: regionData}}) => ({regionData}),
      (prev, curr) => isEqual(prev, curr)
    );
    const dispatch = useDispatch();

    // State
    const [regionList, setRegionList] = React.useState({
      majorRegions: [],
      subRegionMap: {},
      major: null,
      sub: null
    });
    const {majorRegions, subRegionMap, major, sub} = regionList;

    // Memo Variable, Function
    const subRegions = React.useMemo(() => (
      subRegionMap[major] || [ {label: '전체 2차 지역'} ]
    ), [subRegionMap, major]);

    const onChange = React.useCallback((major: string, sub: string) => {
      const {onChange} = props;
      const name = `${major}${sub ? `/${sub}` : ''}`;
      const region = (regionData.filter(({name: n}) => n === name) || [])[0];

      onChange(region ? region.id : 0);
    }, [props.onChange, regionData]);

    // Life Cycle
    React.useEffect(() => {
      dispatch(fetchRegionThunk());   // 마운트시, region region fetch
    }, []);

    React.useEffect(() => {
      if (!isEmpty(regionData)) {
        const convertedRegionList = convertRegionListToData(regionData);

        setRegionList(curr => ({
          ...curr,
          ...convertedRegionList,
          ...initializeCurrRegion(defaultRegionId, regionData),
        }));
        props.onChange(defaultRegionId || regionData[0].id || 0);
      }
    }, [regionData, defaultRegionId, props.onChange]);

    return (
      <Div className="region-select">
        <ul>
          <li className="area-li">
            <SelectBox
              option={majorRegions}
              value={major}
              onChange={major => {
                const subRegions = subRegionMap[major];
                const sub = subRegions ? subRegions[0].value : null;

                setRegionList(curr => ({...curr, major, sub}));
                onChange(major, sub);
              }}
            />
          </li>
          <li className="area-li">
            <SelectBox
              option={subRegions}
              value={sub}
              onChange={sub => {
                setRegionList(curr => ({...curr, sub}));
                onChange(major, sub);
              }}
            />
          </li>
        </ul>
      </Div>
    );
  }
);

RegionSelect.displayName = 'RegionSelect';
export default RegionSelect;
