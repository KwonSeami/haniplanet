import * as React from 'react';
import DoctalkApi from '../../../src/apis/DoctalkApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import FaqForm from '../../../components/faq/Form';
import {useRouter} from 'next/router';
import {FaqWrapperDiv, FaqHeader} from '../../../components/faq/common';
import {Div} from '../../../components/meetup/pcStyledComp';

const FaqNew: React.FC<IDocTalkFaq> = () => {
  const router = useRouter();
  const doctalkApi = useCallAccessFunc(access => new DoctalkApi(access));

  return (
    <FaqWrapperDiv>
      <FaqHeader>
        <div>
          <h1>FAQ  입력하기</h1>
        </div>
      </FaqHeader>
      <Div>
        <FaqForm
          onSubmit={formData => {
            if(confirm('입력한 정보로 저장 하시겠습니까?')) {
              doctalkApi.createFaq(formData)
                .then(({status}) => {
                  if(status === 403)  {
                    alert('닥톡 연동이 되어있지 않습니다. 연동 후 등록 해 주세요.');
                  } else if(Math.floor(status / 100) === 2) {
                    alert('정상적으로 등록되었습니다.');
                    router.push('/user/faq');
                  }
                })
            }
          }}
        />
      </Div>
    </FaqWrapperDiv>
  )
}

export default React.memo(FaqNew);