import * as React from 'react';
import ProfileCard from '../UI/Card/ProfileCard';
import isEmpty from 'lodash/isEmpty';
import ProfileLicenseForm from './form/ProfileLicenseForm';
import {$FONT_COLOR, $TEXT_GRAY} from '../../styles/variables.types';
import {toDateFormat} from '../../src/lib/date';
import StyledSelectBox from './style/common/StyledSelectBox';
import {ProfileItemLi, StyledLabel} from './style/styleCompPC';
import styled from 'styled-components';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {
  appendProfileForm,
  patchProfileForm,
  deleteProfileForm
} from '../../src/reducers/profile';
import {RootState} from '../../src/reducers';
import uuid from 'uuid/v4';

const StyledProfileCard = styled(ProfileCard)`
  h2 {
    span {
      color: ${$TEXT_GRAY};
    }
  }
`;

interface Props extends IProfileCommonProps {
}

const ProfileLicenseItem: React.FC<
  TProfileFormParamsExceptId<IProfileLicense>
> = React.memo(({
  acquisition_at,
  is_specialist,
  organization
}) => (
  <ProfileItemLi>
    <span className="status-date">
      {toDateFormat(acquisition_at, 'YYYY.MM')}
    </span>  
    {is_specialist && (
      <StyledLabel
        name="전문의"
        color={$FONT_COLOR}
        borderColor="#999"
      />
    )}
    {organization} {name}
  </ProfileItemLi>
));

const ProfileLicense: React.FC<Props> = React.memo(({
  selectValue,
  selectOption,
  onSelectClick,
  id: userPk,
  isMe,
  setShowAddTab,
  className,
  showType = 'simple',
  subTitle
}) => {
  const dispatch = useDispatch();

  const profile = useSelector(
    ({profile}: RootState) => profile[userPk],
    shallowEqual
  );

  const [unSavedForms, setUnSavedForms] = React.useState([]);

  const {ids, data} = (!isEmpty(profile) && !isEmpty(profile.license))
    ? profile.license
    : {ids: [], data: {}};

  React.useEffect(() => {
    if (!isEmpty(profile?.license) && isEmpty(profile?.license?.ids) && isEmpty(unSavedForms)) {
      setUnSavedForms([uuid()]);
    }
  }, [profile, unSavedForms]);

  return (
    <StyledProfileCard
      title="면허증/자격증"
      subTitle={subTitle}
      cardName="license"
      className={className}
      id={userPk}
      setShowAddTab={setShowAddTab}
      isMe={isMe}
      showType={showType}
    >
      <div>
        {isMe ? (
          <>
            <StyledSelectBox
              value={selectValue}
              option={selectOption}
              onChange={onSelectClick}
            />
            {ids.map((id, index) => data[id] && (
              <ProfileLicenseForm
                key={id}
                {...data[id]}
                type="EDIT"
                isAddBtnVisible={isEmpty(unSavedForms) && index === ids.length - 1}
                onCreateForm={() => setUnSavedForms(curr => ([
                  ...curr,
                  uuid()
                ]))}
                onDeleteForm={formId => {
                  dispatch(deleteProfileForm({
                    name: 'license',
                    userPk,
                    formId
                  }));
                }}
                onEditForm={(formId, form, callback) => {
                  dispatch(patchProfileForm<IProfileLicense>({
                    name: 'license',
                    formId,
                    form,
                    userPk,
                    callback
                  }));
                }}
                hasSpecialistCheckbox={!index}
              />
            ))}
            {unSavedForms.map((hashId, index) => (
              <ProfileLicenseForm
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
                hasSpecialistCheckbox={isEmpty(ids) && !index}
                onAddForm={(form, callback) => {
                  dispatch(appendProfileForm<IProfileLicense>({
                    name: 'license',
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
                  <ProfileLicenseItem
                    key={id}
                    {...data[id]}
                  />
                ))}
              </ul>
            )
          ) : (
            !isEmpty(ids) ? (
              ids.map(id => data[id] && (
                <ProfileLicenseForm
                  key={id}
                  {...data[id]}
                  controllable={false}
                />
              ))
            ) : (
              <ProfileLicenseForm controllable={false}/>
            )
          )
        )}
      </div>
    </StyledProfileCard>
  );
});

ProfileLicense.displayName = 'ProfileLicense';

export default ProfileLicense;
