import request from '~/plugins/request'

const url =  process.env.ACTIVITY_API

import {Message, MessageBox} from 'element-ui'

export function getVipInfo(param) {
    return new Promise(
      function (resolve, reject) {
        request({
          url: `${url}/api/common/user/queryUserVipInfo?userAddress=${param}`,
          method: 'get'
        }).then(response => {
            if(response.code === 0){
              resolve(response.data)
            }else{
              Message({
                type: 'warning',
                message:response.message
              })
            } 
        }).catch(err => {

          Message({
            type: 'warning',
            message:err.message
          })
          reject(err)
        })
      }
  
    )
  }

  export function getVipList() {
    return new Promise(
      function (resolve, reject) {
        request({
          url: `${url}/api/common/user/queryVipList`,
          method: 'get'
        }).then(response => {
            if(response.code === 0){
              resolve(response.data)
            }else{
              Message({
                type: 'warning',
                message:response.message
              })
            } 
        }).catch(err => {

          Message({
            type: 'warning',
            message:err.message
          })
          reject(err)
        })
      }
  
    )
  }
  

  export function getInviteList(params) {
    return new Promise(
      function (resolve, reject) {
        request({
          url: `${url}/api/common/user/queryInviteReturnList`,
          method: 'get',
          params:params
        }).then(response => {
            if(response.code === 0){
              resolve(response.data)
            }else{
              Message({
                type: 'warning',
                message:response.message
              })
            } 
        }).catch(err => {

          Message({
            type: 'warning',
            message:err.message
          })
          reject(err)
        })
      }
  
    )
  }