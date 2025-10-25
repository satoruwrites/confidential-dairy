const encoder = new TextEncoder();
const decoder = new TextDecoder();

const KEY_LENGTH = 8;

const base64FromBytes = (bytes: Uint8Array): string => {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

const bytesFromBase64 = (value: string): Uint8Array => {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
};

const deriveKeyBytes = (key: number): Uint8Array => {
  const keyString = key.toString();
  return encoder.encode(keyString.padStart(KEY_LENGTH, keyString));
};

export const generateDiaryKey = (): number => {
  const min = 10 ** (KEY_LENGTH - 1);
  const max = 10 ** KEY_LENGTH - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const encryptWithKey = (value: string, key: number): string => {
  const valueBytes = encoder.encode(value);
  const keyBytes = deriveKeyBytes(key);
  const encrypted = new Uint8Array(valueBytes.length);

  for (let index = 0; index < valueBytes.length; index += 1) {
    encrypted[index] = valueBytes[index] ^ keyBytes[index % keyBytes.length];
  }

  return base64FromBytes(encrypted);
};

export const decryptWithKey = (value: string, key: number): string => {
  const encryptedBytes = bytesFromBase64(value);
  const keyBytes = deriveKeyBytes(key);
  const decrypted = new Uint8Array(encryptedBytes.length);

  for (let index = 0; index < encryptedBytes.length; index += 1) {
    decrypted[index] = encryptedBytes[index] ^ keyBytes[index % keyBytes.length];
  }

  return decoder.decode(decrypted);
};
