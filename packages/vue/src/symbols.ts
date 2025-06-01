import { InjectionKey } from 'vue';
import { FlowStore } from './store';

export const VUE_FLOW_SYMBOL = Symbol('vueFlow') as InjectionKey<FlowStore>;
