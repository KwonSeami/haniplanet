interface IFunding extends HasTagModel {
    id: Id;
    title: string;
    apply_price?: number;
    count: number;
    funding_type: string;
    mobile_image: string;
    pc_image: string;
    price: number;
    end_at: string;
    status_text: string;
    html?: string;
    comment_count: number;
    is_available: boolean;
    delivery_price: number;
}
interface IFundingParticipant {
    nick_name: string;
    created_at: string;
    image: string;
}

interface IFetchedFunding extends IFunding, IFetchedModel {}

interface IGoods {
    id: Id;
    title: string;
    text?: string;
    price: number;
}


