import React from 'react';

export const moveTo = <T extends HTMLElement>(ref: React.RefObject<T>, height: number) => {
  if (ref.current) {
    ref.current.scrollTop = height;
  }
};

export const moveToBottom = <T extends HTMLElement>(ref: React.RefObject<T>) => {
  const bottomOfTarget = ref.current
    ? ref.current.scrollHeight - ref.current.offsetHeight
    : 10000;

  moveTo(ref, bottomOfTarget);
};

export const keepBottomPosition = <T extends HTMLElement>(ref: React.RefObject<T>, height: number) => {
  if (ref.current) {
    const {
      scrollTop,
      scrollHeight,
      offsetHeight
    } = ref.current;

    const threshold = scrollHeight - (offsetHeight + scrollTop);

    if (threshold <= height) {
      moveToBottom(ref);
    }
  }
};
