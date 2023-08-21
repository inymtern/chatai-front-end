<template>
    <div class="home">
        <div class="chatview" ref="chatview">
            <msg v-for="item in records" :record="item"></msg>
        </div>
        <div class="inputview">
            <input-view @clearRecords="clearRecords"></input-view>
        </div>
    </div>
</template>
<script setup>
import InputView from '../components/InputView.vue';
import Msg from '../components/Msg.vue';
import { ref, watch, getCurrentInstance, onMounted, nextTick } from 'vue'
import { configStore } from '../stores/Store';
import { addRecord, loadRecords } from '../stores/LocalStore';
import { withContext, withoutContext, streamChat } from '../js/gpt';
import { now } from '../js/utils';
const cfgStore = configStore()
const { proxy } = getCurrentInstance()

const records = ref([

])
const scrollBottom = () => {
    nextTick(() => {
        const height = proxy.$refs.chatview.scrollHeight
        if(proxy.$refs.chatview.scrollTop < height) {
            proxy.$refs.chatview.scrollTop = height;
        }
    })
}


onMounted(() => {
    records.value = loadRecords(cfgStore.currentRole.id)
    scrollBottom()
})







watch(() => {
    return cfgStore.currentRole
}, (nval) => {
    records.value = loadRecords(nval.id)
})

watch(() => {
    return cfgStore.sendStatus
}, (nval) => {
    if (nval) {
        const msg = cfgStore.currentUserMsg.text
        records.value.push(cfgStore.currentUserMsg)
        cfgStore.changeSendStatus(false, {})
        // 接受完成
        if (cfgStore.enableContext) {
            chat(withContext(records.value, cfgStore.currentRole.prompt), cfgStore.gptKey)
        } else {
            chat(withoutContext(msg, cfgStore.currentRole.prompt), cfgStore.gptKey)
        }
    }

})
const clearRecords = () => {
    records.value = []
}
const chat = (context, key) => {
    scrollBottom()
    const respData = {
        left: true,
        createTime: now(),
        headImg: cfgStore.gptConfig.headImg,
        username: cfgStore.gptConfig.username,
        text: ''
    }
    records.value.push(respData)
    streamChat(key, context, (item) => {
        cfgStore.setLoadingMsg(true)
        const msgArr = item.split('data: ')
        // console.log(msgArr);
        msgArr.forEach(e => {
            if (e) {
                if (e.indexOf('[DONE]') != -1) {
                    cfgStore.setLoadingMsg(false)
                    addRecord(cfgStore.currentRole.id, respData)
                    return
                } else {
                    const msg = JSON.parse(e)
                    if (msg) {
                        const sp = msg.choices[0].delta.content
                        if (sp) {
                            records.value[records.value.length - 1].text += sp
                            scrollBottom()
                            
                        }
                    }
                }
            }
        })

    })
}


</script>
<style scoped>
.chatview {
    height: calc(100vh - 200px);
    background: #fff;
    overflow-y: scroll;
    padding: 0 20px;
}

.inputview {
    height: 90px;

}
</style>