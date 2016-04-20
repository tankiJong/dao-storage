import clone from 'lodash/object/cloneDeep';
import { EventManager } from './event-manager';
/**
 * Model
 */

const _legalHookType = ['get', 'beforeSet', 'afterSet'];

const _eventPool = {};
_legalHookType.forEach( type => Object.defineProperty(type, {value: new Map()}));

export class Model extends Object {
  constructor($obj) {
    super();
    this.$obj = clone($obj);
    const obj = this.$obj;
    Object.keys(obj).forEach(k => {
        // recursive definition of Model
        if(k instanceof Object){
            obj[k] = new Model(obj[k]);
        }

        // bind behaviors for the members
        const { enumerable, value, writable } = Object.getOwnPropertyDescriptor(obj, k);
        Object.defineProperty(this, k, {
          enumerable,
          value,
          writable,
          configurable: true,
          __proto__: obj[k].___proto__,
          get: () => {
            this.runHook('get', k);
            return obj[k];
          },
          set: v => {
            this.runHook('beforeSet', k);
            obj[k] = v;
            this.runHook('afterSet', k);
          },
        });

        _legalHookType.forEach(e => _eventPool[e].set(k, new EventManager()))
    });
  }

  runHook(type, key){
    // if hook type illegal, break
    if(!(_eventPool[type])){
      throw new Error('illegal hook type');
    }
    if(!(_eventPool[type].get(key))){
      throw new Error('illegal hook key');
    }

    _eventPool[type].get(key).emitAll();

  }
}
