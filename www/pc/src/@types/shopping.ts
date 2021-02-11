import {IStory} from "./story";
import {HashId} from '@hanii/planet-types';

interface IGoods {
  origin?: string;
  body_image?: string;
  manufacturer?: string
  min_amount?: number;
  max_amount?: number;
  capacity?: number;
  delivery_fee?: number
  delivery_fee_free_over?: number;
  as_notice?: string;
  exchange_notice?: string
  delivery_notice?: string;
  refund_notice?: string;
  detail_name?: string;
  volume?: number;
  weight?: number;
  kc_expose?: boolean;
  kc_number?: string;
}

export interface IProduct {
  id: string;
  name: string;
  price: number;
  sale_price?: number
  sale_start_at?: string;
  sale_end_at?: string;
  capacity?: null | number;
}

export interface IStoryGoods extends IStory {
  products: IProduct[];
  goods: IGoods;
}

export interface ICartItemProps {
  id: HashId;
  storyId: string;
  thumbnail?: string;
  title: string;
  name: string;
  text?: string;
  quantity: number;
  price: number;
  sale_price?: number;
  sale_start_at?: string;
  sale_end_at?: string;
  delivery_fee: number;
}

export interface IAddress {
  id: string;
  name: string;
  phone: string;
  zonecode: string;
  road_address?: string;
  jibun_address: string;
  address_detail?: string;
  can_receive_on_weekend?: boolean;
  request?: string;
};