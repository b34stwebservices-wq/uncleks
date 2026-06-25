import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

export const PendingApprovalPage = () => {
  return (
    <div className="min-h-screen bg-primary-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-900 mb-4">Account Pending Approval</h1>
          <p className="text-gray-600 mb-6">
            Your account has been created successfully, but it needs administrator approval before you can access customer features.
          </p>
          <p className="text-gray-600 mb-6">
            You can wait for confirmation from an admin and then return to login once your account is approved.
          </p>
          <Link
            to="/login"
            className="btn-primary inline-flex items-center justify-center px-6 py-3"
          >
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PendingApprovalPage;
