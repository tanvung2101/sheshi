import axios from "axios";
// import axiosClient from "./axiosClient";
const categoryApis = {
  getAllCategory: () =>
    axios.get("http://0.0.0.0:3001/api/product/get-list-category"),
};
export default categoryApis;
