interface IToolResponse {
  id: number;
  name: string;
}

interface IMockData {
  data: {
    result: IToolResponse[];
  }
}

export const TOOL_MOCK_DATA: IMockData = {
  data: {
    result: [
      {id: 2, name: "오케이차트"},
      {id: 3, name: "한차트"},
      {id: 4, name: "동의보감"},
      {id: 5, name: "한의사랑"},
      {id: 6, name: "원여의주"},
      {id: 7, name: "기타"}
    ]
  }
};
