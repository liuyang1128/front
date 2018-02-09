<template>
	<div class="authSectionWrap">
		<slot></slot>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				params: [],
				value: {}
			};
		},
		
		methods: {
			send() {
				if (this.params.length === 0) {
					return;
				}
				let data = this.params.toString();
				this.$http.post(
					'/finaloan-web/common/userPermissions.do',
					{
	                	permissions: data
	            	}
				).then((response) => {
	                this.value = response.data.data;
					this.$root.eventHub.$emit('authSectionWrap', this.value);
	            });
			},
		},
		mounted() {
			this.$root.eventHub.$on("authSection",(params) => {
				this.params.push(params.elementName);
				let len = this.params.length;
				if (len === document.querySelectorAll('.authSection').length) {
					this.send();
				}
			})
		},
		destroyed() {
			this.$off("authSection");
		}
	};
</script>
<style>
	.authSectionWrap {
		overflow: hidden;
	}
</style>