import './assets/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
// import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import './assets/css/md.css'
import Prism from 'prismjs';
// 复制代码插件
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';

VueMarkdownEditor
.use(vuepressTheme, {
    Prism
})
.use(createCopyCodePlugin())


const app = createApp(App)

app.use(createPinia())
app.use(VueMarkdownEditor)
app.use(router)

app.mount('#app')
