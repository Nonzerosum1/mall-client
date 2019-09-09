Vue.component('v-topbar', {
	template: "#topBar",
	data: function() {
		return {
			perInfo: false,
			keywords: '',
			searchflag: true,
			searchColorFlag:0
		}
	},
	props: ['topinfo', 'datalist'],
	methods: {
		infoShow() {
			this.perInfo = true;
		},
		infoHid() {
			this.perInfo = false;
		},
		signOut() {
			localStorage.removeItem("password");
			localStorage.removeItem("userName");
			vm.getInfoInit();
		},
		login() {
			window.location.href = "http://localhost:8080/graduClient/HTML/login.html";
		},
		gotoShopCart() {
			var userName = localStorage.getItem("userName");
			var password = localStorage.getItem("password");
			console.log("userName--------->" + userName);
			console.log("password--------->" + password);
			if (!isNull(userName) && !isNull(password)) {
				vm.topinfo.isRegister = false;
				vm.topinfo.isLogin = false;
				vm.topinfo.isShowName = true;
				vm.topinfo.nickName = userName;
				window.location.href = "http://localhost:8080/graduClient/HTML/shoppingCart.html";
			} else {
				vm.topinfo.isRegister = true;
				vm.topinfo.isLogin = true;
				vm.topinfo.isShowName = false;
				vm.topinfo.nickName = "";
				vm.Alert("登录后才能查看购物车哦！", "info", 2000);
			}
		},
		indexHome() {
			window.location.href = "http://localhost:8080/graduClient/HTML/exmIndex.html";
		},
		searchPro() {

		},
		appClick(arg) {
			this.$emit("func1",arg);
		},
		search(keywords) {
			var newList = this.datalist.filter(item => {
				// if(item.name.indexOf(keywords) != -1){}
				if (item.keyname.includes(keywords)) {
					return true
				}
			})
			this.searchflag = true;
			return newList
		},
		hidePanelSearch() {
			this.searchflag = false;
		},
		showPanelSearch(){
			this.searchflag = true;
		},
		searchColorShow(arg){
			this.searchColorFlag = arg + 1;
		},
		searchColorHid(arg){
			this.searchColorFlag = 0;
		},
		gotoAbout(){
			window.location.href="http://localhost:8080/graduClient/HTML/about.html";
		}
	}
});

var ctx = 'clickoutside'
var nodeList = []
var isServer = Vue.prototype.$isServer
var seed = 0
var startClick

// 用来绑定事件的方法，它是一个自执行的函数，会根据是否运行于服务器和是否支持addEventListener来返回一个function
var on = (function() {
    if (!isServer && document.addEventListener) {
        return function(element, event, handler) {
            if (element && event && handler) {
                element.addEventListener(event, handler, false)
            }
        }
    } else {
        return function(element, event, handler) {
            if (element && event && handler) {
                element.attachEvent('on' + event, handler)
            }
        }
    }
})()
// 返回一个方法用来在点击的时候触发函数（触发之前会判断该元素是不是el，是不是focusElment以及他们的后代元素，如果是则不会执行函数）
function createDocumentHandler(el, binding, vnode) {
    return function(mouseup = {}, mousedown = {}) {
        if (!vnode ||
            !vnode.context ||
            !mouseup.target ||
            !mousedown.target ||
            el.contains(mouseup.target) ||
            el.contains(mousedown.target) ||
            el === mouseup.target || (vnode.context.focusElment &&
                (vnode.context.focusElment.contains(mouseup.target) ||
                    vnode.context.focusElment.contains(mousedown.target)))
        ) {
            return
        }
        if (binding.expression &&
            el[ctx].methodName &&
            vnode.context[el[ctx].methodName]) {
            vnode.context[el[ctx].methodName]()
        } else {
            el[ctx].bindingFn && el[ctx].bindingFn()
        }
    }
}

if (!isServer) {
    on(document, 'mousedown', e => (startClick = e))
    on(document, 'mouseup', e => {
        // 循环所有的绑定节点，把它们的documentHandler属性所绑定的函数执行一次（这个时候得到的刚好是上面的那个判断执行的函数）
        nodeList.forEach(node => node[ctx].documentHandler(e, startClick))
    })
}


Vue.directive('clickoutside', {
    // 当被绑定的元素插入到dom时……
    inserted(el) {
        console.log(el)
    },
    // 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置
    // 把绑定的元素扔到nodeList里面，并给绑定元素设置属性
    // documentHandler属性在nodeList.forEach的时候执行并得到一个function
    // bindingFn 是绑定的那个值，用来执行的
    bind(el, binding, vnode) {
        nodeList.push(el)
        const id = seed++
            el[ctx] = {
                id,
                documentHandler: createDocumentHandler(el, binding, vnode),
                methodName: binding.expression,
                bindingFn: binding.value
            }
    },
    // 所在组件的 VNode 更新时调用
    update(el, binding, vnode) {
        el[ctx].documentHandler = createDocumentHandler(el, binding, vnode)
        el[ctx].methodName = binding.expression
        el[ctx].bindingFn = binding.value
    },
    // 只调用一次，指令与元素解绑时调用
    unbind(el, binding, vnode) {
        const len = nodeList.length
        for (let i = 0; i < len; i++) {
            if (nodeList[i][ctx].id === el[ctx].id) {
                nodeList.splice(i, 1)
                break
            }
        }
        delete el[ctx]
    }
});


Vue.component('v-imgbar', {
	template: "#imgBar",
	props: {
		initialSpeed: {
			type: Number,
			default: 40
		},
		initialInterval: {
			type: Number,
			default: 4
		}
	},
	data: function() {
		return {
			sliders: [{
				img: '../img/bg1.jpg'
			}, {
				img: '../img/bg2.png'
			}, {
				img: '../img/bg3.jpg'
			}, {
				img: '../img/bg4.jpg'
			}],
			currentIndex: 1,
			distance: -1920,
			transitionEnd: true,
			speed: this.initialSpeed,
			isShow: false,
			colorFlagLeft: "left",
			colorFlagRight: "right"
		}
	},
	computed: {
		containerStyle() {
			return {
				transform: `translate3d(${this.distance}px, 0, 0)`
			}
		},
		interval() {
			return this.initialInterval * 1000
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			this.play()
			window.onblur = function() {
				this.stop()
			}.bind(this)
			window.onfocus = function() {
				this.play()
			}.bind(this)
		},
		move(offset, direction, speed) {
			if (!this.transitionEnd) return
			this.transitionEnd = false
			direction === -1 ? this.currentIndex += offset / 1920 : this.currentIndex -= offset / 1920
			if (this.currentIndex > 4) this.currentIndex = 1
			if (this.currentIndex < 1) this.currentIndex = 4
			const destination = this.distance + offset * direction
			this.animate(destination, direction, speed)
		},
		animate(des, direc, speed) {
			if (this.temp) {
				window.clearInterval(this.temp)
				this.temp = null
			}
			this.temp = window.setInterval(() => {
				if ((direc === -1 && des < this.distance) || (direc === 1 && des > this.distance)) {
					this.distance += speed * direc
				} else {
					this.transitionEnd = true
					window.clearInterval(this.temp)
					this.distance = des
					if (des < -7680) this.distance = -1920
					if (des > -1920) this.distance = -7680
				}
			}, 20)
		},
		jump(index) {
			const direction = index - this.currentIndex >= 0 ? -1 : 1
			const offset = Math.abs(index - this.currentIndex) * 1920
			const jumpSpeed = Math.abs(index - this.currentIndex) === 0 ? this.speed : Math.abs(index - this.currentIndex) * this.speed
			this.move(offset, direction, jumpSpeed)
		},
		play() {
			if (this.timer) {
				window.clearInterval(this.timer)
				this.timer = null
			}
			this.timer = window.setInterval(() => {
				this.move(1920, -1, this.speed)
			}, this.interval)
			this.isShow = false
		},
		stop() {
			window.clearInterval(this.timer)
			this.timer = null
			this.isShow = true
		},
		btnleftover() {
			this.colorFlagLeft = "F";
		},
		btnleftleave() {
			this.colorFlagLeft = "left";
		},
		btnrightover() {
			this.colorFlagRight = "F";
		},
		btnrightleave() {
			this.colorFlagRight = "right";
		}
	}
});

Vue.component('v-slodbar', {
	template: "#slodBar"
});

Vue.component('v-tabbarwrap', {
	template: "#tabbarWrap",
	data: function() {
		return {
			displayMode: ''
		}
	},
	props: ['flagbar', 'flagline', 'cateListArr'],
	methods: {
		mobileSect: function() {
			this.$emit("func1");
		},
		// newSect: function() {
		// 	this.$emit("func2");
		// },
		getProBycate: function(arg1, arg2) {
			this.$emit("func3", arg1, arg2);
			localStorage.setItem("typeId", arg1);
		}
	}
});

Vue.component('v-goodlist', {
	template: "#goodList",
	props: ['proListArr'],
	methods: {
		gotoDetailPage: function(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11,arg12) {
			console.log("arg1-------->" + arg1);
			console.log("arg2-------->" + arg2);
			console.log("arg3-------->" + arg3);
			console.log("arg4-------->" + arg4);
			var detailPageInfo = {};
			detailPageInfo.goodId = arg1;
			detailPageInfo.detailedPageDesc = arg2;
			detailPageInfo.detailedPageTitle = arg3;
			detailPageInfo.goodCapacity = arg4;
			detailPageInfo.goodPrice = arg5;
			detailPageInfo.originalPrice = arg6;
			detailPageInfo.goodDesc = arg7;
			detailPageInfo.salesVolume = 1;
			detailPageInfo.goodName = arg8;
			detailPageInfo.goodParam = arg9;
			detailPageInfo.goodStock = arg10;
			detailPageInfo.subtitle = arg11;
			detailPageInfo.goodImg = arg12;


			localStorage.setItem("detailPageInfo", JSON.stringify(detailPageInfo));
			window.location.href = "http://localhost:8080/graduClient/HTML/detailPage.html";
		}
	}
});

Vue.component('v-pagin', {
	template: "#pagination",
	data: function() {
		return {
			current: this.currentPage
		}
	},
	props: {
		total: { // 数据总条数
			type: Number,
			default: 0
		},
		display: { // 每页显示条数
			type: Number,
			default: 20
		},
		currentPage: { // 当前页码
			type: Number,
			default: 1
		},
		pagegroup: { // 分页条数
			type: Number,
			default: 5,
			coerce: function(v) {
				v = v > 0 ? v : 5;
				return v % 2 === 1 ? v : v + 1;
			}
		}
	},
	computed: {
		page: function() { // 总页数
			return Math.ceil(this.total / this.display);
		},
		grouplist: function() { // 获取分页页码
			var len = this.page,
				temp = [],
				list = [],
				count = Math.floor(this.pagegroup / 2),
				center = this.current;
			if (len <= this.pagegroup) {
				while (len--) {
					temp.push({
						text: this.page - len,
						val: this.page - len
					});
				};
				return temp;
			}
			while (len--) {
				temp.push(this.page - len);
			};
			var idx = temp.indexOf(center);
			(idx < count) && (center = center + count - idx);
			(this.current > this.page - count) && (center = this.page - count);
			temp = temp.splice(center - count - 1, this.pagegroup);
			do {
				var t = temp.shift();
				list.push({
					text: t,
					val: t
				});
			} while (temp.length);
			if (this.page > this.pagegroup) {
				(this.current > count + 1) && list.unshift({
					text: '...',
					val: list[0].val - 1
				});
				(this.current < this.page - count) && list.push({
					text: '...',
					val: list[list.length - 1].val + 1
				});
			}
			return list;
		}
	},
	methods: {
		setCurrent: function(idx) {
			if (this.current != idx && idx > 0 && idx < this.page + 1) {
				this.current = idx;
				this.$emit('pagechange', this.current);
			}
		}
	}
});

Vue.component('v-goodlistnew', {
	template: "#goodListNew"
});

var vm = new Vue({
	el: '#app',
	data: {
		topinfo: {
			isRegister: true,
			isLogin: true,
			isShowName: false,
			nickName: ''
		},
		message: {
			show: false,
			type: 'c-message--success',
			status: 'messageFadeInDown',
			text: '操作成功',
			time: 2000,
			timeout: null
		},
		displayMode: '',
		flagbar: 1,
		flagline: 1,
		cateListArr: [],
		proListArr: [],
		total: 0, // 记录总条数
		display: 10, // 每页显示条数
		currentPage: 1, // 当前的页数
		datalist: [],
		proSearchListArr:[],
		totalSearch:0
	},
	mounted: function() {
		this.getInfoInit();
		//this.getFirstCate();
		this.displayMode = "section_new";
	},
	// create:function(){

	// },
	methods: {
		getInfoInit: function() {

			var userName = localStorage.getItem("userName");
			var password = localStorage.getItem("password");
			console.log("userName--------->" + userName);
			console.log("password--------->" + password);

			var requestUrl = "http://127.0.0.1:8000/demo_mybatis/ind_init_info_jsons.tml";
			var paramData = {
				"matePro": "get_cate"
			};
			console.log("上送数据--------->");
			console.log(paramData);
			$.ajax({
				type: "POST",
				url: requestUrl,
				data: JSON.stringify(paramData),
				dataType: "json",
				contentType: "application/json;charset=UTF-8",
				success: function(data) {
					console.log(data.transCode + "接口返回--------->");
					console.log(data);
					if (data.rcode === "000000") {
						//window.location.href = "http://localhost:8080/graduClient/HTML/index.html";
						//vm.Alert("添加成功", "success", 2000);
						//console.log("data.robj.userName---->" + data.robj.userName);
						//console.log("data.robj.cateListArr---->" + data.robj.cateListArr);
						vm.cateListArr = data.robj.cateListArr;

						if (!isNull(userName) && !isNull(password)) {
							vm.topinfo.isRegister = false;
							vm.topinfo.isLogin = false;
							vm.topinfo.isShowName = true;
							vm.topinfo.nickName = userName;
						} else {
							vm.topinfo.isRegister = true;
							vm.topinfo.isLogin = true;
							vm.topinfo.isShowName = false;
							vm.topinfo.nickName = "";
						}
						// var typeId  = vm.cateListArr;
						// console.log("typeIdw----------->" + typeId[0].typeId);
						vm.getFirstCate();
					} else if (data.rcode === "290010") {
						vm.Alert("该分类已存在", "warning", 2000);
						//alert("该分类已存在..");
					} else {
						vm.Alert("Unexpected error", "error", 2000);
					}
				},
				error: function() {
					//alert("Unexpected error");
					vm.Alert("Unexpected error", "error", 2000);
				}

			});
		},
		getFirstCate: function() {

			var cate_arr = this.cateListArr;
			var typeId = cate_arr[0].typeId;
			console.log("typeId----->" + typeId);
			var requestUrl = "http://127.0.0.1:8000/demo_mybatis/ind_init_info_jsons.tml";
			var paramData = {
				//"typeId": this.cateListArr[0].typeId,
				"typeId": typeId,
				"currentPage": this.currentPage,
				"matePro": "get_first_pro"
			};
			console.log("上送数据--------->");
			console.log(paramData);
			$.ajax({
				type: "POST",
				url: requestUrl,
				data: JSON.stringify(paramData),
				dataType: "json",
				contentType: "application/json;charset=UTF-8",
				success: function(data) {
					console.log(data.transCode + "接口返回--------->");
					console.log(data);
					if (data.rcode === "000000") {
						//window.location.href = "http://localhost:8080/graduClient/HTML/index.html";
						//vm.Alert("添加成功", "success", 2000);
						vm.proListArr = data.robj.proListArr;
						vm.total = data.robj.count;
						vm.display = data.robj.limit;
						vm.datalist = data.robj.goodPtListAllArr;
					} else if (data.rcode === "290010") {
						vm.Alert("Unexpected error", "warning", 2000);
						//alert("该分类已存在..");
					} else {
						vm.Alert("Unexpected error", "error", 2000);
					}
				},
				error: function() {
					//alert("Unexpected error");
					vm.Alert("Unexpected error", "error", 2000);
				}

			});
		},
		mobileSect: function() {
			this.displayMode = 'section_mobile';
			this.flagbar = 4;
			this.flagline = 4;
		},
		newSect: function() {
			//this.displayMode = 'section_new';
			this.flagbar = vm.cateListArr.length;
			this.flagline = vm.cateListArr.length;
		},
		getProBycate: function(arg1, arg2) {
			this.flagbar = arg2 + 1;
			this.flagline = arg2 + 1;
			if(arg1 == "search"){
				vm.proListArr = vm.proSearchListArr;
				vm.total = vm.totalSearch;
				vm.limit = 20;
				return;
			}
			var requestUrl = "http://127.0.0.1:8000/demo_mybatis/ind_init_info_jsons.tml";
			var paramData = {
				//"typeId": this.cateListArr[0].typeId,
				"typeId": arg1,
				"matePro": "get_first_pro"
			};
			console.log("上送数据--------->");
			console.log(paramData);
			$.ajax({
				type: "POST",
				url: requestUrl,
				data: JSON.stringify(paramData),
				dataType: "json",
				contentType: "application/json;charset=UTF-8",
				success: function(data) { 
					console.log(data.transCode + "接口返回--------->");
					console.log(data);
					if (data.rcode === "000000") {
						//window.location.href = "http://localhost:8080/graduClient/HTML/index.html";
						//vm.Alert("添加成功", "success", 2000);
						vm.proListArr = data.robj.proListArr;
						vm.total = data.robj.count;
						vm.display = data.robj.limit;
					} else if (data.rcode === "290010") {
						vm.Alert("Unexpected error", "warning", 2000);
						//alert("该分类已存在..");
					} else {
						vm.Alert("Unexpected error", "error", 2000);
					}
				},
				error: function() {
					//alert("Unexpected error");
					vm.Alert("Unexpected error", "error", 2000);
				}

			});
		},
		pagechange: function(currentPage) {
			console.log("currentPage------->" + currentPage);
			// ajax请求, 向后台发送 currentPage, 来获取对应的数据
			var cate_arr = this.cateListArr;
			var typeId = localStorage.getItem("typeId");
			var keywords =  localStorage.getItem("keywords");

			console.log("typeId----->" + typeId);
			var requestUrl = "http://127.0.0.1:8000/demo_mybatis/ind_init_info_jsons.tml";
			if(typeId == "search"){
				var paramData = {
					"keywords": keywords,
					"currentPage": currentPage,
					"matePro": "search_pro"
				};
			}else {
				var paramData = {
					"typeId": typeId,
					"currentPage": currentPage,
					"matePro": "get_first_pro"
				};
			}
			
			console.log("上送数据--------->");
			console.log(paramData);
			$.ajax({
				type: "POST",
				url: requestUrl,
				data: JSON.stringify(paramData),
				dataType: "json",
				contentType: "application/json;charset=UTF-8",
				success: function(data) {
					console.log(data.transCode + "接口返回--------->");
					console.log(data);
					if (data.rcode === "000000") {
						//window.location.href = "http://localhost:8080/graduClient/HTML/index.html";
						//vm.Alert("添加成功", "success", 2000);
						if(typeId == "search"){
							vm.proListArr = data.robj.proSearchListArr;
							vm.proSearchListArr = data.robj.proSearchListArr;
							vm.newSect();
						}else {
							vm.proListArr = data.robj.proListArr;
							vm.total = data.robj.count;
							vm.display = data.robj.limit;
						}
						
					} else if (data.rcode === "290010") {
						vm.Alert("Unexpected error", "warning", 2000);
						//alert("该分类已存在..");
					} else {
						vm.Alert("Unexpected error", "error", 2000);
					}
				},
				error: function() {
					//alert("Unexpected error");
					vm.Alert("Unexpected error", "error", 2000);
				}

			});

		},
		appClick(arg) {
			localStorage.setItem("keywords", arg);
			var requestUrl = "http://127.0.0.1:8000/demo_mybatis/ind_init_info_jsons.tml";
			var paramData = {
				//"typeId": this.cateListArr[0].typeId,
				"keywords": arg,
				"matePro": "search_pro"
			};
			console.log("上送数据--------->");
			console.log(paramData);
			$.ajax({
				type: "POST",
				url: requestUrl,
				data: JSON.stringify(paramData),
				dataType: "json",
				contentType: "application/json;charset=UTF-8",
				success: function(data) {
					console.log(data.transCode + "接口返回--------->");
					console.log(data);
					if (data.rcode === "000000") {
						//window.location.href = "http://localhost:8080/graduClient/HTML/index.html";
						//vm.Alert("添加成功", "success", 2000);
						vm.total = data.robj.count;
						vm.totalSearch = data.robj.count;
						vm.display = data.robj.limit;
						vm.proListArr = data.robj.proSearchListArr;
						vm.proSearchListArr = data.robj.proSearchListArr;
						if(vm.cateListArr[vm.cateListArr.length - 1].typeId != "search"){
							vm.cateListArr.push({"typeId":"search","typeName":"搜索结果"});
						}
						localStorage.setItem("typeId", "search");

						vm.newSect();
					} else if (data.rcode === "290010") {
						vm.Alert("Unexpected error", "warning", 2000);
						//alert("该分类已存在..");
					} else {
						vm.Alert("Unexpected error", "error", 2000);
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