// const addressFromEnv = import.meta.env.VITE_CONFIDENTIAL_DIARY_ADDRESS;

// if (!addressFromEnv) {
//   throw new Error('Missing VITE_CONFIDENTIAL_DIARY_ADDRESS environment variable');
// }

export const CONTRACT_ADDRESS = "0xb6468fEb04971f411E92abEaC792b58da07ce9f4" as `0x${string}`;

// ABI copied from deployments/sepolia/ConfidentialDiary.json
export const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "entryId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "DiarySubmitted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getDiary",
    "outputs": [
      {
        "components": [
          {
            "internalType": "euint32",
            "name": "encryptedKey",
            "type": "bytes32"
          },
          {
            "internalType": "string",
            "name": "encryptedTitle",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "encryptedContent",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "createdAt",
            "type": "uint256"
          }
        ],
        "internalType": "struct ConfidentialDiary.DiaryEntry",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getDiaryCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "listDiaries",
    "outputs": [
      {
        "components": [
          {
            "internalType": "euint32",
            "name": "encryptedKey",
            "type": "bytes32"
          },
          {
            "internalType": "string",
            "name": "encryptedTitle",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "encryptedContent",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "createdAt",
            "type": "uint256"
          }
        ],
        "internalType": "struct ConfidentialDiary.DiaryEntry[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "protocolId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "externalEuint32",
        "name": "encryptedKey",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "proof",
        "type": "bytes"
      },
      {
        "internalType": "string",
        "name": "encryptedTitle",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "encryptedContent",
        "type": "string"
      }
    ],
    "name": "submitDiary",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
