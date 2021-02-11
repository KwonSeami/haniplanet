import * as React from 'react';
import useSaveApiResult from '../useSaveApiResult';
import useCallAccessFunc from '../session/useCallAccessFunc';
import {axiosInstance} from '@hanii/planet-apis';
import {BASE_URL} from '../../constants/env';

export interface IPaymentDetail {
  id: HashId;
  title: string;
  created_at: string;
  merchant_uid: string;
  status: 'ok' | 'ongoing' | 'refund' | 'partial-refund';
  payment: IPayment;
  is_able_to_cancel: boolean;
  price: number;
  sale_perc: number;
  cancels: ICancel[];
}

export interface IPayment {
  id: HashId;
  pay_method: string;
  card_code: number;
  card_quota: number;
  receipt_url: string;
}

interface ICancel {
  id: HashId;
  price: number;
  reason: string;
  quantity: number;
  cancel_type: 'all' | 'partial';
}

type TUseDetail = (userPk: HashId, id: HashId) => IPaymentDetail

const useDetail: TUseDetail = (userPk, id) => {
  const storyApi = useCallAccessFunc(access => (
    access ? axiosInstance({token: access, baseURL: BASE_URL}) : null
  ));
  const storyGetApi = React.useMemo(() => (
    (storyApi && userPk) ? storyApi.get : null
  ), [userPk, storyApi]);
  const {resData, setPk} = useSaveApiResult(storyGetApi, `/user/${userPk}/apply/${id}/`);

  React.useEffect(() => {
    setPk(`/user/${userPk}/apply/${id}/`);
  }, [userPk, id]);

  return resData;
};

export default useDetail;
