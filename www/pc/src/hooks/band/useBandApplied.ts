import * as React from 'react';
import BandApi from '../../apis/BandApi';
import useCallAccessFunc from '../session/useCallAccessFunc';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {fetchBandThunk} from '../../reducers/orm/band/thunks';
import {pickBandSelector} from '../../reducers/orm/band/selector';
import useSetPageNavigation from '../useSetPageNavigation';

const useBandApplied = (slug: string) => {
  const dispatch = useDispatch();

  const bandApi: BandApi = useCallAccessFunc(access => new BandApi(access));

  const [appliedInfo, setAppliedInfo] = React.useState({});

  const {band} = useSelector(
    ({orm}) => ({
      band: pickBandSelector(slug)(orm)
    }),
    shallowEqual
  );

  const getAppliedBandInfo = React.useCallback(() => {
    bandApi.me(slug)
      .then(({data: {result}}) => {
        !!result && setAppliedInfo(result);
      });
  }, [slug]);

  React.useEffect(() => {
    dispatch(fetchBandThunk(bandApi, slug));
    getAppliedBandInfo();
  }, [slug, getAppliedBandInfo]);

  // Custom Hooks
  useSetPageNavigation('/band');

  return {
    band,
    appliedInfo
  };
};

export default useBandApplied;
