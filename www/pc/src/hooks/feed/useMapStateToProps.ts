import {useRouter} from 'next/router';
import {useSelector, shallowEqual} from 'react-redux';
import {RootState} from '../../reducers';
import {makeFeedKey} from '../../lib/feed';
import {pickStorySelector} from '../../reducers/orm/story/selector';

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
    shallowEqual
  );
};

export default useMapStateToProps;
