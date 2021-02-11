import * as React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import Input from '../../components/inputs/Input';
import Radio from '../../components/UI/Radio/Radio';
import Button from '../../components/inputs/Button';
import WaypointHeader from '../../components/layout/header/WaypointHeader';
import ResponsiveLi, {H3, Div} from '../../components/UI/ResponsiveLi/ResponsiveLi';
import moaCreateForm from '../../src/hooks/band/new';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {USER_TYPE_TO_KOR} from '../../src/constants/users';
import {$BORDER_COLOR, $TEXT_GRAY, $POINT_BLUE, $FONT_COLOR} from '../../styles/variables.types';
import BasicButtonGroup from '../../components/inputs/ButtonGroup/BasicButtonGroup';
import MoaHeader from '../../components/band/MoaHeader';
import useSetPageNavigation from '../../src/hooks/useSetPageNavigation';

const ApplyFormUl = styled.ul`
  width: 680px;
  padding: 0 222.5px;
  margin: 40px auto auto;

  .button-group {
    text-align: right;
    padding: 30px 0 80px;
  }
`;


const StyledInput = styled(Input)`
  display: inline-block !important;
  vertical-align: middle;
  width: 100%;
  margin-right: 8px;
  height: 44px;
  border-bottom: 1px solid ${$BORDER_COLOR} !important;
  ${fontStyleMixin({
    size: 14,
    color: $TEXT_GRAY
  })}
`;

const StyledResponsiveLi = styled(ResponsiveLi)`
  border-top: 1px solid ${$BORDER_COLOR};
  border-bottom: 1px solid ${$BORDER_COLOR};
  padding-bottom: 0;

  &.visibility {
    ${Div} {
      padding-bottom: 12px;
      
      li div {
        padding: 0;
      }
    }
  }

  ${H3} {
    top: 17px;
    letter-spacing: -2px;
    ${fontStyleMixin({
      size: 19,
      weight: '300'
    })}
  }

  ${Div} {
    padding: 21px 0 32px 149px;

    li {
      position: relative;

      & > div {
        padding-left: 100px;
      }
    }

    h3 {
      position: absolute;
      left: 0;
      top: 14px;
      ${fontStyleMixin({
        size: 11,
        weight: 'bold'
      })}
    }

    .message {
      display: block;
      padding-top: 4px;
      ${fontStyleMixin({
        size: 11,
        color: $TEXT_GRAY
      })}
    }
  }

  .applicant-list li {
    display: inline-block;
    vertical-align: middle;
    padding-right: 40px;
    ${fontStyleMixin({
      size: 15,
      color: $TEXT_GRAY
    })}

    h3 {
      position: static;
      display: inline-block;
      vertical-align: middle;
      margin: -3px 5px 0 0;
    }

    &.nick-name {
      display: block;
      padding-top: 13px;

      h3 {
        position: absolute;
        top: 30px;
      }
    } 
  }

  .basic-info {
    margin-top: -14px;

    & > li {
      padding-bottom: 10px;

      .category-list {
        text-align: center;
        padding: 14px 0 20px;
        border-bottom: 1px solid ${$BORDER_COLOR};

        li {
          display: inline-block;
          vertical-align: middle;
          text-align: center;
          cursor: pointer;
          padding: 0 18px;
          ${fontStyleMixin({
            size: 13,
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
        }
      }

      p {
        padding: 3px 0 2px;
        border-bottom: 1px solid ${$BORDER_COLOR};
        ${fontStyleMixin({
          size: 14,
          color: $POINT_BLUE
        })}

        ${StyledInput} {
          width: calc(100% - 250px);
          margin: -5px 0 0 5px;
          border-bottom: 0 !important;
        }
      } 

      &.textbox-list {
        padding-bottom: 2px;

        h3 {
          position: static;
          padding: 12px 0 9px;
        }
      }
    }

    .join-question {
      padding-bottom: 0;

      h3 {
        top: 19px;
      }

      ul {
        margin-left: -14px;

        li {
          margin-left: -3px;
          padding: 8px 0 3px;
          font-size: 14px;

          ${StyledInput} {
            margin: -6px 0 0 0;
            width: calc(100% - 16px);
          }
        }
      }
    }
  } 
`;

const StyledRadio = styled(Radio)`
  margin-bottom: 20px;

  label {
    width: 400px;
    padding-left: 28px;

    span {
      padding-left: 5px;
      ${fontStyleMixin({
        size: 12,
        color: $TEXT_GRAY
      })}
    }
  } 
`;

const TextAreaBox = styled.textarea`
  height: 80px;
  padding: 8px 12px;
  text-align: left;
  box-sizing: border-box;
  border: 1px solid ${$BORDER_COLOR};
  ${fontStyleMixin({
    size: 14,
    color: $TEXT_GRAY
  })}

  &.large {
    min-height: 180px;
  }

  &::placeholder {
    color: ${$TEXT_GRAY};
  }
`;

const CompleteButton = styled(Button)`
  position: absolute;
  right: 0;
  top: 22px;
`;

const NewMoaPC: React.FC = React.memo(() => {
  const router = useRouter();

  // Custom Hooks
  useSetPageNavigation('/band');

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
    <section>
      <WaypointHeader
        headerComp={
          <MoaHeader
            title="MOA 개설하기"
            linkProps={{href: '/band'}}
          >
            MOA
          </MoaHeader>
        }
      >
        <ApplyFormUl>
          <StyledResponsiveLi
            title="공개 설정"
            className="visibility"
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
            <CompleteButton
              size={{
                width: '95px',
                height: '94px'
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
            </CompleteButton>
          </StyledResponsiveLi>

          {isShowContent && (
            <>
              <StyledResponsiveLi title="신청자 정보">
                <ul className="applicant-list">
                  <li>
                    <h3>ID</h3> {auth_id}
                  </li>
                  {user_expose_type === 'real' && (
                    <li>
                      <h3>실명</h3> {user_name}
                    </li>
                  )}
                  {user_expose_type !== 'anon' && (
                    <li>
                      <h3>구분</h3> {USER_TYPE_TO_KOR[user_type]}
                    </li>
                  )}
                  {user_expose_type === 'nick' && (
                    <li className="nick-name">
                      <h3>닉네임</h3>
                      <div>
                        <StyledInput
                          value={nick_name}
                          name="nick_name"
                          onChange={onChangeAtName}
                          placeholder="3~10자(한글,영문,숫자 가능)"
                          regex="VALIDATE_NUMBER_ENGLISH__KOREAN_REQUIRED"
                          maxLength={10}
                        />
                        <span className="message">※ 30일마다 변경 가능</span>
                      </div>
                    </li>
                  )}
                </ul>
              </StyledResponsiveLi>
              <StyledResponsiveLi title="기본 정보">
                <ul className="basic-info">
                  <li>
                    <h3>카테고리 선택</h3>
                    <div>
                      <ul className="category-list">
                        {categoryList.map(({id, name, avatar_on, avatar_off}) => (
                          <li
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
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                  <li>
                    <h3>커뮤니티명</h3>
                    <div>
                      <StyledInput
                        value={name}
                        name="name"
                        onChange={changeCommunityName}
                        maxLength={15}
                        regex="VALIDATE_NUMBER_LOWER_CASE__KOREAN_REQUIRED"
                        placeholder="15자 이내, 영소문자, 숫자, 한글 입력해주세요."
                      />
                      <span className="message">
                      {name.length
                        ? alreadyCommunity.name
                          ? '이미 사용중인 이름입니다.'
                          : '사용 가능한 이름입니다.'
                        : '추후 변경이 불가능하니, 신중하게 작성해주세요.'}
                    </span>
                    </div>
                  </li>
                  <li>
                    <h3>커뮤니티 주소</h3>
                    <div>
                      <p>
                        https://www.haniplanet.com/band/
                        <StyledInput
                          value={slug}
                          name="slug"
                          onChange={changeCommunitySlug}
                          placeholder="15자 이내, 영소문자, 숫자"
                        />
                      </p>
                      <span className="message">
                      {slug.length
                        ? alreadyCommunity.slug
                          ? '이미 사용중인 이름입니다.'
                          : '사용 가능한 이름입니다.'
                        : '추후 변경이 불가능하니, 신중하게 작성해주세요.'}
                    </span>
                    </div>
                  </li>
                  <li className="textbox-list">
                    <h3>개설목적</h3>
                    <TextAreaBox
                      value={purpose}
                      name="purpose"
                      onChange={onChangeAtName}
                      placeholder={`MOA 가입 상단 MOA 메인화면에 노출되므로, 자세하게 작성해주세요.\n100자 이내로 입력해주세요.`}
                    />
                  </li>
                  <li className="textbox-list">
                    <h3>소개글</h3>
                    <TextAreaBox
                      className="large"
                      value={body}
                      name="body"
                      onChange={onChangeAtName}
                      placeholder="50~500자 이내로 입력해주세요."
                      maxLength={500}
                    />
                  </li>
                  <li className="join-question">
                    <h3>가입 질문</h3>
                    <div>
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
                    </div>
                  </li>
                </ul>
              </StyledResponsiveLi>
            </>
          )}
          <BasicButtonGroup
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
              onClick: () => {
                const createMoaRes = createMoa();
  
                return createMoaRes && createMoaRes
                  .then(({status}) => {
                    if (Math.floor(status / 100) !== 4) {
                      return router.replace('/band');
                    }
                  });
              }
            }}
          />
        </ApplyFormUl>
      </WaypointHeader>
    </section> 
  );
});

NewMoaPC.displayName = 'NewMoaPC';
export default NewMoaPC;
