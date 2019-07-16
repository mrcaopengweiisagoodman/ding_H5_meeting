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
	/*
	 * 数字处理
	 * @param  [Number/String] n 需要处理的数字
	 * @return [String] 例子：'05'
	 */ 
	formatNumber = n => {
		n = n.toString();
		return n[1] ? n : '0' + n;
	}
	/* 
	* 时间转换
	* @param date 
	* @param str_ymd 拼接的字符 年月日的拼接字符
	* @param str_dm  拼接的字符 年月日和时分秒之间的拼接字符
	* @param str_hms 拼接的字符 时分秒之间的拼接字符
	*/
	formatTime = ({
		date,
		str_ymd,
		str_dm,
		str_hms
	}) => {
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const hour = date.getHours();
		const minute = date.getMinutes();
		const second = date.getSeconds();

		return [year, month, day].map(this.formatNumber).join(str_ymd) + str_dm + [hour, minute, second].map(this.formatNumber).join(str_hms);
	}
	
}
export default new CommonFn();