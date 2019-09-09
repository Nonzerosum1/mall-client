export default {
	data() {
		return {
			_datalist: this.itemlist.concat(),
			datalist: this.itemlist.concat(),
			length: this.itemlist.length
		}
	},
	props: {
		'show': { //用于外部控制组件的显示/隐藏
			type: Boolean,
			default: true
		},
		'itemlist': Array,
		'placeholder': String,
		'nodatatext': String
	},
	directives: {
		'show-extend': function(el, binding, vnode) { //bind和 update钩子
			let value = binding.value,
				searchInput = null;
			if (value) {
				el.style.display = 'block';
			} else { //隐藏后，恢复初始状态
				el.style.display = 'none';
				searchInput = el.querySelector(".search-text");
				searchInput.value = '';
				vnode.context.datalist = vnode.context.itemlist; //还原渲染数据
			}
		}
	},
	methods: {
		appClick: function(data) {
			this.$emit('item-click', data);
		},
		search: function(e) {
			let vm = this,
				searchvalue = e.currentTarget.value;
			vm.datalist = vm.$data._datalist.filter(function(item, index, arr) {
				return item.name.indexOf(searchvalue) != -1;
			});
		}
	},
	mounted: function() {

	}
}