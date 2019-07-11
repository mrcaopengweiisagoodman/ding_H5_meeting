class CommonFn {
	/*
	* 设置state
	* @param [Component] context 上下文
	* @param [Object]    val     要设置的state；如：{a:1,b:2}
	*/
	dispatchFn = ({
		context,
		val
	}) => {
		context.dispatch('setStateData',val)
	}
	
}
export default new CommonFn();