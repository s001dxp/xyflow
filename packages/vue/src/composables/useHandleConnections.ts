import { computed, ref } from 'vue';
import { useVueFlow } from './useVueFlow';
import type { Connection, OnConnectStart, OnConnectEnd } from '@xyflow/system';

export function useHandleConnections() {
  const store = useVueFlow();
  const isConnecting = ref(false);
  const connectionStartHandle = ref<ReturnType<OnConnectStart> | null>(null);

  const connectingNodeId = computed(() => connectionStartHandle.value?.nodeId ?? null);
  const connectingHandleId = computed(() => connectionStartHandle.value?.handleId ?? null);
  const connectingHandleType = computed(() => connectionStartHandle.value?.type ?? null);

  const onConnectStart: OnConnectStart = (event, params) => {
    isConnecting.value = true;
    connectionStartHandle.value = params;
  };

  const onConnectEnd: OnConnectEnd = (event) => {
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
