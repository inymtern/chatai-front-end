<template>
    <div :class="['msgbox', {'right_01': !record.left}]"  >


        <img class="headimg" v-if="record.left" :src="record.headImg" width="45" height="45">
        <div :class="['rightbox', {'left_03': record.left}, {'right_03':!record.left}]">
            <span :class="['time', {'right_02': !record.left}]">{{record.createTime}}</span>
            <div :class="['msg', {'wrap': !record.left}]"> 
                <v-md-editor v-if="record.left" v-model="record.text" mode="preview"  @copy-code-success="handleCopyCodeSuccess"/>
                {{ record.left ? '' : record.text }}    
            </div>
        </div>
        <img class="headimg" v-if="!record.left" :src="record.headImg" width="45" height="45">

        <span v-if="record.left && store.getIsLogin" title="同步至AfterLife"  class="select iconfont icon-send-fill"></span>
    </div>
    
</template>
<script setup>
import { ref, defineProps } from 'vue'
import { userStore } from '../stores/Store';
const store = userStore()

const props = defineProps({
    record: {
        default: {
            left: false,
            headImg: '',
            username: '',
            createTime: '',
            text: ''
        } 
    }
})

const handleCopyCodeSuccess = () => {
    window.toastr.success('copied!')
}



</script>

<style scoped>
.headimg {
    border-radius: 5px;

}
.select {
    margin: 5px;
    transition: all .3s;
}
.select:hover {
    transform: scale(1.1);
    cursor: pointer;
}
.msgbox {
    display: flex;
    margin-bottom: 30px;
    position: relative;
}
.right_01 {
    justify-content: flex-end;
}
.time {
    font-size: 12px;
    color: #777;
    /* align-self: flex-end; */
}
.right_02 {
    align-self: flex-end;
}
.msg {
    margin-top: 10px;
    padding: 5px;
    border-radius: 5px;
    max-width: 800px;
    word-break: break-all;
    background: #f1f3f5;
    padding: 15px;
}

.wrap {
    white-space: pre-wrap;
    line-height: 1.5;
}
.rightbox {
    display: flex;
    flex-direction: column;
    /* margin-right: 10px; */
}

.left_03 {
    margin-left: 10px;
}
.right_03 {
    margin-right: 10px;
}
</style>