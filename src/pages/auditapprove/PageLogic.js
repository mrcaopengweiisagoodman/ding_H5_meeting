import PageConst from './PageConst';
import { apiSync } from 'utils';

export default {
    defaults(props) {
        //初始的state
        return {  
        	test_data: '',
        	searchVal: '',
			...PageConst,
        	listData: [], // 招投标数据列表
			pageInfo: {
				pageNum: 1,
				pageSize: 1000,
				searchWord: '',
				// 0当天会议
				state: 0,
				userId: null
			},
        }
    },
	/**
	 * 修改state
	 * @param ctx
	 * @param val 
	 */
	setStateData (ctx,val) {
		ctx.setState(val);
	},
};
