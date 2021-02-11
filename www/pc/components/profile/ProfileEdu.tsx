import * as React from 'react';
import styled from 'styled-components';
import ProfileCard from '../UI/Card/ProfileCard';
import isEmpty from 'lodash/isEmpty';
import ProfileEduForm from './form/ProfileEduForm';
import {$FONT_COLOR} from '../../styles/variables.types';
import {toDateFormat} from '../../src/lib/date';
import {PROGRESS_STATUS_TO_KOR, DEGREE_TYPE_TO_KOR} from '../../src/constants/profile';
import StyledSelectBox from './style/common/StyledSelectBox';
import {ProfileItemLi, StyledLabel} from './style/styleCompPC';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {
  appendProfileForm,
  patchProfileForm,
  deleteProfileForm,
  swapProfileForm
} from '../../src/reducers/profile';
import cn from 'classnames';
import {RootState} from '../../src/reducers';
import uuid from 'uuid/v4';

const StyledProfileEduForm = styled(ProfileEduForm)`
  input::placeholder {
    color: ${$FONT_COLOR};
  }
`;

interface Props extends IProfileCommonProps {
  className?: string;
  selectBox?: React.ReactNode;
}

const ProfileEduItem: React.FC<
  TProfileFormParamsExceptId<IProfileEdu>
> = React.memo(({
  admission_at,
  graduate_at,
  progress_status,
  school_name,
  degree_type
}) => (
  <ProfileItemLi>
    <span className="status-date">
      {toDateFormat(admission_at, 'YYYY.MM')} - {toDateFormat(graduate_at, 'YYYY.MM')}
      <strong>{PROGRESS_STATUS_TO_KOR[progress_status]}</strong>
    </span>
    {school_name}
    <StyledLabel
      name={DEGREE_TYPE_TO_KOR[degree_type]}
      color={$FONT_COLOR}
      borderColor="#999"
    />
  </ProfileItemLi>
));

const ProfileEdu: React.FC<Props> = React.memo(({
  id: userPk,
  setShowAddTab,
  className,
  selectBox,
  isMe,
  showType = 'simple',
  subTitle
}) => {
  const dispatch = useDispatch();

  const profile = useSelector(
    ({profile}: RootState) => profile[userPk],
    shallowEqual
  );

  const [unSavedForms, setUnSavedForms] = React.useState([]);

  const {ids, data} = (!isEmpty(profile) && !isEmpty(profile.edu))
    ? profile.edu
    : {ids: [], data: {}};
  
  React.useEffect(() => {
    if (!isEmpty(profile?.edu) && isEmpty(profile?.edu?.ids) && isEmpty(unSavedForms)) {
      setUnSavedForms([uuid()]);
    }
  }, [profile, unSavedForms]);

  return (
    <ProfileCard
      title="학력"
      subTitle={subTitle}
      cardName="edu"
      className={cn(className, 'clearfix')}
      id={userPk}
      setShowAddTab={setShowAddTab}
      isMe={isMe}
      showType={showType}
    >
      <div>
        {isMe ? (
          <>
            {selectBox}
            {ids.map((id, index) => data[id] && (
              <ProfileEduForm 
                key={id}
                {...data[id]}
                index={index}
                lastIndex={ids.length - 1}
                isAddBtnVisible={isEmpty(unSavedForms) && index === ids.length - 1}
                type="EDIT"
                onCreateForm={() => setUnSavedForms(curr => ([
                  ...curr,
                  uuid()
                ]))}
                onDeleteForm={formId => {
                  dispatch(deleteProfileForm({
                    name: 'edu',
                    userPk,
                    formId
                  }));
                }}
                onEditForm={(formId, form, callback) => {
                  dispatch(patchProfileForm<IProfileEdu>({
                    name: 'edu',
                    formId,
                    form,
                    userPk,
                    callback
                  }));
                }}
                onSwapData={(currIdx: number, swapIdx: number) => {
                  dispatch(swapProfileForm({
                    name: 'edu',
                    userPk,
                    ids,
                    currId: ids[currIdx],
                    swapId: ids[swapIdx]
                  }));
                }}
              />
            ))}
            {unSavedForms.map((hashId, index) => (
              <ProfileEduForm
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
                  dispatch(appendProfileForm<IProfileEdu>({
                    name: 'edu',
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
                  <ProfileEduItem
                    key={id}
                    {...data[id]}
                  />
                ))}
              </ul>
            )
          ) : (
            !isEmpty(ids) ? (
              ids.map(id => data[id] && (
                <ProfileEduForm
                  key={id}
                  {...data[id]}
                  controllable={false}
                />
              ))
            ) : (
              <StyledProfileEduForm controllable={false}/>
            )
          )
        )}
      </div>
    </ProfileCard>
  );
});

ProfileEdu.displayName = 'ProfileEdu';

export default ProfileEdu;
