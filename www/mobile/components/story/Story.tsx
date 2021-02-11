import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';
import {withRouter} from 'next/router';
import {useSelector} from 'react-redux';
import StoryDefault from './branches/StoryDefault/index';
import StoryAd from './branches/StoryAd';
import StoryQnA from './branches/StoryQnA';
import StoryAdMobile from './StoryAdMobile';
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import {IStory} from '../../src/@types/story';
import {OPEN_RANGE_TO_KOR_LABEL, MAIN_USER_TYPES} from '../../src/constants/users';
import StoryProfessor from "./branches/StoryProfessor";
import StoryModunawa from "./branches/StoryModunawa";
import StoryMeetup from './branches/StoryMeetup';
import {waterMarkOptions} from './story.config';

interface Props extends IStory {
  className?: string;
  storyIdx: number;
  priceTable?: boolean;
  highlightKeyword?: string;
}

const securityAlarm = () => {
  console.log('State Security Alarm');
};

const Story = React.memo<Props>(props => {
  const {id, open_range, user_types, user, extend_to, detail} = props;

  const {
    access,
    theme: {type: themeType},
    me: {id: myId, name: myName},
  } = useSelector(
    ({system: {session: {access, id}}, orm, theme}) => ({
      me: pickUserSelector(id)(orm) || {},
      access,
      theme
    }),
    (prev, curr) => isEqual(prev, curr)
  );

  // Variables
  const labelArr = React.useMemo<Array<keyof typeof OPEN_RANGE_TO_KOR_LABEL>>(() => {
    const tempArr = !user ? ['anonymous'] : [];

    tempArr.push(open_range);

    if (user_types === null || isEmpty(user_types)) {
      return tempArr;
    } else if (!isEqual(MAIN_USER_TYPES, sortBy(user_types))) {
      return [...tempArr, ...user_types];
    }

    return tempArr;
  }, [user, open_range, user_types]);

  const [waterMarkProps, setWaterMarkProps] = React.useState({
    waterMarkText: `${myName}_${myId}`,
    securityAlarm,
    options: waterMarkOptions,
    openSecurityDefense: true,
  });

  React.useEffect(() =>  {
    if (waterMarkProps.waterMarkText !== `${myName}_${myId}`) {
      setWaterMarkProps(curr => ({
        ...curr,
        waterMarkText: `${myName}_${myId}`,
      }))
    }
  }, [waterMarkProps.waterMarkText, myName, myId]);

  const injectProps = {
    labelArr,
    access,
    waterMarkProps,
    isMeetup: extend_to === 'meetup',
    isWriter: user && user.is_writer,
    themeType,
    detail,
    ...props,
  };
  const branch = React.useCallback(() => {
    switch (extend_to) {
      case 'ad':
        // 해당 부분만 예외적으로 PC, 모바일 번들 파일 분리 X
        return process.env.RUN_ENV === 'pc'
          ? StoryAd
          : StoryAdMobile;
      case 'qna':
        return StoryQnA;
      case 'meetup':
        return StoryMeetup;
      case 'professor':
        return StoryProfessor;
      case 'price_comparison':
        return StoryModunawa;
      default:
        return StoryDefault;
    }
  }, [extend_to]);
  const Branch = branch();

  return (
    <div id={`story_${id}`}>
      <Branch {...injectProps} />
    </div>
  );
});

export default withRouter(Story);

