import PropTypes from 'prop-types';

const DownloadModal = ({ showModal, handleDownloadChoice, setShowModal, pageContext }) => {
    if (!showModal) return null;

    return (
        <div className="z-10 fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 m-0">
            <div className="bg-white p-8 rounded-md shadow-lg w-80">
                <h2 className="text-xl font-semibold mb-4">Choose Download Type</h2>
                <div className="flex space-x-4">
                    <button
                        onClick={() => handleDownloadChoice('excel', pageContext)}  // Pass pageContext
                    >
                        <img src="./src/assets/excel2.png" className="fill-current w-8 h-8" />
                    </button>
                    <button
                        onClick={() => handleDownloadChoice('word', pageContext)}  // Pass pageContext
                    >
                        <img src="./src/assets/word.png" className="fill-current w-8 h-8" />
                    </button>
                </div>
                <button
                    className="bg-[#ED6565] hover:bg-[#F24E4E] text-white px-4 py-2 rounded mt-5"
                    onClick={() => setShowModal(false)}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

// Define prop types for validation
DownloadModal.propTypes = {
    showModal: PropTypes.bool.isRequired,
    handleDownloadChoice: PropTypes.func.isRequired,
    setShowModal: PropTypes.func.isRequired,
    pageContext: PropTypes.string.isRequired,  // New prop for context
};

export default DownloadModal;
