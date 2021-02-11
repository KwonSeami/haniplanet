// 특정 타입을 제외를 위한 Omit Type
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// 겹치지 않게 타입 필터링
type Diff<T, U> = T extends U ? never : T;

// 특정 타입 재정의
type Overwrite<T, U> = {[P in Diff<keyof T, keyof U>]: T[P]} & U;

// 특정 필드의 타입 가져오기
type Dig<T, U extends keyof T> = Pick<T, U>[U];
