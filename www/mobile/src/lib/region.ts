import isEmpty from 'lodash/isEmpty';

// defaultValue를 전달받아, major, sub 객체 작성
export const initializeCurrRegion = (defaultRegionId: Id, regions) => {
  const [major, sub] = regions[0].name.split('/');
  const defaultRegionData = { major, sub} ;

  if (!defaultRegionId || !regions) { return defaultRegionData; }
  else if (isEmpty(regions)) { return defaultRegionData; }

  const {name: currRegionName} = regions.filter(({id}) => id === defaultRegionId)[0];

  return {
    major: currRegionName.split('/')[0] || major,
    sub: currRegionName.split('/')[1] || sub,
  };
};

// regionList를 사용해 majorRegions, subRegionMap 객체 작성
export const convertRegionListToData = (regionList: any) => {
  const majorRegions = [];
  const subRegionMap = {};

  if (isEmpty(regionList)) {
    return { majorRegions, subRegionMap };
  }

  regionList.forEach(({name}) => {
    const [majorText, subText] = name.split('/');

    if (majorText && majorRegions.every(({value}) => value !== majorText)) {
      majorRegions.push({ label: majorText, value: majorText });
    }

    if (subText) {
      let map = subRegionMap[majorText];

      if (!map) { map = []; }
      if (map.every(({value}) => value !== subText)) {
        map.push({ label: subText, value: subText });
        subRegionMap[majorText] = map;
      }
    }
  });

  return {majorRegions, subRegionMap};
};
