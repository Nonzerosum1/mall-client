Vue.component('v-topbar', {
	template: "#topBar",
	data:function(){
		return {
			perInfo:false
		}
	},
	props:['topinfo','cartnum','cartnumtop'],
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
});

Vue.component('v-cartmain',{
	template:"#cartMain",
	props:['cartList','imgflag1','cartnum','totalprice','imgflagarr','cartnumtotal'],
	methods:{
		selectedTick:function(arg1,arg2,arg3){
			this.$emit("func1",arg1,arg2,arg3);
		},
		selectAll:function(){
			this.$emit("func2");
		},
		deleteCart:function(arg){
			this.$emit("func3",arg);
		},
		gotoBuy:function(){
			this.$emit("func4");
		}
	}
});

Vue.component('v-footer1',{
	template:"#footer_1"
});

Vue.component('v-footer2',{
	template:"#footer_2"
});

Vue.component('v-footer3',{
	template:"#footer_3"
});

Vue.component('v-dialog', {
	template: '#dialog',
	// props: {
	// 	msg: String,
	// 	showDialog: {
	// 		type: Boolean,
	// 		default: false
	// 	},
	// 	type: Number,
	// 	type_id:String
	// },
	props: ['msg', 'showDialog', 'type', 'cate', 'delflag'],
	methods: {
		close: function() {
			//this.$emit('update:visible', false) // 传递关闭事件
			//this.showDialog = !this.showDialog
			vm.showDialog = false;
		},
		hidePanel: function(event) {
			var dom = document.getElementById("dialogContainer");
			if (dom) {
				if (!dom.contains(event.target)) {
					vm.showDialog = false
				}
			}
		},
		deleteCateTemp(arg, delflag) {
			var markCate = '';
			var requestUrl = '';
			if (delflag === "cartshop_del") {
				markCate = "delete_cart"
				requestUrl = "http://127.0.0.1:8000/demo_mybatis/sc_cart_manage_jsons.tml";
			} else if (delflag === "pro_del") {
				markCate = "delete_pro"
				requestUrl = "http://127.0.0.1:8000/demo_mybatis/bs_products_manage_jsons.tml";
			}
			vm.showDialog = false;
			var paramData = {
				"matePro": markCate,
				"cateId": arg
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
						if (delflag === "cartshop_del") {
							vm.getInfoInit();
						} else if (delflag === "pro_del") {
							//vm.gotoProManage(vm.typeId);
						}

						//alert("删除成功..")
						vm.Alert("删除成功", "success", 2000);
					} else if (data.rcode === "290010") {
						//alert("该分类已存在..");
					}
				},
				error: function() {
					alert("Unexpected error");
				}

			});
		}
		
	}
});

var vm = new Vue({
	el:"#app",
	data:{
		topinfo:{
			isRegister:true,
			isLogin:true,
			isShowName:false,
			nickName:''
		},
		cartList:[],
		msg: '',
		showDialog: false,
		type: 1,
		cate: '',
		delflag: '',
		message: {
			show: false,
			type: 'c-message--success',
			status: 'messageFadeInDown',
			text: '操作成功',
			time: 2000,
			timeout: null
		},
		imgflag1:0,
		cartnum:0,
		cartnumtop:0,
		totalprice:0,
		totalpriceBackup:[],
		imgflagarr:[],
		imgflagarrBackup:[],
		cartnumtotal:0
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

				this.getShopCartInfo();
			}
			// this.detailPageInfo = JSON.parse(localStorage.getItem("detailPageInfo"));
			// console.log("this.detailPageInfo-------->" + this.detailPageInfo.detailedPageTitle);
			// console.log("this.detailPageInfo-------->" + this.detailPageInfo.goodCapacity);
			// console.log("this.detailPageInfo-------->" + this.detailPageInfo.detailedPageDesc);
			// console.log("this.detailPageInfo-------->" + this.detailPageInfo.goodId);
			
		},
		getShopCartInfo:function(){
			var userId = localStorage.getItem("userId");
			var requestUrl = "http://127.0.0.1:8000/demo_mybatis/sc_cart_manage_jsons.tml";
			var paramData = {
				"userId":userId,
				"matePro":"get_cart_info"
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
						//vm.Alert("添加购物车成功", "success", 2000);
						vm.cartList = data.robj.shopCartList;
						vm.imgflagarr = data.robj.shopCartShopIdList;
						//vm.imgflagarrBackup = data.robj.shopCartShopIdList;
						vm.cartnum = data.robj.shopCartShopIdList.length;
						vm.cartnumtop = data.robj.shopCartShopIdList.length;
						var totalPriceList = data.robj.shopCartTotalPriceList;
						vm.totalprice = eval(totalPriceList.join('+'));
						vm.totalpriceBackup = data.robj.shopCartTotalPriceList;
						
						if(vm.imgflagarr.length == 0){
							vm.cartnumtotal = -1;
						}else{
							vm.cartnumtotal = vm.imgflagarr.length;
						}

						var imgflagarrBackup = data.robj.shopCartShopIdList;
						localStorage.setItem("imgflagarrBackup",JSON.stringify(imgflagarrBackup));
						localStorage.setItem("totalPriceList",JSON.stringify(totalPriceList));
						console.log("vm.cartList---初始化-->" + vm.cartList);
						console.log("vm.imgflagarr---初始化-->" + vm.imgflagarr);
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
		},
		selectedTick:function(arg1,arg2,arg3){
			console.log("arg1------>" + arg1);
			console.log("arg2------>" + arg2);
			console.log("arg3------>" + arg3);

			//this.imgflag1 = arg3 + 1;
			//this.totalpriceBackup = JSON.parse(localStorage.getItem("totalPriceList"));
			console.log("this.totalpriceBackup---不选1--->" + this.totalpriceBackup);
			if(this.imgflagarr.indexOf(arg1) != -1){
				var index1 = this.imgflagarr.indexOf(arg1);
				var index2 = contains(this.totalpriceBackup,arg2);
				console.log("index1----------->" + index1);
				console.log("index2----------->" + index2);
				//this.imgflagarrBackup = this.imgflagarr;

				this.imgflagarr.splice(index1,1);

				this.totalpriceBackup.splice(index2,1,0);
				this.totalprice = eval(this.totalpriceBackup.join('+'));

				this.cartnum = this.cartnum - 1;

				console.log("this.imgflagarr----不选中---->" + this.imgflagarr);
				console.log("this.totalpriceBackup---不选中--->" + this.totalpriceBackup);
			}else{
				this.imgflagarr.push(arg1);

				this.totalpriceBackup.push(arg2);
				this.totalprice = eval(this.totalpriceBackup.join('+'));

				this.cartnum = this.cartnum + 1

				console.log("this.imgflagarr----选中---->" + this.imgflagarr);
			}
			
			//this.cartnum = this.cartnum + 1;
			//this.totalprice = this.totalprice + parseFloat(arg2);
		},
		selectAll:function(){
			if(this.imgflagarr.length != 0){
				var index1 = this.imgflagarr.length;
				var index2 = this.totalpriceBackup.length;
				this.imgflagarr.splice(0,index1);
				this.totalpriceBackup.splice(0,index2,0);
				this.totalprice = eval(this.totalpriceBackup.join('+'));
				this.cartnum = 0;
				console.log("this.imgflagarr----全不选---->" + this.imgflagarr);
				console.log("this.totalpriceBackup----全不选---->" + this.totalpriceBackup);
			}else if(this.imgflagarr.length == 0){
				//var arrBackup = new Array();
				var arrBackup = JSON.parse(localStorage.getItem("imgflagarrBackup"));

				for(var i = 0; i < arrBackup.length; i++){
					this.imgflagarr.push(arrBackup[i]);
				}

				var totalPriceList = JSON.parse(localStorage.getItem("totalPriceList"));
				this.totalpriceBackup = this.totalpriceBackup.concat(totalPriceList);
				this.totalprice = eval(this.totalpriceBackup.join('+'));

				this.cartnum = arrBackup.length;
				console.log("arrBackup-------->" + arrBackup);
				
				//this.imgflagarr = this.imgflagarrBackup;
				// this.imgflagarr.concat([this.imgflagarrBackup]);
				//this.imgflagarr = arrBackup;
				console.log("this.imgflagarr----全选---->" + this.imgflagarr);
				console.log("this.totalpriceBackup----全选---->" + this.totalpriceBackup);
			}
		},
		deleteCart:function(arg){
			this.msg = "你确定删除此项？";
			this.showDialog = !this.showDialog;
			this.type = 2;
			this.cate = arg;
			this.delflag = "cartshop_del";
			console.log("arg==========" + arg);
		},
		gotoBuy:function(){
			window.location.href="http://localhost:8080/graduClient/HTML/buy.html";
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