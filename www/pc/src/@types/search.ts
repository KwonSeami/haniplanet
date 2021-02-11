export interface ISearchParam {
  q?: string;
  page?: string;
  order_by?: string | null;
}
  
export interface ISearchProps {
  query: string;
  page?: string;
  setURL: (param: ISearchParam) => ISearchParam;
}

export interface ISearchRank {
  keyword: string;
  order: number;
  search_count: number;
}
