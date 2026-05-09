import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

const adminLogin = async ({ email, password }) => {

  try{
 const response = await axios.post("api/auth/login", { email, password });

  return response;
  }
 catch(err){
  console.log(err.message)
 }
};




export {adminLogin}