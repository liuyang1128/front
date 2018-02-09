<template>
    <div class="exportExcel">
        <Button type="primary" size="small" @click="exportE"
        @down="exportExcel">{{defaultText}}</Button>
    </div>
</template>

<script>
    export default {
        name: 'exportExcel',
        props:['url','text'],
        data () {
            return {
            }
        },
        methods: {
            exportExcel(paramobj) {
                let url = this.url;
                let paramObj = paramobj;
                console.log(url)
                console.log(paramObj)
                var doc = document;
                //使用一个隐藏的form表单执行提交，没有则创建
                var downloadForm = doc.getElementById('_downloadForm');
                if(!downloadForm){
                    downloadForm = doc.createElement('form');
                    downloadForm.id = '_downloadForm';
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
                if(paramObj != null){
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
                }

                downloadForm.submit();//提交，执行下载
            },
            exportE() {
                this.$emit('exprot-excel');
            }
        },
        computed: {
            defaultText:function() {
                if(this.text) {
                    return this.text;
                }else {
                    return 'EXCEL导出'
                }
            }
        },
        created() {
            this.$root.eventHub.$on('down',(paramobj) => {
                this.exportExcel(paramobj);
            });
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    .exportExcel {
        display: inline-block;
        // margin-bottom: 10px;
    }
</style>
