import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {pickBandSelector} from '../../../src/reducers/orm/band/selector';
import HospitalDetailMobile from '../../../components/hospital/detail.mobile';
import MoaDetailMobile from '../../../components/moa/detail.mobile';
import {fetchBandThunk} from '../../../src/reducers/orm/band/thunks';
import {useRouter} from 'next/router';
import {parseCookies} from "nookies";
import {saveBand} from '../../../src/reducers/orm/band/bandReducer';
import ErrorController from "../../../components/errors/ErrorController";
import Loading from "../../../components/common/Loading";
import {nodeAxiosInstance} from '../../../src/lib/axios';
import { BASE_URL } from '../../../src/constants/env';
import BandApi from '../../../src/apis/BandApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';

interface Props {
  session: ISessionState;
  match: any;
}

const BandDetailMobile = React.memo<Props>((props) => {
  const {pageProps: {status, message}} = props;
  const router = useRouter();
  const {slug} = router.query;
  const {session: {access}, band} = useSelector(
    ({system: {session}, orm}) => ({
      session, band: pickBandSelector(slug)(orm),
    }),
    shallowEqual,
  );
  const dispatch = useDispatch();
  const {band_type} = band || {} as any;
  const bandApi: BandApi = useCallAccessFunc(access => new BandApi(access));

  const DetailComp = React.useMemo(() => {
    switch (band_type) {
      case 'moa':
        return MoaDetailMobile;
      case 'consultant':
        return MoaDetailMobile;
      case 'hospital':
        return HospitalDetailMobile;
      default:
        return Loading;
    }
  }, [band_type]);

  React.useEffect(() => {
    dispatch(fetchBandThunk(bandApi, slug));
  }, [slug]);

  if (isEmpty(band)) {
    if (status !== 200) {
      return <ErrorController status={status} message={message}/>;
    } else {
      return <Loading/>;
    }
  }

  return (
    <DetailComp
      band={band}
      access={access}
      {...props}
    />
  );
});

BandDetailMobile.displayName = 'BandDetailMobile';
BandDetailMobile.getInitialProps = async (ctx) => {
  const {access} = parseCookies(ctx);
  const {query: {slug}} = ctx;

  try {
    const {status, data: {result}} = await nodeAxiosInstance({
      token: access,
      baseURL: BASE_URL,
    }).get(`/band/${encodeURIComponent(slug)}/`);

    ctx.store.dispatch(saveBand({ ...result, slug }));

    return {slug, band: result, status};
  } catch (err) {
    return {status: 404};
  }
};

export default BandDetailMobile;
