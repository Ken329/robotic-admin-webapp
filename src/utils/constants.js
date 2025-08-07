export const STUDENT_STATUS = {
  PENDING_CENTER: 'pending center',
  PENDING_ADMIN: 'pending admin',
  REJECTED: 'rejected',
  APPROVED: 'approved'
};

export const CENTRE_STATUS = {
  APPROVED: 'approved'
};

export const USER_ROLE = {
  ADMIN: 'admin',
  CENTER: 'center'
};

export const categoryMap = {
  general: { label: 'General', colorScheme: 'blue' },
  exercise: { label: 'Exercise', colorScheme: 'green' },
  competition: { label: 'Competition', colorScheme: 'orange' }
};

export const POST_TYPE = {
  GENERAL: 'general',
  COMPETITION: 'competition',
  EXERCISE: 'exercise'
};

export const PAGE_NAME = {
  '/admin/dashboard': 'Admin Dashboard',
  '/admin/students': 'Students',
  '/admin/centres': 'Centres',
  '/admin/achievements': 'Achievements'
};

export const POST_ATTRIBUTE_TYPES = {
  CHECKBOX: 'checkbox',
  TEXT_INPUT: 'textInput',
  TEAM_MEMBER: 'Team Member'
};
