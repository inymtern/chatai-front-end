import { defineStore } from 'pinia'
import { get, roleAdd, roleGet, set, remove } from './LocalStore'
import { now } from '../js/utils'
import { userinfo } from '../js/api/chatApi'
import icopng from '@/assets/img/icopng.png'
import upng from '@/assets/img/u.png'
export const userStore = defineStore('user', {
    state: () => {
        return {
            isLogin: false,
            username: 'Guest',
            email: 'click to login... ',
            headImg: upng,
            token: ''
        }
    },

    getters: {
        getUserInfo() {
            return {
                username: this.username,
                email: this.email,
                headImg: this.headImg
            }
        },
        getIsLogin() {
            return this.isLogin
        },
       
        
    },

    actions: {
        login(username, email,headImg, token) {
            this.username = username
            this.email = email
            this.headImg = headImg
            this.isLogin = true
            set("Authorization", { token: "Bearer " + token })
        },
        loadUserInfo() {
            const tokenObj = get("Authorization")
            if (tokenObj) {
                userinfo().then(res => {
                    this.headImg = res.data.headImg
                    this.username = res.data.username
                    this.email = res.data.email
                    this.isLogin = true
                })
            }
        },
        logout() {
            this.isLogin = false
            this.username= 'Guest',
            this.email= 'click to login... ',
            this.headImg= upng
            remove("Authorization")
        }
    }
})


export const configStore = defineStore('config', {
    state: () => {
        return {
            showLogin: false,  // 展示登录弹窗
            showSetting: false, // 设置弹窗
            showAddRole: false, // 添加角色弹窗
            roleList: [], // 角色列表
            currentRole: {}, // 当前角色
            currentUserMsg: {}, // 当前对话
            sendStatus: false,
            gptKey: '',
            enableContext: false,
            loadingMsg: false,
            isSync: false,
            gptConfig: {
                username: 'ChatAI',
                headImg: icopng
            },
            pause: false,
            pause2: false
        }
    },

    getters: {
        getEditorMode() {
            return this.editorMode
        }
    },

    actions: {
        openLoginView() {
            this.showLogin = true
        },
        closeLoginView() {
            this.showLogin = false
        },
        openSettingView() {
            this.showSetting = true
        },
        closeSettingView() {
            this.showSetting = false
        },
        openAddRoleView() {
            this.showAddRole = true
        },
        closeAddRoleView() {
            this.showAddRole = false
        },
        addRole(item) {
            this.roleList.unshift(item)
        },
        loadRole() {
            this.roleList = roleGet()
            if (this.roleList.length > 0) {
                this.currentRole = this.roleList[0]
            } else {
                const newo = {
                    id: now(),
                    title: '_default',
                    prompt: '回答使用中文，尽量简洁，回答问题先给出答案'
                }
                roleAdd(newo)
                this.currentRole = newo
            }
        },
        changeCurrentRole(item) {
            this.currentRole = item
        },
        changeSendStatus(b, item) {
            this.currentUserMsg = item
            this.sendStatus = b
        },
        loadGptKey() {
            const key = get('chatai:gpt:key')
            this.gptKey = !key ? '' : key
        },
        setGptKey() {
            set('chatai:gpt:key', this.gptKey)
        },
        changeContextEnable() {
            this.enableContext = !this.enableContext
        },
        setLoadingMsg(b) {
            this.loadingMsg = b
        },
        setIsSync(b) {
            this.isSync = b
        },
        setPause(b) {
            this.pause = b
        },
        setPause2(b) {
            this.pause2 = b
        }
    }



})