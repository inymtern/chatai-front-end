
import axios from "../request";
import { userStore } from '../../stores/Store'
const store = userStore()
export function uploadImg(file) {
    if(!store.isLogin) {
        window.toastr.error('请登录后重试')
        return 
    }
    return axios.post('/obs/images/upload', file, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}