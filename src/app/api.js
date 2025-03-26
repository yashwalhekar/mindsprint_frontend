// this is the common url file
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Change this based on your backend URL
});

export default API;
