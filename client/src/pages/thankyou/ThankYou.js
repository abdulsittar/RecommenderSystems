import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import './thankYou.css';

export default function ThankYou() {
    const history = useHistory();
    const { userId } = useParams(); // Get userId from route parameters

    useEffect(() => {
        console.log('🎉 ThankYou component mounted');
        console.log('Current URL:', window.location.pathname);
        console.log('Extracted userId from params:', userId);
    }, [userId]);

    const handleNewSession = async () => {
        console.log('🔄 Start New Session clicked');
        console.log('Using userId:', userId);
        
        // PILOT STUDY: User was logged out, redirect to register page
        // Register page will detect existing user and auto-login them
        // This will clear sessionReadPosts and increment sessionCount
        console.log('Redirecting to register page for auto-login');
        history.push(`/register/${userId}`);
        
        // MAIN STUDY: Same flow but may require manual login
        // history.push(`/login/${userId}`);
    };

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
                <div className="thankYouButtons" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <button 
                        className="thankYouButton primaryButton" 
                        onClick={handleNewSession}
                        style={{ padding: '16px 32px', fontSize: '16px', fontWeight: '600', border: 'none', borderRadius: '10px', cursor: 'pointer', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}
                    >
                        Start a New Session
                    </button>
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
