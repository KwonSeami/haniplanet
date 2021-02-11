import {useRouter} from 'next/router';
import {useSelector} from 'react-redux';
import {RootState} from '../../reducers';
import {makeFeedKey} from '../../lib/feed';
import {pickStorySelector} from '../../reducers/orm/story/selector';
import isEqual from 'lodash/isEqual';

const useMapStateToProps = () => {
  const {asPath} = useRouter();

  return useSelector(
    ({system: {session: {access}}, feed, orm}: RootState) => {
      const currentFeed = feed[makeFeedKey(asPath)];
      
      return {
        access,
        pending: currentFeed ? currentFeed.pending : true,
        currentFeed: currentFeed && {
          ...currentFeed,
          ids: currentFeed.ids.map(storyId => {
            const [id, ..._] = storyId.split('-');
            const story = pickStorySelector(id)(orm);

            if (!story) return null;

            return {
              ...story,
              storyId
            };
          }),
        },
      };
    },
    (prev, curr) => isEqual(prev, curr)
  );
};

export default useMapStateToProps;
