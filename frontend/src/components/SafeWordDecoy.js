import React from 'react';
import './SafeWordDecoy.css';

const SafeWordDecoy = ({ onReturn }) => {
    const [, setClickCount] = React.useState(0);
    const clickTimer = React.useRef(null);

    const handleTripleTap = () => {
        setClickCount(prev => {
            const newCount = prev + 1;
            if (newCount === 3) {
                if (onReturn) onReturn();
                return 0;
            }
            
            // Reset count if no follow-up click within 500ms
            if (clickTimer.current) clearTimeout(clickTimer.current);
            clickTimer.current = setTimeout(() => {
                setClickCount(0);
            }, 500);
            
            return newCount;
        });
    };

    const currentDate = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    return (
        <div className="decoy-container" onClick={handleTripleTap}>
            <div className="decoy-header">
                <h1>📝 Notes</h1>
                <span className="decoy-date">{currentDate}</span>
            </div>

            <div className="decoy-list">
                <div className="decoy-card">
                    <h3>Chemistry — Ch 4</h3>
                    <p>Periodic table revision</p>
                    <p>Assignment due Friday</p>
                </div>

                <div className="decoy-card">
                    <h3>Tomorrow Schedule</h3>
                    <p>9am — Maths lecture</p>
                    <p>2pm — Lab session</p>
                </div>

                <div className="decoy-card">
                    <h3>Weekend Plans</h3>
                    <p>Call home Sunday</p>
                    <p>Return library books</p>
                </div>
            </div>
        </div>
    );
};

export default SafeWordDecoy;
