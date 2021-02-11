import * as React from 'react';
import {useRouter} from 'next/router';
import {useSelector, shallowEqual, useDispatch} from 'react-redux';
import {pickBandSelector} from '../../../src/reducers/orm/band/selector';
import MoaEditMobile from '../../../components/moa/edit.mobile';
import HospitalEditMobile from '../../../components/hospital/edit.mobile';
import Loading from '../../../components/common/Loading';
import {fetchBandThunk} from '../../../src/reducers/orm/band/thunks';
import isEmpty from 'lodash/isEmpty';
import loginRequired from '../../../hocs/loginRequired';
import BandApi from '../../../src/apis/BandApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';

const BandEditMobile = React.memo(() => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {query: {slug}} = router;

  const {band} = useSelector(
    ({orm}) => ({band: pickBandSelector(slug as string)(orm)}),
    shallowEqual
  );
  const {band_type} = band || {} as any;

  const bandApi: BandApi = useCallAccessFunc(access => new BandApi(access));

  React.useEffect(() => {
    dispatch(fetchBandThunk(bandApi, slug));
  }, [slug]);

  const branch = React.useCallback(() => {
    switch(band_type) {
      case 'moa':
      case 'consultant':
        return <MoaEditMobile/>;
      case 'hospital':
        return <HospitalEditMobile/>;
      default:
        return <Loading/>;
    }
  }, [band_type]);

  const DetailComp = branch();

  if (isEmpty(band)) {
    return <Loading/>;
  }

  if (!DetailComp) {
    return <Loading/>;
  }

  return (
    DetailComp
  );
});

BandEditMobile.displayName = 'BandEditMobile';
export default loginRequired(BandEditMobile);
