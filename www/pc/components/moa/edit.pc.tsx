import * as React from 'react';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import {useRouter} from 'next/router';
import Input from '../inputs/Input';
import WaypointHeader from '../layout/header/WaypointHeader';
import usePrevious from '../../src/hooks/usePrevious';
import useBandEdit from '../../src/hooks/band/useBandEdit';
import loginRequired from '../../hocs/loginRequired';
import {staticUrl} from '../../src/constants/env';
import {backgroundImgMixin, fontStyleMixin, heightMixin} from '../../styles/mixins.styles';
import {USER_EXPOSE_TYPE_TO_KOR, USER_TYPE_TO_KOR} from '../../src/constants/users';
import {$BORDER_COLOR, $GRAY, $POINT_BLUE, $TEXT_GRAY} from '../../styles/variables.types';
import BasicButtonGroup from '../inputs/ButtonGroup/BasicButtonGroup';
import MoaHeader from '../band/MoaHeader';
import Page403 from '../errors/Page403';
import {ADMIN_PERMISSION_GRADE} from '../../src/constants/band';

const ApplyTopDiv = styled.div`
  width: 680px;
  margin: auto;
  box-sizing: border-box;
  padding: 40px 0 15px;
  position: relative;

  h2 {
    ${fontStyleMixin({size: 23, weight: '300'})};

    span {
      display: block;
      ${fontStyleMixin({size: 11, weight: 'bold'})};
    }
  }
`;

const MoaAvatar = styled.div<{avatar: string;}>`
  position: absolute;
  right: -66px;
  top: 50%;
  margin-top: -3px;
  ${({avatar}) => backgroundImgMixin({
    img: avatar || staticUrl('/static/images/icon/icon-default-moa-img.png'),
  })}
  width: 40px;
  height: 40px;
  border-radius: 50%;

  img {
    position: absolute;
    right: -33px;
    bottom: 0px;
    width: 40px;
  }
`;

const ApplyInfoDiv = styled.div`
  width: 100%;
  box-sizing: border-box;
  background-color: #f8f6ee;
  ${heightMixin(50)};
  border-top: 1px solid ${$BORDER_COLOR};

  p {
    width: 680px;
    margin: auto;
    ${fontStyleMixin({
      size: 14,
      color: '#999',
    })}

    span {
      padding-right: 5px;
      ${fontStyleMixin({
        size: 14,
        weight: '600',
      })}
    }
  }
`;

const ApplyFormUl = styled.div`
  width: 680px;
  margin: auto;
  padding: 23px 75px 15px;
  box-sizing: border-box;
  border-bottom: 1px solid ${$BORDER_COLOR};

  & > li {
    position: relative;
    padding-bottom: 15px;

    h3 {
      position: absolute;
      left: 0;
      top: 15px;
      ${fontStyleMixin({
        size: 11,
        weight: 'bold'
      })}
    }

    div {
      padding-left: 100px;

      p {
        ${heightMixin(44)}
        font-size: 15px;
        border-bottom: 1px solid ${$BORDER_COLOR};

        span {
          color: ${$POINT_BLUE};
        }
      }
    }
  }

  .user-info li {
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
      margin-top: -2px;
    }
  }

  .text-box-list {
    margin-bottom: -8px;

    li {
      &:first-child {
        padding-bottom: 13px;
      }

      h3 {
        position: static;
        padding-bottom: 9px;
      }
    }
  } 

  ol {
    padding-left: 98px;

    li {
      padding-bottom: 2px;
      border-bottom: 1px solid ${$BORDER_COLOR};
      list-style: unset;
      font-size: 14px;
    }
  }   
`;

const TextareaBox = styled.textarea`
  box-sizing: border-box;
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

const StyledInput = styled(Input)`
  width: 100%;
  height: 44px;
`;

const MoaInfoEditPC = React.memo(({}) => {
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
    if (!isEmpty(question)) {
      const [first, second] = Object.values(question[slug]);

      setBandInfo(curr => ({
        ...curr,
        questions: {first, second},
      }));
    }
  }, [question, slug]);

  if (band === undefined || isEmpty(myInfo) || isEmpty(question)) {
    return null;
  }

  const {user} = myInfo;
  const {
    name,
    band_member_grade,
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
  const hasPermissionDiff = ADMIN_PERMISSION_GRADE.includes(band_member_grade);

  if(!hasPermissionDiff) {
    return <Page403/>;
  }

  return (
    <WaypointHeader
      headerComp={
        <MoaHeader
          title="정보 수정"
          avatar={avatar}
          linkProps={{href: '/band/[slug]', as: `/band/${slug}`}}
        >
          {name} 커뮤니티
        </MoaHeader>
      }
    >
      <section>
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
            <span>{nameByExposeType}MOA</span>&nbsp;
            {nameByExposeType}으로 활동하는 모아입니다.
          </p>
        </ApplyInfoDiv>

        <ApplyFormUl>
          <li>
            <ul className="user-info">
              {user_expose_type === 'real' && (
                <li>
                  <h3>ID</h3> {user.auth_id}
                </li>
              )}
              <li>
                <h3>{nameByExposeType}</h3>&nbsp;
                {user.name || user.nick_name}
              </li>
              <li>
                <h3>구분</h3>  {USER_TYPE_TO_KOR[user.user_type]}
              </li>
            </ul>
          </li>
          <li>
            <h3>카테고리 선택</h3>
            <div>
              <p>{category.name}</p>
            </div>
          </li>
          <li>
            <h3>커뮤니티 명</h3>
            <div>
              <p>{name}</p>
            </div>
          </li>
          <li>
            <h3>커뮤니티주소</h3>
            <div>
              <p>
                https://www.haniplanet.com/band/<span>{slug}</span>
              </p>
            </div>
          </li>
          <li>
            <ul className="text-box-list">
              <li>
                <h3>개설목적</h3>
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
                <h3>소개글</h3>
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
            </ul>
          </li>
          <li>
            <h3>가입 질문</h3>
            <ol>
              <li>
                <StyledInput
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
                <StyledInput
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
            </ol>
          </li>
        </ApplyFormUl>
        <BasicButtonGroup
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
      </section>
    </WaypointHeader>
  );
});

MoaInfoEditPC.displayName = 'MoaInfoEditPC';
export default loginRequired(MoaInfoEditPC);
