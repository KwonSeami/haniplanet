import * as React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import ProfileTool from '../../../components/profile/ProfileTool';
import InfoText from '../../../components/user/style/InfoText';
import ProfileBasicInfo from '../../../components/profile/ProfileBasicInfo';
import ProfileLicense from '../../../components/profile/ProfileLicense';
import ProfileEdu from '../../../components/profile/ProfileEdu';
import ProfileBrief from '../../../components/profile/ProfileBrief';
import ProfileThesis from '../../../components/profile/ProfileThesis';
import ProfileHospital from '../../../components/profile/ProfileHospital';
import ProfileSkill from '../../../components/profile/ProfileSkill';
import useProfileEdit from '../../../src/hooks/user/useProfileEdit';
import {toDateFormat} from '../../../src/lib/date';
import {HospitalEditLi, ProfileInfoLi, Ul, TabUl} from '../../../components/user/profile/editStyledComp';
import {PROFILE_OPEN_OPTIONS} from '../../../src/constants/profile';
import loginRequired from '../../../hocs/loginRequired';
import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$FONT_COLOR} from '../../../styles/variables.types';
import StyledSelectBox from '../../../components/profile/style/common/StyledSelectBox';

const StyledInfoText = styled(InfoText)`
  display: inline-block;
  text-align: left;

  span {
    padding: 0;
    max-width: 680px;
    margin: auto;
    ${fontStyleMixin({
      size: 11,
      color: $FONT_COLOR
    })};

    @media screen and (max-width: 680px) {
      margin-left: 15px;
    }
  }
`;

const UserProfileEditMobile = React.memo(() => {
  const {...rest} = useProfileEdit();
  const {currTab, me, setBasicInfo, openRange, getOpenTypes, callChangeOpenRange} = rest;

  React.useEffect(() => {
    getOpenTypes();
  }, []);

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
      <TabUl className="clearfix">
        <li className={cn({on: currTab === ''})}>
          <Link href="/user/profile/edit">
            <a>기본정보</a>
          </Link>
        </li>
        <li className={cn({on: currTab === 'additional'})}>
          <Link href="/user/profile/edit?tab=additional">
            <a>추가정보</a>
          </Link>
        </li>
        <li className={cn({on: currTab === 'hospital'})}>
          <Link href="/user/profile/edit?tab=hospital">
            <a>나의 한의원</a>
          </Link>
        </li>
      </TabUl>

      <Ul>
        {/* TODO: 기본정보 */}
        {currTab === '' && (
          <ProfileBasicInfo data={rest}/>
        )}

        {/* TODO: 프로필 추가 */}
        {currTab === 'additional' && (
          <ProfileInfoLi>
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
            />

            <ProfileLicense
              id={me.id}
              subTitle="※ 전문의 여부는 첫 번째 입력란에만 추가 가능"
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
          </ProfileInfoLi>
        )}

        {/* TODO: 나의 한의원 */}
        {currTab === 'hospital' && (
          <HospitalEditLi>
              <StyledInfoText>
                <span>
                  한의원에 나의 의료진정보를 추가해보세요.
                </span>
              </StyledInfoText>
            <ProfileHospital/>
          </HospitalEditLi>
        )}
      </Ul>
    </section>
  );
});

export default loginRequired(UserProfileEditMobile);
