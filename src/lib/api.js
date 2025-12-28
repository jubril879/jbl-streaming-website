const API_URL = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("authToken");

export const authAPI = {
  register: async (name, email, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem("authToken", data.token);
    }
    return data;
  },

  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem("authToken", data.token);
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem("authToken");
  },
};

export const moviesAPI = {
  getAll: async () => {
    try {
      // Try to fetch from API
      const response = await fetch(`${API_URL}/movies`);
      const data = await response.json();

      // The API returns {movies: [...], pagination: {...}}
      return data.movies || [];
    } catch (err) {
      // If API fails, return empty array
      console.error("Failed to fetch from API", err);
      return [];
    }
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/movies/${id}`);
    return await response.json();
  },

  create: async (movieData) => {
    const response = await fetch(`${API_URL}/movies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(movieData),
    });
    return await response.json();
  },

  update: async (id, movieData) => {
    const response = await fetch(`${API_URL}/movies/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(movieData),
    });
    return await response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/movies/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return await response.json();
  },
};

export const userAPI = {
  getProfile: async () => {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return await response.json();
  },

  updateProfile: async (profileData) => {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(profileData),
    });
    return await response.json();
  },

  getWatchHistory: async () => {
    const response = await fetch(`${API_URL}/users/watch-history`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return await response.json();
  },

  addToWatchHistory: async (movieId, movieTitle, movieImage) => {
    const response = await fetch(`${API_URL}/users/watch-history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ movieId, movieTitle, movieImage }),
    });
    return await response.json();
  },
};
