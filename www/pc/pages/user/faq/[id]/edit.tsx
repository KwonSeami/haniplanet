import * as React from 'react';
import DoctalkApi from '../../../../src/apis/DoctalkApi';
import useCallAccessFunc from '../../../../src/hooks/session/useCallAccessFunc';
import {useRouter} from 'next/router';
import {FaqWrapperDiv, FaqHeader} from '../../../../components/faq/common';
import {Div} from '../../../../components/meetup/pcStyledComp';
import FaqForm from '../../../../components/faq/Form';
import Loading from '../../../../components/common/Loading';
import Page500 from '../../../../components/errors/Page500';

const FORM_FILEDS = {
  category: '',
  region: '',
  age_and_gender: '',
  disease: '',
  question_title: '',
  question_body: '',
  answer: '',
  tag_ids: []
};

const FaqEdit = () => {
  const router = useRouter();
  const doctalkApi = useCallAccessFunc(access => new DoctalkApi(access));
  const {query: {id}} = router;
  const [{
    data,
    error,
    pending
  }, setState] = React.useState({
    data: FORM_FILEDS,
    pending: true,
    error: false
  });

  React.useEffect(() => {
    doctalkApi.faq(id)
      .then(({data}) => {
        setState(curr => ({
          ...curr,
          pending: false,
          data: {
            ...curr.data,
            ...data
          }
        }));
      })
      .catch(() => {
        setState(curr => ({
          ...curr,
          pending: false,
          error: true
        }))
      });
  }, [id]);

  if(error) {
    return <Page500/>
  }

  return (
    <FaqWrapperDiv>
      <FaqHeader>
        <div>
          <h1>FAQ  수정하기</h1>
        </div>
      </FaqHeader>
      <Div>
        {pending ? (
          <Loading/>
        ) : (
          <FaqForm
            initialData={data}
            onSubmit={formData => {
              if(confirm('입력한 정보로 저장 하시겠습니까?')) {
                doctalkApi.updateFaq(id, formData)
                  .then(({status}) => {
                    if(status === 403)  {
                      alert('닥톡 연동이 되어있지 않습니다. 연동 후 등록 해 주세요.');
                    } else if(Math.floor(status / 100) === 2) {
                      alert('정상적으로 수정되었습니다.');
                      router.push('/user/faq');
                    }
                  })
              }
            }}
          />
        )}
      </Div>
    </FaqWrapperDiv>
  )
};

export default React.memo(FaqEdit);