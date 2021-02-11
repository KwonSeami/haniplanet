interface ICounsel {
    age: string;
    contents: string;
    created_at?: string;
    gender: 'female' | 'male' | '';
    id: Id;
    image?: string;
    reply_count?: number;
    title: string;
    view_count: number;
    tags: ITag[];
}

interface IAnswerForm {
    contents: string;
    plainText: string;
    files: IFile[];
    tags: ITag[] | string[];
}

interface IAnswer extends IAnswerForm {
    id: Id;
    member: Readonly<IUser>;
}


