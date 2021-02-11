interface HasId {
    id: Id;
}

interface Item extends HasId, StringIndexable {
    member?: IUser;
}

interface TimeStamp {
    created_at: string;
    updated_at?: string;
}

interface HasComment {
    comment_count: number;
}

interface HasLikeCount {
    like_count: number;
}

interface Retrieve {
    view_count: number;
}

interface Reportable {
    is_report: boolean;
}
interface IdAndTitle extends HasId {
    title: string;
}


