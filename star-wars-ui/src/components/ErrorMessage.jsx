export default function ErrorMessage({ error, onRetry, className = "" }) {
  return (
    <div className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <strong className="font-bold">Error: </strong>
          <span>{error}</span>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}