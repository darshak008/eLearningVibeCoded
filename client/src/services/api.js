import axios from 'axios';

const API_BASE_URL = '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, { withCredentials: true });
        if (res.data.accessToken) {
          localStorage.setItem('accessToken', res.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return api(originalRequest);
        }
      } catch {
        localStorage.removeItem('accessToken');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  resendVerification: () => api.post('/auth/resend-verification'),
  sendOTP: () => api.post('/auth/send-otp'),
  verifyOTP: (otp) => api.post('/auth/verify-otp', { otp }),
  changePassword: (data) => api.put('/auth/change-password', data),
};

export const courseAPI = {
  getAll: (params) => api.get('/courses', { params }),
  getFeatured: () => api.get('/courses/featured'),
  getBySlug: (slug) => api.get(`/courses/${slug}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  getMy: () => api.get('/courses/my-courses'),
  uploadThumbnail: (id, formData) => api.post(`/courses/${id}/thumbnail`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getCategories: () => api.get('/courses/categories'),
};

export const moduleAPI = {
  getByCourse: (courseId) => api.get(`/courses/${courseId}/modules`),
  create: (courseId, data) => api.post(`/courses/${courseId}/modules`, data),
  update: (id, data) => api.put(`/courses/${id}/modules`, data),
  delete: (courseId, id) => api.delete(`/courses/${courseId}/modules/${id}`),
  reorder: (courseId, moduleOrder) => api.put(`/courses/${courseId}/modules/reorder`, { moduleOrder }),
};

export const lessonAPI = {
  getByModule: (moduleId) => api.get(`/modules/${moduleId}/lessons`),
  get: (id) => api.get(`/modules/${id}/lessons`),
  create: (moduleId, data) => api.post(`/modules/${moduleId}/lessons`, data),
  update: (id, data) => api.put(`/modules/${id}/lessons`, data),
  delete: (moduleId, id) => api.delete(`/modules/${moduleId}/lessons/${id}`),
  uploadVideo: (id, formData) => api.post(`/modules/${id}/lessons/${id}/video`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const enrollmentAPI = {
  enroll: (courseId) => api.post(`/enrollments/${courseId}`),
  getMy: () => api.get('/enrollments/my'),
  get: (id) => api.get(`/enrollments/${id}`),
  updateProgress: (id, data) => api.put(`/enrollments/${id}/progress`, data),
};

export const reviewAPI = {
  getByCourse: (courseId, params) => api.get(`/courses/${courseId}/reviews`, { params }),
  create: (courseId, data) => api.post(`/courses/${courseId}/reviews`, data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
  toggleLike: (id) => api.post(`/reviews/${id}/like`),
  reply: (id, data) => api.post(`/reviews/${id}/reply`, data),
};

export const paymentAPI = {
  createCheckout: (data) => api.post('/payments/create-checkout', data),
  getHistory: () => api.get('/payments/history'),
  getEarnings: () => api.get('/payments/earnings'),
};

export const quizAPI = {
  getByLesson: (courseId, lessonId) => api.get(`/courses/${courseId}/quizzes/lesson/${lessonId}`),
  get: (courseId, quizId) => api.get(`/courses/${courseId}/quizzes/${quizId}`),
  create: (courseId, data) => api.post(`/courses/${courseId}/quizzes`, data),
  submitAttempt: (courseId, quizId, data) => api.post(`/courses/${courseId}/quizzes/${quizId}/attempt`, data),
  getAttempts: (courseId, quizId) => api.get(`/courses/${courseId}/quizzes/${quizId}/attempts`),
};

export const certificateAPI = {
  getMy: () => api.get('/certificates/my'),
  generate: (enrollmentId) => api.post(`/certificates/${enrollmentId}`),
  verify: (id) => api.get(`/certificates/verify/${id}`),
};

export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

export const messageAPI = {
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (userId) => api.get(`/messages/${userId}`),
  send: (data) => api.post('/messages', data),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getCourses: (params) => api.get('/admin/courses', { params }),
  getPayments: (params) => api.get('/admin/payments', { params }),
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  getReports: (params) => api.get('/admin/reports', { params }),
};

export default api;
