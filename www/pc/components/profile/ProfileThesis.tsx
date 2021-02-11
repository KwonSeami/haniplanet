import * as React from 'react';
import styled from 'styled-components';
import {$FONT_COLOR} from '../../styles/variables.types';
import ProfileCard from '../UI/Card/ProfileCard';
import StyledSelectBox from './style/common/StyledSelectBox';
import isEmpty from 'lodash/isEmpty';
import ProfileThesisForm from './form/ProfileThesisForm';
import {staticUrl} from '../../src/constants/env';
import {ProfileItemLi} from './style/styleCompPC';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {
  appendProfileForm,
  patchProfileForm,
  deleteProfileForm,
  swapProfileForm
} from '../../src/reducers/profile';
import cn from 'classnames';
import uuid from 'uuid/v4';
import {RootState} from '../../src/reducers';

const StyledProfileThesisForm = styled(ProfileThesisForm)`
  input::placeholder {
    color: ${$FONT_COLOR};
  }
`;

interface Props extends IProfileCommonProps {
  selectBox?: React.ReactNode;
}

const ProfileThesisItem: React.FC<
  TProfileFormParamsExceptId<IProfileThesis>
> = React.memo(({title}) => (
  <ProfileItemLi className="dissertation-item">>
    <img
      src={staticUrl('/static/images/icon/icon-list.png')}
      alt="저서/논문 리스트"
    />
    {title}
  </ProfileItemLi>
));
 
const ProfileThesis: React.FC<Props> = React.memo(({
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

  const {ids, data} = (!isEmpty(profile) && !isEmpty(profile.thesis))
    ? profile.thesis
    : {ids: [], data: {}};

  React.useEffect(() => {
    if (!isEmpty(profile?.thesis) && isEmpty(profile?.thesis?.ids) && isEmpty(unSavedForms)) {
      setUnSavedForms([uuid()]);
    }
  }, [profile, unSavedForms]);

  return (
    <ProfileCard
      title="저서/논문"
      subTitle={subTitle}
      cardName="thesis"
      id={userPk}
      className={cn(className, 'clearfix')}
      setShowAddTab={setShowAddTab}
      isMe={isMe}
      showType={showType}
    >
      <div>
        {isMe ? (
          <>
            {selectBox}
            <ul>
              {ids.map((id, index) => data[id] && (
                <ProfileThesisForm
                  {...data[id]}
                  key={id}
                  type="EDIT"
                  index={index}
                  lastIndex={ids.length - 1}
                  isAddBtnVisible={isEmpty(unSavedForms) && index === ids.length - 1}
                  onCreateForm={() => setUnSavedForms(curr => ([
                    ...curr,
                    uuid()
                  ]))}
                  onDeleteForm={formId => {
                    dispatch(deleteProfileForm({
                      name: 'thesis',
                      userPk,
                      formId
                    }));
                  }}
                  onEditForm={(formId, form, callback) => {
                    dispatch(patchProfileForm<IProfileThesis>({
                      name: 'thesis',
                      formId,
                      form,
                      userPk,
                      callback
                    }));
                  }}
                  onSwapData={(currIdx: number, swapIdx: number) => {
                    dispatch(swapProfileForm({
                      name: 'thesis',
                      userPk,
                      ids,
                      currId: ids[currIdx],
                      swapId: ids[swapIdx]
                    }));
                  }}
                />
              ))}
              {unSavedForms.map((hashId, index) => (
                <ProfileThesisForm
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
                    dispatch(appendProfileForm<IProfileThesis>({
                      name: 'thesis',
                      form,
                      userPk,
                      callback
                    }));
                  }}
                />
              ))}
            </ul>
          </>
        ) : (
          showType === 'simple' ? (
            !isEmpty(ids) && (
              <ul>
                {ids.map(id => data[id] && (
                  <ProfileThesisItem
                    key={id}
                    {...data[id]}
                  />
                ))}
              </ul>
            )
          ) : (
            !isEmpty(ids) ? (
              ids.map(id => data[id] && (
                <ProfileThesisForm
                  key={id}
                  {...data[id]}
                  controllable={false}
                />
              ))
            ) : (
              <StyledProfileThesisForm controllable={false}/>
            )
          )
        )}
      </div>
    </ProfileCard>
  );
});

ProfileThesis.displayName = 'ProfileThesis';

export default ProfileThesis;
