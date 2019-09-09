Vue.component('v-header', {
	template: "#header"
});

Vue.component('v-container', {
	template: "#container",
	props: ['cateList'],
	methods: {
		deleteCate: function(arg) {
			this.$emit("func", arg);
		},
		gotoProManage: function(arg1,arg2) {
			// var list = JSON.parse(localStorage.getItem("typeId") || '[]'); 
			// list.unshift(comment); 
			localStorage.setItem('typeId', arg1);
			localStorage.setItem('typeName', arg2);
			//this.$emit("funcgo", arg);
			window.location.href = "http://localhost:8080/graduClient/HTML/manageProduct.html";
		},
		proEdit:function(arg){
			var cateItem = JSON.stringify(arg);
			localStorage.setItem('cateItem', cateItem);
			window.location.href = "http://localhost:8080/graduClient/HTML/updateCate.html";
		},
		//添加分类
		addCate:function(){
			window.location.href = "http://localhost:8080/graduClient/HTML/addCate.html";
		}
	}
});

Vue.component('v-contpage', {
	template: "#contPage",
	props: ['pageCount']
});

Vue.component('v-contaddcate', {
	template: "#contAddCate",
	data: function() {
		return {
			name: '',
			recommend: ''
		}
	},
	//props: ['name','recommend'],
	methods: {
		submit: function() {
			this.$emit("func", this.name, this.recommend);
		}
	}
});

Vue.component('v-promanageshow', {
	template: "#proManageShow",
	props: ['products', 'proType'],
	methods: {
		deletePro: function(arg) {
			this.$emit("func", arg);
		}
	}
});

Vue.component('v-promanageadd', {
	template: "#proManageAdd",
	data: function() {
		return {
			proname: '',
			prodesc: '',
			proprice: '',
			origprice: '',
			prostock: ''
		}
	},
	methods: {
		upProInfo: function() {
			this.$emit("func", this.proname, this.prodesc, this.proprice, this.origprice, this.prostock);
		}
	}
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
			if (delflag === "cate_del") {
				markCate = "delete_cate"
				requestUrl = "http://127.0.0.1:8000/demo_mybatis/bs_add_category_jsons.tml";
			} else if (delflag === "pro_del") {
				markCate = "delete_pro"
				requestUrl = "http://127.0.0.1:8000/demo_mybatis/bs_products_manage_jsons.tml";
			}
			vm.showDialog = false;
			var paramData = {
				"name": "a",
				"recommend": "a",
				"markCate": markCate,
				"cateId": arg
			};
			console.log("上送数据--------->" + this.cate);
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
						if (delflag === "cate_del") {
							vm.getInfoInit();
						} else if (delflag === "pro_del") {
							vm.gotoProManage(vm.typeId);
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
	el: '#app',
	data: {
		typeId: '',
		typeParId: '',
		typeName: '',
		pageCount: '',
		name: '',
		recommend: '',
		cateList: [
			// {"typeName":"����","typeId":"253789","id":"0b154c5e-3761-4709-a792-0921ef41deac","typeParId":"1"},
			// {"typeName":"�ⷿ","typeId":"329874","id":"22d3f5ee-91d2-4822-a28b-40530114e611","typeParId":"1"},
			// {"typeName":"����","typeId":"041736","id":"d9af3ceb-e827-455f-a4ab-639163f93242","typeParId":"1"},
			// {"typeName":"�ֻ�","typeId":"970358","id":"dd5181d3-f3e5-4c9c-80a2-f4802b78e5c9","typeParId":"1"}
		],
		countList: [],
		msg: '',
		showDialog: false,
		type: 1,
		cate: '',
		message: {
			show: false,
			type: 'c-message--success',
			status: 'messageFadeInDown',
			text: '操作成功',
			time: 2000,
			timeout: null
		},
		displayMode: 1,
		proType: '',
		products: [],
		proname: '',
		prodesc: '',
		proprice: '',
		origprice: '',
		prostock: '',
		list: [],
		delflag: ''
	},

	mounted: function() {
		this.getInfoInit();
		this.loadComments();
	},
	methods: {

		loadComments: function() {
			var typeId = localStorage.getItem("typeId");
			this.typeId = typeId
		},

		getInfoInit: function() {
			var requestUrl = "http://127.0.0.1:8000/demo_mybatis/bs_add_category_jsons.tml";
			var paramData = {
				"name": "a",
				"recommend": "a",
				"markCate": "init_cate"
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
						//var message = $.parseJSON(data)
						console.log(data.robj.categorysList);
						vm.cateList = data.robj.categorysList;
						vm.pageCount = '9';
					} else if (data.rcode === "290010") {
						//alert("该分类已存在..");
						vm.Alert("该分类已存在", "warning", 2000);
					}
				},
				error: function() {
					//alert("Unexpected error");
					vm.Alert("Unexpected error", "error", 2000);
				}

			});
		},
		//分类提交
		// submit: function() {
		// 	if (isNull(this.name) || isNull(this.recommend)) {
		// 		alert("请输入分类名称或推荐优先级..");
		// 		return;
		// 	}
		// 	var requestUrl = "http://127.0.0.1:8000/demo_mybatis/bs_add_category_jsons.tml";
		// 	var paramData = {
		// 		"name": this.name,
		// 		"recommend": this.recommend
		// 	};
		// 	console.log("上送数据--------->");
		// 	console.log(paramData);
		// 	$.ajax({
		// 		type: "POST",
		// 		url: requestUrl,
		// 		data: JSON.stringify(paramData),
		// 		dataType: "json",
		// 		contentType: "application/json;charset=UTF-8",
		// 		success: function(data) {　　　　　　　　　　　　 //var message = $.parseJSON(data);//后台返回的json数据需要转为对象
		// 			//vue.selectById=message;//把后台返回的JSON数据赋给selectById
		// 			console.log(data.transCode + "接口返回--------->");
		// 			console.log(data);
		// 			if (data.rcode === "000000") {
		// 				//window.location.href = "http://localhost:8080/graduClient/HTML/index.html";
		// 				vm.getInfoInit();
		// 				vm.Alert("添加成功", "success", 2000);
		// 			} else if (data.rcode === "290010") {
		// 				alert("该分类已存在..");
		// 			}
		// 		},
		// 		error: function() {
		// 			alert("Unexpected error");
		// 		}

		// 	});
		// },
		submit: function(obj1, obj2) {
			if (isNull(obj1) || isNull(obj2)) {
				vm.Alert("请输入分类名称或推荐优先级", "warning", 2000);
				//alert("请输入分类名称或推荐优先级..");
				return;
			}
			var requestUrl = "http://127.0.0.1:8000/demo_mybatis/bs_add_category_jsons.tml";
			var paramData = {
				"name": obj1,
				"recommend": obj2
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
						vm.getInfoInit();
						vm.Alert("添加成功", "success", 2000);
					} else if (data.rcode === "290010") {
						vm.Alert("该分类已存在", "warning", 2000);
						//alert("该分类已存在..");
					}
				},
				error: function() {
					alert("Unexpected error");
				}

			});
		},
		//分类删除
		deleteCate: function(arg) {
			this.msg = "你确定删除此项？";
			this.showDialog = !this.showDialog;
			this.type = 2;
			this.cate = arg;
			this.delflag = "cate_del";
			console.log("arg==========" + arg);
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
		},
		//跳转至商品管理页面
		gotoProManage: function(arg) {
			localStorage.setItem("typeId")
			this.displayMode = 2;
			//this.proType = "手机";
			var requestUrl = "http://127.0.0.1:8000/demo_mybatis/bs_products_manage_jsons.tml";
			var paramData = {
				"typeId": arg,
				"markPro": "get_products_info"
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
						vm.products = data.robj.productList;
						vm.proType = "手机";
						//vm.getInfoInit();
						//vm.Alert("添加成功", "success", 2000);
					} else if (data.rcode === "290010") {
						vm.Alert("Unexpected error", "error", 2000);
						//alert("该分类已存在..");
					}
				},
				error: function() {
					vm.Alert("Unexpected error", "error", 2000);
				}

			});
		},
		//增加商品
		upProInfo: function(arg1, arg2, arg3, arg4, arg5) {
			//this.proname, this.prodesc,this.proprice,this.origprice,this.prostock
			if (isNull(arg1) || isNull(arg2) || isNull(arg3) || isNull(arg4) || isNull(arg5)) {
				//alert("请输入分类名称或推荐优先级..");
				vm.Alert("请填完必要信息！", "warning", 2000);
				return;
			}
			var requestUrl = "http://127.0.0.1:8000/demo_mybatis/bs_products_manage_jsons.tml";
			var paramData = {
				"goodName": arg1,
				"goodDec": arg2,
				"originalPrice": arg4,
				"goodPrice": arg3,
				"goodStock": arg5,
				"markPro": "insert_products",
				"typeId": this.typeId
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
						//vm.getInfoInit();
						vm.gotoProManage(vm.typeId);
						vm.Alert("添加成功", "success", 2000);
					} else if (data.rcode === "290010") {
						vm.Alert("该分类已存在", "success", 2000);
						//alert("该分类已存在..");
					}
				},
				error: function() {
					// alert("Unexpected error");
					vm.Alert("Unexpected error", "error", 2000);
				}

			});
		},
		//删除商品
		deletePro: function(arg) {
			this.msg = "你确定删除此项？";
			this.showDialog = !this.showDialog;
			this.type = 2;
			this.cate = arg;
			this.delflag = "pro_del";
			console.log("arg==========" + arg);
		}
		
	}

});