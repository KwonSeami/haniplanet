import {HashId} from '@hanii/planet-types';
import {TUserType} from './story';
import {Indexable} from '../../../../packages/types';
import {Id} from '../../../../packages/types';

interface IMeetUp extends IParty, Retrieve {}

export interface IPriceInfo {
  id: HashId;
  name: string;
  text: string;
  price: number;
  sale_price: number;
  sale_start_at: string;
  sale_end_at: string;
  user_types: TUserType;
  key: string;
  value: boolean;
  course_period: number;
}

export interface IMyApply {
  id: HashId;
  title: string;
  pay_method: 'card' | 'kakaopay';
  answers: {
    id: HashId;
    question: {
      id: HashId;
      question: string;
    };
    answer: string;
  },
  created_at: string;
  price: number;
  product_name: string;
}

export interface IOnClassPeriod {
  start_at: string;
  end_at: string;
  learning_status: string;
}

export interface IOptionState {
  itemById: Indexable;
  items: Id[];
}

export interface IMeetupAnswer {
  product_id: string;
  answer: string;
}

export type TOptionState = [IOptionState, React.Dispatch<React.SetStateAction<IOptionState>>];
