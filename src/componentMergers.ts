import { Concept } from "./types";

function extractActions<T extends Concept>(obj: T): T {
  return Object.keys(obj).reduce((o, key) => {
    return { ...obj, [key]: (...args: any[]) => (obj as any)[key](...args) };
  }, {}) as T;
}

export function mergeConcepts<T extends Concept, U extends Concept>(
  obj1: T,
  obj2: U,
): T & Omit<U, keyof T> {
  return {
    ...extractActions(obj2),
    ...extractActions(obj1),
  };
}
