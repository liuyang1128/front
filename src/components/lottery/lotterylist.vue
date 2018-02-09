<template>
    <div class="lotterylist" >
        <img  @click="back" class="back" src="../../assets/images/back2.png">
        <div class="input-main">
             <table class="table" cellspacing="0" cellpadding="0" border="0">
                 <tr>
                     <td>
                         中奖号
                     </td>
                     <td v-for="(item,index) in lotteryNumList">
                         {{item.lotteryNumber}}
                     </td>
                 </tr>
                 <tr>
                     <td>
                         姓名
                     </td>
                     <td v-for="(item,index) in lotteryNumList">
                         {{item.name}}
                     </td>
                 </tr>
                 <tr>
                     <td>
                         部门
                     </td>
                     <td v-for="(item,index) in lotteryNumList">
                         {{item.departmentName}}
                     </td>
                 </tr>
             </table>
        </div>
    </div>
</template>
<script>
    import fileUpload from "../common/upload.vue"
    export default {
        name: "lotterylist",
        components: {
            fileUpload
        },
        data() {
            return {
                lotteryNumList:[
                ],
            }
        },
        methods: {
            queryLotteryList(){
                this.$http.post('/lottery-web/lottery/queryLotteryList.do').then((resp)=> {
                    if(resp.data.success && resp.data.data){
                        this.lotteryNumList = resp.data.data;
                    }else{
                        this.$Message.info("查询中奖号列表失败");
                    }
                })
            },
            back(){
                this.$router.push('/lottery?sign=1');
            }
        },
        mounted(){
            this.queryLotteryList();
            // document.documentElement.style.fontSize = clientWidth/750*100+'px';
        }
    }
</script>
<style lang="less">
    .lotterylist {
        background: url(../../assets/images/background_lottery.jpg) no-repeat fixed top;
        background-size: 100% 100%;
        position: relative;
        top: 0;
        height: 100%;
        width: 100%;
        .back {
            position: absolute;
            top: 0.3rem;
            left: 0.3rem;
            width: .25rem;
            height: .20rem;
        }
        .ui-large-title {
            font-size: 16px;
            text-align: center;
        }
        .input-main{
            margin:0 auto;
            padding: 1.99rem .88rem 0rem;
            width: 7.5rem;
            height:4.41rem;
            background: url(../../assets/images/lists.png) no-repeat top;
            background-size:contain;
            .table {
                width: 100%;
                td {
                    // border: 1px solid #fff;
                    line-height:0.48rem;
                }
            }
            .ivu-table th {
                background-color: transparent!important;
            }
            table,tr,td,div,span,th {
                text-align: center;
                font-size:10px;
                background-color: transparent!important;
                color: #d10a0d;
                font-weight: bold;
            }
            th {
                div,span {
                    color: #000!important;
                }
            }
        }
        .input-bottom {
            margin-top: 20px;
            text-align: center;
        }
    }
</style>