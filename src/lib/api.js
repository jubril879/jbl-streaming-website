const API_URL = import.meta.env.VITE_API_URL || "https://jbl-streaming-website.vercel.app/api";

const getToken = () => null;

export const authAPI = {
  register: async (name, email, password) => {
    console.log("authAPI.register called for:", email);
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    console.log("authAPI.register response:", data);
    if (data.token) {
      // Removed localStorage set for authToken
    }
    return data;
  },

  login: async (email, password) => {
    console.log("authAPI.login called for:", email);
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    console.log("authAPI.login response:", data);
    if (data.token) {
      // Removed localStorage set for authToken
    }
    return data;
  },

  logout: () => {
    console.log("authAPI.logout called");
    // Removed localStorage removal for authToken
  },
};

export const moviesAPI = {
  getAll: async () => {
    try {
      const url = `${API_URL}/movies?t=${Date.now()}`;
      console.log(`moviesAPI.getAll fetching from: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`moviesAPI.getAll Error (${response.status}):`, errorText);
        return [];
      }

      const data = await response.json();
      console.log("moviesAPI.getAll fetched count:", Array.isArray(data) ? data.length : (data.movies ? data.movies.length : "unknown"));

      if (Array.isArray(data)) {
        return data;
      }

      if (data.movies && Array.isArray(data.movies)) {
        return data.movies;
      }

      return [];
    } catch (err) {
      console.error("moviesAPI.getAll Exception:", err);
      return [];
    }
  },

  getById: async (id) => {
    console.log("moviesAPI.getById called for ID:", id);
    const response = await fetch(`${API_URL}/movies/${id}`);
    const data = await response.json();
    console.log("moviesAPI.getById response:", data);
    return data;
  },

  create: async (movieData, token) => {
    console.log("moviesAPI.create called with:", movieData);
    const response = await fetch(`${API_URL}/movies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(movieData),
    });
    const data = await response.json();
    console.log("moviesAPI.create response status:", response.status, data);
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to create movie");
    }
    
    return data.movie || data;
  },

  update: async (id, movieData, token) => {
    console.log(`moviesAPI.update called for ID: ${id} with:`, movieData);
    const response = await fetch(`${API_URL}/movies/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(movieData),
    });
    const data = await response.json();
    console.log("moviesAPI.update response:", data);
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to update movie");
    }
    
    return data.movie || data;
  },

  delete: async (id, token) => {
    console.log("moviesAPI.delete called for ID:", id);
    const response = await fetch(`${API_URL}/movies/${id}`, {
      method: "DELETE",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await response.json();
    console.log("moviesAPI.delete response:", data);
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete movie");
    }
    
    return data;
  },
};

export const userAPI = {
  getProfile: async () => {
    console.log("userAPI.getProfile called");
    const response = await fetch(`${API_URL}/users/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const data = await response.json();
    console.log("userAPI.getProfile response:", data);
    return data;
  },

  updateProfile: async (profileData) => {
    console.log("userAPI.updateProfile called with:", profileData);
    const response = await fetch(`${API_URL}/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(profileData),
    });
    const data = await response.json();
    console.log("userAPI.updateProfile response:", data);
    return data;
  },

  getWatchHistory: async () => {
    console.log("userAPI.getWatchHistory called");
    const response = await fetch(`${API_URL}/users/watch-history`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const data = await response.json();
    console.log("userAPI.getWatchHistory response:", data);
    return data;
  },

  addToWatchHistory: async (movieId, movieTitle, movieImage) => {
    console.log(`userAPI.addToWatchHistory called for: ${movieTitle} (${movieId})`);
    const response = await fetch(`${API_URL}/users/watch-history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ movieId, movieTitle, movieImage }),
    });
    const data = await response.json();
    console.log("userAPI.addToWatchHistory response:", data);
    return data;
  },
};
