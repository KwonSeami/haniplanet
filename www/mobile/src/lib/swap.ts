import findIndex from 'lodash/findIndex';

export const swapIdxInArr = <T extends {}>(data: T[], currIdx: number, swapIdx: number) => {
  const maxIdx = data.length - 1;

  if ((currIdx < 0 || currIdx > maxIdx) || (swapIdx < 0 || swapIdx > maxIdx)) {
    return data;
  }

  const newData = [...data];

  const temp = newData[currIdx];
  newData[currIdx] = newData[swapIdx];
  newData[swapIdx] = temp;

  return newData;
};

export const swapIdInArr = (data: HashId[], currId: HashId, swapId: HashId): HashId[] => {
  const currIdx = findIndex(data, id => id === currId);
  const swapIdx = findIndex(data, id => id === swapId);

  if (currIdx === -1 || swapIdx === -1) {
    return data;
  }

  const newData = [...data];

  const temp = newData[currIdx];
  newData[currIdx] = newData[swapIdx];
  newData[swapIdx] = temp;

  return newData;
};
