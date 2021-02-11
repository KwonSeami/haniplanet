interface IColumn extends HasLikeModel, TimeStamp, HasComment, Retrieve, HasTagModel {
    id: Id;
    image?: string;
    title: string;
    html?: string;
    text?: string;
}
