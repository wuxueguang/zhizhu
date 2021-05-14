
import { action, observable } from 'mobx';
import isObject from 'lodash/isObject';

export const updater = action(function(...args){
  const [key, value] = args;

  if(isObject(key)){
    for(const n in key){
      this[n] = key[n];
    }
    return this;
  }else{
    if(args.length === 1){
      return action(value => {
        this[key] = value;
        return this;
      });
    }
    if(args.length > 1){
      this[key] = value;
      return this;
    }
  }
});

export const createStore = state => {
  const store = observable(state);
  store.update = updater;
  return store;
};
