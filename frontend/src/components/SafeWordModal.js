import React, { useState } from 'react';
import './SafeWordModal.css';

const SafeWordModal = ({ isOpen, onClose, onSave }) => {
    const [safeWord, setSafeWord] = useState('');

    if (!isOpen) return null;

    const handleSave = () => {
        if (safeWord.trim()) {
            localStorage.setItem('sahayak_safe_word', safeWord.trim().toLowerCase());
            onSave(safeWord.trim().toLowerCase());
            onClose();
        }
    };

    return (
        <div className="modal-overlay">
            <div className="glass-panel modal-content">
                <h2 className="modal-title">
                    <span className="icon">🔒</span> Set Your Safe Word
                </h2>
                <p className="modal-description">
                    If you type this word anytime, screen instantly switches to a fake notes app.
                </p>

                <input
                    type="text"
                    className="modal-input"
                    placeholder='e.g. "notes" or "history"'
                    value={safeWord}
                    onChange={(e) => setSafeWord(e.target.value)}
                />

                <div className="modal-actions">
                    <button className="btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn-primary" onClick={handleSave}>Save Word</button>
                </div>

                <p className="modal-footer">Saved to localStorage</p>
            </div>
        </div>
    );
};

export default SafeWordModal;
