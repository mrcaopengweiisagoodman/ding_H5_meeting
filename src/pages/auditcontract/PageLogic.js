import PageConst from './PageConst';
import { apiSync } from 'utils';

export default {
    defaults(props) {
        //初始的state
        return {  
        	// 获取到的部门信息
        	listData: [],
        	// 选取的部门id
        	deptIds: []
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
