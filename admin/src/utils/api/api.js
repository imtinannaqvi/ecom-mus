import Api from "../../api/api";

// Calls the backend admin-login endpoint and returns the response body
// ({ success, token, admin } on success).
const adminLogin = async (credentials) => {
  const response = await Api.post("/admin/login", credentials);
  return response.data;
};

export { adminLogin };
