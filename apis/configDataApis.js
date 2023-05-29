const { default: axios } = require("axios");

const configDataApis = {
  getListPagingConfigData: (params) =>
    axios.get("http://0.0.0.0:3001/api/master/", { params }),
  createConfigData: (payload) =>
    axios.post("http://0.0.0.0:3001/api/master/new-master", payload),
  getAllConfigData: (params) =>
    axios.get("http://0.0.0.0:3001/api/master/get-master", { params }),
  updateConfigData: (payload) =>
    axios.put("http://0.0.0.0:3001/api/master/update-master", payload),
};

export default configDataApis;
