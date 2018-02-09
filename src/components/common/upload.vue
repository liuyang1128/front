<template>
    <div class="upload">
        <Button type="primary" size="small" @click="open">{{text}}</Button>
        <form   v-show="false">
            <input type="file" ref="upload" name="uploadedFile" @change="uploadFile">
        </form>
    </div>
</template>
<script>
    export default {
        name: "upload",
        props: {
            text: {
                type: String,
                default: "上传附件",
                required: false
            },
            url: {
                type: String,
                required: true
            },
            format: {//数组文件名|对象文件名和文件大小//toLowerCase
                type: [Object,Array],
                required: false
            },
            propmt:{
                type: Boolean,
                default: true,
                required: false
            }
        },
        data() {
            return {
            }
        },
        methods: {
            open() {
                this.$refs.upload.click();
            },
            uploadFile() {
                let names = this.$refs.upload.files[0].name.split(".")
                let suffix = names[names.length-1].toLowerCase();//上传文件后缀更改小写
                let correct,text;
                let MB = 1024*1024;
                if (Object.prototype.toString.call(this.format) === "[object Array]") {
                    if(this.format.indexOf(suffix)>-1) {
                        correct = true;
                    } else {
                        correct = false;
                        text = "格式不正确"
                    }
                }else if(Object.prototype.toString.call(this.format) === "[object Object]") {
                    console.log(suffix,this.format.hasOwnProperty(suffix))
                    if(!this.format.hasOwnProperty(suffix)) {
                        correct = false;
                        text = "格式不正确"
                    }else if(this.format.hasOwnProperty(suffix) && this.$refs.upload.files[0].size/MB>this.format[suffix]) {
                        correct = false;
                        text = suffix+"文件不能超过"+this.format[suffix]+'M';
                    }else{
                         correct = true;
                    }
                }
                if(correct){
                    let config = {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        transformRequest:[
                            function(data) {
                                return data
                            }
                        ]
                    };
                    let myData = new FormData();
                    myData.append("uploadedFile",this.$refs.upload.files[0]);
                    this.$http.post(this.url,myData,config).then((resp) =>{
                        if( resp.data.success ){
                            if(this.propmt) {
                                // this.$Modal.info({
                                //     title: "提示",
                                //     content: "上传成功",
                                // });
                            }
                            this.$emit("upload-data",resp.data.data);
                        }else {
                            this.$Modal.info({
                                title: "提示",
                                content: "上传失败",
                            });
                        }
                        this.$refs.upload.value="";
                    })
                }else {
                    this.$Modal.info({
                        title: "提示",
                        content: text,
                    });
                }
            }
        }
    }
</script>
<style>
    .upload {
        display: inline-block;
    }
</style>