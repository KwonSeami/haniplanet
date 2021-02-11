interface CommentForm {
    comment: string;
    file?: File;
    medies?: IMedicine[]; // 토론일 때에만
    herbs?: IHerb[]; // 토론일 때에만
}

interface IComment extends CommentForm, TimeStamp, Reportable, HasLikeModel {
    id: Id;
    image?: string;
    is_super_user?: boolean;
    recomment_count: number;
    is_active: boolean;
    is_blind: boolean;
    medi_infos?: IMedicine[]; // 토론일 때에만
    herb_infos?: IHerb[]; // 토론일 때에만
    member?: IUser;
}


