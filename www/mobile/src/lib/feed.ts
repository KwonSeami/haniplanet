export const makeFeedKey = (currPathName: string = '') => `${currPathName}${
  currPathName[currPathName.length - 1] !== '/' ? '/' : ''
}`;
