var vm = new Vue({
	el:'#app',
    data:{
        userName:'',
        password:''
    },
    methods:{
    	login:function(){
    		if (isNull(this.userName) || isNull(this.password)) {
	    		alert("请输入你的用户名或密码..");
	    		return;
	    	}
            var userN = md5(this.userName);
            var passW = md5(this.password);
            console.log("userN------>" + userN);
            console.log("passW------>" + passW);
	    	var requestUrl = "http://127.0.0.1:8000/demo_mybatis/ls_login_verify_jsons.tml";
	    	var paramData = {
	    		"userName":this.userName,
	    		"password":passW
	    	};
	    	console.log("上送数据--------->");
            console.log(paramData);
            $.ajax({
                type : "POST",
                url : requestUrl,
                data : JSON.stringify(paramData), 
                dataType:"json",
                contentType:"application/json;charset=UTF-8",
                success : function(data) {
　　　　　　　　　　　　//var message = $.parseJSON(data);//后台返回的json数据需要转为对象
                     //vue.selectById=message;//把后台返回的JSON数据赋给selectById
                     console.log(data.transCode + "接口返回--------->");
                     console.log(data);
                     if(data.rcode === "000000"){
                        localStorage.setItem("userName",vm.userName);
                        localStorage.setItem("password",vm.password);
                        localStorage.setItem("userId",data.robj.userId);
                        localStorage.setItem("mobile",data.robj.mobile);

                     	window.location.href = "http://localhost:8080/graduClient/HTML/exmIndex.html";
                     }else if(data.rcode === "402004"){
                     	alert("用户名或密码不正确..");
                     }
                },
                error : function(){
                    alert("Unexpected error");
                }

            });
    	}
    	

    }
});