// frontend/src/utils/index.ts

export const formatDate = (dateString?: string): string => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  } catch {
    return dateString;
  }
};

export const getStatusBadgeColor = (
  status: string
): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  switch (status) {
    case 'PENDING':
      return 'warning';
    case 'IN_PROGRESS':
      return 'info';
    case 'APPROVED':
      return 'primary';
    case 'REJECTED':
      return 'error';
    case 'COMPLETED':
      return 'success';
    default:
      return 'default';
  }
};
