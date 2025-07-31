import Loader from '../components/loader';

export default function Table({ 
  columns, 
  data, 
  sortKey, 
  sortAscending, 
  onSort, 
  onRowClick, 
  loading = false,
  emptyMessage = "No data available"
}) {
  const getSortIcon = (columnKey) => {
    if (sortKey !== columnKey) return null;
    return sortAscending ? '▲' : '▼';
  };

  if (loading) {
    return <Loader message="Loading table data..." />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`p-4 text-left font-semibold ${
                    column.sortable 
                      ? 'cursor-pointer hover:bg-blue-700 transition-colors select-none' 
                      : ''
                  }`}
                  onClick={column.sortable ? () => onSort(column.key) : undefined}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <span className="text-xs opacity-75">
                        {getSortIcon(column.key)}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr
                key={row.uid || index}
                className={`transition-colors ${
                  onRowClick 
                    ? 'hover:bg-blue-50 cursor-pointer' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((column) => (
                  <td key={column.key} className="p-4">
                    {column.render 
                      ? column.render(row[column.key], row) 
                      : row[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}