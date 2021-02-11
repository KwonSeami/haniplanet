interface ISessionState {
  access: string;
  refresh: string;
  id?: HashId;
  is_admin?: boolean;
  role?: string;
  name?: string;
}

export interface ISystemState {
  session: ISessionState;
  reportType: string[];
}