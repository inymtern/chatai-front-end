<template>
    <div class="tool">
        <div style="display: flex;align-items: center;">
            <img style="border-radius: 50%;" :src="store.getUserInfo.headImg" width="45" height="45">
            <div class="middle" @click="openLogin">
                <div class="username">{{ store.getUserInfo.username }}</div>
                <div class="email">{{ store.getUserInfo.email }}</div>
            </div>
        </div>

        <span @click="cfgStore.openSettingView()" class="setting iconfont icon-settings"></span>
    </div>
</template>
<script setup>
import { userStore, configStore } from '../stores/Store';
const store = userStore()
const cfgStore = configStore()

const openLogin = () => {
    if (!store.getIsLogin) {
        cfgStore.openLoginView()
    }
}
</script>
<style scoped>
.tool {
    border-top: 1px solid #e5e5e5;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 120px;
    /* background: #ccc; */
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
}

.middle {
    cursor: pointer;
    margin-left: 10px;
}

.username {
    font-size: 16px;
    font-weight: 600;
}

.email {
    font-size: 14px;
    color: #555;
}

.setting {
    transition: all .3s;

}

.setting:hover {
    cursor: pointer;
    transform: scale(1.1);
}</style>