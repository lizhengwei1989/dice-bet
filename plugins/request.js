import axios from "axios";
import { Message, MessageBox } from "element-ui";
import Cookies from "js-cookie";
import { state, actions, mutations } from "~/store";
const activity_url = process.env.ACTIVITY_URL;

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
  config => {
    let token = Cookies.get("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    // Do something with request error
    console.log("error1  ", error); // for debug
    Promise.reject(error);
  }
);

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    const code = parseInt(res.code);

    if (code === 20103) {
      let user = {
        name: "dappzy",
        password: "#$tron@123"
      };
      axios
        .post(`$.{activity_url}/api/common/account/login`)
        .then(response => {
          Cookies.set("token", response.token);
        })
        .catch(err => {
          console.log(err);
        });

      MessageBox.alert("token失效", "", {
        confirmButtonText: "ok",
        callback: action => {
          window.location.reload();
        }
      });

      return;
    }
    return res;
  },
  error => {
    console.log("error2  axios request err" + error); // for debug
    return Promise.reject(error);
  }
);

export default service;
