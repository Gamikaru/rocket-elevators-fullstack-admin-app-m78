import PropTypes from 'prop-types';

function ConfirmationModal({ isOpen, onClose, onConfirm, message }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white w-full max-w-md mx-auto p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-gray-800">{message}</h2>
                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        className="px-5 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-700 transition"
                        onClick={onConfirm}
                    >
                        Confirm
                    </button>
                    <button
                        className="px-5 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition"
                        onClick={onClose}
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
}

// PropTypes validation for ConfirmationModal component
ConfirmationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
};

export default ConfirmationModal;