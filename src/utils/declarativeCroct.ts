import croct from '@croct/plug';
import type { JsonStructure, JsonValue } from '@croct/plug/sdk/json';
import type { ActiveRecord } from '@croct/sdk/activeRecord';

type ActionMap = {
  increment: { property: string; amount?: number };
  decrement: { property: string; amount?: number };
  set: { property: string; value: JsonValue };
  add: { property: string; value: JsonValue };
  combine: { property: string; value: JsonValue };
  remove: { property: string; value: JsonValue };
  merge: { property: string; value: JsonStructure };
  clear: { property: string };
  unset: { property: string };
};

type PatchAction = {
  [K in keyof ActionMap]: { action: K } & ActionMap[K];
}[keyof ActionMap];

type OperationMap = {
  userPatch: { actions: PatchAction[] };
  sessionPatch: { actions: PatchAction[] };
  eventTracking: Record<never, never>;
  multi: { operations: Operation[] };
};

export type Operation = {
  [K in keyof OperationMap]: { type: K } & OperationMap[K];
}[keyof OperationMap];

export async function croctOperate(operation: Operation): Promise<void> {
  switch (operation.type) {
    case 'userPatch':
      return doPatch(croct.user.edit(), operation.actions);
    case 'sessionPatch':
      return doPatch(croct.session.edit(), operation.actions);
    case 'multi':
      await Promise.all(operation.operations.map(subOp => croctOperate(subOp)));
      return;
    case 'eventTracking':
      throw new Error('Not implemented');
  }
}

async function doPatch(
  patch: ActiveRecord<any>,
  actions: PatchAction[]
): Promise<void> {
  for (const action of actions) {
    switch (action.action) {
      case 'increment':
      case 'decrement':
        patch[action.action](action.property, action.amount);
        break;
      case 'set':
      case 'add':
      case 'combine':
      case 'remove':
        patch[action.action](action.property, action.value);
        break;
      case 'merge':
        patch[action.action](action.property, action.value);
        break;
      case 'clear':
      case 'unset':
        patch[action.action](action.property);
        break;
    }
  }

  await patch.save();
}
