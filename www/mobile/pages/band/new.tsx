import * as React from 'react';
import styled from 'styled-components';
import cn from 'classnames';
import Button from '../../components/inputs/Button';
import ButtonGroup from '../../components/inputs/ButtonGroup';
import Input from '../../components/inputs/Input';
import Radio from '../../components/UI/Radio/Radio';
import ResponsiveLi, {H3, Div} from '../../components/UI/ResponsiveLi/ResponsiveLi';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {
  $BORDER_COLOR,
  $WHITE,
  $TEXT_GRAY,
  $THIN_GRAY,
  $POINT_BLUE,
  $FONT_COLOR,
  $GRAY
} from '../../styles/variables.types';
import {USER_TYPE_TO_KOR} from '../../src/constants/users';
import {useRouter} from 'next/router';
import moaCreateForm from '../../src/hooks/band/new';
import loginRequired from '../../hocs/loginRequired';

const Section = styled.section`
  background-color: #f6f7f9;
  padding: 50px 0 100px;
  
  @media screen and (max-width: 680px) {
    padding: 0;
  }
`;

const ApplyFormUl = styled.ul`
  max-width: 580px;
  margin: auto;
  background-color: ${$WHITE};
  padding-top: 4px;
`;

const StyledResponsiveLi = styled(ResponsiveLi)`
  border-bottom: 1px solid ${$BORDER_COLOR};
  padding: 15px 25px 11px;

  ${H3} {
    position: static;
    letter-spacing: -2px;
    padding-bottom: 18px;
    ${fontStyleMixin({
  size: 18,
  weight: '300'
})}
  }

  ${Div} {
    padding: 0;
  }

  @media screen and (max-width: 680px) {
    padding: 18px 12px 11px;
  }
`;

const TitleSpan = styled.span`
  ${fontStyleMixin({
  size: 11,
  weight: 'bold',
})}
  display: block;
  box-sizing: border-box;
  padding-bottom: 10px;
`;

const StyledRadio = styled(Radio)`
  margin-bottom: 20px;

  label span {
    padding-left: 5px;
    ${fontStyleMixin({
  size: 12,
  color: $TEXT_GRAY
})}
  }
`;

const StyledButton = styled(Button)`
  &.nickname-btn {
    position: absolute;
    right: 0;
  }

  &.complete {
    margin-bottom: 19px;
  }

  @media screen and (max-width: 680px) {
    &.complete {
      margin-bottom: 21px;
    }
  }
`;

const ApplicantLi = styled.li`
  display: inline-block;
  vertical-align: middle;
  padding: 1px 40px 0 0;
  font-size: 15px;
  color: ${$TEXT_GRAY};

  ${TitleSpan} {
    display: inline-block;
    vertical-align: middle;
    margin-top: -4px;
    padding: 0;
  }

  &:last-child {
    padding-right: 0;
  }
`;

const NicknameLi = styled.li`
  position: relative;
  padding: 25px 0 18px 0;

  @media screen and (max-width: 680px) {
    padding: 20px 0 6px 0;
  }
`;

const MsgSpan = styled.span`
  display: block;
  padding-top: 5px;
  ${fontStyleMixin({
  size: 11,
  color: $TEXT_GRAY
})}
`;

const StyledInput = styled(Input)`
  display: inline-block !important;
  vertical-align: middle;
  width: 100%;
  height: 44px;
  border-bottom: 1px solid ${$BORDER_COLOR} !important;
  ${fontStyleMixin({
  size: 14,
  color: $TEXT_GRAY
})}

  &.nickname-input {
    width: calc(100% - 120px);
  }
`;

const Infoul = styled.ul`
  margin-top: -16px;
`;

const InfoLi = styled.li`
  position: relative;
  padding-bottom: 20px;

  ${TitleSpan} {
    padding-bottom: 0;
  }

  &:first-child ${TitleSpan} {
    padding-top: 16px;
  }

  @media screen and (max-width: 680px) {
    &:first-child ${TitleSpan} {
      padding-top: 13px;
    }
  }
`;

const CategoryUl = styled.ul`
  text-align: center;
  padding: 17px 0 20px;
  border-bottom: 1px solid ${$BORDER_COLOR};
`;

const CategoryLi = styled.li`
  display: inline-block;
  vertical-align: middle;
  text-align: center;
  
  padding: 0 18px;

  ${fontStyleMixin({
  size: 14,
  weight: '600',
  color: $TEXT_GRAY
})}

  img {
    width: 65px;
    display: block;
    margin: auto;
    padding-bottom: 5px;

    &.on {
      display: none;
    }
  }

  &.on {
    color: ${$FONT_COLOR};

    img {
      display: none;

      &.on {
        display: block;
      }
    }
  }
`;

const UrlP = styled.p`
  border-bottom: 1px solid ${$BORDER_COLOR};

  ${fontStyleMixin({
  size: 15,
  color: $POINT_BLUE
})}

  ${StyledInput} {
    border-bottom: 0 !important;
  }

  @media screen and (max-width: 680px) {
    padding-top: 14px;
  }
`;

const TextareaLi = styled.li`
  padding-top: 15px;

  ${TitleSpan} {
    padding-bottom: 8px;
  }
`;

const TextAreaBox = styled.textarea`
  ${fontStyleMixin({
  size: 14,
  color: $TEXT_GRAY
})}
  height: 80px;
  box-sizing: border-box;
  padding: 8px 12px;
  border: 1px solid ${$BORDER_COLOR};
  text-align: left;

  &.large {
    min-height: 180px;
  }

  &::placeholder {
    color: ${$TEXT_GRAY};
  }
`;

const JoinQuestionLi = styled.li`
  position: relative;
  padding: 20px 0 21px;

  ${TitleSpan} {
    padding-bottom: 7px;
  }


  ${StyledInput} {
    width: calc(100% - 21px);
  }
`;

const StyledButtonGroup = styled(ButtonGroup)`
  max-width: 580px;
  margin: auto;
  text-align: center;
  padding: 30px 0 60px;
  background-color: ${$WHITE};

  li {
    padding: 0 5px;
  }

  button {
    width: 128px;
    height: 33px;
    box-sizing: border-box;
    border-radius: 17px;
    border: 1px solid ${$THIN_GRAY};
    ${fontStyleMixin({
  size: 15,
  color: '#999'
})}

    &.right-button {
      color: ${$POINT_BLUE};
      border-color: ${$POINT_BLUE};
    }
  }
`;

const NewMoaMobile: React.FC<{}> = React.memo(() => {
  const router = useRouter();
  const {
    formaDataState: {formData, setFormData},
    tmpUserExposeTypeState: {tmpUserExposeType, setTmpUserExposeType},
    alreadyCommunity,
    categoryList,
    isShowContent,
    useMeData,
    applyUserExposeType,
    changeCommunityName,
    changeCommunitySlug,
    createMoa,
    onChangeAtName
  } = moaCreateForm();

  const {
    user_expose_type,
    nick_name,
    category,
    name,
    slug,
    purpose,
    body,
    question1,
    question2
  } = formData;

  const {
    name: user_name,
    user_type,
    auth_id
  } = useMeData;

  // categoryList를 성공적으로 받아오지 못했다면 화면을 노출시키지 않습니다.
  if (!categoryList) { return null; }

  return (
    <Section>
      <ApplyFormUl>
        <StyledResponsiveLi
          title="공개 설정"
        >
          <ul>
            <li>
              <StyledRadio
                checked={tmpUserExposeType === 'nick'}
                onClick={() => setTmpUserExposeType('nick')}
              >
                닉네임 MOA
                <span>닉네임으로만 활동하는 커뮤니티입니다</span>
              </StyledRadio>
            </li>
            <li>
              <StyledRadio
                checked={tmpUserExposeType === 'real'}
                onClick={() => setTmpUserExposeType('real')}
              >
                실명 MOA
                <span>실명으로만 활동 하는 커뮤니티입니다.</span>
              </StyledRadio>
            </li>
            <li>
              <StyledRadio
                checked={tmpUserExposeType === 'anon'}
                onClick={() => setTmpUserExposeType('anon')}
              >
                익명 MOA
                <span>익명으로만 활동 하는 커뮤니티입니다.</span>
              </StyledRadio>
            </li>
          </ul>
          <StyledButton
            size={{
              width: '100%',
              height: '44px'
            }}
            border={{
              radius: '0',
              width: '1px',
              color: $BORDER_COLOR
            }}
            font={{
              color: $POINT_BLUE,
              size: '14px'
            }}
            onClick={applyUserExposeType}
          >
            확인
          </StyledButton>
        </StyledResponsiveLi>
        {isShowContent && (
          <>
            <StyledResponsiveLi title="신청자 정보">
              <ul>
                <ApplicantLi>
                  <TitleSpan>ID</TitleSpan> {auth_id}
                </ApplicantLi>
                {user_expose_type === 'real' && (
                  <ApplicantLi>
                    <TitleSpan>실명</TitleSpan> {user_name}
                  </ApplicantLi>
                )}
                {user_expose_type !== 'anon' && (
                  <ApplicantLi>
                    <TitleSpan>구분</TitleSpan> {USER_TYPE_TO_KOR[user_type]}
                  </ApplicantLi>
                )}
                {user_expose_type === 'nick' && (
                  <NicknameLi>
                    <TitleSpan>닉네임</TitleSpan>
                    <StyledInput
                      className="nickname-input"
                      value={nick_name}
                      name="nick_name"
                      onChange={onChangeAtName}
                      placeholder="3~10자(한글,영문,숫자 가능)"
                      regex="VALIDATE_NUMBER_ENGLISH__KOREAN_REQUIRED"
                      maxLength={10}
                    />
                    <StyledButton
                      className="nickname-btn"
                      size={{
                        width: '113px',
                        height: '44px'
                      }}
                      border={{
                        width: '1px',
                        radius: '0',
                        color: $BORDER_COLOR
                      }}
                      font={{
                        size: '14px',
                        weight: '600',
                        color: $GRAY
                      }}
                    >
                      중복 체크
                    </StyledButton>
                    <MsgSpan>※ 30일마다 변경 가능</MsgSpan>
                  </NicknameLi>
                )}
              </ul>
            </StyledResponsiveLi>
            <StyledResponsiveLi
              title="기본 정보"
            >
              <Infoul>
                <InfoLi>
                  <TitleSpan>카테고리 선택</TitleSpan>
                  <CategoryUl>
                    {categoryList.map(({id, name, avatar_on, avatar_off}) => (
                      <CategoryLi
                        key={id}
                        className={cn({on: category === id})}
                        onClick={() => setFormData(curr => ({ ...curr, category: id }))}
                      >
                        <img
                          src={avatar_off}
                          alt={name}
                        />
                        <img
                          className="on"
                          src={avatar_on}
                          alt={name}
                        />
                        {name}
                      </CategoryLi>
                    ))}
                  </CategoryUl>
                </InfoLi>
                <InfoLi>
                  <TitleSpan>커뮤니티 명</TitleSpan>
                  <StyledInput
                    value={name}
                    name="name"
                    onChange={changeCommunityName}
                    maxLength={15}
                    regex="VALIDATE_NUMBER_LOWER_CASE__KOREAN_REQUIRED"
                    placeholder="15자 이내, 영소문자, 숫자, 한글 입력해주세요."
                  />
                  <MsgSpan>
                    {name.length
                      ? alreadyCommunity.name
                        ? '이미 사용중인 이름입니다.'
                        : '사용 가능한 이름입니다.'
                      : '추후 변경이 불가능하니, 신중하게 작성해주세요.'}
                  </MsgSpan>
                </InfoLi>
                <InfoLi>
                  <TitleSpan>커뮤니티 주소</TitleSpan>
                  <UrlP>
                    https://www.haniplanet.com/band/
                    <StyledInput
                      value={slug}
                      name="slug"
                      onChange={changeCommunitySlug}
                      placeholder="15자 이내, 영소문자, 숫자, 한글"
                    />
                  </UrlP>
                  <MsgSpan>
                    {slug.length
                      ? alreadyCommunity.slug
                        ? '이미 사용중인 이름입니다.'
                        : '사용 가능한 이름입니다.'
                      : '추후 변경이 불가능하니, 신중하게 작성해주세요.'}
                  </MsgSpan>
                </InfoLi>
                <TextareaLi>
                  <TitleSpan>개설목적</TitleSpan>
                  <TextAreaBox
                    value={purpose}
                    name="purpose"
                    onChange={onChangeAtName}
                    placeholder={`MOA 가입 상단 MOA 메인화면에 노출되므로, 자세하게 작성해주세요.\n100자 이내로 입력해주세요.`}
                  />
                </TextareaLi>
                <TextareaLi>
                  <TitleSpan>소개글</TitleSpan>
                  <TextAreaBox
                    className="large"
                    value={body}
                    name="body"
                    onChange={onChangeAtName}
                    placeholder="50~500자 이내로 입력해주세요."
                    maxLength={500}
                  />
                </TextareaLi>
                <JoinQuestionLi>
                  <TitleSpan>가입 질문</TitleSpan>
                  <ul>
                    <li>
                      1. <StyledInput
                      value={question1}
                      name="question1"
                      onChange={onChangeAtName}
                      maxLength={30}
                      placeholder="30자이내로 입력해주세요"
                    />
                    </li>
                    <li>
                      2. <StyledInput
                      value={question2}
                      name="question2"
                      onChange={onChangeAtName}
                      maxLength={30}
                      placeholder="30자이내로 입력해주세요"
                    />
                    </li>
                  </ul>
                </JoinQuestionLi>
              </Infoul>
            </StyledResponsiveLi>
          </>
        )}
      </ApplyFormUl>
      <StyledButtonGroup
        leftButton={{
          children: '취소',
          onClick: () => {
            const isCancel = confirm('작성하신 신청서는 저장되지 않습니다. 취소하시겠습니까?');

            if (isCancel) {
              router.back();
            }
          }
        }}
        rightButton={{
          children: '확인',
          onClick: () => createMoa()
            .then(({status}) => {
              if (Math.floor(status / 100) !== 4) {
                return router.replace('/band');
              }
            })
        }}
      />
    </Section>
  );
});

NewMoaMobile.displayName = 'NewMoaMobile';
export default loginRequired(NewMoaMobile);
