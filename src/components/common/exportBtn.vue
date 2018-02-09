<template>
    <!-- 导出excel按钮 -->
    <div class="exportBtn">
        <Button type="primary" size="small" @click="open" :disabled="exprotDis">
            <!-- <vbl-icon type="android-arrow-down"></vbl-icon> -->
            <span class="w80">{{excelTime}}</span>EXCEL导出
        </Button>
        <transition name="fade">
            <div v-if="downShow" :class="{'downModal':true,'downShow': downShow}">
                <div class="downtitle">下载提示<span @click="downClose">X</span></div>
                <p>已提交后台下载，请稍后在附件下载中查看。<!-- <a @click="addTab">点击进入</a> -->
                    <br/>
                    <Button type="primary" size="small" @click="addTab">快速打开附件下载</Button>
                </p>
            </div>
        </transition>
    </div>
</template>
<script>
    export default {
        name: "exportBtn",
        props: {
            name:{
                    type: String,
                    default: "EXCEL导出"
                },
            url: {
                type: String,
                required: true,
            },
            cookieName: {
                type: String,
                required: true,
            },
            time: {//控制时间
                type: Number,
                default: 60
            },
        },
        data() {
            return {
                downShow: false,//下载提示class
                exprotDis: false,
                excelTime: "",
                portalPath: ""
            }
        },
        methods: {
            open() {
                this.$emit('getPrams');
            },
            exprotExcel(paramobj) {
                this.exprotDis = true;
                this.setCookie(this.cookieName,Number(new Date()),this.time/60);
                this.excelTime = this.time;
                let excelTime = this.excelTime;
                let timer = setInterval(() => {
                    if(excelTime > 0) {
                        excelTime--;
                        this.excelTime = excelTime;
                    }else {
                        this.excelTime = "";
                        this.exprotDis = false;
                        clearInterval(timer);
                    }
                },1000);
                this.downShow = true;
                this.$http.post(this.url,paramobj).then((resp) => {
                });
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
            downClose() {
                this.downShow = false;
            },
            addTab() {
                // this.$router.push("./down");
                this.$common.openportalTab(this.portalPath,'/repayment/index.html%23/down','','附件下载');
            }
        },
        mounted() {
            this.$http.post('/finaloan-web/common/getPortalUrl.do').then((res)=> {
                this.portalPath = res.data.data;
            });
            if(this.getCookie(this.cookieName)) {
                let date = new Date() - new Date(Number(this.getCookie(this.cookieName)));
                let excelTime = Math.floor(date/1000);
                this.exprotDis = true;
                this.excelTime = this.time-excelTime;
                let timer = setInterval(()=>{
                    if(this.excelTime <= 0) {
                        this.excelTime = "";
                        this.exprotDis = false;
                        clearInterval(timer);
                    }else {
                        excelTime++;
                        this.excelTime = this.time - excelTime;
                    }
                },1000)
            }
        },
        // created() {
        //     this.$on('down',(paramobj) => {
        //         this.exprotExcel(paramobj);
        //     });
        // }
    }
</script>
<style lang="less" scoped>
    .exportBtn {
        display: inline-block;
        .downModal {
            text-align: right;
            color: #000;
            background-color: #fff;
            width: 310px;
            // height: 80px;
            opacity: 80%;
            border: 1px solid #eee;
            border-radius: 4px;
            position: absolute;
            z-index: 999;
            top: 150px;
            right: 40px;
            // transition: right .3s ease 0s;
            // -webkit-transition: right .3s ease 0s;
            // -moz-transition: right .3s ease 0s;
            // -o-transition: right .3s ease 0s;
            border-radius: 4px;
            display:none;
            .downtitle {
                color: #000;
                font-size: 14px;
                height: 36px;
                line-height: 36px;
                text-align: left;
                padding:0 20px;
                background-color: #f5f7f9;
                span {
                    float: right;
                    font-size: 14px;
                }
            }
            span {
                margin-right: 5px;
                font-size: 18px;
                cursor: pointer;
            }
            p {
                padding:30px;
                font-size: 12px;
                text-align: left;
                line-height: 18px;
                overflow: hidden;
                .ivu-btn {
                    margin-top: 10px;
                    float: right;
                    margin-right: 0px;
                }
            }
        }
        .downShow {
            display:block;
            // right: 20px;
        }
        .w80 {
            display: inline-block;
            margin-right: 5px;
            text-align: center;
        }
        .fade-enter-active, .fade-leave-active {
            transition: all .5s;
        }
        .fade-enter, .fade-leave-active {
            right: -80px;
        }
    }
</style>