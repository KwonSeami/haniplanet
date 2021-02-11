interface IMoaQuestion {
    id: Id;
    title: string;
}

interface IMoa {
    id: Id;
    name: string;
    created_at: string;
    image: null | string;
    domain: string;
    expose_type: string;
    member: Pick<IUser, 'login_id' | 'nick_name' | 'name'>;
    questions: IMoaQuestion[];
    is_waiting?: boolean;
}

interface IMoaHistory extends Pick<IMoa, 'id'
    | 'name'
    | 'created_at'
    | 'image'
    | 'domain'
    | 'expose_type'
    | 'member'
    | 'questions'> {
    contents: string;
    purpose: string;
    approved_at: string;
    decline_at: string;
}

interface IMoaInfo extends Pick<IMoa,
    'id' |
    'name' |
    'image'> {
    expose_type: TExposeType;
    member: IUser;
    domain: string;
    approved_at: string;
    purpose: string;
    contents: string;
    questions: Array<{
        id: Id;
        title: string;
    }>;
}

interface IMoaManagement extends IMoa {
    approved_at: string;
    member_count: number;
    apply_count: number;
}

type ISimpleMoaHistory = Pick<IMoaHistory, 'id' | 'name' | 'created_at' | 'image' | 'approved_at' | 'decline_at'> ;

type TNick = 'nick';
type TReal = 'real';
type TAnon = 'anon';
type TExposeType = TNick | TReal | TAnon;