import * as React from 'react';
import styled from 'styled-components';
import {useDispatch} from 'react-redux';
import ProfileEdu from '../ProfileEdu';
import Button from '../../inputs/Button/ButtonDynamic';
import Radio from '../../UI/Radio/Radio';
import ProfileBrief from '../ProfileBrief';
import ProfileThesis from '../ProfileThesis';
import CheckBox from '../../UI/Checkbox1/CheckBox';
import ButtonGroup from '../../inputs/ButtonGroup';
import FileUploader from '../../inputs/FileUploader';
import ProfileCard, {ProfileCardDiv} from '../../UI/Card/ProfileCard';
import UserApi from '../../../src/apis/UserApi';
import useProfileJobForm, {IJobFormState} from '../hooks/useProfileJobForm';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import {staticUrl} from '../../../src/constants/env';
import {updateUser} from '../../../src/reducers/orm/user/userReducer';
import isEmpty from 'lodash/isEmpty';
import {fontStyleMixin, backgroundImgMixin} from '../../../styles/mixins.styles';
import {POSITION_TYPES, SUBJECT_TYPES} from '../../../src/constants/profile';
import {$FONT_COLOR, $GRAY, $BORDER_COLOR, $POINT_BLUE, $TEXT_GRAY, $THIN_GRAY, $WHITE} from '../../../styles/variables.types';

export const WorkInfoDiv = styled.div`
  display: table;
  position: relative;
  z-index: 1;
  left: -1px;
  width: 1000px;
  background-color: ${$WHITE};
  border: 1px solid ${$BORDER_COLOR};
  border-top: 1px solid ${$FONT_COLOR};
  box-sizing: border-box;

  .profile {
    display: table-cell;
    position: relative;
    top: 1px;
    left: 1px;
    width: 240px;
    padding: 0 20px;
    background-color: #f6f7f9;
    border-right: 1px solid ${$BORDER_COLOR};
    border-bottom: 1px solid ${$BORDER_COLOR};
    box-sizing: border-box;
    vertical-align: top;

    h2 {
      margin-top: 12px;
      text-align: center;
      ${fontStyleMixin({
        size: 20,
        weight: '600',
        color: '#4a4a4a'
      })};
    }

    p {
      margin-top: 10px;
      padding-top: 11px;
      margin-top: 29px;
      line-height: 18px;
      border-top: 1px solid ${$GRAY};
      ${fontStyleMixin({
        size: 11,
        color: '#999'
      })};
      
      span {
        ${fontStyleMixin({
          color: $POINT_BLUE
        })};
      }
    }

    .delete-btn {
      margin-top: 20px;
      
      img {
        width: 15px;
        height: 15px;
        margin-bottom: -3px;
      }
    }
  }

  & > div:nth-child(2) {
    position: relative;
    display: table-cell;
    width: 758px;
    padding-top: 5px;
    vertical-align: top;

    ${ProfileCardDiv} {
      width: 700px;

      &:first-child {
        border-top: none;
      }
    }

    .position {
      height: 80px;
      padding: 0;

      h2 {
        margin-top: 0;

        &::after {
          content: '*';
          position: absolute;
          top: 0;
          left: 36px;
          color: #f32b43;
        }
      }

      ul {
        padding: 14px 0 0 171px;

        .type-li {
          display: inline-block;
          padding: 5px 34px 0 0;
          vertical-align: middle;
          
          span {
            cursor: pointer;
            top: 1px;
          }
        }
      }
    }

    .field {
      height: 256px;
      padding: 51px 0 0 171px;

      h2 {
        margin-top: 0;
        z-index: 2;

        &::after {
          content: '*';
          position: absolute;
          top: 0;
          left: 72px;
          color: #f32b43;
        }

        p {
          float: right;
          padding: 5px 0 0 20px;
          ${fontStyleMixin({
            size: 11,
            color: '#999'
          })};
  
          span {
            padding: 0;
            ${fontStyleMixin({
              size: 11,
              color: $POINT_BLUE
            })};
          }
        }
      }

      ul {
        width: 520px;

        li {
          display: inline-block;
          width: 130px;
          margin-top: 19px;
        }
      }
    }

    .greeting {
      height: 129px;
      padding: 17px 0 0 171px;
      margin-bottom: 0;

      h2 {
        margin-top: 0;

        &::after {
          content: '*';
          position: absolute;
          top: 0;
          left: 55px;
          color: #f32b43;
        }
      }
    }

    .cover {
      padding: 59px 0 15px 150px;

      &.profile-must {
        h2 {
          &::after {
            content: '*';
            position: absolute;
            top: 0;
            left: 37px;
            color: #f32b43;
          }

          p {
            padding-left: 20px;
          }
        } 
      }

      h2 {
        margin-top: 0;
        z-index: 2;

        p {
          float: right;
          padding: 5px 0 0 10px;
          ${fontStyleMixin({
            size: 11,
            color: '#999'
          })};
  
          span {
            padding: 0;
            ${fontStyleMixin({
              size: 11,
              color: $POINT_BLUE
            })};
          }
        }
      }
    }
  }
`;

const JobAvatarDiv = styled.div<Pick<IProfileBasicInfo, 'backgroundImg'>>`
  position: relative;
  width: 100px;
  height: 120px;
  margin: 37px auto 0;
  ${props => backgroundImgMixin({
    img: props.backgroundImg || staticUrl('/static/images/banner/img-default-user.png'),
  })};

  button {
    position: absolute;
    bottom: -6px;
    right: -6px;
    font-size: 0;

    img {
      width: 25px;
    }
  }
`;

const StyledCheckBox = styled(CheckBox)`
  label {
    padding-left: 25px;
    font-size: 15px;

    &::before {
      top: 3px;
      width: 15px;
      height: 15px;
    }
  }
`;

const TextArea = styled.textarea`
  width: 493px;
  height: 63px;
  padding: 8px 23px 8px 12px;
  border: 1px solid ${$BORDER_COLOR};
  font-size: 14px;

  &::placeholder {
    ${fontStyleMixin({
      size: 14,
      color: $TEXT_GRAY
    })};
  }
`;

const StyledButtonGroup = styled(ButtonGroup)`
  padding: 31px 16px 30px 20px;
  border-top: 1px solid ${$BORDER_COLOR};
  margin-top: 0;
  text-align: right;

  li {
    padding-right: 14px;

    button {
      width: 139px;
      height: 39px;
      border-radius: 19.5px;
      text-align: center;
      box-sizing: border-box;
      border: 1px solid ${$THIN_GRAY};
      ${fontStyleMixin({
        size: 15,
        color: '#999'
      })};
  
      &.right-button {
        border-color: ${$POINT_BLUE};
        color: ${$POINT_BLUE};
      }
    }
  }
`;

interface ICommonCompProps {
  checked: boolean;
  label: string;
}

interface ICheckBoxCompProps extends ICommonCompProps {
  onChange: () => void;
}

interface IRadioCompProps extends ICommonCompProps {
  onClick: () => void;
}

const CheckBoxComp: React.FC<ICheckBoxCompProps> = React.memo(({
  checked,
  onChange,
  label
}) => (
  <li>
    <StyledCheckBox
      checked={checked}
      onChange={onChange} 
    >
      {label}
    </StyledCheckBox>
  </li>
));

const RadioComp: React.FC<IRadioCompProps> = React.memo(({
  checked,
  onClick,
  label
}) => (
  <li className="type-li">
    <Radio
      checked={checked}
      onClick={onClick}
    >
      {label}
    </Radio>
  </li>
));

interface Props {
  initialData?: any; // 타입 수정 필요
  leftText?: string;
  rightText?: string;
  ableToDelete?: boolean;
  onDelete?: () => void;
  type?: 'ADD' | 'EDIT';
  onLeftBtnClick?: () => void;
  onRightBtnClick: (data: IJobFormState) => void;
  onChangeJobForm: (subjectList: IJobFormState) => void;
}

const ProfileJobForm: React.FC<Props> = React.memo(({
  initialData,
  leftText,
  rightText,
  ableToDelete,
  onDelete,
  type = 'ADD',
  onLeftBtnClick,
  onRightBtnClick,
  onChangeJobForm,
}) => {
  const {me, id, jobForm, setJobForm, isValidForm, patchForm} = useProfileJobForm(initialData);
  const {position, subject_list, self_introduce} = initialData || {} as IJobFormState;
  const {name, avatar} = me || {name: '', avatar: ''};
  const profileUploadRef = React.useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  const userApi: UserApi = useCallAccessFunc(access => new UserApi(access));

  React.useEffect(() => {
    setJobForm({position, subject_list, self_introduce});
  }, [position, subject_list, self_introduce]);

  React.useEffect(() => {
    onChangeJobForm && onChangeJobForm(jobForm);
  }, [onChangeJobForm, jobForm]);

  const deleteProfileImg = () => {
    userApi.deleteProfileAvatar()
      .then(({status}) => {
        if (status === 200) {
          dispatch(updateUser(me.id, {avatar: null}));
        }
      });
  };

  const updateProfile = (formData) => {
    userApi.saveMyInfo(formData)
      .then(({status, data: {result}}) => {
        if (status === 200 && !!result) {
          dispatch(updateUser(me.id, result));
        }
      });
  };

  return (
    <WorkInfoDiv className="profile-job-form clearfix">
      <div className="profile">
        <JobAvatarDiv backgroundImg={avatar}>
          <FileUploader
            ref={profileUploadRef}
            validate='VALIDATE_IMAGE'
            onChange={file => {
              const formData = new FormData();
              formData.append('avatar', file);

              updateProfile(formData);
            }}
          />
          <button
            type="button"
            className="pointer"
            onClick={() => {
              if (!avatar) {
                profileUploadRef.current.click();
              } else if (confirm('프로필 이미지를 제거하시겠습니까? 취소할 수 없습니다.')) {
                deleteProfileImg();
              }
            }}
          >
            <img
              src={staticUrl(avatar
                ? '/static/images/icon/icon-delete-picture.png'
                : '/static/images/icon/icon-hospital-plus.png')}
              alt="재직정보 프로필 이미지 관리하기"
            />
          </button>
        </JobAvatarDiv>
        <h2>{name}</h2>
        <p>
          ※ 재직 프로필 이미지는 기본 프로필 이미지로 동일하게 사용됩니다.
        </p>
         {ableToDelete && (
          <Button
            className="delete-btn"
            onClick={onDelete}
            size={{width: '198px', height: '40px'}}
            border={{radius: '0', width: '1px', color: $GRAY}}
            font={{size: '13px', weight: 'normal', color: $FONT_COLOR}}
          >
            <img
              src={staticUrl('/static/images/icon/icon-img-delete.png')}
              alt="재직정보 삭제"
            />
            재직정보 삭제
          </Button>
        )}
      </div>
      <div>
        <ProfileCard
          title="직급"
          className="position"
          showAddCard
        >
          <ul>
            {POSITION_TYPES.map(({label, value}) => (
              <RadioComp
                key={value}
                checked={value === jobForm.position}
                onClick={() => setJobForm(curr => ({
                  ...curr,
                  position: value
                }))}
                label={label}
              />
            ))}
          </ul>
        </ProfileCard>
        <ProfileCard
          title="진료분야"
          subTitle={(
            <p>※ 대표 진료분야는 <span>최대 5개</span>까지 선택이 가능합니다.</p>
          )}
          className="field clearfix"
          showAddCard
        >
          <ul>
            {SUBJECT_TYPES.map(({label, value}) => (
              <CheckBoxComp
                key={value}
                checked={(jobForm.subject_list || []).includes(value)}
                onChange={() => setJobForm(curr => {
                  const {subject_list} = curr;
                  const changedSubjectList = (subject_list || []).includes(value)
                    ? (subject_list || []).filter(sub => sub !== value)
                    : !isEmpty(subject_list) ? [...subject_list, value] : [value];

                  return {
                    ...curr,
                    subject_list: changedSubjectList.length > 5
                      ? subject_list
                      : changedSubjectList
                  };
                })}
                label={label}
              />
            ))}
          </ul>
        </ProfileCard>
        <ProfileCard
          title="인사말"
          className="greeting"
          showAddCard
        >
          <TextArea
            placeholder="인사말을 입력해주세요. (200자 이내)"
            name="self_introduce"
            value={jobForm.self_introduce}
            maxLength={200}
            onChange={({target: {value}}) => setJobForm(curr => ({
              ...curr,
              self_introduce: value
            }))}
          />
        </ProfileCard>

        <ProfileEdu
          id={id}
          showType="detail"
          subTitle={(
            <p>※ 재직 정보에 입력 된 학력 항목은 <span>프로필에 자동 추가 및 외부 공개됩니다.</span></p>
          )}
          className="cover profile-must profile-edu"
          isMe
        />
        <ProfileBrief
          id={id}
          showType="detail"
          subTitle={(
            <p>※ 재직 정보에 입력 된 약력 항목은 <span>프로필에 자동 추가 및 외부 공개됩니다.</span></p>
          )}
          className="cover profile-must"
          isMe
        />
        <ProfileThesis
          id={id}
          showType="detail"
          subTitle={(
            <p>※ 재직 정보에 입력 된 저서/논문 항목은 <span>프로필에 자동 추가 및 외부 공개됩니다.</span></p>
          )}
          className="cover"
          isMe
        />
        <StyledButtonGroup
          leftButton={{
            children: leftText || '취소',
            onClick: onLeftBtnClick || (() => {
              setJobForm(curr => ({
                ...curr,
                self_introduce: initialData.self_introduce,
                position: initialData.position,
                subject_list: [...initialData.subject_list]
              }))
            })
          }}
          rightButton={{
            children: rightText || '저장하기',
            onClick: () => {
              const [isValid, result] = isValidForm(jobForm);

              if (isValid) {
                onRightBtnClick(type === 'EDIT'
                  ? patchForm({
                      position,
                      subject_list,
                      self_introduce
                    }, result as IJobFormState
                  ) as IJobFormState
                  : result as IJobFormState
                );
              } else {
                alert(result);
              }
            }
          }}
        />
      </div>
    </WorkInfoDiv>
  );
});

ProfileJobForm.displayName = 'ProfileJobForm';
export default ProfileJobForm;
