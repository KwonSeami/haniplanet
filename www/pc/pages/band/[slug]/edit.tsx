import * as React from 'react';
import {useRouter} from 'next/router';
import {useSelector, shallowEqual, useDispatch} from 'react-redux';
import {pickBandSelector} from '../../../src/reducers/orm/band/selector';
import MoaEditPC from '../../../components/moa/edit.pc';
import HospitalEditPC from '../../../components/hospital/edit.pc';
import Loading from '../../../components/common/Loading';
import {fetchBandThunk} from '../../../src/reducers/orm/band/thunks';
import isEmpty from 'lodash/isEmpty';
import loginRequired from '../../../hocs/loginRequired';
import {RootState} from "../../../src/reducers";
import BandApi from '../../../src/apis/BandApi';

const BandEditPC = React.memo(() => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {query: {slug}} = router;

  const {band, access} = useSelector(
    ({orm, system: {session: {access}}}: RootState) => ({
      access,
      band: pickBandSelector(slug as string)(orm) || {}
  }),
    shallowEqual,
  );
  const {band_type} = band || {} as any;

  React.useEffect(() => {
    dispatch(fetchBandThunk(new BandApi(access), slug));
  }, [access, slug]);

  const branch = React.useCallback(() => {
    switch(band_type) {
      case 'moa':
      case 'consultant':
        return <MoaEditPC/>;
      case 'hospital':
        return <HospitalEditPC band={band} />;
      default:
        return <Loading/>;
    }
  }, [band_type, band]);

  const DetailComp = branch();

  if (isEmpty(band)) {
    return <Loading/>;
  }

  if (!DetailComp) {
    return <Loading/>;
  }

  return DetailComp;
});

BandEditPC.displayName = 'BandEditPC';
export default loginRequired(BandEditPC);
