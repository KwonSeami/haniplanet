import {HashId} from "@hanii/planet-types";

type TSelectType = 'all' | 'seminar' | 'meetup' | 'funding';

interface ICarrierData {
  id: HashId;
  carrier_id: string;
  name?: string;
  tel?: string

}

export interface ITrackData {
  progress: string;
  track_id?: string;
  delivery_fee: number;
  carrier?: ICarrierData
}

interface IPaymentPgData {
  created_at: string;
  img_uid: string;
  pay_method: string;
}

export interface IPaymentData {
  id: HashId;
  merchant_uid?: string;
  created_at: string;
  current_price: number;
  price: number;
  status: TSelectType;
  title: string;
  payment?: IPaymentPgData;
  track?: ITrackData;
} 