import * as React from 'react';
import BandApi from '../../apis/BandApi';
import useCallAccessFunc from '../session/useCallAccessFunc';
import {useDispatch, useSelector} from 'react-redux';
import {fetchBandThunk} from '../../reducers/orm/band/thunks';
import {pickBandSelector} from '../../reducers/orm/band/selector';
import isEqual from 'lodash/isEqual';
import {fetchQuestionThunk} from '../../reducers/question';
import useSetPageNavigation from '../useSetPageNavigation';

const useBandOpened = (slug: string) => {
  const dispatch = useDispatch();

  const bandApi: BandApi = useCallAccessFunc(access => new BandApi(access));

  const [openedInfo, setOpenedInfo] = React.useState({});
  const [pending, setPending] = React.useState(true);

  // Custom Hooks
  useSetPageNavigation('/band');

  const {band, question} = useSelector(
    ({orm, question}) => ({
      band: pickBandSelector(slug)(orm),
      question
    }),
    (prev, curr) => isEqual(prev, curr)
  );

  const getOpenedBandInfo = React.useCallback(() => {
    bandApi.me(slug)
      .then(({data: {result}}) => {
        !!result && setOpenedInfo(result);
        setPending(false);
      })
      .catch(() => setPending(false));
  }, [slug]);

  React.useEffect(() => {
    dispatch(fetchBandThunk(bandApi, slug));
    dispatch(fetchQuestionThunk(slug));
    getOpenedBandInfo();
  }, [slug, getOpenedBandInfo]);

  return {
    band,
    pending,
    question,
    openedInfo
  };
};

export default useBandOpened;
