<template>
  <div class="my-nav">
    <div class="inner">
      <a  class="logo" href="javascript:window.location.reload();">
        <img :src="require('../assets/images/logo.png')">
      </a>
      <div class="nav">
        <el-button class="how" @click="dialogHow = true">{{$t('HowToPlay')}}</el-button>
        <el-dialog
                :title="$t('HowToPlay')"
                :visible.sync="dialogHow"
                width="5.8rem"
                custom-class="how-dialog">
          <p v-html="$t('Rule.P1')"></p>
          <p v-html="$t('Rule.P2')"></p>
          <p v-html="$t('Rule.P3')"></p>
          <p v-html="$t('Rule.P4')"></p>
          <p v-html="$t('Rule.P5')"></p>
          <p v-html="$t('Rule.P6')"></p>
          <p v-html="$t('Rule.P7')"></p>
          <p v-html="$t('Rule.RuleTip')"></p>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogHow = false">{{$t('Confirm')}}</el-button>
          </span>
        </el-dialog>
        <div v-if="address && address.base58" class="account">
          {{address.base58}}
        </div>
        <el-button v-else class="how" style="margin-left:.3rem" @click="$store.commit('SET_DIALOG_LOGIN',true)">
          {{$t('Login')}}
        </el-button>
        <el-dialog
                :title="$t('LoginTipTitle')"
                :visible.sync="dialogLogin"
                width="3.8rem"
                custom-class="how-dialog">
          <p v-html="$t('LoginTipContent')"></p>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="$store.commit('SET_DIALOG_LOGIN',false)">{{$t('Confirm')}}</el-button>
          </span>
        </el-dialog>
        <div class="language" @click="selectLanguage">
          <span>{{txt}}</span>
          <div class="group">
            <div v-for="item of languageGroup" class="item" @click="location(item.lng)">
              <span>{{$t(item.txt)}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import {mapState} from 'vuex';
    export default {
      name: "MyNav",
      props:["languageGroup"],
      data(){
        return {
          txt: "",
          icon: "",
          show:false,
          dialogHow:false,
          luckyList:[{area:'0-100',prize:0.2},{area:'101-999',prize:2},{area:'1000-4999',prize:20},{area:'5000-9999',prize:200},{area:'10000',prize:1000}]
        }
      },
      created(){
        this.languageGroup.forEach(v=>{
          if(v.lng === this.locale){
            this.txt = this.$t(v.txt);
          }
        })
      },
      watch:{
        address:{
            handler(n,o){
              //window.location.reload()
            },
            deep:true
        }

      },
      mounted(){},
      computed:{
          ...mapState(['address','locale','dialogLogin'])
      },
      methods:{
        selectLanguage(){
          this.show = !this.show;
        },
        location(lng){
          window.location = '/'+lng;
        }
      }

    }
</script>

<style scoped lang="scss">
  .my-nav{
    height:.7rem;
    background-color: #332C66;
    .inner{
      width: 12rem;
      height: 100%;
      margin: auto;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      .logo{
        display: flex;
        justify-content: flex-start;
        img{
          width: 1.76rem;
          height: .39rem;
        }
      }
      .nav{
        height: 100%;
        flex:1;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        .account{
          margin-left:.3rem;
          letter-spacing: .01rem;
          font-size: .16rem;
          display: flex;
          align-items: center;
          color: #B3A6FF;
        }
        .language{
          position: relative;
          z-index:10;
          height: 100%;
          margin-left:.3rem;
          padding-right:20px;
          display: flex;
          align-items: center;
          cursor: pointer;
          color: #B3A6FF;
          transition:opacity .2s ease-in-out;
          &:hover{
            &>span{
              opacity: .5;
            }
            &>.group{
              display: block;
            }
          }
          &:after{
            content:"";
            position: absolute;
            top:.34rem;
            right:.05rem;
            width: 0;
            height: 0;
            border-top:.04rem solid #B3A6FF;
            border-bottom:.04rem solid transparent;
            border-left:.04rem solid transparent;
            border-right:.04rem solid transparent;
          }
          .group{
            display: none;
            position: absolute;
            right: 0;
            top:100%;
            width:1.2rem;
            background: rgba(53,58,62,0.85);
            .item{
              height: .4rem;
              border-top:.01rem solid #4e4e4e;
              padding:0 .20rem;
              display: flex;
              align-items: center;
              cursor: pointer;
              &:first-child{
                border:none;
              }
              &:hover{
                background-color: #50555A;
              }
            }
          }
        }
      }
    }
  }
  @media screen and (max-width:1280px){
    .my-nav{
      .inner{
        width: 100%;
        overflow: hidden;
      }
    }
  }

</style>
