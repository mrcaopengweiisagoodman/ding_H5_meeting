import mydingready from './../dings/mydingready';
import common from './common';
const { AUTH_URL, IMGCOMMONURI ,CONFIG_APP_URL} = require(`config/develop.json`);

class UtilsFile {
	/*
	* 获取存储空间权限（next：企业自定义空间）
	* @param [String] type       文件操作方式（add/download）
	* @param [String] userId     用户id
	* @param [String] ddApiState
	*/
	getSpaceGrant = ({context,type,userId,ddApiState}) => {
		fetch(`${AUTH_URL}ding/grant/role?type=${type}&userId=${userId}`,{
			method: 'POST'
		})
		.then( res => res.json())
		.then(data => {
			if (data.state == 'SUCCESS') {
				fetch(`${AUTH_URL}ding/gain/space`)
				.then( res => res.json())
				.then( result => {
					if (result.state == 'SUCCESS') {
						dd.device.notification.alert({
	                        message: "接口获取的spaceId---" + result.values.spaceId,
	                        title: "警告",
	                        buttonName: "确定"
	                    });
						mydingready.ddReady({
							context: context,
							ddApiState: ddApiState,
							otherData: {spaceId: result.values.spaceId}
						});
					}
				})
			}
		})
	}
	/*
	* 删除文件
	* @param [String] fileId 文件Id
	*
	*/
	delFile = ({context, fileId}) => {
		let data = {},
			{ enclosure } = context.state;
		for (let i = 0;i < enclosure.length;i++) {
			if (fileId == enclosure[i].fileId) {
				enclosure.splice(i,1);
				break;
			}
		}	
		common.dispatchFn({context: context,val: data});
	}
	


	/*
	* 删除选中的联系人
	* @param [String] manState 要删除的是审批人的还是抄送人
	* @param [String] emplId   用户id（即该员工的工号）
	*/
	delContact = ({context,manState,emplId}) => {
		let data = {};
			data[manState] = context.state[manState];
		for (let i = 0;i < data[manState].length;i++) {
			if (emplId == data[manState][i].emplId) {
				data[manState].splice(i,1);
				break;
			}
		}	
		common.dispatchFn({context: context,val: data});
	}

}
export default new UtilsFile();