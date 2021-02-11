import BandApi from '../../../../src/apis/BandApi';
import useCallAccessFunc from '../../../../src/hooks/session/useCallAccessFunc';
import useSaveApiResult from '../../../../src/hooks/useSaveApiResult';

const getMyMoaList = (band_type: string) => {
  const badnApi: BandApi = useCallAccessFunc(access => access ? new BandApi(access) : null);
  const {resData} = useSaveApiResult(() => badnApi && badnApi.myBand({band_type}));

  return resData;
};

export default getMyMoaList;
