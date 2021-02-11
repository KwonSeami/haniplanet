import * as React from 'react';
import StoryQnADetail from './detail';
import {TStoryThemeType} from '../../../../src/reducers/theme';
import StorySimple from '../../StorySimple2';

interface Props {
  themeType: TStoryThemeType;
  detail: boolean;
}

const StoryQnA: React.FC<Props> = React.memo(props => {
  const {
    themeType,
    detail
  } = props;

  const [isOpened, setIsOpened] = React.useState(false);

  const isDetail = (themeType === 'preview' || detail || isOpened);

  return (
    isDetail ? (
      <StoryQnADetail
        {...props}
        detail={isOpened || detail}
      />
    ) : (
      <StorySimple
        {...props}
        upCountOnly
        onClick={() => setIsOpened(true)}
      />
    )
  );
});

StoryQnA.displayName = 'StoryQnA';

export default StoryQnA;
