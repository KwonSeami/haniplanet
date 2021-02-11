export const SHOPPING_STATUS = {
  ok_pending: '결제완료',
  ok_preparing: '배송 준비중',
  ok_sending: '발송 완료',
  ok_delivered: '배송 완료',
  ok_purchase_fix: '구매 확정',
  exchange_pending: '교환 요청',
  exchange_ongoing: '교환 처리중',
  exchange_done: '교환 완료',
  exchange_cancel: '교환 철회',
  refund_pending: '환불 요청',
  refund_ongoing: '환불 처리중',
  refund_cancel: '환불 철회',
  refund_done: '환불 완료'
};

export const PAYMENT_STATUS = {
  ok: '결제완료',
  refund: '환불',
  partital_refund: '부분환불',
  ongoing: '처리중',
};

export const PAY_METHOD_TO_KOR = {
  samsung: '삼성페이',
  card: '신용카드',
  trans: '계좌이체',
  vbank: '가상계좌',
  point: '카카오페이',
  shinhan: '신한페이'
};