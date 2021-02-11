// TODO: Medicine 사용하는 부분 이름 전부 변경
interface IMedicine {
    code: string;
    name: string;
    chn_name: string;
    category?: string;
    tags?: ITag;
    dependencies?: string[];
    is_bookmark?: boolean;
}

interface HerbBook {
    chapter: string;
    name: string;
    section: string;
    texts: string[];
}

interface HerbDanbang {
    book_name: string;
    chapter: string;
    chn_text: string;
    section: string;
    text: string;
    title: string;
}

interface HerbData {
    id: number;
    like_count: number;
    like_type: T_Like | T_Unlike;
    link: string;
    origin: string;
    title: string;
}

interface IHerbPriceData {
    base_date: Date;
    name: string;
    price: number;
    product_area: string;
    seller: string;
}

// TODO: Herb 사용하는 부분 이름 전부 변경
interface IHerb {
    acd_character?: string;
    acd_definition?: string;
    acd_origin?: string;
    book?: HerbBook;
    character_song?: string;
    chn_name: string;
    danbang_text: HerbDanbang[];
    description?: string;
    eng_name?: string;
    id: Id;
    inner_data: HerbData[];
    is_bookmark?: boolean;
    latin_name?: string;
    memo?: string;
    name: string;
    other_name: string;
    outer_data: HerbData[];
    precaution?: string;
    price_info: IHerbPriceData[];
}

interface IDictParams {
    categories?: number[];
    exclu_herbs?: number[];
    exclu_tags?: number[];
    inclu_herbs?: number[];
    inclu_tags?: number[];
    is_detail?: boolean | string;
    is_incomplete?: boolean;
    max?: number;
    max_price?: number;
    min?: number;
    min_price?: number;
    order_type?: string;
    page?: number;
    query?: string;
    shapes?: number[];
}

interface IBookmarkedDict extends IMedicine {
    other_name: string;
    tags: ITag[];
}
