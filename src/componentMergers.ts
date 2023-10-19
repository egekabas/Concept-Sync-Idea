import { Concept } from "./types";

function getInstanceMethodNames(obj: any) {
  return Object.getOwnPropertyNames(Object.getPrototypeOf(obj)).filter(
    (name) => name !== "constructor" && typeof obj[name] === "function",
  );
}

export function extractActions<T extends Concept>(obj: T): T {
  const ret: any = {};
  for (const key of getInstanceMethodNames(obj)) {
    ret[key] = (...args: any[]) => (obj as any)[key](...args);
  }
  return ret as T;
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
