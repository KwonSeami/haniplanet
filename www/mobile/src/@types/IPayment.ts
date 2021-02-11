interface IPayment {

}
interface IPaymentGoods {
    member_type: string;
    text: string;
}

interface IRefundInfo {
    price: number;
    pay_status: string;
    reason: string;
}

interface IOption {
    name: string;
    text: string;
}

interface IDeliveryInfo extends IAddress {
    delivery_company_code: string;
    delivery_price: number;
    invoice_number: number;
    memo: string;
    receiver: string;
    receiver_phone: string;
}

interface IProduct extends IFetchedFunding, HasLikeModel {
    files: IFundingFile[];
    is_delivery: boolean;
    result: string;
    start_at: string;
    view_count: number;
}

interface CommonPayedDetailProps {
    card_quota: number;
    card_text: string;
    created_at: string;
    id: number;
    is_available_cancel: boolean;
    order_num: string;
    price: number;
    refund_infos: IRefundInfo[];
    result_price: number;
    title: string;
    is_cancelled: boolean;
    method_text: string;
    product_type: string;
    reason: string;
    receipt_url: string;
}

interface PayedSeminarDetailProps extends CommonPayedDetailProps {
    goods: IPaymentGoods;
}

interface PayedPurchaseDetailProps extends CommonPayedDetailProps {
    options: IOption[];
}

interface PayedFundingDetailProps extends CommonPayedDetailProps {
    goods: IGoods;
    delivery_info: IDeliveryInfo;
    product: IProduct;
}

type IPaymentDetail = PayedSeminarDetailProps | PayedPurchaseDetailProps | PayedFundingDetailProps;

type T_PAY_KKAKAO = 'kakaopay';
type T_PAY_CARD = 'card';

type T_PAY_METHOD = T_PAY_KKAKAO | T_PAY_CARD;


