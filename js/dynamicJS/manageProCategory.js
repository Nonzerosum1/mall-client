
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
	props:['msg','showDialog','type','cate'],
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
		deleteCateTemp(arg) {
			//vm.showDialog = false;
			this.close();
			var requestUrl = "http://127.0.0.1:8000/demo_mybatis/bs_add_category_jsons.tml";
			var paramData = {
				"name": "a",
				"recommend": "a",
				"markCate": "delete_cate",
				"cateId": arg
			};
			console.log("上送数据--------->"+this.type_id);
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
						//alert("删除成功..")
					} else if (data.rcode === "290010") {
						alert("该分类已存在..");
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
		msg:'',
		showDialog:false,
		type:1,
		cate:'',
		message: {
            show: false,
            type: 'c-message--success',
            status: 'messageFadeInDown',
            text: '操作成功',
            time: 2000,
            timeout: null
        }
	},

	mounted: function() {
		this.getInfoInit();
	},
	methods: {
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
						alert("该分类已存在..");
					}
				},
				error: function() {
					alert("Unexpected error");
				}

			});
		},
		//分类提交
		submit: function() {
			if (isNull(this.name) || isNull(this.recommend)) {
				alert("请输入分类名称或推荐优先级..");
				return;
			}
			var requestUrl = "http://127.0.0.1:8000/demo_mybatis/bs_add_category_jsons.tml";
			var paramData = {
				"name": this.name,
				"recommend": this.recommend
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
						vm.Alert("添加成功","success",2000);
					} else if (data.rcode === "290010") {
						alert("该分类已存在..");
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

            console.log("arg==========" + arg);
		},
		//消息提示
		Alert: function (text, type, time) {
            vm.message.status = '';
            clearTimeout(vm.timeout)
            vm.message.text = (typeof text == 'string') && text ? text : '我是默认';
            vm.message.time = time ? time : 2000;
            vm.message.type = 'c-message--' + (type ? type : 'info');
            vm.message.show = true;
            vm.message.status = 'messageFadeInDown';
            vm.timeout = setTimeout(function () {
                vm.message.status = 'messageFadeOutUp'
                // event.target.addEventListener('transitionend', function () {
                //     alert('动画结束了！');
                // }, false)
            }, vm.message.time)
        },
	}
	//router
});