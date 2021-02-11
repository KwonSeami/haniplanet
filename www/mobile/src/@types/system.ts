interface ISessionState {
  access: string;
  refresh: string;
  id?: HashId;
  is_admin?: boolean;
  role?: string;
  name?: string;
}

interface IStyleState  {
  header: {
    layout: {
      headerDetail: string;
    };
  };
  footer: {
    isFooterShow: boolean;
  };
};

interface ISystemState {
  session: ISessionState;
  reportType: string[];
  style: IStyleState;
}