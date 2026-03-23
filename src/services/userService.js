import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/users';

// 🔑 Helper function to get auth headers
const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  // 🚨 If token missing, log it (debug)
  if (!token) {
    console.error("❌ No token found in localStorage");
  } else {
    console.log("✅ Token found:", token);
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

const userService = {

  // =========================
  // GET ALL USERS
  // =========================
  getAllUsers: () => {
    return axios.get(API_BASE_URL, getAuthHeader());
  },

  // =========================
  // GET USERS BY ROLE
  // =========================
  getUsersByRole: (role) => {
    return axios.get(
      `${API_BASE_URL}?role=${role.toUpperCase()}`,
      getAuthHeader()
    );
  },

  // =========================
  // GET USERS BY ROLE + SCHOOL
  // =========================
  getUsersByRoleAndSchool: (role, school) => {
    return axios.get(
      `${API_BASE_URL}?role=${role.toUpperCase()}&school=${school}`,
      getAuthHeader()
    );
  },

  // =========================
  // SEARCH USERS
  // =========================
  searchUsers: (role, searchTerm) => {
    return axios.get(
      `${API_BASE_URL}?role=${role.toUpperCase()}&search=${searchTerm}`,
      getAuthHeader()
    );
  },

  // =========================
  // GET ALL SCHOOLS
  // =========================
  getAllSchools: () => {
    return axios.get(`${API_BASE_URL}/schools`, getAuthHeader());
  },

  // =========================
  // GET USER BY ID
  // =========================
  getUserById: (id) => {
    return axios.get(`${API_BASE_URL}/${id}`, getAuthHeader());
  },

  // =========================
  // CREATE USER
  // =========================
  createUser: (userData) => {
    return axios.post(API_BASE_URL, userData, getAuthHeader());
  },

  // =========================
  // UPDATE USER
  // =========================
  updateUser: (id, userData) => {
    return axios.put(`${API_BASE_URL}/${id}`, userData, getAuthHeader());
  },

  // =========================
  // DELETE USER
  // =========================
  deleteUser: (id) => {
    return axios.delete(`${API_BASE_URL}/${id}`, getAuthHeader());
  },

  // =========================
  // RESET PASSWORD
  // =========================
  resetPassword: (id, newPassword) => {
    return axios.post(
      `${API_BASE_URL}/${id}/reset-password`,
      { newPassword },
      getAuthHeader()
    );
  }
};

export default userService;