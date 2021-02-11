import * as React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {MY_APPLIES} from '../../src/gqls/shopping';
import loginRequired from '../../hocs/loginRequired';
import PaymentItem from '../../components/payment/PaymentItem';
import Button from '../../components/inputs/Button';
import {NoContentLi} from '../../components/moa/list/moaList/ApplicatedMoaList/styleCompPC';
import {Section, PaymentDiv} from '../../components/payment/style';
import {$WHITE} from '../../styles/variables.types';
import isEmpty from 'lodash/isEmpty';
import Loading from '../../components/common/Loading';

const PAGE_SIZE = 20;

const PaymentList  = React.memo<any>(() =>  {
  const [page, setPage] = React.useState(1);
  const {
    data: {my_applies = {nodes: [], count: 0}} = {my_applies},
    loading
  } = useQuery(MY_APPLIES, {
    variables: {
      offset: 0,
      limit: PAGE_SIZE * page
    }
  });
  
  const {
    nodes,
    count
  } = my_applies;

  if(loading && isEmpty(nodes)) return <Loading/>

  return (
    <Section>
      <PaymentDiv>
        {!isEmpty(nodes) ? (
          <ul>
            {nodes.map((
              {
                id,
                story,
                ...props
              }
            ) => (
              <PaymentItem
                key={id}
                id={id}
                {...story}
                {...props}
              />
            ))}
          </ul>
        ) : ( 
          <NoContentLi>결제 정보가 없습니다.</NoContentLi>
        )}

        {!!count && (
          <Button
            size={{
              width: '100%',
              height: '40px'
            }}
            backgroundColor={$WHITE}
            font={{
              size: '15px',
              weight: '600'
            }}
            border={{
              radius: '0'
            }}
            onClick={() => {
              setPage(curr => curr+1);
            }}
          >
            더 보기
          </Button>
        )}
      </PaymentDiv>
    </Section>
  );
});

PaymentList.displayName = 'PaymentListPC';

export default loginRequired(PaymentList);
