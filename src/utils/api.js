import axios from "axios";

const api = axios.create({
  baseURL: "https://exhibition-curation-api.onrender.com",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const postUser = async (info) => {
  const { data } = await api.post("/users", info);
  return data;
};

export const signInUser = async (info) => {
  const { data } = await api.post("/users/signIn", info);
  if (data?.session && data?.user) {
    localStorage.setItem("token", data.session.access_token);
    localStorage.setItem("userId", data.user.id);
  }
  return data;
};

export const signOutUser = async () => {
  const { data } = await api.post("/users/signOut");
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  return data;
};

export const postCollection = async (title) => {
  const userId = localStorage.getItem("userId");
  if (!userId) throw new Error("User id not found. Please sign in.");
  const { data } = await api.post("/collections", { title, userId });
  return data;
};

export const getCollections = async () => {
  const { data } = await api.get("/collections");
  return data;
};

export const patchCollection = async (info) => {
  const { data } = await api.patch("/collections", info);
  return data;
};

export const deleteCollection = async (info) => {
  const { data } = await api.delete("/collections", { data: info });
  return data;
};

export const getArt = async (collectionId) => {
  const { data } = await api.get(`/art/${collectionId}`);
  return data;
};

export const addArt = async (info) => {
  const { data } = await api.post("/art", info);
  return data;
};

export const deleteArt = async (info) => {
  const { data } = await api.delete("/art", { data: info });
  return data;
};
