import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuditLogs } from '../services/auditService';
import Navbar from '../components/Navbar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorAlert } from '../components/ErrorAlert';
import { formatDate } from '../utils/helpers';

const actionBadgeClass = (actionType) => {
  if (actionType.startsWith('order')) return 'bg-blue-100 text-blue-700';
  if (actionType.startsWith('product')) return 'bg-green-100 text-green-700';
  if (actionType.startsWith('user')) return 'bg-yellow-100 text-yellow-700';
  return 'bg-gray-100 text-gray-700';
};

const AuditTrail = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadLogs = async () => {
      try {
        setError('');
        const data = await getAuditLogs();
        setLogs(data);
      } catch (err) {
        console.error('Failed to load audit logs', err);
        setError('Unable to load audit history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    void loadLogs();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Audit Trail</h1>
            <p className="text-gray-600 mt-1">Review admin and customer activity in the app.</p>
          </div>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            Back to Dashboard
          </button>
        </div>

        <ErrorAlert message={error} onDismiss={() => setError('')} />

        {logs.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-gray-600">No audit events recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="card p-5 border border-gray-200 bg-white rounded-3xl">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-sm font-semibold text-gray-900">{log.actionType}</span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${actionBadgeClass(log.actionType)}`}>
                        {log.entityType || 'General'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Actor: {log.actorEmail || 'Unknown'}</p>
                    <p className="text-sm text-gray-600">Entity: {log.entityName || 'N/A'} {log.entityId ? `(${log.entityId.slice(0, 8)})` : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{formatDate(log.createdAt)}</p>
                  </div>
                </div>

                {log.details && (
                  <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                    {log.details}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditTrail;
