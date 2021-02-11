interface IPartyPrice {
    id: Id;
    text: string;
    member_type: TUserType;
    price: number;
}

interface IParty extends HasLikeModel, TimeStamp {
    id: Id;
    member: IUser;
    title: string;
    location: string;
    capacity: number;
    text: string;
    start_at: string;
    end_at: string;
    type_prices: IPartyPrice[];
    count: number;
    payment_id?: number;
    comment_count: number;
    party_start_at: string;
    party_end_at: string;
    html?: string;
    teacher_info?: string;
    payment_info?: string;
    files?: IFile[];
    refund_policy: string;
    tags: ITag[];
    receive_method: 'haniplanet' | 'private';
    is_available_cancel?: boolean;
}

interface IFetchedParty extends IParty {
    fetchTime: number;
}


