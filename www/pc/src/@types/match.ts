// from typings
interface MatchParams {
    name: string;
}
// interface RouteComponentProps<P> {
//     match: match<P>;
//     location: H.Location;
//     history: H.History;
//     staticContext?: any;
// }
interface match<P> {
    params: P;
    isExact: boolean;
    path: string;
    url: string;
}
