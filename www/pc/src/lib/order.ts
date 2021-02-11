import isEmpty from 'lodash/isEmpty';
import difference from 'lodash/difference';

/**
 * @param target - The object that wants to reorder keys.
 * @param order - The array of keys of target object.
 * It returns the order of keys within an object.
 */

export const changeOrderOfKeys = <T extends {}>(target: T, order: Array<keyof T>) => {
  if (typeof target !== 'object' || !Array.isArray(order)) {
    return {};
  }

  const keysArrOfTarget = Object.keys(target) as Array<keyof T>;

  if (keysArrOfTarget.length !== order.length || !isEmpty(difference(keysArrOfTarget, order))) {
    return target;
  }

  const ordered = {} as T;

  order.forEach(o => {
    ordered[o] = target[o];
  });

  return ordered;
};
