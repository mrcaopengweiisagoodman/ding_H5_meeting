import PageConst from './PageConst';
import { apiSync } from 'utils'

export default {
    defaults(props) {
        //初始的state
        return {  
        	startTime: '',
            endTime: '',
            dataList: {
                list: [],
                meetingCount: 0,
                issueCount: 0
            },
            moreStr: '点击加载更多'
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
