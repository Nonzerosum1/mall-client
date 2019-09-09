Vue.component('v-header', {
	template: "#header"
});

Vue.component('v-progressbar',{
	template:"#progressBar",
	props:['flagbar2','flagbar3']
});

Vue.component('v-promanageadd1', {
	template: "#proManageAdd1",
	data: function() {
		return {
			proinfopage_1:{
				ategories:'',
				proname: '',
				prodesc: '',
				proprice: '',
				origprice: '',
				prostock: '',
				subtitle: '',
				itemnum: '',
				unitofmeas: '',
				goodweight: '',
				goodsort: ''
			}
			
		}
	},
	methods: {
		// upProInfo: function() {
		// 	//this.$emit("func", this.proname, this.prodesc, this.proprice, this.origprice, this.prostock);
		// },
		nextStep2:function(){
			this.$emit("func",this.proinfopage_1);
		}
	}
});

Vue.component('v-promanageadd2',{
	template:"#proManageAdd2",
	data:function(){
		return{
			proinfopage_2:{
				giftpoint:'',
				giftgrowthvalue:'',
				trailnoticegood:[],
				commodityshelves:[],
				productsfeaturednew:[],
				productsfeaturedtui:[],
				service1:[],
				service2:[],
				service3:[],
				detailedpagetitle:'',
				detailedpagedesc:'',
				goodkeywords:'',
				goodnote:''
			}	
		}
	},
	methods:{
		nextStep1:function(){
			this.$emit("func1");
		},
		nextStep3:function(){
			this.$emit("func2",this.proinfopage_2);
		}
	}
})

Vue.component('v-promanageadd3',{
	template:"#proManageAdd3",
	data:function(){
		return{
			proinfopage_3:{
				attributessort:'',
				goodsize:'',
				screensize:'',
				networktype:'',
				operatingsystem:'',
				batterycapacity:'',
				colorname:''
			},
			colorNameInp:'',
			goodnote:'',
			imgList:[],
			size:0
		}
	},
	props:['colorList'],
	methods:{
		addColor:function(){
			this.$emit("func",this.colorNameInp);
		},
		deleteColor:function(arg){
			this.$emit("funcdel",arg);
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
        },
        nextStep3_2() {
        	this.$emit("funcnext1");
        },
        upProInfo(){
        	this.$emit("funcnext2",this.proinfopage_3,this.imgList);
        	console.log("this.imgList=======>" + JSON.stringify(this.imgList));
        }

	}
});


var vm = new Vue({
	el:'#app',
	data:{
		displayMode:1,
		flagbar2:'',
		flagbar3:'',
		colorName:'',
  		colorList:[], //添加商品第三页颜色
  		proinfopage_1:{},
  		proinfopage_2:{},
  		proinfopage_3:{},
  		imgList:[],
  		message: {
			show: false,
			type: 'c-message--success',
			status: 'messageFadeInDown',
			text: '操作成功',
			time: 2000,
			timeout: null
		}
	},
	methods:{
		nextStep2:function(arg){
			this.proinfopage_1 = arg;
			console.log("proinfopage_1--------->" + JSON.stringify(this.proinfopage_1));
			if (isNull(this.proinfopage_1.proname) || isNull(this.proinfopage_1.subtitle) ||
				isNull(this.proinfopage_1.itemnum) || isNull(this.proinfopage_1.proprice) ||
				isNull(this.proinfopage_1.origprice) || isNull(this.proinfopage_1.prostock) ||
				isNull(this.proinfopage_1.goodsort)) {
				vm.Alert("未填完必要信息", "warning", 2000);
				//alert("请输入分类名称或推荐优先级..");
				return;
			}
			this.displayMode = 2;
			this.flagbar2 = true;			
		},
		nextStep1:function(){
			this.displayMode = 1;
		},
		nextStep3:function(arg){
			this.proinfopage_2 = arg;
			console.log("proinfopage_2--------->" + JSON.stringify(this.proinfopage_2));
			if (isNull(this.proinfopage_2.giftpoint) || isNull(this.proinfopage_2.giftgrowthvalue) ||
				isNull(this.proinfopage_2.commodityshelves) || isNull(this.proinfopage_2.detailedpagetitle) ||
				isNull(this.proinfopage_2.detailedpagedesc) || isNull(this.proinfopage_2.goodkeywords)) {
				vm.Alert("未填完必要信息", "warning", 2000);
				//alert("请输入分类名称或推荐优先级..");
				return;
			}
			this.displayMode = 3;
			this.flagbar3 = true;
		},
		nextStep3_2:function(){
			this.displayMode = 2;
		},
		addColor:function(arg){
			console.log("arg------------>" + arg);
			this.colorList.push({"colorName":arg});
		},
		deleteColor:function(arg){
			console.log("arg数组下标------------>" + arg);
			this.colorList.splice(arg,1);
		},
		upProInfo:function(arg1,arg2){
			this.proinfopage_3 = arg1;
			this.imgList = arg2;
			console.log("proinfopage_3--------->" + JSON.stringify(this.proinfopage_3));
			if (isNull(this.proinfopage_3.attributessort) || isNull(this.proinfopage_3.goodsize) ||
				isNull(this.proinfopage_3.screensize) || isNull(this.proinfopage_3.networktype) ||
				isNull(this.proinfopage_3.operatingsystem) || isNull(this.proinfopage_3.batterycapacity)) {
				vm.Alert("未填完必要信息", "warning", 2000);
				//alert("请输入分类名称或推荐优先级..");
				return;
			}
			vm.upAllProduct();
		},
		upAllProduct:function(){
			var typeId = localStorage.getItem("typeId");
			var requestUrl = "http://127.0.0.1:8000/demo_mybatis/bs_products_manage_jsons.tml";
			var paramData = {
				"proinfopage_1": this.proinfopage_1,
				"proinfopage_2": this.proinfopage_2,
				"proinfopage_3": this.proinfopage_3,
				"colorList": this.colorList,
				"imgList": this.imgList,
				"typeId": typeId,
				// "catedesc": this.catedesc,
				// "whethershow": this.whethershow,
				// "whetherbar": this.whetherbar,
				// "imgDataUrl": this.imgDataUrl,
				"markPro": "insert_products"
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
						window.location.href = "http://localhost:8080/graduClient/HTML/manageProduct.html";
						vm.Alert("添加成功", "success", 2000);
						
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
