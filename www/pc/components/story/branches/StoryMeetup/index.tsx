import * as React from 'react';
import StoryDefault from '../StoryDefault/index2';
import StorySimple from '../../StorySimple';
import StoryMeetupDetail from './StoryMeetupDetail';
import {TStoryThemeType} from '../../../../src/reducers/theme';

interface Props {
  themeType: TStoryThemeType;
  detail: boolean;
}

const StoryMeetuo = React.memo<Props>(props => {
  const {themeType, detail} = props;
  const [isOpened, setIsOpened] = React.useState(false);
  const isDetail = (themeType === 'preview' || detail || isOpened);

  return (
    isDetail ? (
      detail ? (
        <StoryMeetupDetail {...props} detail />
      ) : (
        <StoryDefault {...props} detail={isOpened || detail} />
      )
    ) : (
      <StorySimple
        {...props}
        upCountOnly
        onClick={() => setIsOpened(true)}
      />
    )
  );
});

StoryMeetuo.displayName = 'StoryMeetuo';

export default StoryMeetuo;
