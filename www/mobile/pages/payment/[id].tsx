import * as React from 'react';
import moment from 'moment';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import {useRouter} from 'next/router';
import {useSelector} from 'react-redux';
import {IPaymentDetail, IPayment} from '../../src/hooks/payment/useDetail';
import {DetailSeciton, DetailDiv, H2, Div, Span, Table, DetailProductUl} from '../../components/payment/style';
import loginRequired from '../../hocs/loginRequired';
import A from '../../components/UI/A';
import {RootState} from '../../src/reducers';
import {MY_APPLY} from '../../src/gqls/shopping';
import {useQuery} from '@apollo/react-hooks';
import {IStory} from '../../src/@types/story';
import Loading from '../../components/common/Loading';
import StateCartItem from '../../components/shopping/StateCartItem';

const PAY_METHOD_TO_KOR = {
  samsung: '삼성페이',
  card: '신용카드',
  trans: '계좌이체',
  vbank: '가상계좌',
  point: '카카오페이',
};

const APPLY_CANCEL_STATUS_TYPE = {
  refund: 'refund',
  partitial_refund: 'partial-refund'
};

const PayMentDetailPC = React.memo(() => {
  const router = useRouter();
  const {query: {id}} = router;
  const {myId} = useSelector(
    ({system: {session: {id}}}: RootState) => ({myId: id}),
    (prev, curr) => isEqual(prev, curr),
  );

  const {
    data: {my_applies} = {my_applies: {nodes: []}},
    loading
  } = useQuery(MY_APPLY, {
    variables: {merchant_uid: id}
  });

  const {
    nodes
  } = my_applies;
  const [resData] = my_applies.nodes || [{}];


  const {
    story,
    created_at,
    merchant_uid,
    status,
    payment,
    shinhan,
    cancels = [],
    address,
    sale_price,
    sale_perc
  } = resData || {} as IPaymentDetail;

  const {card_name} = shinhan || {};

  const {
    title,
  } = story || {} as IStory;

  const {
    pay_method,
    card_quota,
    receipt_url
  } = payment || {} as IPayment;

  const price = React.useMemo(() => {
    return (nodes || []).reduce((prevValue, {price}) => {
      return prevValue + price;
    }, 0)
  }, [nodes]);

  if(loading) return <Loading/>;

    return (
      <DetailSeciton>
        <DetailDiv>
          <H2>주문내역</H2>
          <Div className="order-box">
            <H2>
              {title}
              <Span>{moment(created_at).format('YYYY-MM-DD')}</Span>
            </H2>
            <ul>
              <li>
                주문내역 <Span>{price.toLocaleString()}원</Span>
              </li>
              <li>
                결제금액 <Span className="price">{price.toLocaleString()}원</Span>
              </li>
            </ul>
          </Div>
          <Div>
            <H2>상품정보</H2>
            <DetailProductUl>
              {nodes.map(({
                id,
                product,
                story: {id: storyId, images, ...story},
                track,
                price,
                quantity,
                ...props
              }) => {
                let image = '';

                if(!isEmpty(images)) {
                  image = images.map(str => JSON.parse(str))[0].image;
                }

                return (
                  <StateCartItem
                    {...story}
                    {...product}
                    {...track}
                    {...props}
                    key={id}
                    id={id}
                    thumbnail={image}
                    storyId={storyId}
                    userId={myId}
                    quantity={quantity}
                    price={price/quantity}
                  />
                )
              })}
            </DetailProductUl>
          </Div>
          {!isEmpty(address) && (
            <Div>
              <H2>배송지 정보</H2>
              <Table>
                <tr>
                  <th>연락처</th>
                  <td>{address.phone}</td>
                </tr>
                <tr>
                  <th>주소</th>
                  <td>({address.zonecode}) {address.road_address || address.jibun_address} {address.address_detail}</td>
                </tr>
                <tr>
                  <th>배송 메세지</th>
                  <td>{address.request}</td>
                </tr>
                <tr>
                  <th>주말 배송유무</th>
                  <td>{address.can_receive_on_weekend ? '가능' : '불가능'}</td>
                </tr>
              </Table>
            </Div>
          )}
          {price > 0 && (
            <Div >
              <H2>결제정보</H2>
              <Table>
                <tr>
                  <th>주문번호</th>
                  <td>{merchant_uid}</td>
                </tr>
                <tr>
                  <th>결제금액</th>
                  <td>{price.toLocaleString()}원</td>
                </tr>
                <tr>
                  <th>결제종류</th>
                  <td>
                    {card_name || PAY_METHOD_TO_KOR[pay_method]}
                  </td>
                </tr>
                <tr>
                  <th>납부방식</th>
                  <td>{card_quota ? `${card_quota}개월` : '일시불'}</td>
                </tr>
                {!!receipt_url && (
                  <tr>
                    <th>결제 영수증</th>
                    <td>
                      <A
                        className="receipt-url"
                        to={receipt_url}
                        newTab
                      >
                        결제 영수증
                      </A>
                    </td>
                  </tr>
                )}
              </Table>
            </Div>
          )}
          {(!!sale_perc || !!sale_price) && (
            <Div>
              <H2>할인정보</H2>
              <Table>
              <tr>
                  <th>할인액</th>
                  <td>{sale_price.toLocaleString()}원 {sale_perc ? `(-${sale_perc}%)` : ''}</td>
                </tr>
              </Table>
            </Div>
          )}
          {!isEmpty(cancels) &&(
            <Div>
              <H2>환불 정보</H2>
              <div>
                <Table>
                  {cancels.map(
                    ({id, price: cancelPrice = 0, reason}, idx) => (
                      <React.Fragment key={id}>
                        <tr>
                          <th>환불내용</th>
                          <td>{reason || '없음'}</td>
                        </tr>
                        <tr>
                          <th>환불액</th>
                          <td>{cancelPrice.toLocaleString()}원</td>
                        </tr>
                      </React.Fragment>
                    )
                  )}
                </Table>
              </div>
            </Div>
          )}
          {(!isEmpty(cancels) && APPLY_CANCEL_STATUS_TYPE[status]) && (
            <p>신청 취소된 세미나입니다.</p>
          )}
        </DetailDiv>
      </DetailSeciton>
    );
  },
);

export default loginRequired(PayMentDetailPC);
