import {saveBand, updateBand} from './bandReducer';
import {timeOver} from '../../../lib/date';
import {MINUTE} from '../../../constants/times';
import {pickBandSelector} from './selector';
import {updateQuestion} from '../../question';
import {LocalCache} from 'browser-cache-storage';
import moment from 'moment';
import BandApi from '../../../apis/BandApi';
import OnClassApi from '../../../apis/OnClassApi';

export const fetchBandThunk = (API: BandApi | OnClassApi, bandPK: HashId, duration = 30 * MINUTE) =>
  (dispatch, getState) => {
    const {system: {session: {access}}, orm} = getState();
    const api = API;
    const {retrieved_at} = pickBandSelector(bandPK)(orm) || {} as any;

    if (!retrieved_at || timeOver(retrieved_at, duration)) {
      const key = `band_${bandPK}_v2`;
      const uniqId = moment(new Date()).format('hh:mm');
      const cached = LocalCache.get(uniqId, key);
      if (cached) {
        dispatch(saveBand(cached));
      } else {
        api.retrieve(bandPK)
          .then(({data: {result}}) => {
            if (!!result) {
              const data = {
                ...result,
                retrieved_at: new Date().getTime(),
              };
              LocalCache.set(uniqId, key, data);
              dispatch(saveBand(data));
            }
          });
      }
    }
  };

export const patchBandThunk = (API: BandApi | OnClassApi, slug: string, bandForm: Indexable, callback?: () => void) =>
  (dispatch, getState) => {
    const {system: {session: {access}}} = getState();
    const api = API;

    const form = new FormData();

    Object.keys(bandForm).forEach(value => {
      (form as FormData).append(value, value === 'questions_map'
        ? JSON.stringify(bandForm[value])
        : bandForm[value]
      );
    });

    api.partial_update(slug, form)
      .then(({data: {result}}) => {
        if (!!result) {
          dispatch(updateBand(slug, result));
  
          if (bandForm.hasOwnProperty('questions_map')) {
            const question = {}; 
            const entries = Object.entries(bandForm.questions_map);
  
            entries.forEach(v => {
              const [key, value] = v;
  
              question[key] = {
                id: key,
                question: value
              };
            });
  
            dispatch(updateQuestion({slug, payload: question}));
          }
  
          callback && callback();
        }
      });
  };
