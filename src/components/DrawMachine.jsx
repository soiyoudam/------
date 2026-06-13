import { useState, useEffect, useRef } from 'react';

export default function DrawMachine({ roster, drawnList, setDrawnList, riggedSelection, setRiggedSelection }) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDraw, setCurrentDraw] = useState(null);
  const [drawCount, setDrawCount] = useState(1);
  const [genderSplit, setGenderSplit] = useState(false);
  
  // Available pool is roster minus already drawn
  const availablePool = roster.filter(s => !drawnList.some(d => d.id === s.id));
  
  const handleDraw = (isRedraw = false) => {
    if (availablePool.length === 0 && !isRedraw) {
      alert("뽑을 수 있는 학생이 없습니다.");
      return;
    }

    setIsDrawing(true);
    setCurrentDraw(null);

    setTimeout(() => {
      let selected = [];

      // Check for rigged selection first
      if (riggedSelection && riggedSelection.length > 0) {
        selected = [...riggedSelection];
        setRiggedSelection(null); // Clear rigged after use
      } else {
        // Normal random selection
        let poolToDraw = [...availablePool];
        
        // If redraw, we add the currentDraw back to pool virtually for this draw only
        // Actually, if it's redraw, currentDraw is not in drawnList yet anyway because we don't commit it until "Next"
        // Wait, the PRD and logic discussed: 
        // "Drawn student is moved to a drawn list. Redraw returns them to pool and picks someone else."
        // Let's adjust state: 
        // When we draw, they are NOT immediately put into `drawnList`. They are just in `currentDraw`.
        // If we click "Redraw", we just draw again from `availablePool`.
        // If we click "Draw Next", we add `currentDraw` to `drawnList`, and then clear `currentDraw`.

        if (genderSplit && drawCount > 1) {
          // Attempt to split evenly. This is simple logic: half male, half female if possible
          let maleCount = Math.ceil(drawCount / 2);
          let femaleCount = Math.floor(drawCount / 2);
          
          let males = poolToDraw.filter(s => s.gender === 'M').sort(() => 0.5 - Math.random());
          let females = poolToDraw.filter(s => s.gender === 'F').sort(() => 0.5 - Math.random());
          
          selected = [...males.slice(0, maleCount), ...females.slice(0, femaleCount)];
          
          // Fill remainder if one gender didn't have enough
          while (selected.length < drawCount) {
            let remaining = poolToDraw.filter(s => !selected.includes(s)).sort(() => 0.5 - Math.random());
            if (remaining.length > 0) {
              selected.push(remaining[0]);
            } else {
              break; // No more people
            }
          }
        } else {
          // Pure random
          poolToDraw.sort(() => 0.5 - Math.random());
          selected = poolToDraw.slice(0, Math.min(drawCount, poolToDraw.length));
        }
      }

      setCurrentDraw(selected);
      setIsDrawing(false);
    }, 2000); // 2 second animation
  };

  const handleNextDraw = () => {
    if (currentDraw) {
      setDrawnList([...drawnList, ...currentDraw]);
      setCurrentDraw(null);
    }
  };

  const resetDrawnList = () => {
    if (confirm("뽑힌 명단을 모두 초기화하시겠습니까?")) {
      setDrawnList([]);
      setCurrentDraw(null);
    }
  };

  return (
    <div className="draw-machine grid-2">
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        {!currentDraw && !isDrawing ? (
          <>
            <div className="marble-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)' }}>
              <h2 style={{ color: 'rgba(255,255,255,0.3)' }}>준비 완료</h2>
            </div>
            
            <div style={{ marginTop: '2rem', width: '100%', maxWidth: '300px' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--text-muted)' }}>뽑을 인원</label>
                  <input type="number" min="1" max={availablePool.length || 1} value={drawCount} onChange={e => setDrawCount(parseInt(e.target.value) || 1)} />
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', height: '45px' }}>
                    <input type="checkbox" checked={genderSplit} onChange={e => setGenderSplit(e.target.checked)} style={{ width: 'auto' }} />
                    <span style={{ fontSize: '0.85rem' }}>남녀 배분</span>
                  </label>
                </div>
              </div>
              <button onClick={() => handleDraw()} className="btn btn-primary" style={{ width: '100%', fontSize: '1.2rem', padding: '16px' }} disabled={availablePool.length === 0}>
                {availablePool.length === 0 ? '명단 부족' : '뽑기 시작!'}
              </button>
            </div>
          </>
        ) : isDrawing ? (
          <div className="marble-container">
            {/* Fake bouncing marbles */}
            {Array.from({ length: 15 }).map((_, i) => (
              <div 
                key={i} 
                className={`marble jiggling ${i % 2 === 0 ? 'male-marble' : 'female-marble'}`}
                style={{
                  left: `${10 + Math.random() * 70}%`,
                  bottom: `${Math.random() * 30}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${0.3 + Math.random() * 0.3}s`
                }}
              ></div>
            ))}
            <h3 style={{ position: 'absolute', top: '20px', width: '100%', textAlign: 'center', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>섞는 중...</h3>
          </div>
        ) : (
          <div style={{ width: '100%', textAlign: 'center' }}>
            <h2 className="text-gradient">당첨!</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', margin: '2rem 0' }}>
              {currentDraw.map((student, idx) => (
                <div key={idx} className={`huge-marble drawn-marble-showcase ${student.gender === 'M' ? 'male-marble' : 'female-marble'}`}>
                  {student.name}
                </div>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => handleDraw(true)} className="btn btn-outline">다시 뽑기</button>
              <button onClick={handleNextDraw} className="btn btn-primary">확정하고 다음</button>
            </div>
          </div>
        )}
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2>뽑힌 명단 <span className="text-muted" style={{ fontSize: '1rem' }}>({drawnList.length}명)</span></h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>남은 인원: {availablePool.length}명</p>
          </div>
          {drawnList.length > 0 && (
            <button onClick={resetDrawnList} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>초기화</button>
          )}
        </div>

        {drawnList.length === 0 ? (
          <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>아직 뽑힌 학생이 없습니다.</p>
        ) : (
          <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
            {drawnList.map((student, idx) => (
              <div key={idx} style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px', background: 'rgba(255,255,255,0.05)', 
                borderRadius: '8px', marginBottom: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: '600', color: 'var(--text-muted)', width: '20px' }}>{idx + 1}.</span>
                  <span style={{ fontWeight: '600' }}>{student.name}</span>
                  <span className={`badge ${student.gender === 'M' ? 'badge-male' : 'badge-female'}`}>
                    {student.gender === 'M' ? '남' : '여'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
