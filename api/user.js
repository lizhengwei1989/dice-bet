import request from "~/plugins/request";

const url = process.env.ACTIVITY_API;

import { Message, MessageBox } from "element-ui";

export function addInviteUser(params) {
  return new Promise(function(resolve, reject) {
    request({
      url: `${url}/auth/user/addUserInvite`,
      method: "post",
      data: params
    })
      .then(response => {
        if (response.code === 0) {
          resolve(response.data);
        } else {
          Message({
            type: "warning",
            message: response.message
          });
        }
      })
      .catch(err => {
        Message({
          type: "warning",
          message: err.message
        });

        reject(err);
      });
  });
}

export function addTransition(params) {
  return new Promise(function(resolve, reject) {
    request({
      url: `${url}/api/auth/trx/addTrx`,
      method: "post",
      data: params
    })
      .then(response => {
        if (response.code === 0) {
          resolve(response.data);
        } else {
          Message({ type: "warning", message: response.message });
        }
      })
      .catch(err => {
        Message({ type: "warning", message: err.message });

        reject(err);
      });
  });
}
