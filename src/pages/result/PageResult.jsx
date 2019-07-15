require('./PageResult.less');
import logic from './PageLogic';
import { Component, LogicRender } from 'refast';  
import {
    Checkbox,
    InputItem,
    TextareaItem,
    SearchBar
} from 'antd-mobile';
import { createForm } from 'rc-form';
import mydingready from './../../dings/mydingready';
import contractJson from './../../test_json/contract';
import moment from 'moment';
import common from './../../utils/common';
import utilsFile from './../../utils/utils_file';
import ApproverCom from './../../components/approvercom/Approvercom';
import {
    Control,
    Link
} from 'react-keeper';
import TestJson from '../../test_json/contract.js';
const { AUTH_URL, IMGCOMMONURI ,CONFIG_APP_URL} = require(`config/develop.json`);


class DetailcontractForm extends Component {
    constructor(props) { 
        super(props, logic);        
        mydingready.ddReady({pageTitle: '投票结果'});
    }
    componentDidMount () {
        this.getDetail(this.props.params.id);   
        this.showMsgList(this.props.params.id);   
    }
    /**
    * 发送自定义事件（设置state）
    */
   /* dispatchFn = (val) => {
        this.dispatch('setStateData',val)
    }*/
     /**
    * 获取详情
    */
    getDetail = (id) => {
        fetch(`${AUTH_URL}meeting/mt-issue-vote/info/${id}`)
        .then(res => res.json())
        .then(data => {
            /*dd.device.notification.alert({
                message: "合同详情数据" + JSON.stringify(data),
                title: "提示",
                buttonName: "确定"
            })*/
            // console.log(data)
            if (data.state == 'SUCCESS') {
              
                common.dispatchFn({
                    context: this,
                    val: { 
                       resultData: data.values.info
                    }
                });
            }
        })
    }
    
      /**
  
    /**
    * 提交投票
    */
    submit = () => {
        let { id,emplIds ,result,userIds,writeMsg,issueId} = this.state;

     	let _this = this;

        this.props.form.validateFields((error,value) => {
            if (!error) {
                if (!value.mtMessageContent) {
                    dd.device.notification.alert({
                        message: "请填写内容！",
                        title: "温馨提示",
                        buttonName: "确定"
                    });
                    return
                }
                
                dd.device.notification.showPreloader({
                    text: "提交中...", //loading显示的字符，空表示不显示文字
                    showIcon: true, //是否显示icon，默认true
                })

                var params , 
                    url = encodeURIComponent(`${CONFIG_APP_URL}#/detailauditapprove/${_this.props.params.mtMeetingId}`);
                    params = {
                        mtIssueId: _this.props.params.id,
                        mtMessageContent: value.mtMessageContent,
                        redirectUrl: url,
                        mtMessageUserid: localStorage.getItem('userId'),
                        mtMessageUsername: localStorage.getItem('userName')
                   };
                fetch(`${AUTH_URL}meeting/mt-message/create`,{
                    method: 'POST',
                    headers: {
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify(params)
                })
                .then(res => res.json())
                .then(data => {
                    if (data.state == 'SUCCESS') {
                        dd.device.notification.hidePreloader({});
                        dd.device.notification.toast({
                            icon: 'success', 
                            text: '提交成功！', 
                            duration: 2, 
                        });
                        _this.getDetail(_this.props.params.id);   
                        _this.showMsgList(_this.props.params.id);   
                        let timer = setTimeout(function(){
                            
                            _this.props.form.setFieldsValue({
                                mtMessageContent: ''
                            });
                            common.dispatchFn({
                                context: _this,
                                val: { 
                                   mtMessageContent: ''
                                }
                            });
                        },2000);
                        return
                    }
                    dd.device.notification.alert({
                        message: data.info,
                        title: "温馨提示",
                        buttonName: "确定"
                    });
                })
            }
        });
    }  
    // 留言列表
    showMsgList = (id) => {
        fetch(`${AUTH_URL}meeting/mt-message/list/${id}?pageNum=1&pageSize=100000`,{
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            }
    	})
        .then(res => res.json())
        .then(data => {
            /*dd.device.notification.alert({
                message: "合同详情数据" + JSON.stringify(data),
                title: "提示",
                buttonName: "确定"
            })*/
            if (data.state == 'SUCCESS') {
                console.log(data.values.messageList.list[0])
                common.dispatchFn({
                    context: this,
                    val: { 
                       showMsgListData: data.values.messageList.list,
                    }
                });
            }
        })

    }
    showMan = () => {
        common.dispatchFn({
            context: this,
            val: { isShowMan : !this.state.isShowMan}
        })
    }
    // 顶一下
    dingFn = (issueId,	userId,userName) => {
    	let url = encodeURIComponent(`${CONFIG_APP_URL}#/detailauditapprove/${this.props.params.mtMeetingId}`);

		fetch(`${AUTH_URL}meeting/mt-issue-vote/reminder?issueId=${issueId}&beReminderName=${userName}&beReminderId=${userId}&redirectUrl=${url}&userId=${localStorage.getItem('userId')}&userName=${localStorage.getItem('userName')}`,{
            method: 'POST',
        })
        .then(res => res.json())
        .then(data => {
            if (data.state == 'SUCCESS') {
            	dd.device.notification.alert({
                    message: '提醒成功！',
                    title: "温馨提示",
                    buttonName: "确定"
                });
                common.dispatchFn({
                    context: this,
                    val: { 
                        isShowMan: false
                    }
                });
                return
            }
        	dd.device.notification.alert({
                message: data.info,
                title: "温馨提示",
                buttonName: "确定"
            });
        });
    }
    // 
    render() {
        let administrators = [],
            myUserId = localStorage.getItem('userId');
        const { getFieldProps } = this.props.form;

        // 测试数据开始
        // detailData = contractJson.detail.contract;
     
        // 测试数据结束
        let { showMsgListData,resultData,isShowMan,isShowToupiao,result ,isLimitMsg,styleInfo,contractType ,issues ,eventType ,approver,copyPerson ,enclosure ,detailData,searchVal,checking_type,isRebut} = this.state;
        let meetingOriginatorId = localStorage.getItem('meetingOriginatorId');
        if (resultData) {
           	let showMsgListCom = showMsgListData.map((v,i) =>{
                // result: 0，1，2
                let arr = ['同意','反对','弃权'];
                // mtMessageType：0是留言 1是钉消息 2投票描述
                console.log(i,v.mtMessageType)
                let str ;
                if (v.mtMessageType == 1) {
                    str = 'Ding';
                } else if (v.mtMessageType == 2) {
                    str = arr[v.result]
                } else if (v.mtMessageType == 0) {
                    str = '评论';
                }
           		return <div className="list">
                  		<div className="flex_bc">
                  			<div className="h_50">{v.mtMessageUsername}</div>
                  			<div className="h_50">{ str}</div>
                  		</div>
                     	<div className="line_gray"></div>
              			<div className="h_50">{v.mtMessageContent}</div>
                     	<div className="line_gray"></div>
              			<p className="text_right h_50">{moment(v.createTime).format('YYYY.MM.DD HH:mm')}</p>
                     	<div className="line_box"></div>
                  	</div>
           	});
           	let peopleCom = JSON.parse(resultData.mtIssueNotvotepeople).map(v=>{
           		return <div>
           			<div className="listHeight flex_bc">
                        <span className="leftText f_14 color_gray">{v.name}</span>
                        <div onClick={()=>this.dingFn(resultData.mtIssueId,v.emplId,v.name)}>Ding一下</div>
                    </div>
                    <div className="line_gray"></div>
           		</div>
           	});
           
            return (
                <div className="addcontract detailcontract result">
              		<div className="num_box flex_ac">
              			<div>{resultData.mtIssueResultAgreeNum ? resultData.mtIssueResultAgreeNum : 0}</div>
              			<div>{resultData.mtIssueResultRefuseNum ? resultData.mtIssueResultRefuseNum : 0}</div>
              			<div>{resultData.mtIssueResultWaiverNum ? resultData.mtIssueResultWaiverNum : 0}</div>
              		</div>
              		<div className="num_box flex_ac">
              			<span>同意</span>
              			<span>反对</span>
              			<span>弃权</span>
              		</div>

                    <div className="line_box"></div>
              		<div className={ meetingOriginatorId == myUserId ?"h_50" : 'isHide'} onClick={()=>this.showMan()}>未投票人员</div>
                  	<div className={isShowMan ? 'showmanBox' : 'isHide'}>
						{peopleCom}
                  	</div>
              		 {/* 留言板 --- 发起人没有权限 */}
                    <div className="line_box"></div>
                    <div>
                        <div className='biddingName'> 
                            <TextareaItem 
                                className="textArea"
                                rows={5}
                                onBlur={(e) => {console.log(e)}}
                                placeholder="描述"
                                {...getFieldProps('mtMessageContent',{
                                    onChange: this.getRemindContacts,
                                    rules:[{required: false,message:'此处输入备注、补充审批等信息！'}]
                                })}
                            ></TextareaItem> 
                        </div>
                        <button className="btnBlueLong" type="submit" onClick={this.submit} style={{marginBottom: '1vh'}}>提交</button>
                    </div>
	                <div className="line_box"></div>

                  	{showMsgListCom}
                   
                </div>
            )
        } else {
            return (<div>
               
            </div>)
        }
    }

}
const Detailcontract = createForm()(DetailcontractForm);
export default Detailcontract ;
