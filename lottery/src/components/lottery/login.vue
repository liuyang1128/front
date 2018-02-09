<template>
    <div class="login" >
        <div class="top-left">
            <file-upload :url="'/lottery-web/lottery/excelDataSave.do'" :text="'导入抽奖码'" :format="format"></file-upload>
            <file-upload :url="'/lottery-web/lottery/excelDataDelete.do'" :text="'　删　除　'" :format="format"></file-upload>
        </div>
        <div class="center">
            <div class="input-text">
                <span class="input-text-title">用户名：</span>
                <Input class="input-text-content" type="text" placeholder="请输入用户名" v-model.sync="username"></Input>
            </div>
            <div class="input-text">
                <span class="input-text-title">密码：</span>
                <Input class="input-text-content" type="password" v-model.sync="password" placeholder="请输入密码" ></Input><br/>
            </div>
            <div class="input-text">
                <Button type="primary" class="loginBtn" long @click="login"> 登 录 </Button>
            </div>
        </div>
        <loading :show="loading"></loading>
    </div>
</template>
<script>
    import fileUpload from "../common/upload.vue"
    export default {
        name: "login",
        components: {
            fileUpload
        },
        data() {
            return {
                format: {//单位M
                    'XLS': 20,
                    'XLSX': 20,
                    'xls': 20,
                    'xlsx': 20
                },
                loading: false,
                username:'',
                password:''
            }
        },
        methods: {
            login(){
                let data = {
                    'userName':this.username,
                    'password':this.password
                };
                this.$http.post('/lottery-web/user/login.do', data).then((resp)=> {
                    if(resp.data.success && resp.data.data){
                        this.$router.push('/lottery?sign=1');
                    }else{
                        this.$Message.info("登录失败");
                    }
                })
            }
        },
        mounted(){
            // document.documentElement.style.fontSize = clientWidth/750*100+'px';
        }
    }
</script>
<style lang="less">
    .login {
        background: url(../../assets/images/background.gif) no-repeat fixed top;
        background-size: 100% 100%;
        position: relative;
        width: 100%;
        height: 100%;
        .center{
            position: absolute;
            width: 100%;
            top: 25%;
            height: 400px;
            .commonBtn{
                position:relative;
                width:50%;
            }
            .input-text {
                width: 40%;
                margin-left: 30%;
                margin-bottom: 20px;
                .input-text-title {
                    display: inline-block;
                    width: 110px;
                    text-align: right;
                    vertical-align: bottom;
                    font-size:20px;
                }
                .input-text-content {
                    width: 45%;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    vertical-align: bottom;
                }
                .loginBtn {
                    font-size:20px;
                    text-align: center;
                }
            }
        }
        .top-left {
            position: absolute;
            top: 0.1rem;
            left: 0.1rem;
        }
    }
</style>