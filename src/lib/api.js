const API_URL = import.meta.env.VITE_API_URL || "https://jbl-streaming-website.vercel.app/api";

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
      const url = `${API_URL}/movies?t=${Date.now()}`;
      console.log(`Fetching movies from: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}):`, errorText);
        return [];
      }

      const data = await response.json();
      console.log("Fetched movies data:", data);

      if (Array.isArray(data)) {
        return data;
      }

      if (data.movies && Array.isArray(data.movies)) {
        return data.movies;
      }

      return [];
    } catch (err) {
      console.error("Failed to fetch from API. Is the backend running at http://localhost:5000?", err);
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
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to create movie");
    }
    
    return data.movie || data;
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
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to update movie");
    }
    
    return data.movie || data;
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/movies/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete movie");
    }
    
    return data;
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
