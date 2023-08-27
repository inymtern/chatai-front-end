
import axios from "../request";



export function getLoginParams(state) {
    return axios.get('/chatai/oauth2/params?state=' + state)
}

export function fetchAccessToken(code) {
    return axios.get('/chatai/oauth2/access-token?code=' + code)
}

export function userinfo() {
    return axios.get('/chatai/oauth2/userinfo')
}

export function syncBlog(data) {
    return axios.post('/chatai/oauth2/resource/syncBlog', data)
}