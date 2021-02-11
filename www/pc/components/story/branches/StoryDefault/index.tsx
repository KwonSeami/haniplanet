import * as React from 'react';
import {TStoryThemeType} from '../../../../src/reducers/theme';
import StorySimple from '../../StorySimple';
import StoryDetailCard from './StoryDetailCard';
import {fetchStoryThunk} from '../../../../src/reducers/orm/story/thunks';
import StoryDefaultDetail from './StoryDetail';
import {useDispatch} from 'react-redux';
import {USER_TYPE_TO_KOR} from '../../../../src/constants/users';
import {HashId} from '@hanii/planet-types';
import isEmpty from 'lodash/isEmpty';

interface Props {
  themeType: TStoryThemeType;
  detail: boolean;
  allowDetail?: boolean;
  fixedView?: boolean;
  onlineView?: boolean;
  onClick: () => void;
  id: HashId;
  user_types: TUserTypes[];
  is_admin ?: boolean;
}

type TUserTypes = ['doctor' | 'student'];

const StoryDefault: React.FC<Props> = React.memo(props => {
  const {themeType, detail, allowDetail = true, fixedView = false, user_types, is_admin = false} = props;

  const [isOpened, setIsOpened] = React.useState(false);
  const isDetail = (themeType === 'preview' || detail || isOpened);

  const dispatch = useDispatch();

  const detailViewAlert = () => {
    if (!isEmpty(user_types) && !is_admin)
      alert(`${USER_TYPE_TO_KOR[user_types[0]]} 계정만 접속 가능한 공간입니다.`);
  };

  if (isOpened) {
    return (
      <StoryDefaultDetail
        onClick={() => setIsOpened(false)}
        {...props}
      />
    )
  } else if (!isDetail || fixedView) {
    return (
      <StorySimple
        allowDetail={allowDetail}
        onClick={
          () => allowDetail
            ? setIsOpened(true)
            : detailViewAlert()
        }
        {...props}
      />
    );
  }

  return (
    <StoryDetailCard
      {...props}
      allowDetail={allowDetail}
      onClick={() => {
        if (allowDetail) {
          setIsOpened(true);
          dispatch(fetchStoryThunk(props.id));
        } else {
          detailViewAlert()
        }
      }}
    />
  );
});

StoryDefault.displayName = 'StoryDefault3';

export default StoryDefault;
