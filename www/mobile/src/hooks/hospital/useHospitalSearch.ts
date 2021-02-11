import React from 'react';
import {useSelector, shallowEqual} from 'react-redux';
import {useRouter} from 'next/router';
import {RootState} from '../../reducers';
import {axiosInstance} from '@hanii/planet-apis';
import {BASE_URL, staticUrl} from '../../constants/env';
import * as queryString from 'query-string';
import isEmpty from 'lodash/isEmpty';
import {GANGNAM_STATION} from '../../constants/hospital';

type TOpenType = 'DEFAULT' | 'FOLD' | 'TOUCH_PIN';

const MARKER_SRC = staticUrl('/static/images/icon/map-marker.png');
const DISABLED_MARKER_SRC = staticUrl('/static/images/icon/map-marker-disabled.png');

let listRefs = {};

const useHospitalSearch = () => {
  const [type, setType] = React.useState<TOpenType>('DEFAULT');

  const router = useRouter();
  const {query: routerQuery, pathname} = router;

  const map = React.useRef(null);

  const _window = typeof window === 'undefined'
    ? ({} as typeof window)
    : window;

  const [searchedCount, setSearchedCount] = React.useState(0);
  const [searchedHospitals, setSearchedHospitals] = React.useState([]);
  const [pending, setPending] = React.useState(true);

  const listContainerRef = React.useRef(null);

  const access = useSelector(
    ({system: {session: {access}}}: RootState) => access,
    shallowEqual
  );

  const searchHospital = React.useCallback((query: Indexable) => {
    router.replace({pathname, query});
  }, [pathname]);

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

  const setHospitalMarkers = React.useCallback((response: Indexable[]) => {
    if (isEmpty(response)) {
      // 검색 결과가 없을 때의 기본 좌표는 강남역입니다.
      const {coordinates: [lat, lng]} = GANGNAM_STATION;
      initMapPosition({lat, lng, setCenter: true});
    } else {
      const markers = [];
      const filteredData = response.reduce((prev, curr) => {
        const {
          slug,
          extension: {
            coordinates: {latitude, longitude,}
          },
        } = curr;
        prev[slug] = {slug, latitude, longitude};

        return prev;
      }, {});

      Object.values(filteredData).forEach(({
        slug,
        latitude,
        longitude,
      }, index) => {
        const marker = initMapPosition({
          lat: latitude,
          lng: longitude,
          setCenter: index === 0
        });

        marker.hospitalSlug = slug;
        markers.push(marker);
      });

      onClickMarker(markers);
    }
  }, []);

  const onClickMarker = React.useCallback((markers: Indexable[]) => {
    markers.forEach(marker => {
      _window.naver.maps.Event.addListener(marker, 'click', value => {
        const {
          overlay: {
            hospitalSlug,
            position: {x, y},
          }
        } = value;

        // 부모 요소 안의 자식 요소의 상대 위치를 구하기 위해 offsetTop을 사용하였고,
        // div.top-text.pointer(= 부모의 offsetTop) 만큼의 높이를 빼주었습니다.
        const {offsetTop} = listRefs[hospitalSlug];
        const {current: {offsetTop: wrapperOffsetTop}} = listContainerRef;

        listContainerRef.current.scrollTop = offsetTop - wrapperOffsetTop;

        map.current.setZoom(15);
        map.current.setCenter(new _window.naver.maps.Point(x, y));

        setType('TOUCH_PIN');

        markers.forEach(_marker => {
          const {
            hospitalSlug: _hospitalSlug,
            icon: {url: _url},
          } = _marker;

          if (hospitalSlug === _hospitalSlug) {
            _marker.setIcon({
              url: MARKER_SRC,
              scaledSize: {width: 40, height: 40},
            });
          } else if (hospitalSlug !== _hospitalSlug && _url !== DISABLED_MARKER_SRC) {
            _marker.setIcon({
              url: DISABLED_MARKER_SRC,
              scaledSize: {width: 34, height: 34},
            });
          }
        });
      });
    });
  }, []);

  const initMapPosition = React.useCallback(({lat, lng, setCenter}: {
    lat: number,
    lng: number,
    setCenter?: boolean
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

    return marker;
  }, []);

  const setMap = React.useCallback(() => {
    setTimeout(() => {
      try {
        if (typeof _window !== 'undefined' && _window.naver) {
          map.current = new _window.naver.maps.Map('map', {
            useStyleMap: true,
            zoom: 1,
            zoomControl: true,
            zoomControlOptions: {
              style: _window.naver.maps.ZoomControlStyle.SMALL,
              position: _window.naver.maps.Position.TOP_LEFT
            }
          });

          setHospitalMarkers(searchedHospitals);
        }
      } catch (err) {
        // Error occured
      }
    }, 0);
  }, [searchedHospitals]);

  React.useEffect(() => {
    if (!pending) {
      setMap();
    }
  }, [searchedHospitals, pending]);

  React.useEffect(() => {
    fetchSearchedHospital(routerQuery);

    return () => {
      listRefs = {};
    };
  }, [routerQuery]);

  return {
    searchHospital,
    routerQuery,
    type,
    setType,
    searchedCount,
    searchedHospitals,
    listContainerRef,
    listRefs,
    pending
  };
};

export default useHospitalSearch;
