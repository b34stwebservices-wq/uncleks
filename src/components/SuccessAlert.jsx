export const SuccessAlert = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-b-lg shadow-lg z-40">
      <div className="flex items-center justify-between">
        <span>{message}</span>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-green-700 font-bold hover:text-green-900"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SuccessAlert;
