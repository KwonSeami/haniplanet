import * as React from 'react';
import moment from 'moment';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import {useRouter} from 'next/router';
import {useSelector} from 'react-redux';
import {IPaymentDetail, IPayment} from '../../src/hooks/payment/useDetail';
import loginRequired from '../../hocs/loginRequired';
import A from '../../components/UI/A';
import {Section, DetailDiv, H2, Div, Span, StyledCartTable, Table, GuideDiv} from '../../components/payment/style';
import StateCartItem from '../../components/shopping/StateCartItem';
import {useQuery} from '@apollo/react-hooks';
import {MY_APPLY} from '../../src/gqls/shopping';
import {RootState} from '../../src/reducers';
import Loading from '../../components/common/Loading';
import {PAY_METHOD_TO_KOR, PAYMENT_STATUS} from '../../src/constants/payment';
import {IStory} from '../../src/@types/story';
import OGMetaHead from '../../components/OGMetaHead';



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
        return price + prevValue
      }, 0)

    }, [nodes])

    if(loading) return <Loading/>

    return (
      <Section>
        <OGMetaHead title={`${title}${my_applies.nodes.length > 1 && ` 외 ${my_applies.nodes.length -1}건`} 결제내역`}/>
        <DetailDiv>
          <H2>주문내역</H2>
          <Div className="order-box">
            <H2>
              {title}
              <Span>{moment(created_at).format('YYYY-MM-DD')}</Span>
            </H2>
            <ul>
              <li>
              주문금액 <Span>{(price+sale_price).toLocaleString()}원</Span>
              </li>
              <li>
                결제금액 <Span className="price">{price.toLocaleString()}원</Span>
              </li>
            </ul>
          </Div>
          <Div>
            <H2>상품정보</H2>
            <StyledCartTable>
              <tr>
                <th>이미지</th>
                <th>상품정보</th>
                <th>수량</th>
                <th>상품 가격</th>
                <th>총 상품 금액</th>
                <th>배송비</th>
                <th>상태</th>
              </tr>
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
                    {...props}
                    {...story}
                    {...product}
                    {...track}
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
            </StyledCartTable>
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
            <Div>
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

          {(!isEmpty(cancels) && PAYMENT_STATUS[status]) && (
            <p>구매 또는 신청 취소된 상품입니다.</p>
          )}
          <GuideDiv>
            <h3 className="title">주문상태</h3>
            <dl>
              <dt>주문 접수</dt>
              <dd>가상 계좌(무통장입금) 주문의 입금 전 상태입니다. 주문 후 24시간 동안 입금하지 않으시면 주문이 취소됩니다.</dd>
            </dl>
            <dl>
              <dt>결제 및 입금 확인</dt>
              <dd>
                해당 브랜드로 주문이 전달되어 발송을 요청한 상태입니다.<em>(해당 브랜드로 주문이 전달되기 전, 운영에서 엑셀 정리 중인 단계입니다.)</em>
              </dd>
            </dl>
            <dl>
              <dt>배송 준비 중</dt>
              <dd>출고지에서 상품을 준비 중인 상태입니다. 교환/환불 요청은 발송 완료 상태 이후에 가능합니다.</dd>
            </dl>
            <dl>
              <dt>발송 완료</dt>
              <dd>출고지에서 택배사에 상품을 인계하여 배송 중인 상태입니다. 교환 요청, 환불 요청이 가능합니다.</dd>
            </dl>
            <dl>
              <dt>배송 완료</dt>
              <dd>상품이 배송지에 도착한 상태입니다. 교환 요청, 환불 요청이 가능합니다.</dd>
            </dl>
            <dl>
              <dt>구매 확정</dt>
              <dd>상품 수령 후 구매를 결정한 상태입니다. 출고 후 N일이 지나면 자동으로 구매 확정 처리되며 단순 변심으로 인한 교환, 환불이 불가능합니다.</dd>
            </dl>
            <dl>
              <dt>주문 취소</dt>
              <dd>가상 계좌 주문을 취소한 상태입니다.</dd>
            </dl>
            <dl>
              <dt>결제 오류</dt>
              <dd>카드 한도 초과, 할부 개월 수 오류 등으로 결제되지 않은 상태입니다.</dd>
            </dl>
            <h3 className="title">반품상태</h3>
            <dl>
              <dt>교환 요청</dt>
              <dd>교환을 접수하고 반품 확인 전 상태입니다. 교환 상품을 직접 택배사에 반품 접수하여 보내주세요. 반품 도착 후 검수 완료까지 영업일 기준 2~3일 정도 소요됩니다.</dd>
            </dl>
            <dl>
              <dt>교환 처리 중</dt>
              <dd>반품을 확인하고 교환 상품을 발송 준비 중인 상태입니다.</dd>
            </dl>
            <dl>
              <dt>교환 완료</dt>
              <dd>브랜드에 교환 상품을 발송 요청한 상태입니다. 교환 상품 배송 완료까지 영업일 기준 2~3일 정도 소요됩니다.</dd>
            </dl>
            <dl>
              <dt>교환 철회</dt>
              <dd>교환 요청을 취소한 상태입니다.</dd>
            </dl>
            <dl>
              <dt>환불 요청</dt>
              <dd>환불 접수하고 반품을 확인하기 전 상태입니다. 환불 상품을 직접 택배사에 반품 접수 후 보내주세요. 반품 도착 후 검수 완료까지 영업일 기준 2~3일 정도 소요됩니다.</dd>
            </dl>
            <dl>
              <dt>환불 처리 중</dt>
              <dd>반품을 확인하고 환불 처리를 진행 중인 상태입니다.</dd>
            </dl>
            <dl>
              <dt>환불 철회</dt>
              <dd>교환 요청을 취소한 상태입니다.</dd>
            </dl>
            <dl>
              <dt>환불 완료</dt>
              <dd>반품을 확인하고 환불 처리를 진행 중인 상태입니다.</dd>
            </dl>
          </GuideDiv>
        </DetailDiv>
      </Section>
    );
  },
);

export default loginRequired(PayMentDetailPC);
