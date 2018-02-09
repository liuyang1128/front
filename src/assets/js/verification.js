let verification = {
    num:function(val) {//数字
        return !isNaN(val);
    },
    Mobile:function(val) {//移动电话
        return /^1[3|4|5|7|8]\d{9}$/.test(val);
    }
    Mail:function(val) {//邮箱
        return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(val);
    }
    isid:function(val) {//身份证号
        return /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(val);
    }
}
export default verification;
// module.exports = verification;