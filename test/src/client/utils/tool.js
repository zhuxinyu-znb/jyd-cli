import crypto from 'crypto';
import axios from 'axios';
import qs from 'qs';
import { message } from 'antd';

const tool = {
    trim:function (str){ //删除左右两端的空格
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    md5:function (str) {
        //指定加密规则
        const obj=crypto.createHash('md5');
        //加密字符串
        obj.update(str);
        //以hex模式输出
        return obj.digest('hex');
    },
    base64_coding:function (str) {
        if(typeof window !== 'undefined'){
            return new Buffer(str).toString('base64');
        }
        return ''
    },
    base64_decoding:function (str) {
        if(typeof window !== 'undefined'){
            return new Buffer(str, 'base64').toString();
        }
        return ''
    },
    dateFormat:function () {
        const oDate=new Date();
        return (`${oDate.getFullYear()}-${this.toDou(oDate.getMonth()+1)}-${this.toDou(oDate.getDate())} ${this.toDou(oDate.getHours())}:${this.toDou(oDate.getMinutes())}:${this.toDou(oDate.getSeconds())}`)
    },
    toDou:function (n) {
        return n>=10?n:`0${n}`
    },
    //判断身份证号正则
    isCardID: function (cardID) {
        const reg=/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
        return reg.test(cardID)
    },
    //判断手机号正则
    isPhoneNumber: function (phoneNumber) {
        const reg=/^1[3|4|5|7|8][0-9]{9}$/;
        return reg.test(phoneNumber)
    },
    //存登录cookie
    setCookie:function (name,value,expires) {
        if(typeof window !== 'undefined'){
            const oDate=new Date();
            if(expires){
                oDate.setDate(oDate.getDate()+(expires-0));
                document.cookie=`${name}=${value};expires=${oDate}`;
            }else{
                document.cookie=`${name}=${value}`
            }
        }
    },
    //取登录cookie
    getCookie:function (name) {
        let cookieArr = document.cookie.split('; ');
        for (let i = 0; i < cookieArr.length; i++) {
            let cookieArr2 = cookieArr[i].split('=');
            if (cookieArr2[0] === name) {
                return cookieArr2[1]
            }
        }
        return ''
    },
    //清除cookie
    removeCookie:function (name) {
        this.setCookie(name, 1, -1)
    },
    browserType:function() {
        let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        let isOpera = userAgent.indexOf("Opera") > -1;
        //判断是否Opera浏览器
        if (isOpera) {
            return "-o-linear-gradient"
        }
        //判断是否Firefox浏览器
        if (userAgent.indexOf("Firefox") > -1) {
            return "-moz-linear-gradient";
        }
        //判断是否chorme浏览器
        if (userAgent.indexOf("Chrome") > -1) {
            return "-webkit-linear-gradient";
        }
        //判断是否Safari浏览器
        if (userAgent.indexOf("Safari") > -1) {
            return "-webkit-linear-gradient";
        }
        //判断是否IE浏览器
        if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
            const reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            const fIEVersion = parseFloat(RegExp["$1"]);
            if (fIEVersion === 9) {
                return "9";
            }
            return "-ms-linear-gradient";
        }
        //判断是否Edge浏览器
        if (userAgent.indexOf("Trident") > -1) {
            return "-ms-linear-gradient";
        }
    },
    //判断是否为空
    isNull:function (item) {
        if(!item || item==='null' || item==='undefined'){
            return ''
        }else {
            return item
        }
    }
};

const instance = axios.create({
    baseURL:'',
    timeout: 1000*30,//请求超时时间
    validateStatus: function (status) {
        return status >= 200 && status <= 400;
    },//定义可获得的http响应状态码
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials:true,
});

//拦截器
instance.interceptors.response.use(response => {
    if(response.headers.redirect==='REDIRECT'){
        window.location.href = response.headers.contentpath;
    }else{
        return response;
    }
},error => {
    return console.error(error)
});

const Axios = {
    post:async function (url,param,headers=null){
        let result;
        if(headers){
            // 传图片
            if(headers['Content-Type']==="multipart/form-data"){
                result=await instance.post(url,param);
            }else{
                // 改headers
                const config = {
                    headers
                }
                result=await instance.post(url,param,config);
            }
        }else{
            result=await instance.post(url,qs.stringify(param));
        }
        if(result && result.data.code==='0'){
            return result.data.data
        }else{
            try {
                message.error(result.data.msg);
            } catch (err) {
                console.log(err)
            }
            return null
        }
    },
    get:async function (url,param,header=null){
        let result;
        if(header && header['Content-Type']==="multipart/form-data"){
            result=await instance.get(url,param);
        }else{
            result=await instance.get(url,qs.stringify(param));
        }
        if(result && result.data.code==='1'){
            return result.data.data
        }else{
            try {
                message.error(result.data.msg);
            } catch (err) {
                console.log(err)
            }
            return null
        }
    },
    all:async function (url,list,method,header=null) {
        let allRequest;
        if(header && header['Content-Type']==="multipart/form-data"){
            allRequest=list.map((d)=>{
                return instance[method](url,d)
            });
        }else{
            allRequest=list.map((d)=>{
                return instance[method](url,qs.stringify(d))
            });
        }
        return await axios.all(allRequest)
    }
};

export {tool, Axios}

