import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { pickBandSelector } from '../../../src/reducers/orm/band/selector';
import { fetchBandThunk } from '../../../src/reducers/orm/band/thunks';
import MoaDetailPC from '../../../components/moa/detail.pc';
import HospitalDetail from '../../../components/hospital/detail.pc';
import { useRouter } from 'next/router';
import Loading from '../../../components/common/Loading';
import { parseCookies } from "nookies";
import BandApi from '../../../src/apis/BandApi';
import { saveBand } from "../../../src/reducers/orm/band/bandReducer";
import ErrorController from "../../../components/errors/ErrorController";
import useSetPageNavigation from '../../../src/hooks/useSetPageNavigation';
import {BASE_URL} from '../../../src/constants/env';
import { nodeAxiosInstance } from '../../../src/lib/axios';

interface Props {
  session: ISessionState;
  match: any;
}

const BandDetailPC = React.memo<Props>((props) => {
    const { pageProps: { status, message } } = props;
    const router = useRouter();
    const { slug } = router.query;
    const { session: { access }, band } = useSelector(
      ({ system: { session }, orm }) => ({
        session, band: pickBandSelector(slug)(orm),
      }),
      shallowEqual,
    );
    const dispatch = useDispatch();
    const { band_type } = band || {} as any;

    React.useEffect(() => {
      dispatch(fetchBandThunk(new BandApi(access), slug));
      // band_type 이 없으면 band 데이터를 누실한 것이므로 다시 불러와야 함
    }, [access, slug]);

    // Custom Hooks
    useSetPageNavigation(
      ['moa', 'consultant'].includes(band_type)
        ? '/band'
        : `/${band_type}`
    );

    const branch = React.useCallback(() => {
      switch (band_type) {
        case 'moa':
        case 'consultant':
          return MoaDetailPC;
        case 'hospital':
          return HospitalDetail;
        default:
          return Loading;
      }
    }, [band_type]);

    const DetailComp = branch();

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
  },
);

BandDetailPC.displayName = 'BandDetailPC';
BandDetailPC.getInitialProps = async (ctx) => {
  const { access } = parseCookies(ctx);
  const { query: { slug } } = ctx;

  try {
    const {status, data: {result}} = await nodeAxiosInstance({
      token: access,
      baseURL: BASE_URL,
    }).get(`/band/${encodeURIComponent(slug)}/`);

    ctx.store.dispatch(saveBand({ ...result, slug }));

    return { slug, band: result, status };
  } catch (err) {
    return { status: 404 };
  }
};

export default BandDetailPC;
