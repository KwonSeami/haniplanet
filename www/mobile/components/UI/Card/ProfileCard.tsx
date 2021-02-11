import * as React from 'react';
import {Waypoint} from 'react-waypoint';
import UserApi from '../../../src/apis/UserApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import styled from 'styled-components';
import {$BORDER_COLOR, $TEXT_GRAY} from '../../../styles/variables.types';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import isEmpty from 'lodash/isEmpty';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import Loading from '../../common/Loading';
import {fetchProfileInfo} from '../../../src/reducers/profile';
import cn from 'classnames';
import {RootState} from '../../../src/reducers';

export const ProfileCardDiv = styled.div`
  position: relative;
  max-width: 680px; 
  margin: auto;
  box-sizing: border-box;
  padding: 60px 0 20px 150px;
  border-top: 1px solid ${$BORDER_COLOR};

  h2 {
    position: absolute;
    left: 0;
    top: 16px;
    ${fontStyleMixin({
      size: 19,
    })};

    > span {
      display: inline-block;
      vertical-align: middle;
      padding-left: 7px;
      ${fontStyleMixin({
        size: 12,
        color: $TEXT_GRAY
      })};
    }
  }

  .error {
    display: block; 
    padding-top: 4px;
    margin-bottom: -5px;
    ${fontStyleMixin({
      size: 11,
      color: '#ea6060'
    })};
  }
`;

interface Props {
  title: string;
  subTitle?: React.ReactNode;
  className?: string;
  children: React.ComponentType | React.ReactNode;
  cardName?: TProfileFormName;
  id?: HashId;
  isMe?: boolean;
  showAddCard?: boolean;
  setShowAddTab?: (data: boolean) => void; 
  showType?: 'simple' | 'detail';
}

const ProfileCard = React.memo<Props>(({
  title,
  subTitle,
  cardName,
  children,
  id,
  setShowAddTab,
  className,
  isMe,
  showAddCard: _showAddCard,
  showType = 'simple'
}) => {
  const dispatch = useDispatch();

  const profile = useSelector(({profile}: RootState) => profile, shallowEqual);

  const userApi: UserApi = useCallAccessFunc(access => new UserApi(access));

  const [isFetched, setIsFetched] = React.useState(false);
  const [showAddCard, setShowAddCard] = React.useState(_showAddCard || false);

  const getProfileAdditionalInfo = () => {
    if (!userApi) {
      return <Loading/>;
    }

    dispatch(fetchProfileInfo(id, cardName));
  };

  React.useEffect(() => {
    if (!isEmpty(profile) && !isEmpty(profile[id])) {
      const {ids} = profile[id][cardName];

      if (!isEmpty(ids) || isMe || showType === 'detail') {
        setShowAddCard(true);
      }

      if (!isEmpty(ids) && !isMe) {
        setShowAddTab && setShowAddTab(true);
      }
    }
  }, [profile, id, cardName, isMe, showType]);

  React.useEffect(() => {
    if (isFetched && id) {
      getProfileAdditionalInfo();
    }
  }, [isFetched, id]);

  return (
    <Waypoint onEnter={() => setIsFetched(true)}>
      {!!showAddCard && (
        <ProfileCardDiv className={cn(className, {'my-profile-card': isMe})}>
          <h2>
            {title}
            {subTitle && (
              typeof subTitle === 'string' ? (
                <span>{subTitle}</span>
              ) : (
                subTitle
              )
            )}
          </h2>
          {children}
        </ProfileCardDiv>
      )}
    </Waypoint>
  );
});

ProfileCard.displayName = 'ProfileCard';
export default ProfileCard;
