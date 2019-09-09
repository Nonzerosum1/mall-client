Vue.component('v-header', {
	template: "#header"
});

Vue.component('v-contaddcate', {
	template: "#contAddCate",
	data: function() {
		return {
			name: '',
			recommend: '',
			quantityunit: '',
			catesort: '',
			keyword: '',
			catedesc: '',
			whethershow: '',
			whetherbar: '',
			imgDataUrl:''
			//btnname:''
		}
	},
	//props: ['name','recommend'],
	// mounted:function(){
	// 	this.getCateDetail();
	// },
	methods: {
		getCateDetail:function(){
			var cateItem = JSON.parse(localStorage.getItem("cateItem"));
			console.log("cateItem---->" + cateItem);
			this.name = cateItem.typeName;
			this.recommend = cateItem.typeParId;
			this.quantityunit = cateItem.quantityunit;
			this.catesort = cateItem.catesort;
			this.keyword = cateItem.keyword;
			this.whethershow = cateItem.whethershow;
			this.whetherbar = cateItem.whetherbar;
			this.catedesc = cateItem.catedesc;
			//this.name = cateItem.name;
			//this.btnname = "提交修改";

		},
		//上传分类图片
		preview: function(e) {
			var files = document.getElementById("fileImg").files[0];
			var img = document.getElementById("img");
			var reader = new FileReader();
			reader.readAsDataURL(files);
			var that = this;
			reader.onload = function() {
				console.log("this.result:" + this.result);
				//img.src = this.result;
				that.imgDataUrl = this.result;
				console.log("图片路径blob:" + dataURItoBlob(that.imgDataUrl));
			}
		},
		submit: function() {
			//this.$emit("func", this.name, this.recommend);
			if (isNull(this.name) || isNull(this.recommend) ||
				isNull(this.quantityunit) || isNull(this.catesort) ||
				isNull(this.keyword) || isNull(this.catedesc) ||
				isNull(this.whethershow) || isNull(this.whetherbar)) {
				vm.Alert("未填完必要信息", "warning", 2000);
				//alert("请输入分类名称或推荐优先级..");
				return;
			}
			var requestUrl = "http://127.0.0.1:8000/demo_mybatis/bs_add_category_jsons.tml";
			var paramData = {
				"name": this.name,
				"recommend": this.recommend,
				"quantityunit": this.quantityunit,
				"catesort": this.catesort,
				"keyword": this.keyword,
				"catedesc": this.catedesc,
				"whethershow": this.whethershow,
				"whetherbar": this.whetherbar,
				"imgDataUrl": this.imgDataUrl,
				"markCate": "add_cate"
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
						vm.Alert("添加成功", "success", 2000);
					} else if (data.rcode === "290010") {
						vm.Alert("该分类已存在", "warning", 2000);
						//alert("该分类已存在..");
					}
				},
				error: function() {
					//alert("Unexpected error");
					vm.Alert("Unexpected error", "error", 2000);
				}

			});
		}
		
	}
});

var vm = new Vue({
	el: "#app",
	data: {
		name: '',
		recommend: '',
		message: {
			show: false,
			type: 'c-message--success',
			status: 'messageFadeInDown',
			text: '操作成功',
			time: 2000,
			timeout: null
		},
	},
	methods: {
		submit: function() {

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