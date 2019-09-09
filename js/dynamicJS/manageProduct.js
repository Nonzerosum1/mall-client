Vue.component('v-header', {
	template: "#header",
	methods:{
		gotoCateManage(){
			window.location.href="http://localhost:8080/graduClient/HTML/exm2.html";
		}
	}
});

Vue.component('v-promanageshow', {
	template: "#proManageShow",
	data() {
		return {
			imgList:[],
			size:0,
			goodId:''
		}
	},
	props: ['products', 'proType'],
	// data:function(){
	// 	return{

	// 	}
	// }，
	methods: {
		deletePro: function(arg) {
			this.$emit("func", arg);
		},
		addProduct:function(){
			window.location.href = "http://localhost:8080/graduClient/HTML/addProduct.html";
		},
		editManage(arg){

		},
		attrManage(arg){

		},
		picManage(arg){
			this.goodId = arg;
			console.log("arg============>" + arg);
		},
		updatePic(){
			var requestUrl = "http://127.0.0.1:8000/demo_mybatis/bs_products_manage_jsons.tml";
			var paramData = {
				"imgList": this.imgList,
				"goodId": this.goodId,
				"markPro": "updata_products_pic"
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
						// window.location.href = "http://localhost:8080/graduClient/HTML/index.html";
						vm.Alert("修改成功", "success", 2000);
						vm.getProManage();
						window.location.href = "http://localhost:8080/graduClient/HTML/manageProduct.html";
					} else if (data.rcode === "000001") {
						vm.Alert("Request Parameter Missing", "error", 2000);
						//alert("该分类已存在..");
					}
				},
				error: function() {
					//alert("Unexpected error");
					vm.Alert("Unexpected error", "error", 2000);
				}

			});
		},
		fileClick() {
            document.getElementById('upload_file').click();
      	},
      	fileChange(el) {
	        if (!el.target.files[0].size) return;
	        this.fileList(el.target);
	        el.target.value = ''
	    },
	    fileList(fileList) {
            let files = fileList.files;
            for (let i = 0; i < files.length; i++) {
               //判断是否为文件夹
               if (files[i].type != '') {
                   this.fileAdd(files[i]);
               } else {
                   //文件夹处理
                   this.folders(fileList.items[i]);
               }
          	 }
    	},
    	//文件夹处理
        folders(files) {
              let _this = this;
              //判断是否为原生file
              if (files.kind) {
                  files = files.webkitGetAsEntry();
              }
              files.createReader().readEntries(function (file) {
                  for (let i = 0; i < file.length; i++) {
                      if (file[i].isFile) {
                          _this.foldersAdd(file[i]);
                      } else {
                          _this.folders(file[i]);
                      }
                  }
              })
        },
        foldersAdd(entry) {
              let _this = this;
              entry.file(function (file) {
                  _this.fileAdd(file)
              })
        },
        fileAdd(file) {
              //总大小
              this.size = this.size + file.size;
              //判断是否为图片文件
              if (file.type.indexOf('image') == -1) {
                  file.src = 'wenjian.png';
                  this.imgList.push({
                      file
                  });
              } else {
                  let reader = new FileReader();
                  reader.vue = this;
                  reader.readAsDataURL(file);
                  reader.onload = function () {
                      file.src = this.result;
                      this.vue.imgList.push({
                          file
                      });
                      console.log("result=======>" + this.result);
                  }
              }

        },
        fileDel(index) {
              this.size = this.size - this.imgList[index].file.size;//总大小
              this.imgList.splice(index, 1);
        },
        bytesToSize(bytes) {
              if (bytes === 0) return '0 B';
              let k = 1000, // or 1024
                  sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                  i = Math.floor(Math.log(bytes) / Math.log(k));
              return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
        },
        dragenter(el) {
              el.stopPropagation();
              el.preventDefault();
        },
        dragover(el) {
              el.stopPropagation();
              el.preventDefault();
        },
        drop(el) {
              el.stopPropagation();
              el.preventDefault();
              this.fileList(el.dataTransfer);
        }
	}
});

Vue.component('v-contpage', {
	template: "#contPage",
	props: ['pageCount']
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
			if (delflag === "cartshop_del") {
				markCate = "delete_cart"
				requestUrl = "http://127.0.0.1:8000/demo_mybatis/sc_cart_manage_jsons.tml";
			} else if (delflag === "pro_del") {
				markCate = "delete_pro"
				requestUrl = "http://127.0.0.1:8000/demo_mybatis/bs_products_manage_jsons.tml";
			}
			vm.showDialog = false;
			var paramData = {
				"markCate": markCate,
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
							vm.getProManage();
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
	el:'#app',
	data:{
		proType: '',
		products: [],
		typeId:'',
		typeName:'',
		pageCount:'9',
		proname: '',
		prodesc: '',
		proprice: '',
		origprice: '',
		prostock: '',
		message: {
			show: false,
			type: 'c-message--success',
			status: 'messageFadeInDown',
			text: '操作成功',
			time: 2000,
			timeout: null
		},
		msg: '',
		showDialog: false,
		type: 1,
		cate: '',
		delflag: ''
	},
	mounted:function(){
		this.loadComments();
		this.getProManage();
	},
	methods:{
		loadComments: function() {
			var typeId = localStorage.getItem("typeId");
			this.typeId = typeId;
			var typeName = localStorage.getItem("typeName");
			this.proType = typeName;
		},
		//跳转至商品管理页面
		getProManage: function() {
			//var typeId = localStorage.getItem("typeId");
			this.displayMode = 2;
			//this.proType = "手机";
			var requestUrl = "http://127.0.0.1:8000/demo_mybatis/bs_products_manage_jsons.tml";
			var paramData = {
				"typeId": this.typeId,
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
		//删除商品
		deletePro: function(arg) {
			this.msg = "你确定删除此项？";
			this.showDialog = !this.showDialog;
			this.type = 2;
			this.cate = arg;
			this.delflag = "pro_del";
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
		}
	}
});