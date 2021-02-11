import React from 'react';
import isEmpty from 'lodash/isEmpty';
import {IMedicalFieldPayload} from '../../reducers/medicalField';
import {useRouter} from 'next/router';
import {useSelector, shallowEqual} from 'react-redux';
import {RootState} from '../../reducers';
import {axiosInstance} from '@hanii/planet-apis';
import {BASE_URL, staticUrl} from '../../constants/env';
import * as queryString from 'query-string';
import {MILLI_SECOND} from '../../constants/times';
import throttle from 'lodash/throttle';
import {filterCategoryIcons} from '../../lib/hospital';
import useSetPageNavigation from '../useSetPageNavigation';

export interface ICategory {
  category: IMedicalFieldPayload & {
    is_filtered: boolean;
  }
}

const MARKER_SRC = staticUrl('/static/images/icon/map-marker.png');
const DISABLED_MARKER_SRC = staticUrl('/static/images/icon/map-marker-disabled.png');

let listRefs = {};

const useHospitalSearch = () => {
  const router = useRouter();
  const {query: routerQuery, pathname} = router;

  const map = React.useRef(null);
  const mapContainerRef = React.useRef(null);
  const listContainerRef = React.useRef(null);

  // Custom Hooks
  useSetPageNavigation('/hospital');

  const _window = typeof window === 'undefined'
    ? ({} as typeof window)
    : window;

  const [isSelectingRegion, setIsSelectingRegion] = React.useState(false);
  const [isSelectingCategory, setIsSelectingCategory] = React.useState(false);

  const [regions, setRegions] = React.useState({
    major: (routerQuery.major as string) || '',
    sub: routerQuery.sub
      ? JSON.parse(routerQuery.sub as string)
      : []
  });
  const [categories, setCategories] = React.useState(routerQuery.category_id
    ? JSON.parse(routerQuery.category_id as string)
    : []
  );

  const [searchedCount, setSearchedCount] = React.useState(0);
  const [searchedHospitals, setSearchedHospitals] = React.useState([]);
  const [pending, setPending] = React.useState(true);

  const [highlightedHospital, setHighlightedHospital] = React.useState('');
  const [isMapExpanded, setIsMapExpanded] = React.useState(false);

  const access = useSelector(
    ({system: {session: {access}}}: RootState) => access,
    shallowEqual
  );

  const selectedRegionName = regions.sub.map(s => s.split('/')[1]).join(', ');
  const selectedCategoryName = categories.map(({name}) => name).join(', ');

  const searchHospital = React.useCallback((query: Indexable) => {
    router.replace({
      pathname,
      query
    });
  }, [pathname]);

  const stringifiedData = React.useCallback(<T extends Indexable>(key: string, data: T) => (
    !isEmpty(data)
      ? {
        [key]: JSON.stringify(data)
      }
      : {}
  ), []);

  // 카테고리 필터 적용 시
  const onFilterCategory = React.useCallback((data: Indexable) => {
    const {category_id, ...rest} = routerQuery;

    searchHospital({
      ...rest,
      ...stringifiedData('category_id', data),
      page: 1
    });

    setCategories(data);
    setIsSelectingCategory(false);
  }, [routerQuery, searchHospital, stringifiedData]);

  // 지역 필터 적용 시
  const onFilterRegion = React.useCallback((data: Indexable) => {
    const {
      major,
      sub,
      regionForm: {regions, regionIds},
    } = data;

    const {
      major: majorQuery,
      sub: subQuery,
      region: regionsQuery,
      region_id: regionIdsQuery,
      ...rest
    } = routerQuery;

    searchHospital({
      ...rest,
      ...stringifiedData('region', regions),
      ...stringifiedData('region_id', regionIds),
      ...stringifiedData('sub', sub),
      ...((major && !isEmpty(sub))
        ? {major}
        : {}
      )
    });

    setRegions({major, sub});
    setIsSelectingRegion(false);
  }, [routerQuery, stringifiedData]);

  const fetchSearchedHospital = React.useCallback((query: Indexable) => {
    const {page: currentPage, ...restQuery} = query;
    // sub과 major은 쿼리로 넘길 필요가 없으므로 제외
    const {sub, major, ...filteredParams} = {
      ...restQuery,
      limit: 20,
      offset: (Number(currentPage) - 1) || 0,
    } as Indexable;

    if (restQuery.hasOwnProperty('category_id')) {
      filteredParams.category_id = JSON.parse(restQuery.category_id).map(({id}) => id);
    }

    if (restQuery.hasOwnProperty('region')) {
      filteredParams.region = JSON.parse(restQuery.region);
    }

    if (restQuery.hasOwnProperty('region_id')) {
      filteredParams.region_id = JSON.parse(restQuery.region_id);
    }

    axiosInstance({baseURL: BASE_URL, token: access})
      .get('/hospital/', {
        params: filteredParams,
        paramsSerializer: params => queryString.stringify(params, {
          arrayFormat: 'bracket'
        })
      })
      .then(({data: {results, count}}) => {
        setSearchedCount(count);
        setSearchedHospitals(results);
        setPending(false);
      })
      .catch(() => {
        alert('검색에 문제가 발생하였습니다!');
        router.replace('/hospital');
      });
  }, [access]);

  const onClickMarker = React.useCallback((markers: Indexable[], infoBoxes: Indexable[]) => {
    markers.forEach((marker, index) => {
      _window.naver.maps.Event.addListener(marker, 'click', (value) => {
        const infoBox = infoBoxes[index];
        const {contentElement: {innerText}} = infoBox;
        const hospitalName = innerText.trim();
        const {overlay: {hospitalSlug}} = value;

        if (infoBox.getMap()) {
          infoBox.close();
          setHighlightedHospital('');
        } else {
          const {offsetTop} = listRefs[hospitalSlug];
          const {current: {offsetTop: containerOffsetTop}} = listContainerRef;

          infoBox.open(map.current, marker);
          listContainerRef.current.scrollTop = offsetTop - containerOffsetTop;
          setHighlightedHospital(hospitalName);
        }

        markers.forEach(_marker => {
          const {
            hospitalSlug: _hospitalSlug,
            icon: {url: _url}
          } = _marker;

          if (hospitalSlug === _hospitalSlug) {
            _marker.setIcon({
              url: MARKER_SRC,
              scaledSize: {width: 40, height: 40},
            });
          } else if (hospitalSlug !== _hospitalSlug && _url !== DISABLED_MARKER_SRC) {
            _marker.setIcon({
              url: DISABLED_MARKER_SRC,
              scaledSize: {width: 40, height: 40},
            });
          }
        });
      });
    });
  }, []);

  const setHospitalMarkers = React.useCallback((response: Indexable[]) => {
    if (!isEmpty(response)) {
      const markers = [];
      const infoBoxes = [];
      const filteredData = response.reduce((prev, curr) => {
        const {
          name,
          slug,
          categories,
          extension: {
            coordinates: {latitude, longitude},
          },
        } = curr;

        prev[name] = {
          name,
          slug,
          latitude,
          longitude,
          categories
        };

        return prev;
      }, {});

      Object.values(filteredData).forEach(({
        name,
        latitude,
        longitude,
        categories,
        slug
      }, index) => {
        const {marker, infoBox} = initMapPosition({
          name,
          slug,
          lat: latitude,
          lng: longitude,
          setCenter: index === 0,
          categories
        });

        marker.hospitalSlug = slug;
        markers.push(marker);
        infoBoxes.push(infoBox);
      });

      onClickMarker(markers, infoBoxes);
    }
  }, [onClickMarker]);

  const initMapPosition = React.useCallback(({lat, lng, name, slug, categories, setCenter}: {
    lat: number;
    lng: number;
    name: string;
    categories?: ICategory[];
    setCenter?: boolean;
    slug: string;
  }) => {
    const addr = new _window.naver.maps.Point(lng, lat);

    if (setCenter) {
      map.current.setCenter(addr);
    }

    const marker = new _window.naver.maps.Marker({
      position: addr,
      map: map.current,
      icon: {
        url: MARKER_SRC,
        scaledSize: {width: 40, height: 40},
      }
    });

    const infoBox = new _window.naver.maps.InfoWindow({
      // * 컴포넌트를 넘기는게 불가능한 것 같습니다.
      content: `
        <a href=${`/band/${slug}`}>
          <div class="marker-info-box">\
            <h3>${name}</h3>\
            <ul>\
              ${categories.map(({category: {
                id,
                name,
                is_filtered,
                icons
              }}) => {
                const {normal, blue} = filterCategoryIcons(icons);

                return (
                  `<li key=${id}>\
                    <img\
                      src=${is_filtered
                        ? blue
                        : normal
                      }\
                      alt=${name}\
                    </img>
                  </li>`
                );
              }).join('')}
            </ul>\
          </div>
        </a>
      `,
      disableAnchor: true,
      borderWidth: 0,
      backgroundColor: 'transparent'
    });

    return {marker, infoBox};
  }, []);

  const setMap = React.useCallback(() => {
    setTimeout(() => {
      try {
        if (typeof _window !== 'undefined' && _window.naver) {
          const isRegionFiltered = routerQuery.region_id || routerQuery.region;

          map.current = new _window.naver.maps.Map('map', {
            useStyleMap: true,
            zoom: isRegionFiltered
              ? 8
              : 7,
            zoomControl: true,
            zoomControlOptions: {
              style: _window.naver.maps.ZoomControlStyle.SMALL,
              position: _window.naver.maps.Position.TOP_RIGHT
            }
          });

          setHospitalMarkers(searchedHospitals);
        }
      } catch (err) {
        // Error occured
      }
    }, 0);
  }, [routerQuery, searchedHospitals]);

  const resizeMap = () => {
    if (map.current && mapContainerRef.current) {
      const {current: {offsetWidth, offsetHeight}} = mapContainerRef;
      map.current.setSize(new _window.naver.maps.Size(offsetWidth, offsetHeight));
    }
  };

  const throttledResizeMap = React.useCallback(
    throttle(resizeMap, 250 * MILLI_SECOND),
    [],
  );

  React.useEffect(() => {
    if (!pending) {
      setMap();
    }
  }, [searchedHospitals, pending]);

  React.useEffect(() => {
    if (!pending) {
      resizeMap();
    }
  }, [isMapExpanded, pending]);

  React.useEffect(() => {
    fetchSearchedHospital(routerQuery);

    return () => {
      listRefs = {};
    };
  }, [routerQuery]);

  React.useEffect(() => {
    _window.addEventListener('resize', throttledResizeMap);

    return () => {
      _window.removeEventListener('resize', throttledResizeMap);
    };
  }, []);

  return {
    pending,
    isMapExpanded,
    setIsMapExpanded,
    searchedCount,
    searchHospital,
    routerQuery,
    isSelectingRegion,
    setIsSelectingRegion,
    onFilterRegion,
    regions,
    isSelectingCategory,
    setIsSelectingCategory,
    onFilterCategory,
    categories,
    setRegions,
    setCategories,
    searchedHospitals,
    highlightedHospital,
    mapContainerRef,
    listRefs,
    listContainerRef,
    selectedRegionName,
    selectedCategoryName
  };
};

export default useHospitalSearch;
