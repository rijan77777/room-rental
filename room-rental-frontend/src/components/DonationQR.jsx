
import React, { useState } from 'react';

const DonationQR = () => {
  const [showModal, setShowModal] = useState(false);

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('✅ Copied: ' + text);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('✅ Copied: ' + text);
    }
  };

  return (
    <>
      {/* QR Button - Shows on Home Page */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        padding: '20px',
        borderRadius: '12px',
        margin: '20px 0',
        textAlign: 'center'
      }}>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: '#1a8cd8',
            color: 'white',
            border: 'none',
            padding: '14px 32px',
            borderRadius: '50px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(26, 140, 216, 0.4)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 8px 25px rgba(26, 140, 216, 0.6)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 15px rgba(26, 140, 216, 0.4)';
          }}
        >
          🤝 Donate to PM Relief Fund
        </button>
      </div>

      {/* Modal - Shows when button is clicked */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.8)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              maxWidth: '500px',
              width: '100%',
              background: 'white',
              borderRadius: '16px',
              padding: '30px',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#999'
              }}
            >
              ✕
            </button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span
                style={{
                  background: '#dc3545',
                  color: 'white',
                  padding: '4px 16px',
                  borderRadius: '50px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  display: 'inline-block'
                }}
              >
                🇳🇵 PM RELIEF FUND
              </span>
              <h2
                style={{
                  fontSize: '1.4rem',
                  margin: '10px 0 5px 0',
                  color: '#1a1a2e'
                }}
              >
                Prime Minister Disaster Relief Fund
              </h2>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                Your contribution helps flood victims across Nepal
              </p>
            </div>

            {/* QR Code */}
            <div
              style={{
                textAlign: 'center',
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '20px'
              }}
            >
              <p style={{ color: '#666', marginBottom: '10px', fontSize: '0.9rem' }}>
                Scan to donate via eSewa, Khalti, or any banking app
              </p>
              <div
                style={{
                  width: '180px',
                  height: '180px',
                  margin: '0 auto',
                  background: 'white',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              >
                <img
                  src="/payment-qr.jpg"
                  alt="PM Relief Fund QR Code"
                  style={{ width: '160px', height: '160px', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/160x160?text=QR+Code';
                  }}
                />
              </div>
              <div
                style={{
                  marginTop: '10px',
                  display: 'flex',
                  gap: '8px',
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}
              >
                <span
                  style={{
                    background: '#e8f5e9',
                    color: '#2e7d32',
                    padding: '3px 12px',
                    borderRadius: '50px',
                    fontSize: '0.7rem'
                  }}
                >
                  📱 eSewa
                </span>
                <span
                  style={{
                    background: '#e3f2fd',
                    color: '#1565c0',
                    padding: '3px 12px',
                    borderRadius: '50px',
                    fontSize: '0.7rem'
                  }}
                >
                  🏦 Khalti
                </span>
                <span
                  style={{
                    background: '#fff3e0',
                    color: '#e65100',
                    padding: '3px 12px',
                    borderRadius: '50px',
                    fontSize: '0.7rem'
                  }}
                >
                  💳 Banking App
                </span>
              </div>
            </div>

            {/* Bank Details */}
            <div
              style={{
                background: '#f8f9fa',
                borderRadius: '12px',
                padding: '15px'
              }}
            >
              <h3 style={{ fontSize: '0.95rem', marginBottom: '10px', color: '#1a1a2e' }}>
                🏦 Bank Account Details
              </h3>

              <div style={{ display: 'grid', gap: '8px' }}>
                {/* Rastriya Banijya Bank */}
                <div
                  style={{
                    background: 'white',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    borderLeft: '4px solid #1a8cd8'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '0.85rem' }}>Rastriya Banijya Bank</strong>
                      <div style={{ fontSize: '0.75rem', color: '#666' }}>
                        Account: 143010000025006
                      </div>
                    </div>
                    <button
                      onClick={() => copyText('143010000025006')}
                      style={{
                        background: '#e8f5e9',
                        border: 'none',
                        padding: '3px 12px',
                        borderRadius: '50px',
                        color: '#2e7d32',
                        cursor: 'pointer',
                        fontSize: '0.7rem'
                      }}
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>

                {/* Nepal Bank Limited */}
                <div
                  style={{
                    background: 'white',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    borderLeft: '4px solid #e65100'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '0.85rem' }}>Nepal Bank Limited</strong>
                      <div style={{ fontSize: '0.75rem', color: '#666' }}>
                        Account: 00211600510039000003
                      </div>
                    </div>
                    <button
                      onClick={() => copyText('00211600510039000003')}
                      style={{
                        background: '#e8f5e9',
                        border: 'none',
                        padding: '3px 12px',
                        borderRadius: '50px',
                        color: '#2e7d32',
                        cursor: 'pointer',
                        fontSize: '0.7rem'
                      }}
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>

                {/* Himalayan Bank */}
                <div
                  style={{
                    background: 'white',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    borderLeft: '4px solid #d4a017'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '0.85rem' }}>Himalayan Bank Limited</strong>
                      <div style={{ fontSize: '0.75rem', color: '#666' }}>
                        Account: 00100105200270
                      </div>
                    </div>
                    <button
                      onClick={() => copyText('00100105200270')}
                      style={{
                        background: '#e8f5e9',
                        border: 'none',
                        padding: '3px 12px',
                        borderRadius: '50px',
                        color: '#2e7d32',
                        cursor: 'pointer',
                        fontSize: '0.7rem'
                      }}
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>

                {/* Nabil Bank */}
                <div
                  style={{
                    background: 'white',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    borderLeft: '4px solid #27ae60'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '0.85rem' }}>Nabil Bank Limited</strong>
                      <div style={{ fontSize: '0.75rem', color: '#666' }}>
                        Account: 01905631210046
                      </div>
                    </div>
                    <button
                      onClick={() => copyText('01905631210046')}
                      style={{
                        background: '#e8f5e9',
                        border: 'none',
                        padding: '3px 12px',
                        borderRadius: '50px',
                        color: '#2e7d32',
                        cursor: 'pointer',
                        fontSize: '0.7rem'
                      }}
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>

                {/* Standard Chartered */}
                <div
                  style={{
                    background: 'white',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    borderLeft: '4px solid #6c3483'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '0.85rem' }}>Standard Chartered Bank</strong>
                      <div style={{ fontSize: '0.75rem', color: '#666' }}>
                        Account: 01013243801
                      </div>
                    </div>
                    <button
                      onClick={() => copyText('01013243801')}
                      style={{
                        background: '#e8f5e9',
                        border: 'none',
                        padding: '3px 12px',
                        borderRadius: '50px',
                        color: '#2e7d32',
                        cursor: 'pointer',
                        fontSize: '0.7rem'
                      }}
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <p
              style={{
                textAlign: 'center',
                marginTop: '15px',
                fontSize: '0.75rem',
                color: '#888'
              }}
            >
              🙏 Your donation directly supports flood relief efforts in Nepal
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default DonationQR;