<template>
  <div class="my-nav">
    <div class="inner">
      <a  class="logo" href="javascript:window.location.reload();">
        <img :src="require('../assets/images/logo.png')">
      </a>
      <div class="nav">
        <!-- 幸运抽奖触发 -->
        <el-button  @click="drawDialog = true">{{$t('LuckyDraw.btn')}}</el-button>
        <!-- 幸运抽奖组件 -->
        <lucky-draw v-if="drawDialog" :visible.sync="drawDialog"></lucky-draw>
        <!-- vip等级 -->
        <el-button  @click="vipDialog.visible = true">{{$t('vip.button')}}</el-button>
        <vip v-if="vipDialog.visible" :vipDialog="vipDialog"></vip>
        <!-- 邀请 -->
        <el-button  @click="inviteDialog.visible = true">{{$t('invite.button')}}</el-button>
        <invite v-if="inviteDialog.visible" :inviteDialog="inviteDialog"></invite>
        
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
import { mapState } from "vuex";
import Vip from "./Vip";
import Invite from "./Invite";
/* 幸运抽奖 */
import LuckyDraw from "./LuckDraw.vue";
export default {
  name: "MyNav",
  props: ["languageGroup"],
  components: {
    LuckyDraw,
    Vip,
    Invite
  },
  data() {
    return {
      txt: "",
      icon: "",
      show: false,
      dialogHow: false,
      luckyList: [
        { area: "0-100", prize: 0.2 },
        { area: "101-999", prize: 2 },
        { area: "1000-4999", prize: 20 },
        { area: "5000-9999", prize: 200 },
        { area: "10000", prize: 1000 }
      ],
      vipDialog: {
        visible: false,
        data: {
          grade: 0,
          prize: 0
        }
      },
      inviteDialog: {
        visible: false,
        data: {
          prize: "",
          table: []
        }
      },
      drawDialog: false
    };
  },
  created() {
    this.languageGroup.forEach(v => {
      if (v.lng === this.locale) {
        this.txt = this.$t(v.txt);
      }
    });
  },
  watch: {
    address: {
      handler(n, o) {
        //window.location.reload()
      },
      deep: true
    }
  },
  mounted() {},
  computed: {
    ...mapState(["address", "locale", "dialogLogin"])
  },
  methods: {
    selectLanguage() {
      this.show = !this.show;
    },
    location(lng) {
      window.location = "/" + lng;
    }
  }
};
</script>

<style scoped lang="scss">
.my-nav {
  height: 0.7rem;
  background-color: #332c66;
  .inner {
    width: 12rem;
    height: 100%;
    margin: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .logo {
      display: flex;
      justify-content: flex-start;
      img {
        width: 1.76rem;
        height: 0.39rem;
      }
    }
    .nav {
      height: 100%;
      flex: 1;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      .account {
        margin-left: 0.3rem;
        letter-spacing: 0.01rem;
        font-size: 0.16rem;
        display: flex;
        align-items: center;
        color: #b3a6ff;
      }
      .language {
        position: relative;
        z-index: 10;
        height: 100%;
        margin-left: 0.3rem;
        padding-right: 20px;
        display: flex;
        align-items: center;
        cursor: pointer;
        color: #b3a6ff;
        transition: opacity 0.2s ease-in-out;
        &:hover {
          & > span {
            opacity: 0.5;
          }
          & > .group {
            display: block;
          }
        }
        &:after {
          content: "";
          position: absolute;
          top: 0.34rem;
          right: 0.05rem;
          width: 0;
          height: 0;
          border-top: 0.04rem solid #b3a6ff;
          border-bottom: 0.04rem solid transparent;
          border-left: 0.04rem solid transparent;
          border-right: 0.04rem solid transparent;
        }
        .group {
          display: none;
          position: absolute;
          right: 0;
          top: 100%;
          width: 1.2rem;
          background: rgba(53, 58, 62, 0.85);
          .item {
            height: 0.4rem;
            border-top: 0.01rem solid #4e4e4e;
            padding: 0 0.2rem;
            display: flex;
            align-items: center;
            cursor: pointer;
            &:first-child {
              border: none;
            }
            &:hover {
              background-color: #50555a;
            }
          }
        }
      }
    }
  }
}
</style>
