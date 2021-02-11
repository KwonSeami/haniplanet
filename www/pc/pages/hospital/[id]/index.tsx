import * as React from 'react';
import HospitalDetail from '../../../components/hospital/detail.pc';
import {axiosInstance} from '@hanii/planet-apis';
import BandApi from '../../../src/apis/BandApi';
import {parseCookies} from 'nookies';
import Page404 from "../../../components/errors/Page404";
import {BASE_URL} from '../../../src/constants/env';

const OldHospitalDetail = ({pageProps: {band, status}, ...props}) => {
  return status === 200 ? (
    <HospitalDetail band={band} {...props} />
  ) : (
    <Page404/>
  )
};
OldHospitalDetail.getInitialProps = async (ctx) => {
  const {query} = ctx;
  try {
    const {data: {slug}} = await axiosInstance({token: null, baseURL: BASE_URL}).get(`${BASE_URL}/hospital/${query.id}/`);

    const {access} = parseCookies(ctx);
    const api = new BandApi(access);

    const {status, data: {result}} = await api.retrieve(encodeURIComponent(slug));
    return {slug, band: result, status};

  } catch(err){
    return {slug: null, band: {}, status: 404};
  }
};

export default OldHospitalDetail;
