/**
 * @param target - The Object to check whether the field has a false value.
 * Doing shallow comparison, checks the field of an object for false values,
 * such as null, undefined, or false,
 * and returns new objects except for them.
 */

export const objWithoutFalsyValue = <T extends {}>(target: T) => {
  const t = {};

  Object.keys(target).forEach(key => {
    const value = target[key];

    if (!!value) {
      t[key] = value;
    }
  });

  return t;
};
