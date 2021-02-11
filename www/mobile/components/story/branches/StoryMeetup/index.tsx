import * as React from 'react';
import StorySimple from '../../StorySimple2';
import StoryDefault from '../StoryDefault/detail2';
import StoryMeetupDetail from './StoryMeetupDetail';
import {TStoryThemeType} from '../../../../src/reducers/theme';

interface Props {
  themeType: TStoryThemeType;
  detail: boolean;
}

const StoryMeetup = props => {
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
};

export default React.memo(StoryMeetup);
