import { useEffect, useMemo, useState } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { useEthersSigner } from '../hooks/useEthersSigner';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contracts';
// import { publicClient } from '../config/publicClient';
import type { ZamaInstance } from '../type/zama';
import { decryptWithKey } from '../utils/diaryCrypto';
import '../styles/DiaryEntries.css';

type DiaryEntriesProps = {
  refreshKey: number;
  zamaInstance: ZamaInstance | null;
  zamaLoading: boolean;
  zamaError: string | null;
};

type ContractDiaryEntry = {
  encryptedKey: `0x${string}`;
  encryptedTitle: string;
  encryptedContent: string;
  createdAt: bigint;
};

type DiaryEntry = {
  encryptedKey: `0x${string}`;
  encryptedTitle: string;
  encryptedContent: string;
  createdAt: number;
};

const EMPTY_STATE_TEXT = 'Your diary is still encrypted silence. Start writing to see entries here.';

export function DiaryEntries({ refreshKey, zamaInstance, zamaLoading, zamaError }: DiaryEntriesProps) {
  const { address } = useAccount();
  const signerPromise = useEthersSigner();
  const publicClient = usePublicClient();

  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [decryptingHandle, setDecryptingHandle] = useState<string | null>(null);
  const [decryptedEntries, setDecryptedEntries] = useState<Record<string, { title: string; content: string }>>({});

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => b.createdAt - a.createdAt);
  }, [entries]);

  useEffect(() => {
    let cancelled = false;

    const fetchEntries = async () => {
      if (!address || !publicClient) {
        setEntries([]);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const contractEntries = (await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'listDiaries',
          args: [address],
        })) as ContractDiaryEntry[];

        if (cancelled) {
          return;
        }

        const normalized = contractEntries.map((entry) => ({
          encryptedKey: entry.encryptedKey,
          encryptedTitle: entry.encryptedTitle,
          encryptedContent: entry.encryptedContent,
          createdAt: Number(entry.createdAt),
        }));

        setEntries(normalized);
        setDecryptedEntries({});
      } catch (readError) {
        if (cancelled) {
          return;
        }
        console.error('Failed to load diary entries:', readError);
        const message = readError instanceof Error ? readError.message : 'Unable to load diary entries';
        setError(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchEntries();

    return () => {
      cancelled = true;
    };
  }, [address, publicClient, refreshKey]);

  const decryptEntry = async (entry: DiaryEntry) => {
    if (!zamaInstance) {
      setError('Encryption service is not ready yet.');
      return;
    }

    if (!address) {
      setError('Connect your wallet to decrypt entries.');
      return;
    }

    try {
      const signer = await signerPromise;
      if (!signer) {
        throw new Error('Signer unavailable');
      }

      setDecryptingHandle(entry.encryptedKey);
      setError('');

      const keypair = zamaInstance.generateKeypair();
      const contractAddresses = [CONTRACT_ADDRESS];
      const startTimestamp = Math.floor(Date.now() / 1000).toString();
      const durationDays = '10';

      const eip712 = zamaInstance.createEIP712(keypair.publicKey, contractAddresses, startTimestamp, durationDays);

      const signature = await signer.signTypedData(
        eip712.domain as any,
        {
          UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification as any,
        },
        eip712.message as any,
      );

      const result = await zamaInstance.userDecrypt(
        [
          {
            handle: entry.encryptedKey,
            contractAddress: CONTRACT_ADDRESS,
          },
        ],
        keypair.privateKey,
        keypair.publicKey,
        signature.replace('0x', ''),
        contractAddresses,
        address,
        startTimestamp,
        durationDays,
      );

      const decryptedKeyValue = result[entry.encryptedKey];
      if (!decryptedKeyValue) {
        throw new Error('Decryption failed: no key returned');
      }

      const clearKey = Number(decryptedKeyValue);
      if (!Number.isFinite(clearKey)) {
        throw new Error('Received invalid diary key');
      }

      const decryptedTitle = decryptWithKey(entry.encryptedTitle, clearKey);
      const decryptedContent = decryptWithKey(entry.encryptedContent, clearKey);

      setDecryptedEntries((previous) => ({
        ...previous,
        [entry.encryptedKey]: {
          title: decryptedTitle,
          content: decryptedContent,
        },
      }));
    } catch (decryptError) {
      console.error('Failed to decrypt diary entry:', decryptError);
      const message = decryptError instanceof Error ? decryptError.message : 'Failed to decrypt entry';
      setError(message);
    } finally {
      setDecryptingHandle(null);
    }
  };

  if (!address) {
    return (
      <div className="diary-placeholder">
        <p className="diary-placeholder-text">Connect your wallet to review encrypted entries.</p>
      </div>
    );
  }

  if (zamaError) {
    return (
      <div className="diary-error">
        <p>{zamaError}</p>
      </div>
    );
  }

  return (
    <div className="entries-container">
      {loading && <p className="diary-status">Loading encrypted entries...</p>}
      {error && <p className="diary-error-text">{error}</p>}

      {!loading && !error && sortedEntries.length === 0 && (
        <p className="diary-placeholder-text">{EMPTY_STATE_TEXT}</p>
      )}

      <ul className="entries-list">
        {sortedEntries.map((entry) => {
          const decrypted = decryptedEntries[entry.encryptedKey];
          const timestamp = new Date(entry.createdAt * 1000);

          return (
            <li key={entry.encryptedKey} className="entry-card">
              <div className="entry-header">
                <span className="entry-date">{timestamp.toLocaleString()}</span>
                <span className={`entry-status ${decrypted ? 'decrypted' : 'encrypted'}`}>
                  {decrypted ? 'Decrypted' : 'Encrypted'}
                </span>
              </div>

              <div className="entry-content">
                <h3 className="entry-title">{decrypted ? decrypted.title : '*** Encrypted Title ***'}</h3>
                <p className="entry-body">{decrypted ? decrypted.content : '*** Encrypted Content ***'}</p>
              </div>

              <div className="entry-footer">
                <button
                  type="button"
                  className="diary-submit"
                  onClick={() => decryptEntry(entry)}
                  disabled={!!decrypted || zamaLoading || decryptingHandle === entry.encryptedKey}
                >
                  {decrypted ? 'Decryption Complete' : decryptingHandle === entry.encryptedKey ? 'Decrypting...' : 'Decrypt Entry'}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
