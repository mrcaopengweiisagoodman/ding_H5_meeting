// 添加招标
require('./PageAddauditapprove.less');
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
        mydingready.ddReady({pageTitle: '添加会议'});

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
  /*  selectedDate = () => {
        let date = moment(new Date()).format('yyyy-MM-dd HH:mm');
        let _this = this;
        dd.biz.util.datetimepicker({
            format: 'yyyy-MM-ddTHH:mm',
            value: date, //默认显示
            onSuccess : function(result) {
                dd.device.notification.alert({
                    message: "shijain" + result.value.split(' ').join('T') + ':00',
                    title: "温馨提示",
                    buttonName: "确定",
                });
                common.dispatchFn({
                    context: _this,
                    val: { meetingTime: result.value.split(' ').join('T') + ':00' }
                })
                //onSuccess将在点击完成之后回调
                // { value: "2015-06-10 09:50" }
            },
            onFail : function(err) {
                dd.device.notification.alert({
                    message: "会议时间选取失败！",
                    title: "温馨提示",
                    buttonName: "确定",
                });
            }
        })
        console.log('选择会议时间！')
    }*/
    submit = () => {
        this.props.form.validateFields((error, value) => {
            let { approver ,copyPerson , enclosure,meetingTime} = this.state;
        console.log('submit',error)

            /*approver = [{"name":"田ert帅","avatar":"","emplId":"0125056400964069"},{"name":"田帅2","avatar":"","emplId":"0121156400954069"}];
            copyPerson = [{"name":"田ert帅","avatar":"","emplId":"0125056400964069"},{"name":"田帅2","avatar":"","emplId":"0121156400954069"}];
            enclosure = [
                {
                   spaceId: "232323",
                   fileId: "DzzzzzzNqZY",
                   fileName: "审批流程.docx",
                   fileSize: 1024,
                   fileType: "docx"
                },    
                {
                   spaceId: "232323",
                   fileId: "DzzzzzzNqZY",
                   fileName: "审批流程1.pdf",
                   fileSize: 1024,
                   fileType: "pdf"
                }];*/
          
            if (!approver.length || !meetingTime) {
                dd.device.notification.alert({
                    message: "您有未填写项！",
                    title: "温馨提示",
                    buttonName: "确定"
                });
                return
            }
            if (!error) {
                if (!value.meetingName) {
                    dd.device.notification.alert({
                        message: "会议名称为必填项",
                        title: "警告",
                        buttonName: "确定"
                    });
                    return
                }
                meetingTime = moment(meetingTime).format();
                approver = encodeURIComponent(JSON.stringify(approver));
                enclosure = encodeURIComponent(JSON.stringify(enclosure));
              /*  dd.device.notification.showPreloader({
                    text: "提交中...", //loading显示的字符，空表示不显示文字
                    showIcon: true, //是否显示icon，默认true
                })*/
                let meetingAttendpeopleName = [] , meetingAttendpeopleId = [],
                    originatorName = localStorage.getItem('userName'),
                    originatorId = localStorage.getItem('userId'),
                    url = encodeURIComponent(`${CONFIG_APP_URL}#/detailauditapprove/`);
                for (let e of copyPerson) {
                    meetingAttendpeopleName.push(e.name);
                    meetingAttendpeopleId.push(e.emplId);
                }
               
                // fetch(`${AUTH_URL}meeting/mt-meeting/create?attachment=${JSON.stringify(enclosure)}&meetingJoinpeople=${JSON.stringify(approver)}&redirectUrl=${url}`,{
                fetch(`${AUTH_URL}meeting/mt-meeting/create?attachment=${enclosure}&meetingJoinpeople=${approver}&redirectUrl=${url}`,{
                    method: 'POST',
                    headers: {
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify({
                        meetingAttendpeopleId: meetingAttendpeopleId.join(','),
                        meetingAttendpeopleName: meetingAttendpeopleName.join(','),
                        meetingName: value.meetingName,
                        meetingOriginatorId: originatorId,
                        meetingOriginatorName: originatorName,
                        meetingTime: meetingTime.slice(0,meetingTime.length-6)
                    })
                    // YYYY.MM.DD HH:mm
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
                        window.location.href = '/';
                        return
                    }
                    dd.device.notification.alert({
                        message: data.values.msg,
                        title: '温馨提示',
                        buttonName: "确定"
                    });
                })
            }
        });
    }
    dateChange = (date,str) => {
        console.log(date,str)
        common.dispatchFn({
            context: this,
            val: {
                meetingTime: date
            }   
        })
    }
    render() {
        const { getFieldProps } = this.props.form;
        const { approver , copyPerson , enclosure ,testStr,meetingTime} = this.state; 
        console.log(meetingTime)
        
        /*let data1 = [{"name":"田ert帅","avatar":"","emplId":"0125056400964069"},{"name":"田帅2","avatar":"","emplId":"0121156400954069"}];
        let approverCom = data1.map(v=>{*/
      /*  let approverCom = approver.map(v=>{
            return <div key={v.emplId} style={{margin: '5px 1.5vw'}}>
                        <div className="box_b manBox">
                            <p className="color_b">{v.name}</p>
                            <img src={`${IMGCOMMONURI}delete.png`} onClick={()=>this.delContact('approver',v.emplId)} />
                        </div>
                    </div>
        });*/
      /*  let copyPersonCom = copyPerson.map(v=>{
            return  <div key={v.emplId} style={{margin: '5px 1.5vw'}}>
                        <div className="box_b manBox">
                            <p className="color_b">{v.name}</p>
                            <img src={`${IMGCOMMONURI}delete.png`} onClick={()=>this.delContact('copyPerson',v.emplId)} />
                        </div>
                    </div>
        });*/
        /*let a = [
             {
               spaceId: "232323",
               fileId: "DzzzzzzNqZY",
               fileName: "审批流程.docx",
               fileSize: 1024,
               fileType: "docx"
            },
            {
               spaceId: "232323",
               fileId: "DzzzzzzNqZY",
               fileName: "审批流程1.pdf",
               fileSize: 1024,
               fileType: "pdf"
            }];
        let enclosureCom = a.map(v => {*/
       /* let enclosureCom = enclosure.map(v => {
            let fileTypeImg, 
                fileTypeImgArr = ['ppt.png','ppt.png','excel.png','excel.png','word.png','word.png'];
            let i = ['ppt','pptx','xls','xlsx','doc','docx'].indexOf(v.fileType);
            i != -1 ? fileTypeImg = fileTypeImgArr[i] : fileTypeImg = 'unknown.png';
            return <div className="file" onClick={() => this.previewFile('previewFile',v)}>
                        <img className="fileIcon" src={`${IMGCOMMONURI}${fileTypeImg}`} />
                        <p className="textOverflow_1">{v.fileName}</p>
                        <div className="closeBtn" onClick={(e) => {this.delFile(e,v.fileId)}}>
                            <img src={`${IMGCOMMONURI}delete.png`} />
                        </div>
                    </div>
        })*/
        return (
            <div className="addauditapprove addcontract">
                {/* <form onSubmit={this.submit}> */}
                    <div className="name flex" style={{padding: '0 3vw'}}>
                        <span className="leftText f_16">会议名称</span>
                        <InputItem 
                            className="inputItem"
                            rows={2}
                            placeholder="请填写会议名称（必填）"
                            {...getFieldProps('meetingName',{
                                rules:[{required: false,message:'请填写会议名称（必填）'}]
                            })}
                        ></InputItem> 
                    </div>
                    <div className="line_gray"></div>
                   {/* <div className="listHeight flex_bc">
                       <span className="leftText">会议时间</span>
                       <div className="flex_ec paySelect" onClick={this.selectedDate}>
                           <span className="color_gray">{ meetingTime ? meetingTime : '请选择'}</span>
                           <img className="fileIcon" src={`${IMGCOMMONURI}common_level2_icon_bg_color.png`} />
                       </div>
                   </div>*/}
                    <DatePicker
                        minDate={new Date()}
                        mode="datetime"
                        extra="请选择"
                        value={this.state[`meetingTime`]}
                        onChange={(date) => {this.dateChange(date,'meetingTime')}}
                    >
                        <List.Item arrow="horizontal" className="f_16">会议时间</List.Item>
                    </DatePicker>
                    <div className="line_gray"></div>
                    {/*<p className="title">会议附件</p>
                    <EnclosureCom data={enclosure} context={this} />*/}
                    {/* <div className="fileBox">
                        {enclosureCom}
                        <div className="file" onClick={() => this.toDdJsApi('uploadFile')}>
                            <img className="fileIcon selectedBtn" src={`${IMGCOMMONURI}z z.png`} />
                            <p>上传附件</p>
                        </div>
                    </div>*/}
                    <div className="selectedMan">
                        <p>出席人</p>
                        <div className="manArr">
                            <ApproverCom context={this} type="approver" /> 
                        </div>
                        <img className="fileIcon selectedBtn" src={`${IMGCOMMONURI}add_small.png`} onClick={() => this.toDdJsApi('approver')} />
                    </div>
                    <div className="line_gray"></div>
                    <div className="selectedMan">
                        <p>列席人</p>
                        <div className="manArr">
                            <ApproverCom context={this} type="copyPerson" /> 
                        </div>
                        <img className="fileIcon selectedBtn" src={`${IMGCOMMONURI}add_small.png`} onClick={() => this.toDdJsApi('copyPerson')} />
                    </div>
                    <div className="line_gray"></div>
                    <button className="btnBlueLong" type="submit" onClick={this.submit}>添加会议</button>
                {/* </form> */}
            </div>
        );
    }

}
const Addauditapprove = createForm()(AddauditapproveForm);
export default Addauditapprove ;
