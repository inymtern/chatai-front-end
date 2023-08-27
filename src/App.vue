<template>
  <div class="header">C H A T A I</div>
  <div class="body">
    <div class="left">
      <chat-role></chat-role>
      <user-tool></user-tool>
    </div>
    <div class="right">
      <div class="main">
        <router-view></router-view>
      </div>
    </div>
  </div>


  <transition name="fade" appear>
    <Modal v-if="cfgStore.showLogin" @close-modal="closeModal">
      <template #default>
        <div class="loginbtn" @click="oauth2Login"> <span class="iconfont icon-atm"></span> <span>AfterLife 授权登录</span></div>
      </template>
    </Modal>
  </transition>


  <transition name="fade" appear>
    <Modal v-if="cfgStore.showSetting" @close-modal="closeSettingModal">
      <template #default>
        <input class="inputt" type="text" v-model="cfgStore.gptKey" @keydown.enter="saveGptKey" placeholder="input api key ">
        <button v-if="store.isLogin" class="buttonn" @click="quit">退出登录</button>
      </template>
    </Modal>
  </transition>


  <transition name="fade" appear>
    <Modal v-if="cfgStore.showAddRole" @close-modal="cfgStore.closeAddRoleView()">
      <template #default>
        <input class="inputt" type="text" v-model="roleData.title" placeholder="role name">
        <input class="inputt" type="text" v-model="roleData.prompt" placeholder="prompt">
        <button class="buttonn" @click="addRole">确认</button>
      </template>
    </Modal>
  </transition>



</template>
<script setup>
import {ref, watch} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UserTool from './components/UserTool.vue'
import ChatRole from './components/chatRole.vue'
import Modal from './components/Modal.vue'
import { userStore, configStore } from './stores/Store';
import { loadRecords, roleAdd } from './stores/LocalStore'
import { getLoginParams, fetchAccessToken } from './js/api/chatApi'
import { env } from './js/env'
const store = userStore()
const cfgStore = configStore()
const route = useRoute()
const router = useRouter()
// console.log(window.toastr);

const roleData = ref({
  title: '_default',
  prompt: '',
  id: ''
})

watch(()=> {
  return route.query
}, (nval) => {
  oauth2RedirectHandler()
})


const addRole = () => {
  if(!roleData.value.title) {
    roleData.value.title = "_default"
  } 
  roleData.value.id = Date.now()
  roleAdd(roleData.value)
  cfgStore.addRole(roleData.value)
  cfgStore.changeCurrentRole(roleData.value)
  cfgStore.closeAddRoleView()

  // roleData.value.title = "_default"
  roleData.value.prompt = ""
}

const oauth2Login = () => {
  getLoginParams("state").then(res => {
    window.location.href = env.oauthLoginAddr + res.data + "&nonce=" + Date.now()
  })
}



const closeModal = () => {
  cfgStore.closeLoginView()
}

const closeSettingModal = () => {
  cfgStore.closeSettingView()
}


const saveGptKey = () => {
  cfgStore.setGptKey()
  cfgStore.closeSettingView()
}

const quit = () => {
  store.logout()
  cfgStore.closeSettingView()
  window.toastr.success('登出成功')
}

// ------------------------------------- OAuth2 login

const oauth2RedirectHandler = () => {
  const code = route.query.code
  if(!code) return
  fetchAccessToken(code).then(res => {
    const userinfo = res.data.userinfo
    store.login(userinfo.username, userinfo.email, userinfo.headImg, res.data.token)
    router.push("/")
    window.toastr.success('登录成功')
  }).catch(err => {
    console.log("授权出现错误");
    router.push("/")
  })

}



// ---- 初始化
const init = () => {
  cfgStore.loadRole()
  cfgStore.loadGptKey() 
  store.loadUserInfo()
}

init()

</script>
<style scoped>
.header {
  height: 60px;
  line-height: 60px;
  text-align: center;
  box-shadow: 0px 1px 5px #333;
  min-width: 1480px;
}

.body {
  display: flex;
  height: calc(100vh - 60px);
}

.left {
  width: 280px;
  height: calc(100vh - 60px);
  padding: 10px;
  border-right: 1px solid #e9ecef;
  position: relative;

}



.right {
  max-width: calc(100vw - 280px);
  margin: 0 auto;
}

.main {
  width: 1200px;
  height: calc(100vh - 60px);
  padding: 30px 20px;
}
.loginbtn {
  font-size: 14px;
  display: flex;
  align-items: center;
  background: #fff;
  color: #000;
  padding: 5px 10px;
  border-radius: 5px;
  transition: all .3s;
  border: 1px solid #000;
}

.loginbtn:hover {
  cursor: pointer;
  background: #000;
  color: #fff;
}
</style>