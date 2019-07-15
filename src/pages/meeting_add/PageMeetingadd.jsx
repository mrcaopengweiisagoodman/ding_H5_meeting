// 添加招标
require('./PageMeetingadd.less');
import logic from './PageLogic';
import { Component, LogicRender } from 'refast';  
import {
    InputItem,
    TextareaItem,
    Toast,
    DatePicker,
    List 

} from 'antd-mobile';
import moment from 'moment';
import {
    Link,
    Control
} from 'react-keeper';
import { createForm } from 'rc-form';
import common from './../../utils/common';
import utilsFile from './../../utils/utils_file';
import mydingready from './../../dings/mydingready';
import ApproverCom from './../../components/approvercom/Approvercom';
import EnclosureCom from './../../components/enclosurecom/EnclosureCom';

const { AUTH_URL, IMGCOMMONURI,CONFIG_APP_URL } = require(`config/develop.json`);

class AddauditapproveForm extends Component {
    constructor(props) { 
        super(props, logic);     
        mydingready.ddReady({pageTitle: '添加议题'});

    }
    componentDidMount () {
        console.log(Control.state)
        common.dispatchFn({
            context: this,
            val: {
                meetingId: Control.state.meetingId,
                meetingName: Control.state.meetingName
            }   
        });
    }
    /**
    * 调用钉钉api（设置state）
    */
    setFn = (e) => {
        mydingready.ddReady({setFn: this.dispatchFn});
    }
    /**
    * 发送自定义事件（设置state）
    */
   /* dispatchFn = (val) => {
        this.dispatch('setStateData',val)
    }*/
    /**
    * 调用钉钉api
    * 选择联系人、附件等
    * @param addApiState 要执行的api
    *
    */
    toDdJsApi = (ddApiState) => {
        if (ddApiState == 'uploadFile') {
            if (!mydingready.globalData.userId) {
                mydingready.globalData.userId = localStorage.getItem('userId');
            }
          /*  this.getSpaceGrant({
                type: 'add',
                userId: mydingready.globalData.userId,
                ddApiState: ddApiState
            });*/
            utilsFile.getSpaceGrant({
                context: this,
                type: 'add',
                userId: mydingready.globalData.userId,
                ddApiState: ddApiState
            });
            return
        }
        mydingready.ddReady({
            context: this,
            ddApiState: ddApiState,
        });
    }
  
    submit = () => {
        this.props.form.validateFields((error, value) => {
            let { enclosure,meetingId } = this.state;
            if (!enclosure.length) {
                dd.device.notification.alert({
                    message: "您有未填写项！",
                    title: "温馨提示",
                    buttonName: "确定"
                });
                return
            }


            if (!error) {
               
                if (!value.mtIssueName) {
                    dd.device.notification.alert({
                        message: "议题名称为必填项",
                        title: "警告",
                        buttonName: "确定"
                    });
                    return
                }
                enclosure = encodeURIComponent(JSON.stringify(enclosure));

                fetch(`${AUTH_URL}meeting/mt-issue/create?attachment=${enclosure}`,{
                    method: 'POST',
                    headers: {
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify({
                       mtIssueMeetingId: meetingId,
                       mtIssueName: value.mtIssueName,
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.state == 'SUCCESS') {
                        dd.device.notification.toast({
                            icon: 'success', //icon样式，有success和error，默认为空
                            text: '添加成功！', //提示信息
                            duration: 3, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s >2s)]
                            onSuccess : function(result) {
                                // 回列表展示页
                            },
                            onFail : function(err) {}
                        });
                        Control.go(-1);
                        return
                    }
                    dd.device.notification.alert({
                        message: data.info,
                        title: '温馨提示',
                        buttonName: "确定"
                    });
                })
            }
        });
    }

    render() {
        const { getFieldProps } = this.props.form;
        const { enclosure ,meetingName ,testStr,meetingTime} = this.state; 
        return (
            <div className="addauditapprove addcontract">
                {/* <form onSubmit={this.submit}> */}
                    <div className="name flex" style={{padding: '0 3vw'}}>
                        <span className="leftText f_16 color_333">会议名称</span>
                        <span className="inputItem am-list-item">{meetingName}</span>
                    </div>
                    <div className="line_gray"></div>
                  
                    <div className="name flex" style={{padding: '0 3vw'}}>
                        <span className="leftText f_16">议题名称</span>
                        <InputItem 
                            className="inputItem"
                            rows={2}
                            placeholder="请填写议题名称（必填）"
                            {...getFieldProps('mtIssueName',{
                                rules:[{required: false,message:'请填写会议名称（必填）'}]
                            })}
                        ></InputItem> 
                    </div>
                    <div className="line_gray"></div>
                    <p className="title">会议附件</p>
                 
                    <EnclosureCom data={enclosure} context={this} />
                    <div className="line_gray"></div>
                    <button className="btnBlueLong" type="submit" onClick={this.submit}>添加议题</button>
                {/* </form> */}
            </div>
        );
    }

}
const Addauditapprove = createForm()(AddauditapproveForm);
export default Addauditapprove ;
