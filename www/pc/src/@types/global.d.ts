declare global {
    interface Window {
        Kakao: any;
        opera: any;
        naver: any;
        nativeImageOnLoad: Function;
        auth_data: (name: string, phone: string, code: string) => void;
        daum: any;
        __VERSION__: string;
        _legacy: any;
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
        IMP: any;
    }
}
interface Window {
    Kakao: any;
    opera: any;
    naver: any;
    nativeImageOnLoad: Function;
    auth_data: (name: string, phone: string, code: string) => void;
    daum: any;
    __VERSION__: string;
    _legacy: any;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
    IMP: any;
}
declare module '*.png' {
    const resource: string;
    export = resource;
}
declare module '*.svg' {
    const resource: string;
    export = resource;
}
declare module '*.css' {
    const resource: any;
    export = resource;
}
declare module '*.scss' {
    const resource: string;
    export = resource;
}
declare module '*.json' {
    const resource: any;
    export = resource;
}

interface StringIndexable {
    [key: string]: any;
}

interface NumberIndexable {
    [key: number]: any;
}

type Indexable = StringIndexable & NumberIndexable;

type TokenType = string;

interface ITokenDecoded {
    token_type: 'access' | 'refresh';
    id: number;
    is_admin: boolean;
    role: string;
    name: string;
    exp: number;
    exp_at: number;
    jti: string;
}

interface IInnerErrorMsgObj {
    errMsg: string;
}
interface IRoute {
    path: string;
    exact: boolean;
    component: Function;
}