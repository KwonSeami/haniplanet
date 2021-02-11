import ExploreApi from '../../apis/ExploreApi';
import {saveCommunity} from './';

export const fetchCommunityThunk = () => 
  (dispatch, getState) => {
    const {system: {session: {access}},
    } = getState();

      new ExploreApi(access).main()
        .then(({data: {result}}) => {
          dispatch(saveCommunity(result));
        })
        .catch(error => {
          console.error(error)
        });
  };
