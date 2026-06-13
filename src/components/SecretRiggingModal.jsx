import { useState } from 'react';

export default function SecretRiggingModal({ isOpen, onClose, roster, drawnList, setRiggedSelection }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const availablePool = roster.filter(s => !drawnList.some(d => d.id === s.id));

  if (!isOpen) return null;

  const toggleStudent = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sId => sId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleConfirm = () => {
    const selectedStudents = availablePool.filter(s => selectedIds.includes(s.id));
    setRiggedSelection(selectedStudents);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <h2 style={{ marginBottom: '1rem', color: '#f87171' }}>비밀 설정 모드</h2>
        <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          다음에 무조건 뽑힐 학생을 선택하세요.
        </p>

        <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1.5rem' }}>
          {availablePool.length === 0 ? (
            <p className="text-muted">선택할 수 있는 학생이 없습니다.</p>
          ) : (
            availablePool.map(student => (
              <div 
                key={student.id} 
                onClick={() => toggleStudent(student.id)}
                style={{
                  padding: '10px 15px',
                  margin: '5px 0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  background: selectedIds.includes(student.id) ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${selectedIds.includes(student.id) ? '#ef4444' : 'transparent'}`
                }}
              >
                <span>{student.name}</span>
                <span className={`badge ${student.gender === 'M' ? 'badge-male' : 'badge-female'}`}>
                  {student.gender === 'M' ? '남' : '여'}
                </span>
              </div>
            ))
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-outline">취소</button>
          <button onClick={handleConfirm} className="btn btn-danger">저장</button>
        </div>
      </div>
    </div>
  );
}
