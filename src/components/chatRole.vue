<template>
    <div class="chatRole">
        <div class="roleItem roleAdd" @click="cfgStore.openAddRoleView()">
            <span class="iconfont icon-add-btn"></span>
        </div>

        <div :class="['roleItem', { 'roleItem-active': item.id === cfgStore.currentRole.id }]"
            v-for="item in cfgStore.roleList" @click="changeSession(item)">
            <div style="display: flex;align-items: center;">
                <span class="iconfont icon-message-comments"></span>
                <div>
                    {{ item.title }}
                </div>
            </div>
            <span class="iconfont icon-delete delete" @click.stop="deleteRole(item.id)"></span>

        </div>
    </div>
</template>
<script setup>
import { userStore, configStore } from '../stores/Store';
import { roleAdd, roleGet, roleRemove } from '../stores/LocalStore'
const cfgStore = configStore()



const changeSession = (item) => {
    cfgStore.changeCurrentRole(item)
}

const deleteRole = (id) => {
    roleRemove(id)
    cfgStore.loadRole()
}
</script>
<style scoped>
.delete {
    font-size: 14px;
    cursor: pointer;
    transition: all .3s;
}
.delete:hover {
    color: red;
    transform: scale(1.5);
}
.chatRole {
    height: calc(100vh - 200px);
    /* background: #ccc; */
    overflow-y: scroll;
}

.roleItem {
    display: flex;
    border: 1px solid #ced4da;
    padding: 10px 10px;
    align-items: center;
    color: #495057;
    border-radius: 5px;
    transition: all .3s;
    margin: 15px 0;
    justify-content: space-between;
}

.roleItem-active {
    color: #364fc7;
    border: 1px solid #364fc7;
}

.roleAdd {
    justify-content: center;
}

.roleItem:hover {
    cursor: pointer;
    border: 1px solid #364fc7;
    color: #364fc7;
}

.roleItem .iconfont {
    margin-right: 10px;
}
</style>