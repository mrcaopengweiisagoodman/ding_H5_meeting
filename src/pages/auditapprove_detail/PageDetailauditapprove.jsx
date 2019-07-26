// 合同详情
require('./PageDetailauditapprove.less');
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
        mydingready.ddReady({pageTitle: '会议详情'});
    }
    componentDidMount () {
        this.getDetail(this.props.params.id);   
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
        let userId = localStorage.getItem('userId');
        fetch(`${AUTH_URL}meeting/mt-meeting/info/${id}?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
            /*dd.device.notification.alert({
                message: "合同详情数据" + JSON.stringify(data),
                title: "提示",
                buttonName: "确定"
            })*/

            if (data.state == 'SUCCESS') {
                localStorage.setItem('meetingOriginatorId',data.values.meeting.meetingOriginatorId);
                common.dispatchFn({
                    context: this,
                    val: { 
                        id: id,
                        detailData: data.values.meeting,
                        approver: data.values.meeting.meetingAttendpeopleName.split(','),
                        copyPerson: data.values.meeting.meetingJoinpeopleName.split(','),
                        //  文件列表
                        issues: data.values.meeting.issues,
                        men: data.values.meeting.meetingJoinpeopleId
                    }
                });
            }
        })
    }
     /**
    * 预览文件 (钉钉api)
    */
    previewFile = (fileInfo) => {
        let userId = localStorage.getItem('userId');
        let url = `ding/grant/role?type=download&userId=${userId}&fileids=${fileInfo.fileId}`;
        fetch(`${AUTH_URL}${url}`,{
            method: 'POST'
        })
        .then( res => res.json())
        .then(data => {
            if (data.state == 'SUCCESS') {
                mydingready.ddReady({
                    context: this,
                    ddApiState: 'previewFile',
                    otherData: fileInfo
                });
                /*fetch(`${AUTH_URL}ding/gain/space`)
                .then( res => res.json())
                .then( result => {
                    if (result.state == 'SUCCESS') {
                        mydingready.ddReady({
                            context: this,
                            ddApiState: 'previewFile',
                            otherData: fileInfo
                        });
                        return
                    }
                    dd.device.notification.alert({
                        message: result.info ,
                        title: "温馨提示",
                        buttonName: "确定"
                    });
                })*/
            }
        })
      /*  mydingready.ddReady({
            context: this,
            ddApiState: 'previewFile',
            otherData: fileInfo
        })*/
    }
      /**
  
    /**
    * 提交投票
    */
    submit = () => {
        let { id,emplIds ,result,userIds,writeMsg,issueId} = this.state;
        this.props.form.validateFields((error,value) => {
            if (!error) {
                if (!value.description && result > 0) {
                    dd.device.notification.alert({
                        message: "请填写理由！",
                        title: "温馨提示",
                        buttonName: "确定"
                    });
                    return
                }
                console.log(value)
                dd.device.notification.showPreloader({
                    text: "提交中...", //loading显示的字符，空表示不显示文字
                    showIcon: true, //是否显示icon，默认true
                })
                var params , 
                    url = encodeURIComponent(`${CONFIG_APP_URL}#/detailauditapprove/${issueId}`);
                   /* params = {
                        issueId: issueId,
                        description: value.description,
                        redirectUrl: url,
                        result: result,
                        userId: localStorage.getItem('userId'),
                        userName: localStorage.getItem('userName')
                   }*/
                   params = ``
                fetch(`${AUTH_URL}meeting/mt-issue-vote/create?issueId=${issueId}&description=${value.description}&redirectUrl=${url}&result=${result}&userId=${localStorage.getItem('userId')}&userName=${localStorage.getItem('userName')}`,{
                    method: 'POST',
                    
                })
                .then(res => res.json())
                .then(data => {
                    dd.device.notification.hidePreloader({});
                    if (data.state == 'SUCCESS') {
                        /*this.dispatchFn({ 
                            messageBoard: [],
                            emplIds: [], 
                            isChooseContact: false,
                            writeMsg: ''
                        });*/
                        common.dispatchFn({
                            context: this,
                            val: { 
                                isShowToupiao: false
                            }
                        });
                        dd.device.notification.toast({
                            icon: 'success', 
                            text: '提交成功！', 
                            duration: 2, 
                        });
                        this.getDetail(this.props.params.id);   
                        return
                    }
                    dd.device.notification.alert({
                        message: data.info,
                        title: "温馨提示",
                        buttonName: "确定"
                    });
                    common.dispatchFn({
                        context: this,
                        val: { 
                            isShowToupiao: false
                        }
                    });
                })
            }
        });
    }  
    /**
    * 去往搜索关联合同页面
    */
    goSearch = () => {
        Control.go(`/contractsearch/audit/${this.props.params.id}`);
    }
   

    componentWillUnmount () {
        localStorage.removeItem('REBUT');
    }
    toupiao = (id) => {
        // 非出席人和列席人无法查看
       /* if () {
            return
        }*/
        // isTouguopiao
        let {issues} = this.state;
        for (let ele of issues) {
            if (ele.mtIssueId == id) {
                ele.isTouguopiao = true;
                break;                
            }
        }
        common.dispatchFn({
            context: this,
            val: { isShowToupiao: true ,issueId: id,issues: issues}
        })
    }
    resultFn = (state) => {
        common.dispatchFn({
            context: this,
            val: { result: state}
        })
    }
    close = () => {
        common.dispatchFn({
            context: this,
            val: { isShowToupiao: false }
        })
    }
    changeMtissueId = (id) => {
        let { mtIssueId } = this.state;
        if (id == mtIssueId) {
            id = -1;
        }
        common.dispatchFn({
            context: this,
            val: { mtIssueId: id }
        })
    }
    /* 发送消息 */
    sendMsg = (id) => {
        let url = encodeURIComponent(`${CONFIG_APP_URL}#/detailauditapprove/${this.state.issueId}`);
        fetch(`${AUTH_URL}meeting/mt-issue-vote/create?id=${id}&redirectUrl=${url}`,{
            method: 'POST',
        })
        .then(res => res.json())
        .then(data => {
            if (data.state == 'SUCCESS') {
                dd.device.notification.alert({
                    message: '消息已发送！' ,
                    title: "温馨提示",
                    buttonName: "确定"
                });
            }
        });
    }
    render() {
        let administrators = [],
            myUserId = localStorage.getItem('userId');
        const { getFieldProps } = this.props.form;
      
        let { mtIssueId,men,isShowToupiao,result ,isLimitMsg,styleInfo,contractType ,issues ,eventType ,approver,copyPerson ,enclosure ,detailData,searchVal,checking_type,isRebut} = this.state;
        if (detailData) {
            let inx = men.indexOf(localStorage.getItem('userId'));
            let issuesCom = issues.map( (v,idx) => {
                 let fileTypeImg, 
                    arr = [],
                    jiantou,
                    fileTypeImgArr = ['ppt.png','ppt.png','excel.png','excel.png','word.png','word.png'];
                let i = ['ppt','pptx','xls','xlsx','doc','docx'].indexOf(v.fileType);

                let enclosureData = JSON.parse(v.mtIssueContent);
                if (!Array.isArray(enclosureData)) {
                    arr.push(enclosureData);
                    enclosureData = arr;
                }
                i != -1 ? fileTypeImg = fileTypeImgArr[i] : fileTypeImg = 'unknown.png';
                mtIssueId == v.mtIssueId ? jiantou = 'down' : jiantou = 'up';
               
                return <div className="fj_list">
                            <div className="flex_bc" style={{minHeight: '4.8rem',padding: '1rem 3vw'}} onClick={()=>this.changeMtissueId(v.mtIssueId)}>
                                <p className="per_w_70 textOverflow_1 f_14">{idx+1}、{v.mtIssueName}</p>
                                <div className="flex p_l_4v">
                                    <span className={inx > -1 && !v.issueVote ? 'color_r_c' : 'isHide'}>未表决</span>
                                    <span className={inx > -1 && v.issueVote ? 'color_g_d' : 'isHide'}>已表决</span>
                                    <img className="fileIcon" src={`${IMGCOMMONURI}${jiantou}.png`} />
                                </div>
                            </div>
                            <div className="line_gray"></div>
                            <div className={mtIssueId == v.mtIssueId ? "" : "isHide"}>
                                {/* 议题附件 */}
                                { 
                                    enclosureData.map( (el) => {
                                        return (
                                            <div>
                                                <div className="flex_bc p_rl_4v" 
                                                    style={{minHeight: '4.8rem',padding: '1rem 3vw'}}
                                                    onClick={() => this.previewFile(el)}>
                                                    <img className="fileIcon_2" src={`${IMGCOMMONURI}${fileTypeImg}`} />
                                                    <p className="textOverflow_1 mtName">{el.fileName}</p>
                                                </div>
                                                <div className="line_gray"></div>
                                            </div>
                                        )
                                            
                                    })

                                }
                                <div className="flex_ec box m_tb_10">
                                    <div className={inx > -1 && !v.issueVote ? "btnBlueShort m_r_2v" : 'isHide'} onClick={()=>this.toupiao(v.mtIssueId)}>表决</div>
                                    <Link to={`result/${detailData.mtMeetingId}/${v.mtIssueId}`} className="btnBlueShort m_r_2v">结果/评论</Link>
                                </div>
                            </div>
                        </div>
            })
            let approverCom = approver.map(v=>{
                return <div style={{margin: '5px 1.5vw'}}>
                            <div className="box_b manBox">
                                <p className="color_b">{v}</p>
                            </div>
                        </div>
            });
            let copyPersonCom = copyPerson.map(v=>{
                return  <div key={v} style={{margin: '5px 1.5vw'}}>
                            <div className="box_b manBox">
                                <p className="color_b">{v}</p>
                            </div>
                        </div>
            });
          
           
            return (
                <div className="addcontract detailcontract">
                    <div className="name flex" style={{padding: '0 3vw'}}>
                        <span className="f_14 color_gray leftText" style={{minHeight: "4.8rem",lineHeight: '4.8rem'}}>会议名称</span>
                        <p className="maxW">{detailData.meetingName}</p>
                    </div>
                    <div className="line_gray"></div>
                    <div className="listHeight flex">
                        <span className="leftText f_14 color_gray">会议时间</span>
                        <div>{moment(detailData.meetingTime).format('YYYY.MM.DD HH:mm')}</div>
                    </div>
                    <div className="line_gray"></div>
                    <div className="selectedMan bg_ff">
                        <p className="color_gray">列席人</p>
                        <div className="manArr detailManArr">
                            {approverCom}
                        </div>
                    </div>
                    <div className="line_gray"></div>
                    <div className="selectedMan bg_ff">
                        <p className="color_gray">出席人</p>
                        <div className="manArr detailManArr">
                            {copyPersonCom}
                        </div>
                    </div>
                    <div className={issues.length ? "title flex_bc" : 'isHide'}>
                        <span>议题列表</span>
                        <div className="flex">
                            <div style={{width: '19vw'}} className="btn_333 manBox color_b m_tb_0" onClick={()=>this.sendMsg(this.props.params.id)}>发送消息</div>
                            <Link style={{width: '19vw'}} to={`exportword/${this.props.params.id}`} className="btn_333 manBox color_b m_tb_0">会议记录</Link>
                            <Link style={{width: '19vw'}} to={`exportexcel/${this.props.params.id}`} className="btn_333 manBox color_b m_tb_0">表决详情</Link>
                        </div>
                    </div>
                    <div className={issues.length ? "fujian" : 'isHide'}>
                        {issuesCom}
                    </div>
                    


                    {/* 留言板 --- 出席人、列席人有权限 */}
                    <div className={isShowToupiao ? "toupiao" : "isHide"}>
                        <div className='biddingName'> 
                            <p className="title">发起表决</p>
                            <TextareaItem 
                                className="textArea"
                                rows={5}
                                onBlur={(e) => {console.log(e)}}
                                placeholder="投票描述"
                                {...getFieldProps('description',{
                                    onChange: this.getRemindContacts,
                                    rules:[{required: false,message:'此处输入备注、补充审批等信息！'}]
                                })}
                            ></TextareaItem> 
                        </div>
                          {/* 待我审批进入之后，合同操作按钮 */}
                        <div className="operationBtns flex_ac">
                            <div className={result == 0 ? "btn btn_b" : "btn btn_e"} onClick={() => this.resultFn('0')}>同意</div>
                            <div className={result == 1 ? "btn btn_b" : "btn btn_e"} onClick={() => this.resultFn('1')}>反对</div>
                            <div className={result == 2 ? "btn btn_b" : "btn btn_e"} onClick={() => this.resultFn('2')}>弃权</div>
                        </div>
                        <div className="flex_ac" style={{width: "100%"}}>
                            <button className="btnRedLong" type="submit" onClick={this.close} style={{marginBottom: '1vh',background: '#ce0707'}}>关闭</button>
                            <button className="btnBlueLong" type="submit" onClick={this.submit} style={{marginBottom: '1vh'}}>表决</button>
                        </div>
                    </div>
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
