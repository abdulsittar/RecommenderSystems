import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './thankYou.css';

export default function ThankYou() {
    const { userId } = useParams(); // Get userId from route parameters
    const [prolificCode, setProlificCode] = useState('');
    const [isLoadingCode, setIsLoadingCode] = useState(true);

    useEffect(() => {
        console.log('🎉 ThankYou component mounted');
        console.log('Current URL:', window.location.pathname);
        console.log('Extracted userId from params:', userId);

        const fetchPilotCode = async () => {
            try {
                const response = await axios.get(`/postsurvey/pilot-code/${userId}`);
                if (response.data?.prolificCode) {
                    setProlificCode(response.data.prolificCode);
                }
            } catch (error) {
                console.error('Could not fetch pilot prolific code:', error?.response?.data || error.message);
            } finally {
                setIsLoadingCode(false);
            }
        };

        fetchPilotCode();
    }, [userId]);

    const handleBackToBrowser = () => {
        console.log('🌐 Back to Browser clicked');
        console.log('Redirecting to: https://www.google.com');
        // Redirect to Google
        window.location.href = 'https://www.google.com';
    };

    console.log('🎨 ThankYou component rendering');

    return (
        <div className="thankYouContainer" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div className="thankYouCard" style={{ background: 'white', padding: '60px 40px', borderRadius: '20px', textAlign: 'center', maxWidth: '500px' }}>
                <div className="thankYouIcon" style={{ fontSize: '48px', marginBottom: '20px' }}>✓</div>
                <h1 className="thankYouTitle" style={{ fontSize: '36px', marginBottom: '20px', color: '#333' }}>Thank You!</h1>
                <p className="thankYouMessage" style={{ fontSize: '18px', color: '#666', marginBottom: '40px' }}>
                    Your session has ended successfully. We appreciate your participation.
                </p>
                <p className="thankYouMessage" style={{ fontSize: '16px', color: '#444', marginBottom: '16px' }}>
                    You will be invited to complete the 2nd session in 2 days via Prolific.
                </p>
                <div style={{ marginBottom: '28px' }}>
                    <p style={{ margin: '0 0 8px 0', color: '#333', fontWeight: '600' }}>Your Prolific completion code:</p>
                    <div style={{
                        display: 'inline-block',
                        padding: '10px 18px',
                        borderRadius: '10px',
                        border: '2px solid #667eea',
                        color: '#1f2a7a',
                        fontWeight: '700',
                        letterSpacing: '0.5px',
                        minWidth: '180px'
                    }}>
                        {isLoadingCode ? 'Loading...' : (prolificCode || 'PILOT_TEST_CODE')}
                    </div>
                </div>
                <div className="thankYouButtons" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <button 
                        className="thankYouButton secondaryButton" 
                        onClick={handleBackToBrowser}
                        style={{ padding: '16px 32px', fontSize: '16px', fontWeight: '600', borderRadius: '10px', cursor: 'pointer', background: 'white', color: '#667eea', border: '2px solid #667eea' }}
                    >
                        Back to Browser
                    </button>
                </div>
            </div>
        </div>
    );
}
