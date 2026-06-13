import { useState } from 'react';

export default function RosterManager({ roster, setRoster }) {
  const [singleName, setSingleName] = useState('');
  const [singleGender, setSingleGender] = useState('M');
  const [bulkText, setBulkText] = useState('');

  const handleAddSingle = (e) => {
    e.preventDefault();
    if (!singleName.trim()) return;
    const newStudent = {
      id: crypto.randomUUID(),
      name: singleName.trim(),
      gender: singleGender,
    };
    setRoster([...roster, newStudent]);
    setSingleName('');
  };

  const handleAddBulk = (e) => {
    e.preventDefault();
    if (!bulkText.trim()) return;
    
    const lines = bulkText.split('\n');
    const newStudents = [];
    
    lines.forEach(line => {
      const parts = line.split(/[,]/).map(p => p.trim());
      if (parts[0]) {
        let name = parts[0];
        let gender = 'M'; // Default if not specified clearly
        
        if (parts.length > 1) {
          const gStr = parts[1].toLowerCase();
          if (gStr === '여' || gStr === 'f' || gStr === 'female' || gStr === '여자') {
            gender = 'F';
          }
        }
        
        newStudents.push({
          id: crypto.randomUUID(),
          name,
          gender
        });
      }
    });

    if (newStudents.length > 0) {
      setRoster([...roster, ...newStudents]);
      setBulkText('');
    }
  };

  const handleDelete = (id) => {
    setRoster(roster.filter(student => student.id !== id));
  };

  const clearAll = () => {
    if (confirm("정말로 모든 학생 명단을 삭제하시겠습니까?")) {
      setRoster([]);
    }
  };

  return (
    <div className="roster-manager grid-2">
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2>학생 추가하기</h2>
        
        <form onSubmit={handleAddSingle} style={{ marginBottom: '2rem' }}>
          <h3>개별 추가</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
            <input 
              type="text" 
              placeholder="이름" 
              value={singleName}
              onChange={(e) => setSingleName(e.target.value)}
            />
            <select 
              value={singleGender}
              onChange={(e) => setSingleGender(e.target.value)}
              style={{ width: '100px' }}
            >
              <option value="M">남</option>
              <option value="F">여</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>추가</button>
        </form>

        <form onSubmit={handleAddBulk}>
          <h3>일괄 추가</h3>
          <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            형식: 이름, 성별(남/여) (각 줄마다 입력)
          </p>
          <textarea 
            rows="5"
            placeholder="홍길동, 남&#10;유관순, 여"
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            style={{ marginBottom: '1rem' }}
          ></textarea>
          <button type="submit" className="btn btn-outline" style={{ width: '100%' }}>일괄 추가</button>
        </form>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>현재 명단 <span className="text-muted" style={{ fontSize: '1rem' }}>({roster.length}명)</span></h2>
          {roster.length > 0 && (
            <button onClick={clearAll} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>전체 삭제</button>
          )}
        </div>
        
        {roster.length === 0 ? (
          <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>등록된 학생이 없습니다.</p>
        ) : (
          <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
            {roster.map(student => (
              <div key={student.id} style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px', background: 'rgba(255,255,255,0.05)', 
                borderRadius: '8px', marginBottom: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: '600' }}>{student.name}</span>
                  <span className={`badge ${student.gender === 'M' ? 'badge-male' : 'badge-female'}`}>
                    {student.gender === 'M' ? '남' : '여'}
                  </span>
                </div>
                <button 
                  onClick={() => handleDelete(student.id)}
                  style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem' }}
                >×</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
