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
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'white' }}>
                    <h1>Something went wrong.</h1>
                    <p>Please refresh the page or try logging out.</p>
                    <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem', color: '#fca5a5' }}>
                        {this.state.error && this.state.error.toString()}
                    </details>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="btn btn-primary"
                        style={{ marginTop: '1rem' }}
                    >
                        Go to Dashboard
                    </button>
                    <button
                        onClick={() => {
                            localStorage.removeItem('userInfo');
                            window.location.href = '/login';
                        }}
                        className="btn"
                        style={{ marginTop: '1rem', marginLeft: '1rem', backgroundColor: '#ef4444' }}
                    >
                        Logout & Reset
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
