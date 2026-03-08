import React from 'react';
import './EmergencyOverride.css';

const EmergencyOverride = ({ onContinue }) => {
    return (
        <div className="emergency-override-container">
            <div className="emergency-card">
                <div className="siren-icon pulse-animation">🚨</div>
                <h1 className="emergency-title">YOU MATTER.</h1>
                <p className="emergency-subtitle">
                    What you are feeling is real. <br />
                    Please reach out right now.
                </p>

                <div className="helpline-list">
                    <div className="helpline-card">
                        <div className="helpline-info">
                            <h3>iCall</h3>
                            <p>Free · Confidential · 24/7</p>
                        </div>
                        <a href="tel:9152987821" className="btn-call">
                            <span>📞</span> 9152987821
                        </a>
                    </div>

                    <div className="helpline-card">
                        <div className="helpline-info">
                            <h3>Vandrevala</h3>
                            <p>Free · 24/7</p>
                        </div>
                        <a href="tel:18602662345" className="btn-call">
                            <span>📞</span> 1860-2662-345
                        </a>
                    </div>

                    <div className="helpline-card highlight">
                        <div className="helpline-info">
                            <h3>Police Emergency</h3>
                            <p>Immediate danger</p>
                        </div>
                        <a href="tel:112" className="btn-call btn-call-red">
                            <span>📞</span> 112
                        </a>
                    </div>
                </div>

                <div className="escape-hatch">
                    <button onClick={onContinue} className="btn-escape">
                        I am physically safe — continue reporting
                    </button>
                </div>

                <div className="system-note">
                    <p>⚡ Pre-screening fires this in milliseconds</p>
                    <p>Bedrock never called for emergency keywords</p>
                </div>
            </div>
        </div>
    );
};

export default EmergencyOverride;
