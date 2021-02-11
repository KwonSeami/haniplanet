interface HasLikeModel {
    like_count: number;
    unlike_count?: number;
    like_type: T_Like | T_Unlike;
}
