import * as React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import BannerDiv from '../../../components/user/BannderDiv';
import TabUl from '../../../components/user/TabUl';
import InfoText from '../../../components/user/InfoText';
import ProfileEdu from '../../../components/profile/ProfileEdu';
import ProfileBrief from '../../../components/profile/ProfileBrief';
import ProfileThesis from '../../../components/profile/ProfileThesis';
import ProfileLicense from '../../../components/profile/ProfileLicense';
import ProfileSkill from '../../../components/profile/ProfileSkill';
import ProfileTool from '../../../components/profile/ProfileTool';
import ProfileHospital from '../../../components/profile/ProfileHospital';
import ProfileBasicInfo from '../../../components/profile/ProfileBasicInfo';
import useProfileEdit from '../../../src/hooks/user/useProfileEdit';
import {toDateFormat} from '../../../src/lib/date';
import {PROFILE_OPEN_OPTIONS} from '../../../src/constants/profile';
import loginRequired from '../../../hocs/loginRequired';
import StyledSelectBox from '../../../components/profile/style/common/StyledSelectBox';
import {useDispatch} from 'react-redux';
import {setLayout, clearLayout} from '../../../src/reducers/system/style/styleReducer';

const ProfileAddDiv = styled.div`
  padding-bottom: 173px;
`;

const UserProfileEditPC = React.memo(() => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setLayout({
      background: 'transparent',
      fakeHeight: true,
      position: 'absolute'
    }));

    return () => {
      dispatch(clearLayout());
    }
  }, []);

  const rest = useProfileEdit();
  const {currTab, me, setBasicInfo, openRange, getOpenTypes, callChangeOpenRange} = rest;

  React.useEffect(() => {
    getOpenTypes();
  }, [getOpenTypes]);

  React.useEffect(() => {
    if (!isEmpty(me)) {
      const {
        name,
        phone,
        birth,
        doctor_number,
        gender,
        jibun_address,
        road_address,
        zonecode,
        address_detail,
        email,
        is_email_receive,
        is_sms_receive
      } = me;

      setBasicInfo(curr => ({
        ...curr,
        name,
        phone,
        birth: birth
          ? toDateFormat(birth, 'YYYYMMDD')
          : '',
        doctor_number,
        gender,
        jibun_address,
        road_address,
        zonecode,
        address_detail,
        email,
        is_email_receive,
        is_sms_receive
      }));
    }
  }, [me]);

  return (
    <section>
      <BannerDiv>
        <h2>
          프로필 수정
        </h2>
        <Link href={`/user/${me.id}`}>
          <a>
            <img
              src="/static/images/icon/arrow/icon-big-shortcuts.png"
              alt="마이페이지"
            />
            MY PAGE
          </a>
        </Link>
      </BannerDiv>

      <TabUl>
        <li className={cn({
          on: currTab === ''
        })}>
          <Link href="/user/profile/edit">
            <a>기본정보</a>
          </Link>
        </li>
        <li className={cn({
          on: currTab === 'additional'
        })}>
          <Link href="/user/profile/edit?tab=additional">
            <a>추가정보</a>
          </Link>
        </li>
        <li className={cn({
          on: currTab === 'hospital'
        })}>
          <Link href="/user/profile/edit?tab=hospital">
            <a>나의 한의원</a>
          </Link>
        </li>
      </TabUl>

      {/* 기본정보 */}
      {currTab === '' && (
        <ProfileBasicInfo data={rest}/>
      )}

      {/* 프로필 추가 */}
      {currTab === 'additional' && (
        <ProfileAddDiv>
          <InfoText>
            <span>※ 공개 범위 설정</span>
            각 항목의 공개 여부를 설정 할 수 있습니다.
          </InfoText>
          <ProfileEdu
            id={me.id}
            selectBox={
              <StyledSelectBox
                value={openRange.edu_open_range}
                option={PROFILE_OPEN_OPTIONS}
                onChange={callChangeOpenRange('edu_open_range')}
              />
            }
            isMe
            subTitle={"재직 상태 등록을 위해서는 학력 입력이 필요합니다."}
          />

          <ProfileBrief
            id={me.id}
            selectBox={
              <StyledSelectBox
                value={openRange.brief_open_range}
                option={PROFILE_OPEN_OPTIONS}
                onChange={callChangeOpenRange('brief_open_range')}
              />
            }
            isMe
            subTitle={"재직 상태 등록을 위해서는 약력 입력이 필요합니다."}
          />

          <ProfileThesis
            id={me.id}
            selectBox={
              <StyledSelectBox
                value={openRange.thesis_open_range}
                option={PROFILE_OPEN_OPTIONS}
                onChange={callChangeOpenRange('thesis_open_range')}
              />
            }
            isMe
            subTitle={"재직 상태 등록을 위해서는 저서/논문의 입력이 필요합니다."}
          />

          <ProfileLicense
            id={me.id}
            subTitle="전문의 여부는 첫 번째 입력란에만 추가가 가능합니다."
            selectValue={openRange.license_open_range}
            selectOption={PROFILE_OPEN_OPTIONS}
            onSelectClick={callChangeOpenRange('license_open_range')}
            isMe
          />

          <ProfileSkill
            id={me.id}
            selectValue={openRange.skill_open_range}
            selectOption={PROFILE_OPEN_OPTIONS}
            onSelectClick={callChangeOpenRange('skill_open_range')}
            isMe
          />

          <ProfileTool
            id={me.id}
            selectValue={openRange.tool_open_range}
            selectOption={PROFILE_OPEN_OPTIONS}
            onSelectClick={callChangeOpenRange('tool_open_range')}
            isMe
          />
        </ProfileAddDiv>
      )}

      {/* 나의 한의원 */}
      {currTab === 'hospital' && (
        <div>
          <InfoText>
            한의원에 나의 의료진정보를 추가해보세요.
          </InfoText>
          <ProfileHospital/>
        </div>
      )}
    </section>
  );
});

UserProfileEditPC.displayName = 'UserProfileEditPC';

export default loginRequired(UserProfileEditPC);
