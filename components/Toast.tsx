import React, { useEffect } from 'react';

const Toast = ({ message, type, onDismiss }: { message: string, type: 'success' | 'error', onDismiss: () => void}) => {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 3000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    return (
        <div className={`toast-notification ${type}`}>
            {message}
        </div>
    );
};

export default Toast;
