import { Concept } from "./types";

export function addAction<
  ActionKey extends string,
  T extends Concept,
  ActionType extends Function,
>(
  concept: T,
  actionKey: string,
  action: ActionType,
): Omit<T, ActionKey> & { [actionKey: string]: ActionType } {
  return {
    ...concept,
    [actionKey]: action,
  };
}

export function removeAction<
  ActionKey extends string,
  T extends { [key in ActionKey]: Function } & Concept,
>(concept: T, actionKey: ActionKey): Omit<T, ActionKey> {
  const { [actionKey]: _, ...rest } = concept;
  return rest;
}

// export function changeAction<
//   ActionKey extends string,
//   T extends { [key in ActionKey]: any },
//   ActionType extends Function,
// >(
//   concept: T,
//   actionKey: ActionKey,
//   action: ActionType,
// ): Omit<T, typeof actionKey> & { [actionKey: string]: ActionType } {
//   return addAction(removeAction(concept, actionKey), actionKey, action);
// }
