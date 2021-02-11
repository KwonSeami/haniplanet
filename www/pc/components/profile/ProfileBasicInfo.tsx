import * as React from 'react';
import styled from 'styled-components';
import cn from 'classnames';
import {USER_TYPE_TO_KOR, GENDER_TO_KOR} from '../../src/constants/users';
import {$FONT_COLOR, $BORDER_COLOR, $TEXT_GRAY} from '../../styles/variables.types';
import {staticUrl} from '../../src/constants/env';
import ResponsiveLi from '../UI/ResponsiveLi/ResponsiveLi';
import {VALIDATE_REGEX} from '../../src/constants/validates';
import {PROFILE_OPEN_OPTIONS} from '../../src/constants/profile';
import CheckBox from '../UI/Checkbox1/CheckBox';
import Button from '../inputs/Button/ButtonDynamic';
import ProfileDiv from './style/ProfileDiv';
import TextMsgLi from './style/TextMsgLi';
import Avatar from '../Avatar';
import SecessionDiv from './style/SecessionDiv';
import MarketingDiv from './style/MarketingDiv';
import StyledButton from './style/StyledButton';
import ProfileListUl from './style/ProfileListUl';
import ProfileButtonGroup from './style/ProfileButtonGroup';
import BasicButtonGroup from '../inputs/ButtonGroup/BasicButtonGroup';
import StyledInput from './style/common/StyledInput';
import StyledSelectBox from './style/common/StyledSelectBox';
import {useRouter} from "next/router";
import {checkValidImage} from '../../src/lib/file';
import UserApi from '../../src/apis/UserApi';
import Label from '../../components/UI/tag/Label';
import FileInput from '../../components/inputs/FileInput';
import isEmpty from 'lodash/isEmpty';
import {LinkSpan, P, StyledText} from './style/styleCompPC';

interface Props {
  data: any;
  isOnArrow: boolean;
}

const StyledLabel = styled(Label)`
  margin: -3px 0 0 2px;
`;

const StyledAvatar = styled(Avatar)`
  & > div {
    top: 19px;
    left: 0;
    position: absolute;
  }
`;

const ProfileBasicInfo = React.memo<Props>(({data}) => {
  const [{type, message}, setNickMessage] = React.useState({type: '', message: ''});

  const fileRef = React.useRef(null);
  const router = useRouter();

  const {VALIDATE_PASSWORD} = VALIDATE_REGEX;

  const {
    me,
    basicInfo,
    setBasicInfo,
    deleteProfileAvatar,
    openRange,
    callChangeOpenRange,
    isValidForm,
    patchProfileInfo,
    withdrawService,
  } = data;
  const {
    avatar,
    name,
    auth_id,
    user_type,
    id,
    nick_name,
    is_regular,
    school, // 학교명
    student_number // 학번
  } = me || {} as any;

  const [isChanged, setIsChanged] = React.useState(false);
  const [certFile, setCertFile] = React.useState();

  const createCertFileForm = file => {
    const formData = new FormData();

    formData.append('cert_file', file);
    setCertFile(formData);

    setBasicInfo(curr => ({
      ...curr,
      cert_file: file.name
    }));
  };

  return (
    <div>
      <ProfileDiv>
        <div>
          <StyledAvatar
            size={75}
            src={avatar}
            userExposeType="real"
          />
          <h2>
            {name}
            <StyledLabel
              name={USER_TYPE_TO_KOR[user_type]}
              color={$FONT_COLOR}
              borderColor="#999"
            />
            {typeof is_regular === 'boolean' && (
              <StyledLabel
                name={is_regular ? '정회원' : '준회원'}
                color={is_regular ? '#78cf8e' : '#cfae78'}
                borderColor={is_regular ? '#78cf8e' : '#cfae78'}
              />
            )}
          </h2>
          <p><span>{nick_name}</span>({auth_id})</p>
          <span>
            ※ 프로필 이미지의 수정/삭제는 바로 적용되며, 나의 한의원 등록 시와 동일한 이미지로 적용됩니다.
          </span>
          <input
            type="file"
            style={{display: 'none'}}
            ref={fileRef}
            onChange={e => {
              checkValidImage(e, file => {
                const formData = new FormData();
                formData.append('avatar', file);
          
                patchProfileInfo(formData as Partial<IProfileBasicInfo>);
              });
            }}
          />
          <ProfileButtonGroup
            leftButton={{
              children: (
                <>
                  <img
                    src={staticUrl("/static/images/icon/icon-img-edit.png")}
                    alt="이미지 수정"
                  />
                  이미지 수정
                </>
              ),
              onClick: () => fileRef.current.click()
            }}
            rightButton={{
              children: (
                <>
                  <img
                    src={staticUrl("/static/images/icon/icon-img-delete.png")}
                    alt="이미지 삭제"
                  />
                  이미지 삭제
                </>
              ),
              onClick: () => {
                if (avatar) {
                  deleteProfileAvatar();
                }
              }
            }}
          />
        </div>
      </ProfileDiv>
      <ProfileListUl>
        <ResponsiveLi
          title="닉네임 수정"
        >
          <StyledInput
            isBasic
            maxLength={10}
            value={basicInfo.nick_name}
            placeholder="3~10자(한글,영문,숫자 가능)"
            onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
              setBasicInfo(curr => ({
                ...curr,
                nick_name: value
              }));
            }}
            onBlur={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
              if (value.trim().length >= 3) {
                UserApi.authNickName(value)
                  .then(({data: {result: {is_exist}}}) => {
                    setNickMessage({
                      type: is_exist ? 'error' : 'success',
                      message: is_exist ? '이미 사용중인 닉네임입니다.' : '사용가능한 닉네임 입니다.',
                    })
                  });
              }
            }}
          />
          {!!message && (
            <span className={cn(type)}>{message}</span>
          )}
          <span className="info">※ 30일마다, 변경 가능합니다. 변경 시, 기존 닉네임으로 작성한 글 모두 변경 처리됩니다.</span>
        </ResponsiveLi>
        <ResponsiveLi
          title="기존 비밀번호"
        >
          <StyledInput
            type="password"
            isBasic
            placeholder="기존 비밀번호를 입력해주세요."
            autoComplete="new-password"
            value={basicInfo.old_password}
            onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
              setBasicInfo(curr => ({
                ...curr,
                old_password: value
              }));
            }}
          />
        </ResponsiveLi>
        <ResponsiveLi
          title="새 비밀번호"
        >
          <StyledInput
            type="password"
            isBasic
            placeholder="8자 이상 15자 이하(영소문자,숫자 필수)"
            autoComplete="new-password"
            maxLength={15}
            value={basicInfo.password}
            onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
              setBasicInfo(curr => ({
                ...curr,
                password: value
              }));
            }}
          />
          {(!!basicInfo.password
            && !VALIDATE_PASSWORD[0].test(basicInfo.password)) && (
              <span className="error">{VALIDATE_PASSWORD[1]}</span>
            )}
        </ResponsiveLi>
        <ResponsiveLi
          title="새 비밀번호 확인"
        >
          <StyledInput
            type="password"
            isBasic
            placeholder="비밀번호를 다시 입력해주세요."
            autoComplete="new-password"
            maxLength={15}
            value={basicInfo.confirm_password}
            onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
              setBasicInfo(curr => ({
                ...curr,
                confirm_password: value
              }));
            }}
          />
          {(!!basicInfo.confirm_password
            && basicInfo.confirm_password !== basicInfo.password) && (
              <span className="error">비밀번호가 일치하지 않습니다.</span>
            )}
        </ResponsiveLi>
        <TextMsgLi>
          <span>※ 공개 범위 설정</span>
          각 항목의 공개 여부를 설정 할 수 있습니다.
        </TextMsgLi>
        <ResponsiveLi title="이름">
          <StyledInput
            isBasic
            readOnly
            placeholder="실명인증을 해주세요."
            value={basicInfo.name}
          />
        </ResponsiveLi>
        <ResponsiveLi
          title="휴대폰번호"
          className="has-button"
        >
          <StyledInput
            isButton
            readOnly
            placeholder='"-"를 제외하고 입력해주세요.'
            value={basicInfo.phone}
            maxLength={12}
          />
          <StyledButton
            size={{width: '110px', height: '44px'}}
            font={{size: '13px', weight: '600'}}
            border={{radius: '0', width: '1px', color: $BORDER_COLOR}}
            onClick={() => {
              if (!basicInfo.phone) {
                alert('휴대폰 번호를 입력해주세요.');
                return null;
              }

              const {IMP} = window;
              IMP.init('imp07711701');
              IMP.certification(
                {merchant_uid: `merchant_${new Date().getTime()}`},
                ({imp_uid}) => {
                  patchProfileInfo({imp_uid}, () => alert('변경되었습니다.'));
                },
              );
            }}
          >
            변경
          </StyledButton>
          <span>휴대폰 인증을 통해, 이름, 휴대폰 번호를 변경하실 수 있습니다.</span>
          <StyledSelectBox
            value={openRange.phone_open_range}
            option={PROFILE_OPEN_OPTIONS}
            onChange={callChangeOpenRange('phone_open_range')}
          />
        </ResponsiveLi>
        <ResponsiveLi
          title="생년월일"
        >
          <StyledInput
            isBasic
            className="has-select"
            value={basicInfo.birth}
            placeholder="19890101"
            maxLength={8}
            onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
              setBasicInfo(curr => ({
                ...curr,
                birth: value
              }));
            }}
          />
          <StyledSelectBox
            value={openRange.birth_open_range}
            option={PROFILE_OPEN_OPTIONS}
            onChange={callChangeOpenRange('birth_open_range')}
          />
        </ResponsiveLi>
        <ResponsiveLi
          title="성별"
        >
          <StyledInput
            isBasic
            className="has-select"
            value={GENDER_TO_KOR[basicInfo.gender]}
          />
          <StyledSelectBox
            value={openRange.gender_open_range}
            option={PROFILE_OPEN_OPTIONS}
            onChange={callChangeOpenRange('gender_open_range')}
          />
        </ResponsiveLi>
        <ResponsiveLi
          title="주소"
          className="has-button"
        >
          <StyledInput
            value={basicInfo.jibun_address || basicInfo.road_address}
            readOnly
            isButton
          />
          <StyledButton
            size={{
              width: '110px',
              height: '44px'
            }}
            font={{
              size: '13px',
              weight: '600'
            }}
            border={{
              radius: '0',
              width: '1px',
              color: $BORDER_COLOR
            }}
            onClick={() => {
              window.daum.postcode.load(() => {
                new daum.Postcode({
                  oncomplete: ({
                    jibunAddress,
                    roadAddress,
                    zonecode
                  }) => setBasicInfo(curr => ({
                    ...curr,
                    jibun_address: jibunAddress,
                    road_address: roadAddress,
                    zonecode
                  }))
                }).open();
              });
            }}
          >
            변경
          </StyledButton>
          <StyledSelectBox
            className="phone-select"
            value={openRange.address_open_range}
            option={PROFILE_OPEN_OPTIONS}
            onChange={callChangeOpenRange('address_open_range')}
          />
          <StyledInput
            isBasic
            placeholder="상세주소"
            value={basicInfo.address_detail}
            onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
              setBasicInfo(curr => ({
                ...curr,
                address_detail: value
              }));
            }}
          />
          {!basicInfo.address_detail && (
            <span className="error">주소를 입력해주세요.</span>
          )}
        </ResponsiveLi>
        <ResponsiveLi
          title="E-mail"
        >
          <StyledInput
            isBasic
            className="has-select"
            placeholder="balky@mail.com"
            value={basicInfo.email}
            onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
              setBasicInfo(curr => ({
                ...curr,
                email: value
              }));
            }}
            
          />
          <StyledSelectBox
            value={openRange.email_open_range}
            option={PROFILE_OPEN_OPTIONS}
            onChange={callChangeOpenRange('email_open_range')}
          />
          {!basicInfo.email && (
            <span className="error">이메일 주소를 입력해주세요.</span>
          )}
        </ResponsiveLi>
        {user_type === 'student' && (
          // 학생 계정 (갱신이 필요하지 않은 정회원)
          <>
            <ResponsiveLi title="학교명">
              <StyledInput
                isBasic
                className="read-only"
                placeholder=""
                readOnly
                value={school}
              />
            </ResponsiveLi>
            <ResponsiveLi title="학번">
              <StyledInput
                isBasic
                className="read-only"
                placeholder=""
                readOnly
                value={student_number}
              />
            </ResponsiveLi>
            <ResponsiveLi title="재학증명서">
              <StyledInput
                isBasic
                className="read-only"
                readOnly
                value="등록 완료"
              />
            </ResponsiveLi>
            <ResponsiveLi>
              <StyledText
                className={cn({on: isChanged})}
                onClick={() => {setIsChanged(curr => !curr)}}>
                한의사 유형으로 전환
                <img
                  src={staticUrl('/static/images/icon/arrow/icon-profile-shortcut.png')}
                  alt="화살표"
                />
              </StyledText>
            </ResponsiveLi>
            {isChanged && (
              <>
                <ResponsiveLi title="면허번호">
                  <StyledInput
                    isBasic
                    numberOnly
                    placeholder="숫자만 가능"
                    value={basicInfo.doctor_number}
                    onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
                      setBasicInfo(curr => ({
                        ...curr,
                        doctor_number: parseInt(value)
                      }))
                    }}
                    name="doctor_number"
                  />
                </ResponsiveLi>
                <ResponsiveLi title="파일 첨부">
                  <FileInput
                    fileNameDisabled
                    onChange={createCertFileForm}
                  />
                  <LinkSpan>
                    {basicInfo.cert_file || '선택된 파일 없음'}
                  </LinkSpan>
                  <P>
                    <em>면허증 사본을 첨부해주세요.</em>
                    &nbsp;(8MB이내, 이미지 파일 또는 pdf)
                    <br/>신청 후 한의플래닛 관리자의 확인을 거쳐 유형이 변경됩니다. (약 1~3일 소요)
                  </P>
                </ResponsiveLi>
              </>
            )}
          </>
        )}
        {user_type === 'doctor' && (
          // 한의사 계정
          <>
            <ResponsiveLi title="면허번호">
              <StyledInput
                isBasic
                className="read-only"
                readOnly
                value={basicInfo.doctor_number}
                placeholder=""
              />
            </ResponsiveLi>
            <ResponsiveLi title="면허증사본">
              <StyledInput
                isBasic
                className="read-only"
                readOnly
                value="등록 완료"
              />
            </ResponsiveLi>
          </>
        )}
        {user_type === 'consultant' && (
          // 사업자 계정
          <ResponsiveLi title="사업자등록증 사본">
            <StyledInput
              isBasic
              className="read-only"
              readOnly
              value="등록 완료"
            />
          </ResponsiveLi>
        )}
      </ProfileListUl>
      <MarketingDiv>
        <h2>
          마케팅 수신 동의
          <span>(선택항목)</span>
        </h2>
        <ul>
          <li>
            <CheckBox
              checked={basicInfo.is_email_receive}
              onChange={({target: {checked}}: React.MouseEvent<HTMLInputElement>) => {
                setBasicInfo(curr => ({
                  ...curr,
                  is_email_receive: checked
                }));
              }}
            >
              이메일 수신 동의
              <span>사이트 이용, 이벤트, 프로모션 안내 이메일 수신을 동의합니다.</span>
            </CheckBox>
          </li>
          <li>
            <CheckBox
              checked={basicInfo.is_sms_receive}
              onChange={({target: {checked}}: React.MouseEvent<HTMLInputElement>) => {
                setBasicInfo(curr => ({
                  ...curr,
                  is_sms_receive: checked
                }));
              }}
            >
              SMS 수신동의
              <span>사이트 이용, 이벤트, 프로모션 안내 문자 수신을 동의합니다.</span>
            </CheckBox>
          </li>
        </ul>
      </MarketingDiv>
      <SecessionDiv>
        <h2>회원탈퇴</h2>
        <Button
          size={{
            width: '164px',
            height: '40px'
          }}
          border={{
            width: '1px',
            color: $BORDER_COLOR,
            radius: '2px'
          }}
          font={{
            size: '13px',
            color: '600'
          }}
          onClick={() => {
            withdrawService();
          }}
        >
          탈퇴하기
        </Button>
      </SecessionDiv>
      <BasicButtonGroup
        leftButton={{
          children: '취소',
          onClick: () => {
            confirm('작성중인 내용이 저장되지 않습니다.\n나가시겠습니까?') && (
              router.push(`/user/${id}`)
            );
          }
        }}
        rightButton={{
          children: '저장하기',
          onClick: () => {
            const [isValid, result] = isValidForm(me, basicInfo);

            if (isValid) {
              confirm('저장하시겠습니까?')
                && patchProfileInfo(result as Partial<IProfileBasicInfo>, () => {
                  !!certFile &&
                    patchProfileInfo(certFile as Partial<IProfileBasicInfo>);
                  
                  alert('저장되었습니다.');
                });
            } else {
              alert(result as string);
            }
          }
        }}
      />
    </div>
  );
});

ProfileBasicInfo.displayName = 'ProfileBasicInfo';
export default ProfileBasicInfo;
