import { AlertTriangle, X } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onCancel}
          className="absolute right-3 top-3 rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        <div className="mb-4 flex items-start gap-3 pr-8">
          <div className="rounded-full bg-red-100 p-2 text-red-700">
            <AlertTriangle size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <p className="mt-2 text-sm text-gray-600">{message}</p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} className="btn-secondary sm:w-auto">
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn-secondary bg-red-600 text-white hover:bg-red-700 sm:w-auto"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
