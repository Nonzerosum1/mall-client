Vue.component('v-topbar', {
	template: "#topBar",
	data:function(){
		return {
			perInfo:false
		}
	},
	props:['topinfo','userId'],
	methods:{
		infoShow(){
			this.perInfo = true;
		},
		infoHid(){
			this.perInfo = false;
		},
		signOut(){
			localStorage.removeItem("password");
			localStorage.removeItem("userName");
			vm.getInfoInit();
		},
		login(){
			window.location.href="http://localhost:8080/graduClient/HTML/login.html";
		},
		gotoShopCart(){
			var userName = localStorage.getItem("userName");
			var password = localStorage.getItem("password");
			console.log("userName--------->" + userName);
			console.log("password--------->" + password);
			if (!isNull(userName) && !isNull(password)) {
				vm.topinfo.isRegister = false;
				vm.topinfo.isLogin = false;
				vm.topinfo.isShowName = true;
				vm.topinfo.nickName = userName;
				window.location.href="http://localhost:8080/graduClient/HTML/shoppingCart.html";
			}else {
				vm.topinfo.isRegister = true;
				vm.topinfo.isLogin = true;
				vm.topinfo.isShowName = false;
				vm.topinfo.nickName = "";
				vm.Alert("登录后才能查看购物车哦！", "info", 2000);
			}
		},
		indexHome(){
			window.location.href="http://localhost:8080/graduClient/HTML/exmIndex.html";
		},
		gotoAbout(){
			window.location.href="http://localhost:8080/graduClient/HTML/about.html";
		}
	}
});

Vue.component('v-sectiontop',{
	template:"#sectionTop"
})

Vue.component('v-sectioncenter',{
	template:"#sectionCenter",
	props:['detailPageInfo','userId'],
	methods:{
		gotoShoppingCart:function(arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8){
			if(isNull(arg8)){
				vm.alert("请先登录哈！","warning",2000)
				return;
			}
			var typeId = localStorage.getItem("typeId");
			var requestUrl = "http://127.0.0.1:8000/demo_mybatis/sc_cart_manage_jsons.tml";
			var paramData = {
				//"typeId": this.cateListArr[0].typeId,
				"goodType":typeId,
				"goodId":arg6,
				"goodName":arg1,
				"goodDesc":arg7,
				"goodPrice":arg4,
				"userId":arg8,
				"goodParam":arg2,
				"originalPrice":arg5,
				"subtitle":arg3,
				"matePro":"add_pro_cart"
			};
			console.log("上送数据--------->");
			console.log(paramData);
			$.ajax({
				type: "POST",
				url: requestUrl,
				data: JSON.stringify(paramData),
				dataType: "json",
				contentType: "application/json;charset=UTF-8",
				success: function(data) {　　　　　　　　　　　　 //var message = $.parseJSON(data);//后台返回的json数据需要转为对象
					//vue.selectById=message;//把后台返回的JSON数据赋给selectById
					console.log(data.transCode + "接口返回--------->");
					console.log(data);
					if (data.rcode === "000000") {
						//window.location.href = "http://localhost:8080/graduClient/HTML/index.html";
						vm.Alert("添加购物车成功", "success", 2000);
					} else if (data.rcode === "290010") {
						vm.Alert("Unexpected error", "warning", 2000);
						//alert("该分类已存在..");
					} else{
						vm.Alert("Unexpected error", "error", 2000);
					}
				},
				error: function() {
					//alert("Unexpected error");
					vm.Alert("Unexpected error", "error", 2000);
				}

			});
		}
	}
})

Vue.component('v-sectionbuttom',{
	template:"#sectionButtom"
})

var vm = new Vue({
	el:"#app",
	data:{
		topinfo:{
			isRegister:true,
			isLogin:true,
			isShowName:false,
			nickName:''
		},
		detailPageInfo:{

		},
		userId:'',
		message: {
			show: false,
			type: 'c-message--success',
			status: 'messageFadeInDown',
			text: '操作成功',
			time: 2000,
			timeout: null
		}
	},
	mounted:function(){
		this.getInfoInit();
	},
	methods:{
		getInfoInit:function(){
			var userName = localStorage.getItem("userName");
			var password = localStorage.getItem("password");
			if(!isNull(userName) && !isNull(password)){
				this.topinfo.isRegister = false;
				this.topinfo.isLogin = false;
				this.topinfo.isShowName = true;
				this.topinfo.nickName = userName;
			}
			this.detailPageInfo = JSON.parse(localStorage.getItem("detailPageInfo"));

			this.userId = localStorage.getItem("userId");
			
			console.log("this.detailPageInfo-------->" + this.detailPageInfo.detailedPageTitle);
			console.log("this.detailPageInfo-------->" + this.detailPageInfo.goodCapacity);
			console.log("this.detailPageInfo-------->" + this.detailPageInfo.detailedPageDesc);
			console.log("this.detailPageInfo-------->" + this.detailPageInfo.goodId);

		},

		//消息提示 type:success,info,warning,error
		Alert: function(text, type, time) {
			vm.message.status = '';
			clearTimeout(vm.timeout)
			vm.message.text = (typeof text == 'string') && text ? text : '我是默认';
			vm.message.time = time ? time : 2000;
			vm.message.type = 'c-message--' + (type ? type : 'info');
			vm.message.show = true;
			vm.message.status = 'messageFadeInDown';
			vm.timeout = setTimeout(function() {
				vm.message.status = 'messageFadeOutUp'
				// event.target.addEventListener('transitionend', function () {
				//     alert('动画结束了！');
				// }, false)
			}, vm.message.time)
		}
	}
});