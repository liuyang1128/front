/*
*公共方法
*
**/
let Common = {
    trim(val) {//去除首尾空格
        return str.replace(/(^\s*)|(\s*$)/g,"");
    },
    changeNull(val) {//null显示
        return val==null ? "":val;
    },
    formatMoney(val) {//金额保留两位小数点并以逗号分割
        if(val===undefined || val===null || isNaN(val) ) {
            return '0.00';
        }
        if(String(val).indexOf("-")>-1) {
        	let num = parseFloat(Number(-val)).toFixed(2);
            let arr = num.split(".");
            let left = arr[0].split("").reverse();
            let str = "";
            for(let i=0;i<left.length;i++)
            {
                str += left[i] + ((i + 1) % 3 == 0 && (i + 1) != left.length ? "," : "");
            }
            return "-"+str.split("").reverse().join("")+'.'+arr[1];
        }else if(String(val).indexOf()===-1){
            let num = parseFloat(Number(val)).toFixed(2);
            let arr = num.split(".");
            let left = arr[0].split("").reverse();
            let str = "";
            for(let i=0;i<left.length;i++)
            {
                str += left[i] + ((i + 1) % 3 == 0 && (i + 1) != left.length ? "," : "");
            }
            return str.split("").reverse().join("")+'.'+arr[1];
        }
    },
    keepTwo(val) {//保留两位小数
        return parseFloat(Number(val)).toFixed(2);
    },
    formatDate(date) {//格式化日期 xxxx-xx-xx;
        if(date===""){
            return "";
        }else {
            let Y = date.getFullYear();
            let M = (date.getMonth() + 1) >= 10 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
            let D = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
            return Y + '-' + M + '-' + D;
            // return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
        }
    },
    openportalTab(portalUrl,url,param,name){//打开portalTab页
        let exec_obj;
        if(typeof(exec_obj)=='undefined'){
            exec_obj = document.createElement('iframe');
            exec_obj.name = 'tmp_frame';

            let location = window.location.href.split('/')[2];
            exec_obj.src = portalUrl+'crossDomain-portlet/parent_click.jsp?url=http://'+location+'/finaloan-web/static.do?url='+url+'?'+param+'&tabName='+name;
            exec_obj.style.display = 'none';
            document.body.appendChild(exec_obj);
        }else{
            exec_obj.src = portalUrl+'crossDomain-portlet/parent_click.jsp?url='+location+'/finaloan-web/static.do?url='+url+'?'+param+'&tabName='+name+Math.random();
        }
    },
    closeportalTab(portalUrl) {//关闭当前标签页面
        let exec_obj;
        if(typeof(exec_obj)=='undefined'){
            exec_obj = document.createElement('iframe');
            exec_obj.name = 'tmp_frame';
            exec_obj.src = portalUrl+'crossDomain-portlet/parent_closeCurrent_tab.jsp';
            exec_obj.style.display = 'none';
            document.body.appendChild(exec_obj);
        }else{
            exec_obj.src = portalUrl+'crossDomain-portlet/parent_closeCurrent_tab.jsp'+Math.random();
        }
    },
    refreshPortalTab(portalUrl,refreshTagName) {//关闭当前页面，并刷新指定页面
        let exec_obj;
        if(typeof(exec_obj)=='undefined'){
            exec_obj = document.createElement('iframe');
            exec_obj.name = 'tmp_frame';
            exec_obj.src = portalUrl+'crossDomain-portlet/parent_close_refresh_tab2.jsp?refreshTabName='+refreshTagName;
            exec_obj.style.display = 'none';
            document.body.appendChild(exec_obj);
        }else{
            exec_obj.src = 'http://localhost:8080/crossDomain-portlet/parent_close_refresh_tab2.jsp?refreshTabName=' + refreshTagName + '&' + Math.random();
        }
    },
    exec6_iframe(portalUrl,url,param,name) {//关闭当前页面，并打开指定页面
        let exec_obj;
        if(typeof(exec_obj)=='undefined'){
            exec_obj = document.createElement('iframe');
            exec_obj.name = 'tmp_frame';
            let location = window.location.href.split('/')[2];
            exec_obj.src = portalUrl+'crossDomain-portlet/close_window_opens_a_new_window.jsp?url=http://'+location+'/finaloan-web/static.do?url='+url+'?'+param+'&refreshTagName='+name;
            exec_obj.style.display = 'none';
            document.body.appendChild(exec_obj);
       }else{
           exec_obj.src = portalUrl+'crossDomain-portlet/close_window_opens_a_new_window.jsp?url=/finaloan-web/static.do?url='+url+'?'+param+'&refreshTagName='+name+ Math.random();
       }
    },
    openNewportalTab(url,param,name) {
        let location = window.location.href.split('/')[2];
        window.parent.postMessage({
            name: name,
            hostname: 'http://'+location+'/finaloan-web/static.do?url='+url+'?'+param,
            methods: "newTab"
        },"*");
    },
    closeNewTab() {
        window.parent.postMessage({
            methods: "closeTab"
        },"*");
    },
    closeNewTabTo(url,param,name) {
        let location = window.location.href.split('/')[2];
        window.parent.postMessage({
            hostname: 'http://'+location+'/finaloan-web/static.do?url='+url+'?'+param,
            name: name,
            methods: "closeTabTo"
        },"*");
    },
    setCookie(cname, cvalue, minute) {
        var d = new Date();
        d.setTime(d.getTime() + (minute*60*1000));
        var expires = "expires="+d.toGMTString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    },
    getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
        }
        return "";
    },
};
export default Common;
// module.exports = common;