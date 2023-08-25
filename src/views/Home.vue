<template>
    <div class="home">
        <div class="chatview" ref="chatview" id="chatview">
            <msg :id="'msg-' + item.id" v-for="item in records" @sync="syncToAF" :record="item"></msg>
        </div>
        <div class="inputview">
            <input-view @clearRecords="clearRecords"></input-view>
        </div>
        <div class="pause" v-if="cfgStore.loadingMsg" @click="pausePrint"> <span class="iconfont icon-close-bold"></span> <span>停止</span></div>
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
import { uploadImg } from '../js/api/commonApi'
const cfgStore = configStore()
const { proxy } = getCurrentInstance()

const records = ref([

])
const scrollBottom = () => {
    nextTick(() => {
        const height = proxy.$refs.chatview.scrollHeight
        if (proxy.$refs.chatview.scrollTop < height) {
            proxy.$refs.chatview.scrollTop = height;
        }
    })
}
const pausePrint = () => {
    console.log("pause..");
    cfgStore.setPause(true)
}


onMounted(() => {
    records.value = loadRecords(cfgStore.currentRole.id)
    scrollBottom()
})

const syncToAF = (id) => {
    cfgStore.setIsSync(true)
    let last = ''
    let cur = ''
    console.log(records.value);
    for (let i = 0; i < records.value.length; i++) {
        if (records.value[i].id == id) {
            cur = records.value[i]
            break
        } else {
            last = records.value[i]
        }
    }


    console.log(last);
    console.log(cur);

    const home = document.getElementById("chatview")
    const d1 = document.getElementById("msg-" + last.id)
    const d2 = document.getElementById("msg-" + cur.id)

    var d10 = d1.cloneNode(true);
    var d20 = d2.cloneNode(true);

    var parentDiv = document.createElement('div');
    parentDiv.classList.add('htmlimg');
    parentDiv.appendChild(d10);
    parentDiv.appendChild(d20);
    home.appendChild(parentDiv);
    // window.domtoimage.toPng(parentDiv)
    //     .then(function (dataUrl) {
    //         var img = new Image();
    //         img.src = dataUrl;
    //         img.classList.add('htmlimg');
    //         document.body.appendChild(img);
    //     })
    //     .catch(function (error) {
    //         console.error('oops, something went wrong!', error);
    //     });
    // home.appendChild(parentDiv);
    window.domtoimage.toBlob(parentDiv)
        .then(function (blob) {
            // console.log(blob);
            const file = blobToFile(blob, Date.now() + ".png")
            home.removeChild(parentDiv)
            
            var formData = new FormData();
            formData.append('file', file);
            uploadImg(formData).then(res => {
                console.log(res.data);
                cfgStore.setIsSync(false)
            }).catch(err => {

            })

            // window.saveAs(blob, 'my-node.png');
        });

}

const blobToFile = (blob, fileName) => {
    const file = new File([blob], fileName);
    return file;
}


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
        id: Date.now() + 5,
        left: true,
        createTime: now(),
        headImg: cfgStore.gptConfig.headImg,
        username: cfgStore.gptConfig.username,
        text: ''
    }
    records.value.push(respData)
    streamChat(key, context, (item) => {
        cfgStore.setLoadingMsg(true)
        if(cfgStore.pause) {
            records.value[records.value.length - 1].text += ' 【STOP】'
            addRecord(cfgStore.currentRole.id, respData)
            cfgStore.setPause2(true)
            return
        }
        const msgArr = item.split('data: ')
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
    position: relative;
}

.inputview {
    height: 90px;

}
.pause {
    position: absolute;
    bottom: 100px;
    left: 50%;
    /* background: #000; */
    border-radius: 5px;
    padding: 10px;
    font-size: 12px;
    color: #fff;
    background: #ff6b6b;
    display: flex;
    align-items: center;
}
.pause .iconfont {
    font-size: 18px;
}
.pause:hover {
    cursor: pointer;
    background: #ff6b6b90;
}
</style>