// src/services/api.js
export const API_URL = "https://localhost:7234/api";

export const authenticateUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/Authentication/Authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Email: email, Password: password }),
    });

    if (!response.ok) {
      throw new Error("Error de autenticación");
    }

    const data = await response.json();
    return { token: data.token };
  } catch (error) {
    console.error("Fallo en authenticateUser:", error);
    throw error;
  }
};
