// addtendering
import { apiSync } from 'utils'
import PageConst from './PageConst';

export default {
    defaults(props) {
        //初始的state
        return {  
        	testStr: '',
        	meetingId: 0, // 会议id
        	meetingName: '', // 会议名称
        	enclosure: [], // 上传文件之后返回的数据数组，
            isNotice: 'true',
            mtIssueName: ''
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
