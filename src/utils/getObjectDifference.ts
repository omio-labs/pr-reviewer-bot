import flatMap from 'lodash/flatMap';
import isObject from 'lodash/isObject';
import concat from 'lodash/concat';
import uniq from 'lodash/uniq';
import DiffItem from '../types/diff-item';

function getObjectDifferenceRecursion(previous: any, current: any, parentKey?: string): DiffItem[] {
  if (previous === current) {
    return [];
  }

  if (!isObject(previous) || !isObject(current)) {
    return [
      {
        keyPath: parentKey as string,
        prevValue: previous,
        newValue: current,
      },
    ];
  }

  const combinedKeys: string[] = uniq(concat(Object.keys(previous), Object.keys(current)));

  return flatMap(combinedKeys, key => {
    // TS has a bug and assumes that variables of type `object` don't have properties that we can access.
    const nextPrevious = (previous as any)[key];
    const nextCurrent = (current as any)[key];

    const nextParentKey = parentKey ? `${parentKey}.${key}` : key;

    return getObjectDifferenceRecursion(nextPrevious, nextCurrent, nextParentKey);
  });
}

export default function getObjectDifference(original: object, current: object) {
  return getObjectDifferenceRecursion(original, current);
}
