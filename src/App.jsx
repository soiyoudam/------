import { useState, useRef } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import RosterManager from './components/RosterManager';
import DrawMachine from './components/DrawMachine';
import SecretRiggingModal from './components/SecretRiggingModal';

function App() {
  const [activeTab, setActiveTab] = useState('draw'); // 'draw' or 'roster'
  const [roster, setRoster] = useLocalStorage('presenter-roster', []);
  const [drawnList, setDrawnList] = useLocalStorage('presenter-drawn', []);
  
  // Secret rigging state
  const [isRiggingModalOpen, setIsRiggingModalOpen] = useState(false);
  const [riggedSelection, setRiggedSelection] = useState(null);
  
  // 5-click detection
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);

  const handleTitleClick = () => {
    clickCountRef.current += 1;
    
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    if (clickCountRef.current >= 5) {
      setIsRiggingModalOpen(true);
      clickCountRef.current = 0;
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 1000); // Reset if 1 second passes without 5 clicks
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 onClick={handleTitleClick} style={{ cursor: 'default', userSelect: 'none' }}>
          <span className="text-gradient">랜덤 발표자</span> 뽑기
        </h1>
        <p className="text-muted">두근두근! 오늘의 발표자는 누구일까요?</p>
      </header>

      <div className="nav-tabs">
        <div 
          className={`tab ${activeTab === 'draw' ? 'active' : ''}`}
          onClick={() => setActiveTab('draw')}
        >
          🎲 발표자 뽑기
        </div>
        <div 
          className={`tab ${activeTab === 'roster' ? 'active' : ''}`}
          onClick={() => setActiveTab('roster')}
        >
          📝 명단 관리
        </div>
      </div>

      <main>
        {activeTab === 'draw' ? (
          <DrawMachine 
            roster={roster} 
            drawnList={drawnList} 
            setDrawnList={setDrawnList}
            riggedSelection={riggedSelection}
            setRiggedSelection={setRiggedSelection}
          />
        ) : (
          <RosterManager 
            roster={roster} 
            setRoster={setRoster} 
          />
        )}
      </main>

      <SecretRiggingModal 
        isOpen={isRiggingModalOpen} 
        onClose={() => setIsRiggingModalOpen(false)} 
        roster={roster}
        drawnList={drawnList}
        setRiggedSelection={setRiggedSelection}
      />
    </div>
  );
}

export default App;
