import { axiosInstance } from "../Axios/axiosInstance";

export const getVaultData = () => {
  let data = new FormData();
  data.append("cred_path", process.env.REACT_APP_VAULT_SECRET_PATH);

  let config = {
    method: "post",
    url: "/api/fetch_ui_data/",
    data: data,
  };

  axiosInstance.request(config).then((response) => {
    sessionStorage.setItem("encryptedData", response.data.data);
  });
};
