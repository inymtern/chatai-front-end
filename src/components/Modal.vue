<template>
    <div class="modal" @click.prevent="close">
        <div class="mainmodal" @click.stop>
            <span class="close iconfont icon-close-bold" @click.stop="close"></span>
            <slot />
        </div>
    </div>
</template>
<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({

})
const emit = defineEmits([
    'closeModal'
])
const close = () => {
    emit('closeModal', {})
}




</script>
<style scoped>
.modal {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background-color: #55555580;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
}

.mainmodal {
    min-width: 500px;
    background: #fff;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 30px 20px;
    position: relative;
}

.close {
    position: absolute;
    right: 20px;
    top: 20px;
}

.close:hover {
    cursor: pointer;

}</style>