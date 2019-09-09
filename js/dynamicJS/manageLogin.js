var vm = new Vue({
	el:"#app",
	data:{
		username:'',
		password:''
	},
	methods:{
		login(){
			if(this.username == "admin" && this.password == "123456"){
				window.location.href = "http://localhost:8080/graduClient/HTML/exm2.html";
			}else{
				alert("用户名或密码不正确！！！");
			}
		}
	}
});