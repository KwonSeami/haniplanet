import * as React from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {useRouter} from 'next/router';
import UserApi from '../../../src/apis/UserApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import SearchApi from '../../../src/apis/SearchApi';
import {RootState} from '../../../src/reducers';
import {fetchUserHospital} from '../../../src/reducers/hospital';
import throttle from 'lodash/throttle';
import HospitalApi from '../../../src/apis/HospitalApi';
import {HOSPITAL_LIST_SIZE} from '../ProfileHospital';

const useProfileHospital = (id: HashId) => {
  const dispatch = useDispatch();

  const router = useRouter();
  const {
    pathname,
    asPath,
    query: q,
  } = router;

  const {page} = q || {};
  const currPage = Number(page) || 1;

  const userApi: UserApi = useCallAccessFunc(access => new UserApi(access));
  const searchApi: SearchApi = useCallAccessFunc(access => new SearchApi(access));
  const hospitalApi = useCallAccessFunc(access => new HospitalApi(access));

  const {hospital, system: {session: {id: myId}}} = useSelector(
    ({system, hospital}: RootState) => ({
      system,
      hospital
    }),
    shallowEqual
  );

  const [pending, setPending] = React.useState(true);
  const [count, setCount] = React.useState(0);
  const [query, setQuery] = React.useState('');
  const [acList, setAcList] = React.useState([]);
  const [dataList, setDataList] = React.useState([]);

  const acFetch = (query: string) => {
    if (!query) {
      return null;
    }

    searchApi.hospitalAutoComplete(query, {
      band_limit: 10
    })
      .then(({status, data: {result}}) => {
        const {band} = result;

        setAcList(status === 200
          ? band
          : []
        );
      });
  };

  const throttledACFetch = React.useCallback(throttle(acFetch, 500), []);

  const searchHospital = React.useCallback((query: string) => {
    if (query.length >= 2) {
      router.push({
        pathname,
        query: {
          tab: 'hospital',
          query
        }
      });
    } else {
      alert('상호명을 2글자 이상 입력해주세요!');
    }
  }, [pathname]);

  React.useEffect(() => {
    if (q.query && q.query.length >= 2) {
      setQuery(q.query as string);

      hospitalApi.search(q.query as string, (currPage - 1) * HOSPITAL_LIST_SIZE, HOSPITAL_LIST_SIZE)
        .then(({data: {count, results}}) => {
          setCount(count);
          setPending(false);
          setDataList(results);
        });
    }
  }, [q]);

  React.useEffect(() => {
    if (myId) {
      dispatch(
        fetchUserHospital(id || myId, id && userApi.hospitalInfo(id))
      );
    }
  }, [myId, id]);

  const hospitalInfo = (hospital[id || myId] || {});

  return {
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
  };
};

export default useProfileHospital;
