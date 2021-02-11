import * as React from 'react';
import styled from 'styled-components';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import {$BORDER_COLOR, $GRAY, $POINT_BLUE, $TEXT_GRAY, $THIN_GRAY, $WHITE} from '../../styles/variables.types';
import {backgroundImgMixin, fontStyleMixin, heightMixin} from '../../styles/mixins.styles';
import useBandEdit from '../../src/hooks/band/useBandEdit';
import {USER_EXPOSE_TYPE_TO_KOR, USER_TYPE_TO_KOR} from '../../src/constants/users';
import {staticUrl} from '../../src/constants/env';
import usePrevious from '../../src/hooks/usePrevious';
import ButtonGroup from '../inputs/ButtonGroup';
import {useRouter} from 'next/router';
import Button from '../inputs/Button';
import Loading from '../common/Loading';
import {cloneDeep} from 'lodash';
import loginRequired from '../../hocs/loginRequired';
import { ADMIN_PERMISSION_GRADE } from '../../src/constants/band';
import Page403 from '../errors/Page403';

const Section = styled.section`
  background-color: #f6f7f9;
  padding: 50px 0 100px;

  & > div {
    max-width: 580px;
    margin: auto;
    background-color: ${$WHITE};
  }

  @media screen and (max-width: 680px) {
    padding: 0;
  }
`;

const ApplyTopDiv = styled.div`
  padding: 20px 25px;
  position: relative;
  text-align: left;

  h2 {
    ${fontStyleMixin({
  size: 23,
  weight: '300',
})}

    span {
      display: block;
      ${fontStyleMixin({
  size: 11,
  weight: 'bold',
})}
    }
  }

  @media screen and (max-width: 680px) {
    padding: 20px 15px 32px;

    h2 {
      padding-right: 80px;
    }
  }
`;

const MoaAvatar = styled.div<{avatar: string;}>`
  position: absolute;
  right: 46px;
  top: 17px;
  ${({avatar}) => backgroundImgMixin({
  img: avatar || staticUrl('/static/images/icon/icon-default-moa-img.png'),
})}
  width: 40px;
  height: 40px;
  border-radius: 50%;

  img {
    position: absolute;
    right: -32px;
    bottom: 0px;
    width: 40px;
  }
`;

const ApplyInfoDiv = styled.div`
  width: 100%;
  padding: 13px 15px;
  box-sizing: border-box;
  background-color: #f8f6ee;
  border-top: 1px solid ${$BORDER_COLOR};

  p {
    ${fontStyleMixin({
  size: 14,
  color: '#999',
})}

    span {
      display: block;
      padding-bottom: 2px;
      ${fontStyleMixin({
  size: 14,
  weight: '600',
})}
    }
  }
`;

const ApplyFormDiv = styled.div`
  max-width: 580px;
  margin: auto;
  box-sizing: border-box;
  padding: 20px 25px;
  background-color: ${$WHITE};
  border-bottom: 1px solid ${$BORDER_COLOR};

  @media screen and (max-width: 680px) {
    padding: 17px 15px;
  }
`;

const TitleSpan = styled.span`
  ${fontStyleMixin({
  size: 11,
  weight: 'bold',
})}
  display: block;
`;

const ApplicantLi = styled.li`
  display: inline-block;
  vertical-align: middle;
  width: 33.333%;
  ${fontStyleMixin({
  size: 15,
  color: $TEXT_GRAY,
})}

  ${TitleSpan} {
    display: inline-block;
    vertical-align: middle;
    margin-top: -2px;
    padding-right: 3px;
  }
`;

const Input = styled.input`
  display: inline-block !important;
  vertical-align: middle;
  width: calc(100% - 146px);
  margin-right: 8px;
  height: 44px;
  border-bottom: 1px solid ${$BORDER_COLOR} !important;
  ${fontStyleMixin({
  size: 14,
  color: $TEXT_GRAY,
})}
`;

const NicknameLi = styled.li`
  position: relative;
  padding: 24px 0 23px;
`;

const StyledButton = styled(Button)`
  position: absolute;
  right: 0;
`;

const MsgSpan = styled.span`
  display: block;
  padding-top: 5px;
  ${fontStyleMixin({
  size: 11,
  color: $TEXT_GRAY,
})}
`;

const CategoryLi = styled.li`
  position: relative;
  padding-bottom: 20px;
`;

const TextBoxP = styled.p`
  ${heightMixin(44)};
  font-size: 16px;
  border-bottom: 1px solid ${$BORDER_COLOR};

  span {
    color: ${$POINT_BLUE};
  }
`;

const TextareaBox = styled.textarea`
  box-sizing: border-box;
  margin: 8px 0 17px;
  padding: 8px 12px;
  width: 100%;
  min-height: 80px;
  border: 1px solid ${$BORDER_COLOR};
  ${fontStyleMixin({
  size: 14,
  color: $GRAY,
})}

  &.large {
    min-height: 180px;
  }

  &::placeholder {
    color: ${$TEXT_GRAY};
  }
`;

const JoinQuestionLi = styled.li`
  position: relative;
  font-size: 14px;

  ${Input} {
    width: calc(100% - 21px);
  }
`;

const StyledButtonGroup = styled(ButtonGroup)`
  max-width: 680px;
  margin: auto;
  text-align: center;
  padding: 30px 0 100px;

  li {
    padding: 0 5px;
  }
  
  button {
    width: 138px;
    height: 40px;
    box-sizing: border-box;
    border-radius: 20px;
    border: 1px solid ${$THIN_GRAY};
    ${fontStyleMixin({
  size: 15,
  color: '#999',
})}

    &.right-button {
      color: ${$POINT_BLUE};
      border-color: ${$POINT_BLUE};
    }
  }
`;


const MoaInfoEditMobile = React.memo<{}>(() => {
  const router = useRouter();
  const {query: {slug}} = router;
  const {
    band,
    myInfo,
    question,
    patchBandInfo,
  } = useBandEdit(slug);
  const prevBand = usePrevious(band);

  const [bandInfo, setBandInfo] = React.useState({
    purpose: '',
    body: '',
    questions: {
      first: {
        id: '',
        question: '',
      },
      second: {
        id: '',
        question: '',
      },
    },
  });

  React.useEffect(() => {
    if (!isEqual(prevBand, band)) {
      setBandInfo(curr => ({
        ...curr,
        purpose: band.purpose,
        body: band.body,
      }));
    }
  }, [band]);

  React.useEffect(() => {
    if (question && !isEmpty(question)) {
      const [first, second] = Object.values(question[slug]);

      setBandInfo(curr => ({
        ...curr,
        questions: {first, second},
      }));
    }
  }, [question, slug]);

  if (isEmpty(bandInfo) || band === undefined || isEmpty(myInfo) || isEmpty(question)) {
    return <Loading/>;
  }

  const {user} = myInfo;
  const {
    name,
    avatar,
    user_expose_type,
    purpose: _purpose,
    body: _body,
    category,
  } = band;
  const [first, second] = Object.values(question[slug]);

  const DEFAULT_STATE = {
    purpose: _purpose,
    body: _body,
    questions: {
      first,
      second,
    },
  };

  const nameByExposeType = USER_EXPOSE_TYPE_TO_KOR[user_expose_type];
  const hasPermissionDiff = ADMIN_PERMISSION_GRADE.includes(band.band_member_grade);

  if(!hasPermissionDiff) {
    return <Page403/>
  }

  return (
    <Section>
      <div>
        <ApplyTopDiv>
          <MoaAvatar avatar={avatar}>
            <img
              src={staticUrl('/static/images/icon/icon-expert.png')}
              alt="모아 대표이미지"
            />
          </MoaAvatar>
          <h2>
            <span>MOA명</span>
            {name}
          </h2>
        </ApplyTopDiv>
        <ApplyInfoDiv>
          <p>
            <span>{nameByExposeType}MOA </span>&nbsp;
            {nameByExposeType}으로 활동하는 모아입니다.
          </p>
        </ApplyInfoDiv>
        <ApplyFormDiv>
          <ul>
            {user_expose_type === 'real' && (
              <ApplicantLi>
                <TitleSpan>ID</TitleSpan> {user.auth_id}
              </ApplicantLi>
            )}
            <ApplicantLi>
              <TitleSpan>{nameByExposeType}</TitleSpan>&nbsp;
              {user.name || user.nick_name}
            </ApplicantLi>
            <ApplicantLi>
              <TitleSpan>구분</TitleSpan> {USER_TYPE_TO_KOR[user.user_type]}
            </ApplicantLi>
            <CategoryLi>
              <TitleSpan>카테고리 선택</TitleSpan>
              <TextBoxP>{category.name}</TextBoxP>
            </CategoryLi>
            <CategoryLi>
              <TitleSpan>커뮤니티 명</TitleSpan>
              <TextBoxP>{name}</TextBoxP>
            </CategoryLi>
            <CategoryLi>
              <TitleSpan>커뮤니티주소</TitleSpan>
              <TextBoxP>https://www.haniplanet.com/band/<span>{slug}</span></TextBoxP>
            </CategoryLi>
            <li>
              <TitleSpan>개설목적</TitleSpan>
              <TextareaBox
                placeholder={`MOA 가입 상단 MOA 메인화면에 노출되므로, 자세하게 작성해주세요.\n100자 이내로 입력해주세요.`}
                maxLength={100}
                value={bandInfo.purpose}
                onChange={({target: {value}}) => {
                  setBandInfo(curr => ({
                    ...curr,
                    purpose: value,
                  }));
                }}
              />
            </li>
            <li>
              <TitleSpan>소개글</TitleSpan>
              <TextareaBox
                className="large"
                placeholder="50~500자 이내로 입력해주세요."
                value={bandInfo.body}
                maxLength={500}
                onChange={({target: {value}}) => {
                  setBandInfo(curr => ({
                    ...curr,
                    body: value,
                  }));
                }}
              />
            </li>
            {(!isEmpty(bandInfo.questions.first) && !isEmpty(bandInfo.questions.second)) && (
              <JoinQuestionLi>
                <TitleSpan>가입질문</TitleSpan>
                <ul>
                  {/* @진혜연: 글씨 색이 $TEXT_GRAY가 아닌, #333이 되어야 할 것 같습니다. */}
                  <li>
                    1.
                    <Input
                      type="text"
                      value={bandInfo.questions.first.question}
                      onChange={({target: {value}}) => {
                        const {
                          questions,
                          questions: {
                            first,
                          },
                        } = bandInfo;

                        setBandInfo(curr => ({
                          ...curr,
                          questions: {
                            ...questions,
                            first: {
                              ...first,
                              question: value,
                            },
                          },
                        }));
                      }}
                    />
                  </li>
                  <li>
                    2.
                    <Input
                      type="text"
                      value={bandInfo.questions.second.question}
                      onChange={({target: {value}}) => {
                        const {
                          questions,
                          questions: {
                            second,
                          },
                        } = bandInfo;

                        setBandInfo(curr => ({
                          ...curr,
                          questions: {
                            ...questions,
                            second: {
                              ...second,
                              question: value,
                            },
                          },
                        }));
                      }}
                    />
                  </li>
                </ul>
              </JoinQuestionLi>
              )}

          </ul>
        </ApplyFormDiv>
        <StyledButtonGroup
          leftButton={{
            children: '취소',
            onClick: () => confirm('정보 수정을 취소하시겠습니까?') && (
              router.push(`/band/${slug}`)
            ),
          }}
          rightButton={{
            children: '확인',
            onClick: () => {
              patchBandInfo(slug, bandInfo, DEFAULT_STATE, () => {
                alert('정보 수정이 완료되었습니다.');
                router.push(`/band/${slug}`);
              });
            },
          }}
        />
      </div>
    </Section>
  );
});

MoaInfoEditMobile.displayName = 'MoaInfoEditMobile';
export default loginRequired(MoaInfoEditMobile);
