import axios from "axios";
// import axiosClient from "./axiosClient";

const contractApis = {
  createContractData: (payload) =>
    axios.post("http://localhost:3001/api/contract/new-contract", payload),
};

export default contractApis;




