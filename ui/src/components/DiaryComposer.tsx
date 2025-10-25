import type { FormEvent } from 'react';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Contract, hexlify } from 'ethers';
import { useEthersSigner } from '../hooks/useEthersSigner';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contracts';
import type { ZamaInstance } from '../types/zama';
import { encryptWithKey, generateDiaryKey } from '../utils/diaryCrypto';
import '../styles/DiaryComposer.css';

type DiaryComposerProps = {
  onSubmitted: () => void;
  zamaInstance: ZamaInstance | null;
  zamaLoading: boolean;
  zamaError: string | null;
};

export function DiaryComposer({ onSubmitted, zamaInstance, zamaLoading, zamaError }: DiaryComposerProps) {
  const { address } = useAccount();
  const signerPromise = useEthersSigner();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTitle('');
    setContent('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!address) {
      setError('Connect your wallet to store a diary entry.');
      return;
    }

    if (!zamaInstance || zamaLoading) {
      setError('Encryption service is not ready.');
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError('Both title and content are required.');
      return;
    }

    try {
      setError('');
      setStatus('Preparing encrypted entry...');
      setIsSubmitting(true);

      const signer = await signerPromise;
      if (!signer) {
        throw new Error('Signer unavailable');
      }

      const diaryKey = generateDiaryKey();
      const encryptedTitle = encryptWithKey(title.trim(), diaryKey);
      const encryptedContent = encryptWithKey(content.trim(), diaryKey);

      setStatus('Encrypting key with Zama...');
      const input = zamaInstance.createEncryptedInput(CONTRACT_ADDRESS, address);
      input.add32(diaryKey);
      const encryptedKey = await input.encrypt();
      const handleHex = hexlify(encryptedKey.handles[0]);
      const proofHex = hexlify(encryptedKey.inputProof);

      setStatus('Submitting transaction...');
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.submitDiary(handleHex, proofHex, encryptedTitle, encryptedContent);

      await tx.wait();

      setStatus('Diary entry stored successfully.');
      resetForm();
      onSubmitted();
    } catch (submissionError) {
      console.error('Failed to submit diary entry:', submissionError);
      const message =
        submissionError instanceof Error ? submissionError.message : 'Unexpected error while submitting entry';
      setError(message);
      setStatus('');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!address) {
    return (
      <div className="diary-placeholder">
        <p className="diary-placeholder-text">Connect your wallet to start a confidential diary.</p>
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
    <form className="diary-form" onSubmit={handleSubmit}>
      <div className="diary-field">
        <label className="diary-label" htmlFor="diary-title">
          Title
        </label>
        <input
          id="diary-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Today I learned..."
          className="diary-input"
          disabled={isSubmitting}
          required
        />
      </div>

      <div className="diary-field">
        <label className="diary-label" htmlFor="diary-content">
          Content
        </label>
        <textarea
          id="diary-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write your encrypted thoughts here..."
          className="diary-textarea"
          rows={8}
          disabled={isSubmitting}
          required
        />
      </div>

      {status && <p className="diary-status">{status}</p>}
      {error && <p className="diary-error-text">{error}</p>}

      <button
        type="submit"
        className="diary-submit"
        disabled={isSubmitting || zamaLoading}
      >
        {zamaLoading ? 'Initializing encryption...' : isSubmitting ? 'Encrypting entry...' : 'Save Encrypted Entry'}
      </button>
    </form>
  );
}
