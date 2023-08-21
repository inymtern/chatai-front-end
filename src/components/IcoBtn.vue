<template>
    <div class="icobtn" :style="{'color': color, 'background': bgColor}">
        <span :class="['iconfont', ico]"></span> <slot></slot>
    </div>
</template>
<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    ico: {
        default: 'icon-success'
    },
    color: {
        default: '#fff'
    },
    bgColor: {
        default: '#000'
    }
})
</script>
<style scoped>
    .icobtn {
        display: flex;
        align-items: center;
        transition: all .3s;
        padding: 5px 15px;
        border-radius: 5px;
        font-size: 14px;
    }
    .icobtn:hover {
        cursor: pointer;
        transform: scale(1.1);
    }
    .icobtn .iconfont {
        margin-right: 2px;
    }
</style>