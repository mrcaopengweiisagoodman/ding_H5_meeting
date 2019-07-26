// 添加招标
require('./PageMeetingadd.less');
import logic from './PageLogic';
import { Component, LogicRender } from 'refast';  
import {
    InputItem,
    TextareaItem,
    Toast,
    DatePicker,
    List ,
    Checkbox
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
const CheckboxItem = Checkbox.CheckboxItem;
class AddauditapproveForm extends Component {
    constructor(props) { 
        super(props, logic);     
        mydingready.ddReady({pageTitle: '添加议题'});

    }
    componentDidMount () {
        console.log(Control)
        console.log(Control.state)
       /* let { enclosure } = this.state;
        let hasFile = localStorage.getItem('hasFile');
        // hasFile为yes，第一次上传文件
        if (hasFile == 'yes') {
            this.props.form.setFieldsValue({
                mtIssueName: enclosure[0].fileName
            });
        }*/
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
            let { enclosure,meetingId , isNotice } = this.state;
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
                let url = encodeURIComponent(`${CONFIG_APP_URL}#/detailauditapprove/${meetingId}`);
                
                fetch(`${AUTH_URL}meeting/mt-issue/create?attachment=${enclosure}&isNotice=${isNotice}&redirectUrl=${url}`,{
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
                        Control.go(`/detailauditapprove/${this.props.params.id}`);
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
    onChange = (isNotice) => {
        // isNotice == 'true' ? isNotice = true : isNotice = false;
        common.dispatchFn({
            context: this,
            val: {
                isNotice: isNotice
            }   
        });
    }
    /* 议题名称input内容改变 */
    inputChange = (e) => {
        common.dispatchFn({
            context: this,
            val: {
                mtIssueName: e
            }   
        });
    }
    componentWillUnmount () {
        localStorage.removeItem('hasFile');
    }
    render() {
        const { getFieldProps } = this.props.form;
        const { enclosure ,meetingName ,testStr,meetingTime,isNotice} = this.state; 
        
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
                            onBlur={(e)=>this.inputChange(e)}
                            placeholder="请填写议题名称（必填）"
                            {...getFieldProps('mtIssueName',{
                                rules:[{required: false,message:'请填写会议名称（必填）'}]
                            })}
                        ></InputItem> 
                    </div>
                    {/*<div className="name flex" style={{padding: '0 3vw'}}>
                        <span className="leftText f_16">议题名称</span>
                        <div className="inputItem h_4_4rem textOverflow_1">{enclosure.length ? enclosure[0].fileName : ''}</div> 
                    </div>*/}
                    <div className="line_gray"></div>
                    <p className="title">会议附件</p>
                    <EnclosureCom data={enclosure} context={this} flag="meetingAdd" />
                    <div className="line_gray"></div>
                    <div className="name flex" style={{padding: '0 3vw'}}>
                        <span className="leftText f_16 color_333">是否发送通知</span>
                        <div className="inputItem am-list-item">
                            <CheckboxItem key={'true'} checked={isNotice == 'true' ? true : false} onChange={() => this.onChange('true')}>是</CheckboxItem>
                            <CheckboxItem key={'false'} checked={isNotice == 'false' ? true : false} onChange={() => this.onChange('false')}>否</CheckboxItem>
                        </div>
                    </div>
                    <div className="line_gray"></div>
                    <button className="btnBlueLong" type="submit" onClick={this.submit}>添加议题</button>
                {/* </form> */}
            </div>
        );
    }

}
const Addauditapprove = createForm()(AddauditapproveForm);
export default Addauditapprove ;
