<template>
    <div class="inputview">

        <textarea placeholder="~请输入您的问题，shift+enter发送" v-model="cfgStore.currentUserMsg.text"
            @keydown="handleKeyDown"></textarea>
        <ico-btn ico="icon-close-bold" bg-color="#f06595" @click="clearChatRecords" title="清理聊天记录"></ico-btn>
        <ico-btn 
        ico="icon-message-comments" 
        :bg-color="cfgStore.enableContext ? '#4c6ef5' : '#ced4da'" 
        title="开启上下文"
        @click="cfgStore.changeContextEnable()"></ico-btn>
        <ico-btn ico="icon-send-fill" bg-color="#20c997" @click="send" title="发送"></ico-btn>
    </div>
</template>
<script setup>
import IcoBtn from '../components/IcoBtn.vue'
import { configStore, userStore } from '../stores/Store';
import { addRecord , clearRecords } from '../stores/LocalStore';
import { now } from '../js/utils';
import {defineEmits} from 'vue'

const emits = defineEmits(['clearRecords'])

const cfgStore = configStore()
const uStore = userStore()

const handleKeyDown = (event) => {
    if (event.shiftKey && event.keyCode === 13) {
        send()
        event.preventDefault();
    }
}
const clearChatRecords = () => {
    
    clearRecords(cfgStore.currentRole.id)
    emits('clearRecords', 1)
    
}

const send = () => {
    if(cfgStore.roleList.length == 0 && !cfgStore.currentRole.id) {
        window.toastr.error('请在左侧新建聊天角色')
        return
    }
    if(!cfgStore.gptKey) {
        window.toastr.error('请输入您的gptkey')
        return
    }
    console.log(cfgStore.currentUserMsg.text);
    const data = {
        id: Date.now(),
        text: cfgStore.currentUserMsg.text,
        headImg: uStore.getUserInfo.headImg,
        username: uStore.getUserInfo.username,
        createTime: now(),
        left: false
    }
    addRecord(cfgStore.currentRole.id, data)
    cfgStore.changeSendStatus(true, data)
}
</script>
<style scoped>
.inputview {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.inputview textarea {
    width: 950px;
    resize: none;
    outline: none;
    font-size: 18px;
    padding: 2px 5px;
    border-radius: 5px;
    border: 1px solid #12b886;
}

textarea::placeholder {
    font-size: 14px;
}
</style>