export const ErrorAlert = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-b-lg shadow-lg z-40">
      <div className="flex items-center justify-between">
        <span>{message}</span>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-700 font-bold hover:text-red-900"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;
