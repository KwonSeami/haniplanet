import * as React from 'react';
import ProfileCard from '../UI/Card/ProfileCard';
import isEmpty from 'lodash/isEmpty';
import ProfileBriefForm from './form/ProfileBriefForm';
import styled from 'styled-components';
import {toDateFormat} from '../../src/lib/date';
import StyledSelectBox from './style/common/StyledSelectBox';
import cn from 'classnames';
import {ProfileItemLi} from './style/styleCompPC';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {$FONT_COLOR} from '../../styles/variables.types';
import {
  appendProfileForm,
  patchProfileForm,
  deleteProfileForm,
  swapProfileForm,
} from '../../src/reducers/profile';
import uuid from 'uuid/v4';
import {RootState} from '../../src/reducers';

const BriefDiv = styled.div`
`;

const StyledProfileBriefForm = styled(ProfileBriefForm)`
  input::placeholder {
    color: ${$FONT_COLOR};
  }
`;

interface Props extends IProfileCommonProps {
  selectBox?: React.ReactNode;
}

const ProfileBriefItem: React.FC<
  TProfileFormParamsExceptId<IProfileBrief>
> = React.memo(({
  start_at,
  end_at,
  title
}) => (
  <ProfileItemLi>
    <span className="status-date">
      {toDateFormat(start_at, 'YYYY.MM')} - {toDateFormat(end_at, 'YYYY.MM')}
    </span>
    {title}
  </ProfileItemLi>
));

const ProfileBrief: React.FC<Props> = React.memo(({
  selectBox,
  id: userPk,
  className,
  isMe,
  setShowAddTab,
  showType = 'simple',
  subTitle,
}) => {
  const dispatch = useDispatch();

  const profile = useSelector(
    ({profile}: RootState) => profile[userPk],
    shallowEqual
  );

  const [unSavedForms, setUnSavedForms] = React.useState([]);

  const {ids, data} = (!isEmpty(profile) && !isEmpty(profile.brief))
    ? profile.brief
    : {ids: [], data: {}};

  React.useEffect(() => {
    if (!isEmpty(profile?.brief) && isEmpty(profile?.brief?.ids) && isEmpty(unSavedForms)) {
      setUnSavedForms([uuid()]);
    }
  }, [profile, unSavedForms]);
  
  return (
    <ProfileCard
      title="약력"
      subTitle={subTitle}
      cardName="brief" 
      id={userPk}
      className={cn(className, 'clearfix')}
      setShowAddTab={setShowAddTab}
      isMe={isMe}
      showType={showType}
    >
      <BriefDiv className={cn({me: isMe})}>
        {isMe ? (
          <>
            {selectBox}
            {ids.map((id, index) => data[id] && ( 
              <ProfileBriefForm
                key={id}
                {...data[id]}
                index={index}
                lastIndex={ids.length - 1}
                type="EDIT"
                isAddBtnVisible={isEmpty(unSavedForms) && index === ids.length - 1}
                onCreateForm={() => setUnSavedForms(curr => ([
                  ...curr,
                  uuid()
                ]))}
                onDeleteForm={formId => {
                  dispatch(deleteProfileForm({
                    name: 'brief',
                    userPk,
                    formId
                  }));
                }}
                onEditForm={(formId, form, callback) => {
                  dispatch(patchProfileForm<IProfileBrief>({
                    name: 'brief',
                    formId,
                    form,
                    userPk,
                    callback
                  }));
                }}
                onSwapData={(currIdx: number, swapIdx: number) => {
                  dispatch(swapProfileForm({
                    name: 'brief',
                    userPk,
                    ids,
                    currId: ids[currIdx],
                    swapId: ids[swapIdx]
                  }));
                }}
              />
            ))}
            {unSavedForms.map((hashId, index) => (
              <ProfileBriefForm
                key={hashId}
                id={hashId}
                isAddBtnVisible={index === unSavedForms.length - 1}
                type="ADD"
                onCreateForm={() => setUnSavedForms(curr => ([
                  ...curr,
                  uuid()
                ]))}
                onFilterUnSavedForm={id =>
                  setUnSavedForms(curr => curr.filter(_id => id !== _id))
                }
                onAddForm={(form, callback) => {
                  dispatch(appendProfileForm<IProfileBrief>({
                    name: 'brief',
                    form,
                    userPk,
                    callback
                  }));
                }}
              />
            ))}
          </>
        ) : (
          showType === 'simple' ? (
            !isEmpty(ids) && (
              <ul>
                {ids.map(id => data[id] && (
                  <ProfileBriefItem
                    key={id}
                    {...data[id]}
                  />
                ))}
              </ul>
            )
          ) : (
            !isEmpty(ids) ? (
              ids.map(id => data[id] && (
                <ProfileBriefForm
                  key={id}
                  {...data[id]}
                  controllable={false}
                />
              ))
            ) : (
              <StyledProfileBriefForm controllable={false}/>
            )
          )
        )}
      </BriefDiv>
    </ProfileCard>
  );
});

ProfileBrief.displayName = 'ProfileBrief';

export default ProfileBrief;
