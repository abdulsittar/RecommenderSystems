import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './thankYou.css';

export default function ThankYou() {
    const { userId } = useParams(); // Get userId from route parameters
    // Session 1 completion code
    const prolificCode = 'C1QMV1VB';
    const prolificLink = 'https://app.prolific.com/submissions/complete?cc=C1QMV1VB';

    useEffect(() => {
        console.log('🎉 ThankYou component mounted');
        console.log('Current URL:', window.location.pathname);
        console.log('Extracted userId from params:', userId);

        // Prevent page scrolling on thank-you screen.
        const previousBodyOverflow = document.body.style.overflow;
        const previousHtmlOverflow = document.documentElement.style.overflow;
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousBodyOverflow;
            document.documentElement.style.overflow = previousHtmlOverflow;
        };
    }, [userId]);

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
                        {prolificCode}
                    </div>
                    <p style={{ margin: '12px 0 0 0', color: '#555', fontSize: '14px' }}>
                        <a href={prolificLink} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea', textDecoration: 'underline' }}>
                            Click here to complete your submission on Prolific
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
