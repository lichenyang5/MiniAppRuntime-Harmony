let requestSequence: number = 0;

export function createRequestId(): string {
  requestSequence += 1;
  return `myascf_${Date.now()}_${requestSequence}`;
}
