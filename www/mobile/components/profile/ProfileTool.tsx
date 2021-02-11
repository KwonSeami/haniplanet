import * as React from 'react';
import cn from 'classnames';
import StyledSelectBox from './style/common/StyledSelectBox';
import isEmpty from 'lodash/isEmpty';
import ProfileToolForm from './form/ProfileToolForm';
import useTool from './hooks/useTool';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import {RootState} from '../../src/reducers';
import {LEVEL_TO_KOR} from '../../src/constants/profile';
import styled from 'styled-components';
import {ProfileItemLi} from './style/styleCompPC';
import ProfileCard from '../UI/Card/ProfileCard';
import {
  appendProfileForm,
  patchProfileForm,
  deleteProfileForm
} from '../../src/reducers/profile';
import uuid from 'uuid/v4';

const Div = styled.div`
  &.me {
    margin-top: -7px;
  }
`;

interface Props extends IProfileCommonProps {
}

const ProfileToolItem: React.FC<
  TProfileFormParamsExceptId<IProfileTool>
> = React.memo(({
  tool,
  level
}) => {
  const {toolData} = useSelector(({tool}: RootState) => tool);

  if (isEmpty(toolData)) {
    return null;
  }

  return (
    <ProfileItemLi className="skill-item">
      <h3>
        {toolData[tool - 1].label}
        <span className="badge">{LEVEL_TO_KOR[level]}</span>
      </h3>
    </ProfileItemLi>
  );
});

const ProfileTool: React.FC<Props> = React.memo(({
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
  const tool = useTool();

  const dispatch = useDispatch();

  const profile = useSelector(
    ({profile}: RootState) => profile[userPk],
    shallowEqual
  );

  const [unSavedForms, setUnSavedForms] = React.useState([]);

  const {ids, data} = (!isEmpty(profile) && !isEmpty(profile.tool))
    ? profile.tool
    : {ids: [], data: {}};

  React.useEffect(() => {
    if (!isEmpty(profile?.tool) && isEmpty(profile?.tool?.ids) && isEmpty(unSavedForms)) {
      setUnSavedForms([uuid()]);
    }
  }, [profile, unSavedForms]);

  return (
    <ProfileCard
      title="사용차트"
      subTitle={subTitle}
      className={className}
      cardName="tool"
      id={userPk}
      isMe={isMe}
      setShowAddTab={setShowAddTab}
      showType={showType}
    >
      <Div className={cn({me: isMe})}>
        {isMe ? (
          <>
            <StyledSelectBox
              value={selectValue}
              option={selectOption}
              onChange={onSelectClick}
            />
            {!isEmpty(tool) && (
              <>
                {ids.map((id, index) => data[id] && (
                  <ProfileToolForm
                    key={id}
                    {...data[id]}
                    isAddBtnVisible={isEmpty(unSavedForms) && index === ids.length - 1}
                    type="EDIT"
                    onCreateForm={() => setUnSavedForms(curr => ([
                      ...curr,
                      uuid()
                    ]))}
                    onDeleteForm={formId => {
                      dispatch(deleteProfileForm({
                        name: 'tool',
                        userPk,
                        formId
                      }));
                    }}
                    onEditForm={(formId, form, callback) => {
                      dispatch(patchProfileForm<IProfileTool>({
                        name: 'tool',
                        formId,
                        form,
                        userPk,
                        callback
                      }));
                    }}
                  />
                ))}
                {unSavedForms.map((hashId, index) => (
                  <ProfileToolForm
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
                      dispatch(appendProfileForm<IProfileTool>({
                        name: 'tool',
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
              <ul>
                {ids.map(id => data[id] && (
                  <ProfileToolItem
                    key={id}
                    {...data[id]}
                  />
                ))}
              </ul>
            )
          ) : (
            !isEmpty(ids) ? (
              ids.map(id => data[id] && (
                <ProfileToolForm
                  key={id}
                  {...data[id]}
                  controllable={false}
                />
              ))
            ) : (
              <StyledProfileToolForm controllable={false}/>
            )
          )
        )}
      </Div>
    </ProfileCard>
  );
});

export default ProfileTool;
