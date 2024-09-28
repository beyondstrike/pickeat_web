import axios from "axios";

const baseURL =
  "https://pickeat-asedfnc8hsfbevdj.italynorth-01.azurewebsites.net/";

const api = axios.create({
  baseURL,
});

export default api;
