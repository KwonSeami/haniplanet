import * as React from 'react';
import Router from 'next/router';
import TermPC from '../../term/TermPC';
import SelectType from '../../selectType/SelectType';
import StyledButtonGroupMobile from '../../StyledButtonGroup/index.mobile';
import {ICurrentCompoentProps} from '../../../../pages/signup';

const AgreementMobile: React.FC<ICurrentCompoentProps> = React.memo(
  ({signType, setSignType, next}) => {
    const [termAgree, setTermAgree] = React.useState({term1: false, term2: false});
    const {term1, term2} = termAgree;

    // 아래 함수는 useCallback 사용이 무의미합니다.
    const onClickRightBtn = () => {
      if (!signType) {
        alert('회원 유형을 체크해주세요.');
      } else if (!term1 || !term2) {
        alert('약관에 동의해주세요.');
      } else {
        setSignType(signType);
        next();
      }
    };

    return (
      <>
        <SelectType
          type={signType}
          setType={setSignType}
        />
        <TermPC
          termAgree={termAgree}
          setTermAgree={setTermAgree}
        />
        <StyledButtonGroupMobile
          // onClickRightBtn 사용으로 useMemo 사용이 무의미합니다.
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
  },
);

AgreementMobile.displayName = 'AgreementMobile';
export default AgreementMobile;
