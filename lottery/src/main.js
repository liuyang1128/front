import Vue from 'vue';
import App from './App';
import router from './router';
import iView from 'iview';
import 'babel-polyfill';//兼容ie11
import "es6-promise";//兼容ie11
import axios from 'axios';
import $ from 'jquery';
import 'iview/dist/styles/iview.css';
// import 'vbl.css';
import './assets/css/style.css';
import './assets/less/ui.less';
import qs from 'qs';
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css';
import common from "./assets/js/common.js";
import crumbs from "./components/common/crumbs.vue"
import loading from "./components/common/loading.vue"
import authSectionWrap from "./components/common/authSectionWrap.vue"
import authSection from "./components/common/authSection.vue"
import md5 from 'blueimp-md5'
// import vblIcon from 'vbl-icon';
Vue.use(iView);
// Vue.use(vblIcon);

Vue.component('crumbs',crumbs);//面包屑导航
Vue.component('loading',loading);//loading
Vue.component('authSectionWrap',authSectionWrap);//权限
Vue.component('authSection',authSection);//权限

Vue.config.productionTip = false;

axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.transformRequest = [function(data) {
    return qs.stringify(data);
}];
function getKey(obj,objkey,arr) {
    for (var key in obj) {
        if(obj[key] === null) {
            var now = (objkey?objkey+'['+key+']':key) + '='
            arr.push(now);
        }
        if(typeof obj[key] !== "object"){
            var now = (objkey?objkey+'['+key+']':key) + '='+obj[key]
            if(typeof obj[key] !== "undefined") {
                arr.push(now);
            }
        }else {
            var nown = objkey?objkey+'['+key+']':key
            getKey(obj[key],nown,arr);
        }
    }
}
//添加一个请求拦截器
axios.interceptors.request.use(function (config) {
    if(config.headers['Content-Type'] === 'multipart/form-data') {
        config.headers.yixin = md5("");
        return config;
    }
    if(config.method === 'get') {
        let url = config.url;
        let index = url.indexOf('?');
        let yixin = md5(url.substring(index+1).split('&').sort().join(''));
        config.headers.yixin = yixin;
        return config;
    }else {
        let arr = [];
        getKey(config.data,'',arr)
        let str = arr.sort().join('')
        let yixin = md5(str)
        config.headers.yixin = yixin;
        return config;
    }
}, function (err) {
    return Promise.reject(error);
});

Vue.prototype.$http = axios;
Vue.prototype.$viewer = Viewer;
Vue.prototype.$common = common;

Vue.mixin({
    methods: {
        attDownload(url,fileId,name) {//下载附件方法
            var doc = document;
            //使用一个隐藏的form表单执行提交，没有则创建
            let formId = '_attdownloadForm';
            var downloadForm = doc.getElementById(formId);
            if(!downloadForm){
                downloadForm = doc.createElement('form');
                downloadForm.id = formId;
                doc.body.appendChild(downloadForm);//必须加入body中，否则可能不下载
            }
            downloadForm.method = 'post';
            downloadForm.action = url;
            downloadForm.style.display='none';//隐藏
            downloadForm.target='_blank';
            //移除之前表单内的所有域
            while(downloadForm.hasChildNodes()){
                downloadForm.removeChild(downloadForm.firstChild);
            }
            //根据传入的参数，创建表单隐藏域
            let paramObj = {fileId:fileId,attachmentName:name};
            var hidden;
            for(var key in paramObj){
                if(paramObj[key]==null || paramObj[key] == undefined){
                    continue;
                }
                hidden = doc.createElement('input');
                hidden.type='hidden';
                hidden.name = key;
                hidden.value = paramObj[key];
                downloadForm.appendChild(hidden);
            }
            downloadForm.submit();//提交，执行下载
        },
    },
    created() {//过滤script和'以及首尾空格
        var SCRIPT_REGEX = /\<.*?\>|'|(^\s*)|(\s*$)/gi;
        this.$nextTick(() => {
            $(".ivu-table-tbody .ivu-table-cell").each(function() {//所有表格添加title
                $(this).attr("title", $(this).text());
            });
            $(this.$el).find("input,textarea").not('[type="file"]').on("change", function() {
                var text = $(this).val();
                if(SCRIPT_REGEX.test(text)) {
                    text = text.replace(SCRIPT_REGEX, "");
                    $(this).val(text);
                }
            });
        });
    }
});
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App },
    data: {
        eventHub: new Vue()
    }
});
