import * as React from 'react';
import ProfileCard from '../UI/Card/ProfileCard';
import useSkill from './hooks/useSkill';
import ProfileSkillForm from './form/ProfileSkillForm';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import {RootState} from '../../src/reducers';
import {LEVEL_TO_KOR} from '../../src/constants/profile';
import StyledSelectBox from './style/common/StyledSelectBox';
import {ProfileItemLi, SkillUl} from './style/styleCompPC';
import {
  appendProfileForm,
  patchProfileForm,
  deleteProfileForm
} from '../../src/reducers/profile';
import uuid from 'uuid/v4';

const Div = styled.div`
  margin-top: -6px;
`;

interface Props extends IProfileCommonProps {
}

const ProfileSkillItem: React.FC<
  TProfileFormParamsExceptId<IProfileSkill>
> = React.memo(({
  skill,
  level,
  description
}) => {
  const fetchedSkill = useSelector(({skill}: RootState) => skill);

  if (isEmpty(fetchedSkill)) {
    return null;
  }

  const {field} = fetchedSkill;

  return (
    <ProfileItemLi className="skill-item">
      <h3>
        <strong>{field[skill.field - 1].label}</strong>
        {skill.name}
        <span className="badge">{LEVEL_TO_KOR[level]}</span>
      </h3>
      <p>{description}</p>
    </ProfileItemLi>
  );
});

const ProfileSkill: React.FC<Props> = React.memo(({
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
  const skill = useSkill();

  const dispatch = useDispatch();

  const profile = useSelector(
    ({profile}: RootState) => profile[userPk],
    shallowEqual
  );

  const [unSavedForms, setUnSavedForms] = React.useState([]);

  const {ids, data} = (!isEmpty(profile) && !isEmpty(profile.skill))
    ? profile.skill
    : {ids: [], data: {}};

  React.useEffect(() => {
    if (!isEmpty(profile?.skill) && isEmpty(profile?.skill?.ids) && isEmpty(unSavedForms)) {
      setUnSavedForms([uuid()]);
    }
  }, [profile, unSavedForms]);

  return (
    <ProfileCard
      title="사용기술"
      subTitle={subTitle}
      className={className}
      cardName="skill"
      id={userPk}
      setShowAddTab={setShowAddTab}
      isMe={isMe}
      showType={showType}
    >
      <Div>
        {isMe ? (
          <>
            <StyledSelectBox
              value={selectValue}
              option={selectOption}
              onChange={onSelectClick}
            />
            {!isEmpty(skill) && (
              <>
                {ids.map((id, index) => data[id] && (
                  <ProfileSkillForm
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
                        name: 'skill',
                        userPk,
                        formId
                      }));
                    }}
                    onEditForm={(formId, form, callback) => {
                      dispatch(patchProfileForm<IProfileSkill>({
                        name: 'skill',
                        formId,
                        form,
                        userPk,
                        callback
                      }));
                    }}
                  />
                ))}
                {unSavedForms.map((hashId, index) => (
                  <ProfileSkillForm
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
                      dispatch(appendProfileForm<IProfileSkill>({
                        name: 'skill',
                        form,
                        userPk,
                        callback
                      }));
                    }}
                  />
                ))}
              </>
            )}
          </>
        ) : (
          showType === 'simple' ? ( 
            !isEmpty(ids) && (
              <SkillUl>
                {ids.map(id => data[id] && (
                  <ProfileSkillItem
                    key={id}
                    {...data[id]}
                  />
                ))}
              </SkillUl>
            )
          ) : (
            !isEmpty(ids) ? (
              ids.map(id => data[id] && (
                <ProfileSkillForm
                  key={id}
                  {...data[id]}
                  controllable={false}
                />
              ))
            ) : (
              <ProfileSkillForm controllable={false}/>
            )
          )
        )}
      </Div>
    </ProfileCard>
  );
});

ProfileSkill.displayName = 'ProfileSkill';

export default ProfileSkill;
