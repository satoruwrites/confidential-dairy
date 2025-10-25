type EncryptedInputBuffer = {
  add32: (value: number) => EncryptedInputBuffer;
  encrypt: () => Promise<{
    handles: Uint8Array[];
    inputProof: Uint8Array;
  }>;
};

type Eip712Payload = {
  domain: Record<string, unknown>;
  types: Record<string, unknown>;
  message: Record<string, unknown>;
};

export type ZamaInstance = {
  createEncryptedInput: (contractAddress: string, userAddress: string) => EncryptedInputBuffer;
  generateKeypair: () => {
    publicKey: string;
    privateKey: string;
  };
  createEIP712: (publicKey: string, contracts: string[], startTimestamp: string, durationDays: string) => Eip712Payload;
  userDecrypt: (
    handleContractPairs: Array<{ handle: string; contractAddress: string }>,
    privateKey: string,
    publicKey: string,
    signature: string,
    contractAddresses: string[],
    userAddress: string,
    startTimestamp: string,
    durationDays: string,
  ) => Promise<Record<string, unknown>>;
};
