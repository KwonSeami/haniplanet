import * as React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import Confirm from '../../common/popup/Confirm';
import {PopupProps} from '../../common/popup/base/Popup';
import {TitleDiv} from '../../common/popup/base/TitlePopup';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {
  $BORDER_COLOR,
  $FLASH_WHITE,
  $GRAY,
  $POINT_BLUE,
  $TEXT_GRAY,
} from '../../../styles/variables.types';
import CheckBox from '../../UI/Checkbox1/CheckBox';
import Input from '../../inputs/Input/InputDynamic';
import Button from '../../inputs/Button/ButtonDynamic';
import UserApi from '../../../src/apis/UserApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import {useRouter} from 'next/router';
import useChangeInputAtName from '../../../src/hooks/input/useChangeInputAtName';

const StyledConfirm = styled(Confirm)`
  .modal-body {
    width: 455px;
    
    ${TitleDiv} h2 {
      position: relative;
      padding: 4px 0 5px 15px;
      ${fontStyleMixin({size: 15, weight: 'bold'})};
    }
  }
  
  .popup-child {
    padding: 0 20px;
    
    & > p {
      padding: 16px 21px 18px;
      text-align: center;
      ${fontStyleMixin({size: 15})};
      
      .point-blue {
        ${fontStyleMixin({color: $POINT_BLUE})};
      }
      
      .notice {
        display: block;
        padding-top: 7px;
        ${fontStyleMixin({size: 13, color: $TEXT_GRAY})};
      }
    }
    
    .agreement-form {
      padding-bottom: 6px;
      
      li {
        position: relative;
        padding: 13px 3px;
        line-height: 1.2;
        border-top: 1px solid ${$BORDER_COLOR};
        ${fontStyleMixin({size: 14})};
        
        a {
          ${fontStyleMixin({size: 13, color: $POINT_BLUE})};
          text-decoration: underline;
        }
        
        .check-box {
          position: absolute;;
          top: 12px;
          right: 12px;
        }
        
        &.agreement-desc {
          padding: 10px 11px 15px;
          background: ${$FLASH_WHITE};
          border: 1px solid ${$BORDER_COLOR};
          border-radius: 2px;
          ${fontStyleMixin({size: 13, color: $GRAY})};
          
          span {
            display: block;
            padding-top: 9px;
            ${fontStyleMixin({size: 12, color: $TEXT_GRAY})};
          }
        }
      }
    }
    
    .login-info {
      border-top: 2px solid ${$BORDER_COLOR};
      
      li {
        padding: 12px 3px 0;
        ${fontStyleMixin({size: 15})};
        
        span {
          ${fontStyleMixin({size: 13})};
        }
      }
    
      .changed-id {
        position: relative;
        
        input {
          width: calc(100% - 85px);
          height: 35px;
          border: 1px solid ${$BORDER_COLOR};
          padding: 0 10px;
          ${fontStyleMixin({size: 15, color: $TEXT_GRAY})};
        }
        
        button {
          position: absolute;
          top: 34px;
          right: 3px;
        }
      }
      
      .changed-pw {
        input {
          width: 100%;
          height: 35px;
          border: 1px solid ${$BORDER_COLOR};
          padding: 0 10px;
          ${fontStyleMixin({size: 15, color: $TEXT_GRAY})};
          margin-top: 5px;
        }
      }
    }
  }
`;

interface IAgreement {
  text: string;
  to?: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent) => void;
}

interface IAgreementListProps {
  agreementState: [string[], React.Dispatch<React.SetStateAction<string[]>>];
  list: IAgreement[];
}

const AgreementList = React.memo<IAgreementListProps>(props => {
  const {agreementState, list = []} = props;
  const [agreement, setAgreement] = agreementState;
  const isAllChk = list.length === agreement.length;

  return (
    <ul className="agreement-form">
      <li>
        <p>전체 동의</p>
        <CheckBox
          checked={isAllChk}
          onChange={() => setAgreement(isAllChk ? [] : list.map(({text}) => text))}
        />
      </li>
      {list.map(({text, to, ...checkProps}) => (
        <li>
          <p>{text}</p>
          {to && (
            <Link href={to}>
              <a target="_blank">자세히 보기</a>
            </Link>
          )}
          <CheckBox {...checkProps} />
        </li>
      ))}
      <li className="agreement-desc">
        <p>
          약관의 거절 및 한의플래닛 회원가입을 원치 않으실 경우, “탈퇴” 버튼을 클릭하여 회원가입을 취소 하실 수 있습니다.
          <span>* 탈퇴 시 회원가입 간소화를 위해 사용(수집) 된 개인정보는 즉시 삭제(파기) 됩니다.</span>
        </p>
      </li>
    </ul>
  );
});

interface Props extends PopupProps {
  currId: string;
}

const AgreementPopup = React.memo<Props>(props => {
  const {currId} = props;
  const [agreement, setAgreement] = React.useState<string[]>([]);
  const [{id, auth_id, password, password2}, setUserInfo] = React.useState({
    id: '',         // 유저가 입력한 ID
    auth_id: '',    // 중복 확인으로 검증된 ID
    password: '',
    password2: ''
  });
  const router = useRouter();
  const changeUserInfoAtName = useChangeInputAtName(setUserInfo);
  const userApi = useCallAccessFunc(access => new UserApi(access));

  const AGREEMENT_LIST: IAgreement[] = [
    {
      text: '서비스 약관 동의',
      to: '/',
      checked: agreement.includes('서비스 약관 동의'),
      onChange: () => {
        if (agreement.includes('서비스 약관 동의')) {
          setAgreement(curr => curr.filter(item => item != '서비스 약관 동의'));
        } else {
          setAgreement(curr => [...curr, '서비스 약관 동의']);
        }
      }
    },
    {
      text: '개인정보 수집 및 이용 동의',
      to: '/',
      checked: agreement.includes('개인정보 수집 및 이용 동의'),
      onChange: () => {
        if (agreement.includes('개인정보 수집 및 이용 동의')) {
          setAgreement(curr => curr.filter(item => item != '개인정보 수집 및 이용 동의'));
        } else {
          setAgreement(curr => [...curr, '개인정보 수집 및 이용 동의']);
        }
      }
    },
  ];

  const chkOverlapId = (id: string) => {
    if (id.length < 5) {
      alert('아이디를 5자 이상 입력해주세요.');
      return null;
    } else if (id.length > 20) {
      alert('아이디를 20자 이하로 입력해주세요.');
      return null;
    } else if (!/^[a-zA-Z0-9_.+-]+$/.test(id)) {
      alert('아이디 형식을 확인해주세요.');
      return null;
    }

    return UserApi.authId(id);
  };

  const proxyUser = () => {
    if (AGREEMENT_LIST.length !== agreement.length) {
      alert('서비스 약관 동의를 해주세요');
      return null;
    }

    if (!auth_id) {
      alert('아이디 중복 확인을 해주세요.');
      return null;
    } else if (auth_id !== id) {
      alert('아이디 중복 확인을 해주세요.');
      return null;
    }

    if (password !== password2) {
      alert('입력된 비밀번호가 서로 다릅니다.');
      return null;
    } else if (password.length < 8 || password.length > 15) {
      alert('비밀번호를 8자~15자로 입력해주세요.');
      return null;
    } else if (!/^(?=.*\d)(?=.*[a-z]).{8,20}$/.test(password)) {
      alert('비밀번호 형식을 확인해주세요.');
      return null;
    }

    const formData = new FormData();
    const signData = {auth_id, password};

    Object.keys(signData).forEach(i => {
      formData.append(i, signData[i]);
    });

    userApi.proxy(formData)
      .then(({status}) => {
        if (Math.floor(status / 100) === 4) {
          return null;
        }

        alert('변경이 완료되었습니다.\n변경된 아이디로 로그인 해주세요.');
        router.push('/logout');
      })
  };

  return (
    <StyledConfirm
      title="약관동의 / 아이디 변경"
      buttonGroupProps={{
        leftButton: {
          children: '탈퇴',
          onClick: () => {
            confirm('회원 탈퇴는 복구가 불가능합니다. 진행하시겠습니까?') &&
              userApi.withdraw().then(() => {
                alert('탈퇴 되었습니다.');
                router.push('/logout');
              });
          }
        },
        rightButton: {
          children: '완료',
          onClick: () => proxyUser(),
        },
      }}
      notClosePop
      {...props}
    >
      <p>
        한의플래닛 회원가입을 감사드립니다.<br/>
        정상적인 홈페이지 이용을 위해서 <span className="point-blue">서비스 약관 동의 및 아이디 변경(1회)</span>을 진행해 주시길 바랍니다.
        <span className="notice">* 아이디는 차후 변경이 불가능 하오니 신중히 결정해 주시길 바랍니다.</span>
      </p>
      <AgreementList
        agreementState={[agreement, setAgreement]}
        list={AGREEMENT_LIST}
      />
      <ul className="login-info">
        <li>
          <span>현재 아이디</span> {currId}
        </li>
        <li className="changed-id">
          <span>아이디 변경</span>
          <Input
            placeholder="5~20자 영문,숫자만 가능"
            name="id"
            value={id}
            onChange={changeUserInfoAtName}
          />
          <Button
            border={{width: '1px', color: $POINT_BLUE}}
            font={{size: '13px', weight: '600', color: $POINT_BLUE}}
            size={{width: '73px', height: '35px'}}
            onClick={() => {
              const authIdRes = chkOverlapId(id);

              authIdRes && authIdRes.then(({data}) => {
                const {result} = data || {} as any;

                if (!!result) {
                  alert('사용 가능한 아이디입니다!');
                  setUserInfo(curr => ({...curr, auth_id: id}));
                }
              });
            }}
          >
            중복 확인
          </Button>
        </li>
        <li className="changed-pw">
          <span>비밀번호 변경</span>
          <Input
            type="password"
            placeholder="8~20자(영문, 숫자만 가능)"
            name="password"
            value={password}
            onChange={changeUserInfoAtName}
          />
          <Input
            type="password"
            placeholder="비밀번호를 다시 입력해주세요."
            name="password2"
            value={password2}
            onChange={changeUserInfoAtName}
          />
        </li>
      </ul>
    </StyledConfirm>
  );
});

AgreementPopup.displayName = 'AgreementPopup';
export default AgreementPopup;
