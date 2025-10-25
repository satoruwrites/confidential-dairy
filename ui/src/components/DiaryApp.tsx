import { useState } from 'react';
import { Header } from './Header';
import { DiaryComposer } from './DiaryComposer';
import { DiaryEntries } from './DiaryEntries';
import { useZamaInstance } from '../hooks/useZamaInstance';
import '../styles/DiaryApp.css';

type DiaryTab = 'compose' | 'entries';

export function DiaryApp() {
  const [activeTab, setActiveTab] = useState<DiaryTab>('compose');
  const [refreshKey, setRefreshKey] = useState(0);
  const zamaContext = useZamaInstance();

  const handleSubmitted = () => {
    setRefreshKey((prev) => prev + 1);
    setActiveTab('entries');
  };

  return (
    <div className="diary-app">
      <Header />
      <main className="diary-main">
        <div className="diary-card">
          <nav className="diary-tabs">
            <button
              type="button"
              onClick={() => setActiveTab('compose')}
              className={`diary-tab ${activeTab === 'compose' ? 'active' : ''}`}
            >
              New Entry
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('entries')}
              className={`diary-tab ${activeTab === 'entries' ? 'active' : ''}`}
            >
              My Entries
            </button>
          </nav>

          <div className="diary-content">
            {activeTab === 'compose' && (
              <DiaryComposer
                onSubmitted={handleSubmitted}
                zamaInstance={zamaContext.instance}
                zamaLoading={zamaContext.isLoading}
                zamaError={zamaContext.error}
              />
            )}
            {activeTab === 'entries' && (
              <DiaryEntries
                refreshKey={refreshKey}
                zamaInstance={zamaContext.instance}
                zamaLoading={zamaContext.isLoading}
                zamaError={zamaContext.error}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
