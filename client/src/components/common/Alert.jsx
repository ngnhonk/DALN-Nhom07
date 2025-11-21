import { AlertCircle, CheckCircle } from 'lucide-react';

export const Alert = ({ type = 'success', message }) => {
  if (!message) return null;

  const styles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
  };

  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div className={`p-4 rounded-lg flex items-start gap-3 border ${styles[type]}`}>
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
      <span className="text-sm">{message}</span>
    </div>
  );
};