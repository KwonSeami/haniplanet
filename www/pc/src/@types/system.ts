interface ISessionState {
  access: string;
  refresh: string;
  id?: HashId;
  is_admin?: boolean;
  role?: string;
  name?: string;
}

interface IStyleState {
  header: {
    layout: {
      themetype: string;
      fakeHeight: boolean;
      position: string;
      background: string;
    };
    navigation: {
      navDetail: string;
    };
  };
  footer: {
    isFooterShow: boolean;
  };
}

interface ISystemState {
  session: ISessionState;
  reportType: string[];
  style: IStyleState;
}