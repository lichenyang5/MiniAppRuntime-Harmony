import { describe, it, expect } from '@ohos/hypium';
import {
  NetworkRequestHandle,
  NetworkRequestRegistry
} from '../main/ets/network/NetworkRequestRegistry';

class TestNetworkRequestHandle implements NetworkRequestHandle {
  aborted: boolean = false;
  abortCount: number = 0;
  active: boolean = true;

  abort(): boolean {
    this.abortCount += 1;
    if (!this.active) {
      return false;
    }
    this.active = false;
    this.aborted = true;
    return true;
  }
}

export default function networkRequestRegistryTest() {
  describe('NetworkRequestRegistry', () => {
    it('registers and removes an active request', 0, () => {
      const registry: NetworkRequestRegistry = new NetworkRequestRegistry();
      const handle: TestNetworkRequestHandle = new TestNetworkRequestHandle();

      expect(registry.register('request_1', handle)).assertTrue();
      expect(registry.has('request_1')).assertTrue();
      expect(registry.remove('request_1')).assertTrue();
      expect(registry.has('request_1')).assertFalse();
    });

    it('returns false when the target request does not exist', 0, () => {
      const registry: NetworkRequestRegistry = new NetworkRequestRegistry();
      expect(registry.abort('missing_request')).assertFalse();
    });

    it('aborts only the selected concurrent request', 0, () => {
      const registry: NetworkRequestRegistry = new NetworkRequestRegistry();
      const first: TestNetworkRequestHandle = new TestNetworkRequestHandle();
      const second: TestNetworkRequestHandle = new TestNetworkRequestHandle();
      registry.register('request_1', first);
      registry.register('request_2', second);

      expect(registry.abort('request_1')).assertTrue();
      expect(first.aborted).assertTrue();
      expect(second.aborted).assertFalse();
      expect(registry.has('request_1')).assertFalse();
      expect(registry.has('request_2')).assertTrue();
    });

    it('does not abort a handle that already completed', 0, () => {
      const registry: NetworkRequestRegistry = new NetworkRequestRegistry();
      const handle: TestNetworkRequestHandle = new TestNetworkRequestHandle();
      handle.active = false;
      registry.register('request_1', handle);

      expect(registry.abort('request_1')).assertFalse();
      expect(handle.aborted).assertFalse();
      expect(handle.abortCount).assertEqual(1);
    });

    it('does not let stale cleanup remove a reused requestId', 0, () => {
      const registry: NetworkRequestRegistry = new NetworkRequestRegistry();
      const first: TestNetworkRequestHandle = new TestNetworkRequestHandle();
      const second: TestNetworkRequestHandle = new TestNetworkRequestHandle();
      registry.register('request_1', first);

      expect(registry.abort('request_1')).assertTrue();
      expect(registry.register('request_1', second)).assertTrue();
      expect(registry.remove('request_1', first)).assertFalse();
      expect(registry.get('request_1') === second).assertTrue();
    });

    it('clear aborts and removes every active request', 0, () => {
      const registry: NetworkRequestRegistry = new NetworkRequestRegistry();
      const first: TestNetworkRequestHandle = new TestNetworkRequestHandle();
      const second: TestNetworkRequestHandle = new TestNetworkRequestHandle();
      registry.register('request_1', first);
      registry.register('request_2', second);

      registry.clear();
      expect(first.aborted).assertTrue();
      expect(second.aborted).assertTrue();
      expect(registry.has('request_1')).assertFalse();
      expect(registry.has('request_2')).assertFalse();
    });
  });
}
