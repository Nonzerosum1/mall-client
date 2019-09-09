Vue.component('v-topbar', {
	template: "#topBar",
	data:function(){
		return {

		}
	},
	props:['topinfo','cartnumtop'],
	methods:{
		gotoAbout(){
			window.location.href="http://localhost:8080/graduClient/HTML/about.html";
		}
	}
});

Vue.component('v-navtop',{
	template:"#navTop"
});

Vue.component('v-buypage',{
	template:"#buyPage"
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

var vm = new Vue({
	el:"#app",
	data:{
		topinfo:{
			isRegister:true,
			isLogin:true,
			isShowName:false,
			nickName:''
		},
		cartnumtop:0
	},
	methods:{

	}
});