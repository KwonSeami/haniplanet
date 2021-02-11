import * as React from 'react';
import StoryDefaultDetail from './detail';
import {TStoryThemeType} from '../../../../src/reducers/theme';
import StorySimple from '../../StorySimple';

interface Props {
  themeType: TStoryThemeType;
  detail: boolean;
  onClick: () => void;
  id: HashId;
}

const StoryDefault: React.FC<Props> = React.memo(props => {
  const {themeType, detail} = props;

  const [isOpened, setIsOpened] = React.useState(false);
  const isDetail = (themeType === 'preview' || detail || isOpened);

  return (
    isDetail ? (
      <StoryDefaultDetail
        {...props}
        detail={detail}
        onClick={() => setIsOpened(false)}
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
