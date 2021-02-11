import * as React from 'react';
import StoryDefaultDetail from './detail';
import {TStoryThemeType} from '../../../../src/reducers/theme';
import StorySimple from '../../StorySimple2';

interface Props {
  themeType: TStoryThemeType;
  detail: boolean;
}

const StoryDefault: React.FC<Props> = React.memo(props => {
  const {
    themeType,
    detail
  } = props;

  const [isOpened, setIsOpened] = React.useState(false);

  const isDetail = (themeType === 'preview' || detail || isOpened);

  return (
    isDetail ? (
      <StoryDefaultDetail
        {...props}
        detail={isOpened || detail}
      />
    ) : (
      <StorySimple
        {...props}
        onClick={() => setIsOpened(true)}
      />
    )
  );
});

StoryDefault.displayName = 'StoryDefault';

export default StoryDefault; 
