export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'resolved':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'in-progress':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'closed':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'pending':
    default:
      return 'bg-blue-100 text-blue-800 border-blue-200';
  }
};

export const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'urgent':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
    default:
      return 'bg-green-100 text-green-800 border-green-200';
  }
};

export const getDepartmentColor = (department) => {
  switch (department?.toLowerCase()) {
    case 'sales':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'support':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'warranty':
      return 'bg-pink-100 text-pink-800 border-pink-200';
    case 'partnership':
      return 'bg-teal-100 text-teal-800 border-teal-200';
    case 'feedback':
      return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    case 'general':
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};