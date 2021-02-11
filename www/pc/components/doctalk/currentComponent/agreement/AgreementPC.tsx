import * as React from 'react';
import Router from 'next/router';
import TermPC from '../../term/TermPC';
import SelectType from '../../selectType/SelectType';
import StyledButtonGroup from '../../../signup/StyledButtonGroup';
import TitleCard from '../../../UI/Card/TitleCard';
import styled from 'styled-components';
import {fontStyleMixin} from '../../../../styles/mixins.styles';
import {$POINT_BLUE, $GRAY} from '../../../../styles/variables.types';
import {staticUrl} from '../../../../src/constants/env';
import {ICurrentComponentProps} from '../../../../pages/doctalk/signup';
import {useSelector, shallowEqual, useDispatch} from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import {fetchUserHospital} from '../../../../src/reducers/hospital';

const DoctalkSignupNoticePC = styled(TitleCard)`
  padding: 12px 0 26px;

  h2 {
    padding-bottom: 8px;
    ${fontStyleMixin({
      size: 15,
      weight: '600'
    })};

    span {
      ${fontStyleMixin({
        size: 15,
        weight: '600',
        color: $POINT_BLUE
      })};
    }
  }

  h3 {
    margin: 10px 0 5px;
    ${fontStyleMixin({
      size: 13
    })};

    span {
      ${fontStyleMixin({
        size: 11
      })};
    }
  }

  ul {
    line-height: 22px;

    li {
      ${fontStyleMixin({
        size: 13,
        color: $GRAY
      })};
      
      span {
        display: inline-block;
        width: 16px;
        height: 16px;
        line-height: 16px;
        margin-right: 5px;
        border-radius: 8px;
        box-sizing: border-box;
        background-color: #edf5ff;
        text-align: center;
        ${fontStyleMixin({
          size: 11,
          color: $POINT_BLUE,
          family: 'Montserrat'
        })};
      }

      p {
        ${fontStyleMixin({
          size: 11,
          color: '#999'
        })};
      }
    }
  }

  > p {
    position: relative;
    padding-left: 16px;
    margin-top: 12px;
    ${fontStyleMixin({
      size: 13,
      color: $GRAY
    })};

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 14px;
    }
  }
`;

const BENEFITS = [
  {text: '닥톡 한의사 회원 무료 가입'},
  {text: '닥톡-NAVER 지식iN 전문가 무료 등록'},
  {text: 'NAVER 지식iN 질문/답변 건수 무제한 무료 등록'},
  {text: '닥톡-NAVER 지식iN 홈페이지 연동 API 무료 제공'},
  {text: '직원 닥톡 메신저 계정 사용료 무료(앱설치 URL 전송 조건부)'}
];

const AgreementPC = React.memo<ICurrentComponentProps>(
  ({signType, setSignType, next}) => {
    const dispatch = useDispatch();

    const {hospital, myId} = useSelector(
      ({hospital, system: {session: {id}}}) => ({
        hospital,
        myId: id
      }),
      shallowEqual
    );

    const myHospital = hospital[myId];

    const [termAgreement, setTermAgreement] = React.useState({
      term1: false,
      term2: false,
      term3: false
    });
    const {
      term1,
      term2,
      term3
    } = termAgreement;

    const onClickRightBtn = () => {
      if (!signType) {
        alert('회원 유형을 체크해주세요.');
      } else if (!term1 || !term2 || !term3) {
        alert('약관에 동의해주세요.');
      } else if (signType === 'haniplanet' && !isEmpty(myHospital)) {
        alert('이미 재직중인 한의 의료기관이 있습니다.');
      } else {
        setSignType(signType);
        next();
      }
    };

    React.useEffect(() => {
      if (myId) {
        dispatch(fetchUserHospital(myId));
      }
    }, [myId]);

    return (
      <>
        <DoctalkSignupNoticePC>
          <h2>
            한의사라면, 누구나 <span>NAVER 지식iN 상담한의사</span>가 될 수 있습니다.
          </h2>
          <h3>혜택</h3>
          <ul>
            {BENEFITS.map(({text}, index) => (
              <li key={text}>
                <span>{index + 1}</span>
                {text}
              </li>
            ))}
          </ul>
          <h3>사용료<span>(VAT포함가)</span></h3>
          <ul>
            <li>
              - 한의사 닥톡 메신저 계정 사용료 : 11,000원(월, 1인당)
            </li>
            <li>
              - 한의사 메시지 저장공간(cloud storage) : 11,000원(월, 10GB당)
            </li>
            <li>
              <p>
                *예시) 2인 원장 한의원 : 계정 사용료 22,000원, 저장공간 22,000원. 총 44,000원 익월 1일 또는 15일부터 과금
              </p>
            </li>
          </ul>
          <p>
            <img
              src={staticUrl('/static/images/icon/check/icon-check-blue.png')}
              alt="체크 아이콘"
            />
            양식 작성 후 제출해주시면, 회원 등록 후에 원장님 메신저로 CMS 이체 동의 신청서를 보내드립니다.<br/>
            1인 원장 한의원의 경우에는 금액란에 22,000원 입력하여 동의해주시면 됩니다.
          </p>
        </DoctalkSignupNoticePC>
        <SelectType
          type={signType}
          setType={setSignType}
        />
        <TermPC
          termAgree={termAgreement}
          setTermAgree={setTermAgreement}
        />
        <StyledButtonGroup
          leftButton={{
            onClick: () => confirm('회원가입을 그만두시겠습니까?') && Router.back(),
            children: '취소',
          }}
          rightButton={{
            onClick: onClickRightBtn,
            children: '다음',
          }}
        />
      </>
    );
  }
);

export default AgreementPC;
