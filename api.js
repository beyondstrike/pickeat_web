import axios from "axios";

const baseURL =
  "https://pickeat-asedfnc8hsfbevdj.italynorth-01.azurewebsites.net/";

// const baseURL = "http://192.168.68.107:8080/";

const api = axios.create({
  baseURL,
});

export default api;
