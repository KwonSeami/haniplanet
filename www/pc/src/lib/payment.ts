import {IS_PROD_SERVER} from '../constants/env';

const IMP_KEY = IS_PROD_SERVER ? 'imp07711701' : 'imp76243438';

export type TPayValue = 'card' | 'kakaopay';

interface IPayMethod {
  value: TPayValue;
  label: string;
}

export const PAY_METHOD: IPayMethod[] = [
  {value: 'card', label: '신용카드'},
  {value: 'kakaopay', label: '카카오페이'},
];

interface IRequestPay {
  pay_method: 'card' | 'kakaopay';
  merchant_uid: string;
  name: string;
  amount: number;
  custom_data?: string;
  m_redirect_url?: string;
  buyer_tel?: string;
  buyer_name?: string;
  buyer_email?: string;
  onSuccess?: (res: any) => void;
}

export const IMPPayment = ({
  pay_method,
  merchant_uid,
  name,
  amount,
  custom_data,
  m_redirect_url,
  buyer_tel,
  buyer_name,
  buyer_email,
  onSuccess,
}: IRequestPay) => {
  const {IMP} = window;

  IMP.init(IMP_KEY);
  IMP.request_pay({
    pg: pay_method === 'kakaopay' ? 'kakaopay' : 'html5_inicis',
    pay_method: pay_method !== 'kakaopay' && pay_method,
    merchant_uid,
    name,
    amount,
    custom_data,
    m_redirect_url,
    buyer_tel,
    buyer_name,
    buyer_email,
    onSuccess,
  }, (res) => {
    if (res.success) {
      onSuccess && onSuccess(res);
    } else {
      alert('결제에 실패했습니다.');
    }
  });
};
