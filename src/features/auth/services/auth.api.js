import axios from "axios";

const api = axios.create({
  baseURL: "https://interview-prep-backend-6eo5.onrender.com",
  withCredentials: true,
});

const getErrorMessage = (err) => {
  if (err.response) {
    return (
      err.response.data?.message || "Something went wrong. Please try again."
    );
  }
  return "Cannot reach the server. Please try again.";
};

export async function register({ username, email, password }) {
  try {
    const response = await api.post("/api/auth/register", {
      username,
      email,
      password,
    });

    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

export async function login({ email, password }) {
  try {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });

    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

export async function logout() {
  try {
    const response = await api.get("/api/auth/logout");

    return response.data;
  } catch (err) {}
}

export async function getMe() {
  try {
    const response = await api.get("/api/auth/get-me");

    return response.data;
  } catch (err) {
    console.log(err);
  }
}
