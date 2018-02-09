<template>
	<div class="authSection">
		<slot v-if="isShow"></slot>
	</div>
</template>

<script>
	export default {
		props: ['name'],
		data() {
			return {
				isShow: false
			};
		},
		created() {
			this.$nextTick(() => {
				this.$root.eventHub.$emit('authSection', {
				    elementName: this.name
				});
			});
		},
		mounted() {
			this.$root.eventHub.$on("authSectionWrap",(value) => {
				if (value[this.name]) {
					this.isShow = true;
				}
			})
		},
		destroyed() {
			this.$off("authSectionWrap");
		}
	};
</script>
<style>
	.authSection {
		display: inline-block;
	}
</style>