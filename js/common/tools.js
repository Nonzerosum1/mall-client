//判断元素是否为空
function isNull(s) {
	var str = (s + "").trim();
	if (str == "null" || str == null || typeof(str) == "undefined" || str == "undefined" || str === "") {
		return true;
	}

	return false;
}

//base64转blob
function dataURItoBlob(base64Data) {
	var byteString;
	if (base64Data.split(',')[0].indexOf('base64') >= 0)
		byteString = atob(base64Data.split(',')[1]);
	else
		byteString = unescape(base64Data.split(',')[1]);
	var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
	var ia = new Uint8Array(byteString.length);
	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}
	return new Blob([ia], {
		type: mimeString
	});
}

//弹框提示  type:success,info,warning,error
// function Alert(text, type, time){

// }


/*
	获取某个元素的下标
	array:传入的数组
	obj:需要获取下标的元素
 */
function contains(arrays, obj) {
    var i = arrays.length;
    while (i--) {
        if (arrays[i] == obj) {
            return i;
        }
    }
    return -1;
}

function indexOfSelf(value,fromindex){
	var arr = this.valueOf(),len=this.length;
        //如果arr不是数组或者第一个参数为空或者undefined，则返回false
        if(toString.call(arr) !== '[object Array]' || value === '' || value === undefined || toString.call(value) === '[object Function]'){
            return false;
        }
        //默认第一个参数为0
        if(fromindex === undefined){
            fromindex = 0;
        }
        //第二个参数不是数字返回false
        if(toString.call(fromindex) !== '[object Number]'){
            return false;
        }
        //判断第二个参数是否为负数
        if(fromindex<0){
            fromindex = Math.abs(fromindex);
            //超过搜索范围
            if(len < fromindex){
                return -1;
            }else{
                //负数则从后面开始向后搜索
                fromindex = len - fromindex;
            }
        }
        //开始查找
        for(var i=0+fromindex;i<len;i++){
            if(value === arr[i]){
                return i;
            }else{
                //判断数据类型相等
                if(toString.call(arr[i]) === toString.call(value)){
                    //判断数据值相等
                    if(JSON.stringify(arr[i]) === JSON.stringify(value)){
                        return i;
                    }else{
                        return -1;
                    }
                }    
            }
        }
        return -1;
}

/*
验证手机号格式
 */
function isMobile(phoneVal){
    var phoneReg = /(^1\d{10}$)|(^[0-9]\d{7}$)/;
    if(!phoneReg.test(phoneVal)) {
        //alert("手机号码格式错误!");
        return false;
    }
    return true;
}

//验证邮箱格式
function isEmail(emailVal){
    var emailReg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
    if(!emailReg.test(emailVal)) {
        //alert("邮箱格式错误!");
        return false;
    }
    return true;
}
