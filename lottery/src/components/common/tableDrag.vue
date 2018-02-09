<template>
    <div>
        <div class="table">
            <TableDrag draggable  border :columns="columns" :data="tableData" :no-data-text="loadingText"></TableDrag>
            <Spin v-show="loading">
                <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                <div>Loading</div>
            </Spin>
        </div>
        <Page v-show="tableData && tableData.length>0" :total="total" :current="current" :page-size="rowCount" @on-change="change_page" @on-page-size-change="changesize"  :page-size-opts="pageSize" show-elevator show-total show-sizer>
            <span class="ivu-page-total">共&nbsp;&nbsp;&nbsp;{{totalPage}}&nbsp;&nbsp;&nbsp;页</span>
        </Page>
    </div>
</template>
<script>
    import TableDrag from "../common/table/index.js"
   /* let data = {"starTime":this.searchInfo[0].start,"endTime":this.searchInfo[0].end,"feedbackStatus":this.searchInfo[1].value}
    this.$refs.table.pageQuery(data)
    <load-table ref="table" :columns="repayment" :url="'/finaloan-web/faTotalBatchInfo/queryFaTotalBatchInfo.do'"></load-table>*/
    export default {
        name: "my-table",
        components: {
            TableDrag,
        },
        props:{
            columns: {
                type: Array,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
            prompt: {
                type: Boolean,
                required: false,
                default: false,
            }
        },
        data() {
            return {
                params: {},
                tableData: [],
                loadingText: "暂无数据",
                loading: false,
                totalPage: 0,
                total: 0,
                current: 1,
                rowCount: 10,
                pageSize: [10,20,50,100]
            }
        },
        methods: {
            pageQuery(data) {
                let params;
                if(data) {
                    this.params = data;
                    params = data;
                    this.current = 1;
                }else {
                    params = this.params
                }
                this.loadingText = "";
                this.tableData = [];
                this.loading = true;
                this.$http.post(this.url,Object.assign(params,{current:this.current,rowCount:this.rowCount})).then((resp) => {
                if(this.prompt && !resp.data.success) {
                    this.$Modal.info({
                            title: "提示",
                            content: resp.data.errorMessage,
                        });
                }
                if(resp.data.success && resp.data.data) {
                    this.total = resp.data.data.resultCount;
                    this.rowCount = resp.data.data.rowCount
                    this.totalPage=this.total%this.rowCount==0?parseInt(this.total/this.rowCount):(parseInt(this.total/this.rowCount))+1
                    this.tableData=resp.data.data.data;
                }
                this.loading = false;
                this.loadingText = "暂无数据";
               
                this.$emit("table-finish");
                },(error)=>{
                    
                    this.loadingText = "暂无数据";
                    this.loading = false;
                    this.$emit("table-finish");
                    this.$Message.info(error.toString());
                });
            },
            change_page(val) {
                this.current = val;
                this.pageQuery();
            },
            changesize(val) {
                this.rowCount = val;
                this.pageQuery();
            }
        },
        mounted() {
        },
        updated() {
            this.$nextTick(function(){
                //分页跳转失去焦点触发分页
                let elevator = this.$el.querySelector(".ivu-page-options-elevator input");
                let rxg = /^[0-9]+$/
                if(elevator) {
                    elevator.onblur= (event)=> {
                        if(event.target.value == this.current && !event.target.value) {
                            return;
                        }
                        if(event.target.value == 0) {
                            event.target.value = this.current;
                            return;
                        }
                        if(!rxg.test(event.target.value)) {
                            event.target.value = 1;
                            this.current = event.target.value;
                            this.pageQuery();//表格查询方法
                        }
                        if(rxg.test(event.target.value)) {
                            if(event.target.value>this.totalPage) {
                                event.target.value = this.totalPage;
                            }
                            this.current = Number(event.target.value)
                            this.pageQuery();//表格查询方法
                        }
                    }
                }
            });
        },
    }
</script>
<style　lang="less" scoped>
    .table {
        width: 100%;
        .demo-spin-icon-load{
            animation: ani-demo-spin 1s linear infinite;
        }
        @keyframes ani-demo-spin {
            from { transform: rotate(0deg);}
            50%  { transform: rotate(180deg);}
            to   { transform: rotate(360deg);}
        }
        .demo-spin-col{
            height: 100px;
            position: relative;
            border: 1px solid #eee;
        }
        .ivu-spin {
            position: relative;
            top: -36px;
            .ivu-icon {
                color: #1d86f4;
            }
        }
    }
</style>