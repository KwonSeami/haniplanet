export const OPEN_RANGE_MAP = {
  human: '외부공개',
  user_all: '회원공개',
  band: '그룹공개',
  only_me: '나만보기',
} as const;

export const getOpenRangeOption = (openRangeKeys: string | string[]) => {
  const filterList = typeof openRangeKeys === 'string'
    ? item => item === openRangeKeys
    : item => openRangeKeys.includes(item);

  return (
    Object.keys(OPEN_RANGE_MAP)
      .filter(filterList)
      .map(item => ({label: OPEN_RANGE_MAP[item], value: item}))
  );
};