
import axios from "../request";


export function uploadImg(file) {
    return axios.post('/blog/api/v1/common/uploadImg', file, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}