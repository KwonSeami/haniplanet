import * as React from 'react';
import styled from 'styled-components';
import {useDispatch} from 'react-redux';
import Button from '../../inputs/Button/ButtonDynamic';
import Radio from '../../UI/Radio/Radio';
import ProfileEdu from '../ProfileEdu';
import ProfileBrief from '../ProfileBrief';
import ProfileThesis from '../ProfileThesis';
import CheckBox from '../../UI/Checkbox1/CheckBox';
import ButtonGroup from '../../inputs/ButtonGroup';
import ProfileCard from '../../UI/Card/ProfileCard';
import FileUploader from "../../inputs/FileUploader";
import AvatarDiv from '../style/AvatarDiv';
import UserApi from '../../../src/apis/UserApi';
import useProfileJobForm, {IJobFormState} from '../hooks/useProfileJobForm';
import useCallAccessFunc from "../../../src/hooks/session/useCallAccessFunc";
import {staticUrl} from '../../../src/constants/env';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {updateUser} from '../../../src/reducers/orm/user/userReducer';
import {POSITION_TYPES, SUBJECT_TYPES} from '../../../src/constants/profile';
import {$BORDER_COLOR, $POINT_BLUE, $TEXT_GRAY, $THIN_GRAY, $FONT_COLOR, $WHITE} from '../../../styles/variables.types';

export const WorkInfoDiv = styled.div`
  position: relative;
  margin-top: 15px;

  > div {
    margin-top: -1px;

    .profile {
      position: relative;
      z-index: 1;
      height: 140px;
      padding: 14px 15px;
      border: 1px solid #eee;
      box-sizing: border-box;
      background-color: #f6f7f9;

      h2 {
        ${fontStyleMixin({
          size: 14,
          weight: 'bold',
          color: $FONT_COLOR
        })};
      }
  
      .delete-btn {
        position: absolute;
        z-index: 1;
        top: 12px;
        right: 15px;
  
        img {
          width: 15px;
          height: 15px;
          margin-bottom: -3px;
        }
      }

      > div {
        position: absolute;
        top: 46px;
        left: 15px;
        width: 64px;
        height: 75px;
        border-radius: 0;
        display: inline-block;
      }

      h3 {
        padding: 12px 0 0 79px;
        ${fontStyleMixin({
          size: 18,
          color: $FONT_COLOR
        })};
      }

      p {
        padding: 5px 0 0 79px;
        line-height: 18px;
        ${fontStyleMixin({
          size: 11,
          color: '#999'
        })};
      }
    }

    .position {
      width: 100%;
      display: inline-block;
      padding: 0;
      border-top: none;

      h2 {
        ${fontStyleMixin({
          size: 18,
          weight: 'normal'
        })};

        &::after {
          content: '*';
          position: absolute;
          top: 0;
          left: 34px;
          color: #f32b43;
        }
      }

      ul {
        padding: 57px 0 30px 0;

        .type-li {
          display: inline-block;
          padding-right: 40px;
          vertical-align: middle;
          
          span {
            
            top: 1px;
          }
        }
      }
    }

    .field {
      width: 100%;
      padding: 0;
      border-top: none;

      &::before {
        content:'';
        width: calc(100% + 30px);
        height: 1px;
        position: absolute;
        top: 0;
        left: -15px;
        background-color: #eee;
      }

      h2 {
        ${fontStyleMixin({
          size: 18,
          weight: 'normal'
        })};

        &::after {
          content: '*';
          position: absolute;
          top: 0;
          left: 65px;
          color: #f32b43;
        }

        p {
          width: 300px;
          position: absolute;
          top: 32px;
          left: 0;
          ${fontStyleMixin({
            size: 11,
            color: '#999'
          })};
  
          span {
            padding: 0 0 3px 0;
            ${fontStyleMixin({
              size: 11,
              color: $POINT_BLUE
            })};
          }
        }
      }

      ul {
        width: 100%;
        padding: 74.5px 0 30px 0;

        li {
          display: inline-block;
          width: 130px;
          margin-top: 11.5px;
        }
      }
    }

    .greeting {
      padding: 55px 0 25px 0;
      border-top: none;

      &::before {
        content:'';
        width: calc(100% + 30px);
        height: 1px;
        position: absolute;
        top: 0;
        left: -15px;
        background-color: #eee;
      }

      h2 {
        ${fontStyleMixin({
          size: 18,
          weight: 'normal'
        })};

        &::after {
          content: '*';
          position: absolute;
          top: 0;
          left: 50px;
          color: #f32b43;
        }
      }
    }

    .cover {
      padding: 90px 15px 15px;
      width: calc(100% + 30px);
      left: -15px;

      ul.date-group {
        li {

          input:first-of-type {
            width: 50px;
            margin-right: 5px;
          }

          input:last-of-type {
            width: 40px;
          }
        }
      }

      &.profile-edu, &.profile-brief {
        h2::after {
          content: '*';
          position: absolute;
          top: 0;
          left: 34px;
          color: #f32b43;
        }
      }

      &.profile-edu {
        border-color: #eee;
      }

      &.profile-brief {
        border-top: 8px solid #f6f7f9;
        border-bottom: 8px solid #f6f7f9;
      }

      &.profile-thesis {
        border-top: none;
      }

      h2 {
        z-index: 2;
        left: 15px;
        width: 100%;
        max-width: 680px;
        margin-top: 0;
        ${fontStyleMixin({
          size: 18,
          weight: 'normal'
        })};

        p {
          width: 100%;
          padding-top: 5px;
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

  @media screen and (max-width: 680px) {
    > div {
      .profile {
        padding: 14px 0;
        border: none;

        &::before {
          content: '';
          position: absolute;
          z-index: -1;
          top: 0;
          left: -15px;
          width: calc(100% + 30px);
          height: 100%;
          border-top: 1px solid ${$BORDER_COLOR};
          background-color: #f6f7f9;
        }

        .delete-btn {
          right: 0;
        }

        > div {
          left: 0;
        }
      }

      .position {
        &::before {
          content:'';
          position: absolute;
          z-index: 1;
          top: 0;
          left: -15px;
          width: calc(100% + 30px);
          height: 1px;
          background-color: #eee;
        }
      }
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
  width: calc(100% - 22px);
  height: 64px;
  padding: 8px 10px;
  border: 1px solid ${$BORDER_COLOR};

  &::placeholder {
    ${fontStyleMixin({
      size: 14,
      color: $TEXT_GRAY
    })}
  }
`;

const StyledButtonGroup = styled(ButtonGroup)`
  position: relative;
  z-index: 1;
  padding: 30px 0 30px 5px;
  margin-bottom: -21px;

  &::before {
    content:'';
    position: absolute;
    z-index: -1;
    top: 0;
    left: -15px;
    width: calc(100% + 30px);
    height: 100%;
    border-top: 1px solid #eee;
    background-color: #f9f9f9;
    box-sizing: border-box;
  }

  li {
    margin: 0 5px;
  }

  button {
    width: 128px;
    height: 33px;
    border-radius: 16.5px;
    text-align: center;
    background-color: ${$WHITE};
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
  onLeftBtnClick: () => void;
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
  const profileUploadRef = React.useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  const userApi: UserApi = useCallAccessFunc(access => new UserApi(access));

  React.useEffect(() => {
    onChangeJobForm && onChangeJobForm(jobForm);
  }, [onChangeJobForm, jobForm]);

  const {name, avatar} = me || {name: '', avatar: ''};

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
    <WorkInfoDiv className="work-info-wrapper">
      <div>
        <div className="profile">
          <h2>재직정보</h2>
          {ableToDelete && (
            <Button
              className="delete-btn"
              size={{width: '54px', height: '26px'}}
              border={{width: '1px', color: $BORDER_COLOR, radius: '0'}}
              font={{size: '12px', weight: '600', color: $FONT_COLOR}}
              backgroundColor={$WHITE}
              onClick={onDelete}
            >
              <img
                src={staticUrl('/static/images/icon/icon-img-delete.png')}
                alt="삭제"
              />
              삭제
            </Button>
          )}
          <AvatarDiv
            backgroundImg={avatar || staticUrl('/static/images/icon/icon-default-profile.png')}
          >
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
          </AvatarDiv>
          <h3>{name}</h3>
          <p>
            ※ 재직 프로필 이미지는 기본 프로필 이미지로 동일하게 사용됩니다. <br />
          </p>
        </div>
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
          className="field"
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
                    : [...subject_list, value];

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
          className="cover profile-edu"
          isMe
        />
        <ProfileBrief
          id={id}
          showType="detail"
          subTitle={(
            <p>※ 재직 정보에 입력 된 약력 항목은 <span>프로필에 자동 추가 및 외부 공개됩니다.</span></p>
          )}
          className="cover profile-brief"
          isMe
        />
        <ProfileThesis
          id={id}
          showType="detail"
          subTitle={(
            <p>※ 재직 정보에 입력 된 저서/논문 항목은 <span>프로필에 자동 추가 및 외부 공개됩니다.</span></p>
          )}
          className="cover profile-thesis"
          isMe
        />
      </div>
      <StyledButtonGroup
        leftButton={{
          children: leftText || '취소',
          onClick: onLeftBtnClick
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
    </WorkInfoDiv>
  );
});

ProfileJobForm.displayName = 'ProfileJobForm';

export default ProfileJobForm;
