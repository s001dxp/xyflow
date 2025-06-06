import { computed, ref } from 'vue';
import { useVueFlow } from './useVueFlow';
import type { Connection } from '../types';

export interface ConnectionStartParams {
  nodeId: string;
  handleId: string;
  type: string;
}

export function useHandleConnections() {
  const store = useVueFlow();
  const isConnecting = ref(false);
  const connectionStartHandle = ref<ConnectionStartParams | null>(null);

  const connectingNodeId = computed(() => connectionStartHandle.value?.nodeId ?? null);
  const connectingHandleId = computed(() => connectionStartHandle.value?.handleId ?? null);
  const connectingHandleType = computed(() => connectionStartHandle.value?.type ?? null);

  const onConnectStart = (event: MouseEvent | TouchEvent, params: ConnectionStartParams) => {
    isConnecting.value = true;
    connectionStartHandle.value = params;
  };

  const onConnectEnd = (event: MouseEvent | TouchEvent) => {
    isConnecting.value = false;
    connectionStartHandle.value = null;
  };

  const onConnect = (connection: Connection) => {
    store.onConnect(connection);
  };

  return {
    isConnecting,
    connectingNodeId,
    connectingHandleId,
    connectingHandleType,
    onConnectStart,
    onConnectEnd,
    onConnect,
  };
}
