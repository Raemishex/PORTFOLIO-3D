import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#050505',
          color: '#fff',
          fontFamily: 'Inter, sans-serif',
          padding: '40px',
          textAlign: 'center'
        }}>
          <svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#ff003c" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, marginTop: '20px', marginBottom: '10px' }}>
            Bir xəta baş verdi
          </h1>
          <p style={{ color: '#86868b', fontSize: '1.1rem', maxWidth: '500px', marginBottom: '30px' }}>
            Tətbiqdə gözlənilməz xəta baş verdi. Zəhmət olmasa səhifəni yeniləyin.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '14px 40px',
              borderRadius: '30px',
              background: '#fff',
              color: '#050505',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}
          >
            Yenidən Yüklə
          </button>
          {this.state.error && (
            <details style={{ marginTop: '30px', color: '#ff003c', maxWidth: '600px', textAlign: 'left', fontSize: '0.85rem' }}>
              <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>Texniki Detallar</summary>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
