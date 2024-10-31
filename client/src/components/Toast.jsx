// components/Toast.js
import PropTypes from 'prop-types';
import { useEffect } from 'react';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
    useEffect(() => {
        // Auto-dismiss the toast after the specified duration
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        // Clear the timer when the component unmounts
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg text-white transition-all duration-300 ease-in-out
            ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}>
            <p>{message}</p>
        </div>
    );
};

Toast.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error', 'info']),
    duration: PropTypes.number,
    onClose: PropTypes.func.isRequired
};

export default Toast;
