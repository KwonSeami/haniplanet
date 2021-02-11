interface IRouteObj {
  path: string;
  exact: boolean;
  component: any;
  sessionType: 'anon' | 'login';
}