import {makeFeedKey} from "../../lib/feed";
import findClosestValue from "../../lib/findClosestValue";

export const saveLastReadThunk = (
  targets: HTMLLIElement[],
  asPath: string,
  callback: (key: string, lastRead: number) => void
) => (_, getState) => {
    const {feed} = getState();
    const key = makeFeedKey(asPath);
    const currentFeed = feed[key];
    const {lastRead} = currentFeed || {lastRead: 0};
    const currPageYOffset = window.pageYOffset;
    const offsetTopList = targets.map(t => t.offsetTop);
    const {index} = findClosestValue(offsetTopList, currPageYOffset);

    if (lastRead === undefined) {
      const lastRead = index === 0 ? -1 : index;
      callback(key, lastRead);
    }

    if (lastRead < index) {
      const lastRead = index;
      callback(key, lastRead);
    }
  };
