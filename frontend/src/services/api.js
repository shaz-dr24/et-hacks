// API service — connects to AutoPilotX FastAPI backend
const BASE_URL = '/api';

// Generic request helper
const request = async (path, options = {}) => {
  const response = await fetch(`${BASE_URL}${path}`, options);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }
  return response.json();
};

export const api = {
  // Health & monitoring
  getHealth: () => request('/health'),
  triggerHealthScan: () => request('/health-scan', { method: 'POST' }),

  // Upload resume → onboarding pipeline
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/upload-resume', { method: 'POST', body: formData });
  },

  // Upload meeting transcript → task extraction pipeline
  uploadTranscript: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/upload-transcript', { method: 'POST', body: formData });
  },

  // Upload invoice → finance pipeline
  uploadInvoice: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/upload-invoice', { method: 'POST', body: formData });
  },

  // Analytics data
  getAnalytics: () => request('/analytics'),

  // Acknowledge a task as completed
  acknowledgeTask: (taskId) => request(`/acknowledge-task/${taskId}`),
};
