require('./PageExportexcel.less');
import logic from './PageLogic';
import { Component, LogicRender } from 'refast';  
import moment from 'moment';
import { 
    Tabs, 
    WhiteSpace ,
    WingBlank,
    Badge,
    SearchBar,
    List
} from 'antd-mobile';
// import logic from './PageLogic';
import {
    Link,
    Control
} from 'react-keeper';
import mydingready from './../../dings/mydingready';
import common from './../../utils/common';
import testJson from './../../test_json/contract';
const { AUTH_URL , IMGCOMMONURI } = require(`config/develop.json`);


class Auditapprove extends Component {
    constructor(props) { 
        super(props, logic);        
        mydingready.ddReady({pageTitle: '会议议题预览'});
    }
    componentDidMount () {
        this.getTenderingList({state: 0});
    }
  
    /**
    * 获取对应议题列表信息
    */
    getTenderingList = ({state ,searchWord }) => {
        let userId = mydingready.globalData.userId ? mydingready.globalData.userId 
                                                   : localStorage.getItem('userId');
        let url = `${AUTH_URL}meeting/mt-meeting/info/${this.props.params.id}?userId=${userId}`
        fetch(url,{
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => {
       
            if (data.state == 'SUCCESS') {
                common.dispatchFn({context: this,val:{dataHistory: data.values.meeting}});
                
                
              /*dd.device.notification.toast({
                    icon: 'success', //icon样式，有success和error，默认为空
                    text: '数据加载成功', //提示信息
                    duration: 1, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s >2s)]
                });*/
                return
            }
            dd.device.notification.alert({
                message: data.info,
                title: "警告",
                buttonName: "确定"
            });
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
    exportExcel = () => {
        let userId = mydingready.globalData.userId ? mydingready.globalData.userId 
                                                   : localStorage.getItem('userId');
        let url = `${AUTH_URL}meeting/mt-issue/excel/export?meetingId=${this.props.params.id}&userId=${userId}`
        fetch(url,{
            method: 'POST'
        })
        .then(res => res.json())
        .then(data => {
       
            if (data.state == 'SUCCESS') {
                dd.device.notification.alert({
                    message: 'excel导出成功，请在消息中查看！',
                    title: "警告",
                    buttonName: "确定"
                });
                let timer = setTimeout(function(){
                    Control.go(-1);
                    clearTimeout(timer);
                },2000);
                
              /*dd.device.notification.toast({
                    icon: 'success', //icon样式，有success和error，默认为空
                    text: '数据加载成功', //提示信息
                    duration: 1, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s >2s)]
                });*/
                return
            }
            dd.device.notification.alert({
                message: data.info,
                title: "警告",
                buttonName: "确定"
            });
        })
    }
    render() {
        const { dataHistory,mtIssueId } = this.state;
        let userId = localStorage.getItem("userId");

        if (dataHistory) {
            let historyCom = dataHistory.issues.map((v,idx) => {
                let jiantou, result ,bg_str;
                mtIssueId == v.mtIssueId ? jiantou = 'down' : jiantou = 'up';
                return <div className="fj_list f_14">
                            <div className="flex_bc" style={{minHeight: '4.8rem',padding: '1rem 3vw'}} onClick={()=>this.changeMtissueId(v.mtIssueId)}>
                                <p className="per_w_70 textOverflow_1 f_14">{idx+1}、{v.mtIssueName}</p>
                                <div className="flex p_l_4v">
                                    <span className="c_trans">未表决</span>
                                    <img className="fileIcon" src={`${IMGCOMMONURI}${jiantou}.png`} />
                                </div>
                            </div>
                            <div className="line_gray"></div>
                            <div className={mtIssueId == v.mtIssueId ? "" : "isHide"}>
                                { 
                                    v.mtIssueVotes.map( (el) => {
                                        if (el.mtIssueVoteResult == 0) {
                                            result = '同意';
                                            bg_str = 'btnBlueShort';
                                        } else if (el.mtIssueVoteResult == 1) {
                                            result = '反对';
                                            bg_str = 'btnRedShort';
                                        } else if (el.mtIssueVoteResult == 2) {
                                            result = '弃权';
                                            bg_str = 'btnGrayShort';
                                        } 
                                        return (
                                            <div>
                                                <div className="flex_bc p_rl_4v" 
                                                    style={{minHeight: '4.8rem',padding: '1rem 3vw'}}>
                                                    <div className="">{el.mtIssueVoteUsername}</div>
                                                    <div className={bg_str}>{result}</div>
                                                </div>
                                                <div className="line_gray"></div>
                                            </div>
                                        )
                                    })
                                }
                                <div className="flex_ac h_4_4rem">
                                    <span className="flex_1 p_l_3v">统计</span>
                                    <span className="flex_1">同意：{v.mtIssueResultAgreeNum}</span>
                                    <span className="flex_1">反对：{v.mtIssueResultRefuseNum}</span>
                                    <span className="flex_1">弃权：{v.mtIssueResultWaiverNum}</span>
                                </div>
                            </div>
                        </div>
                     
            })
            return (
                <div className="auditapprove detailcontract">
                    <div className="lh_4_4rem p_rl_4v f_16 c_333">会议名称：{dataHistory.meetingName}</div>
                    <div className="line_gray"></div>
                    <div className={dataHistory.issues.length ? "fujian p_b_4_4rem" : 'isHide'}>
                        {historyCom}
                    </div>
                    <div className="btnBlueLong position_f_0_0" style={{width: '100%',borderRadius: '0px'}} onClick={this.exportExcel}>导出excel</div>
                </div>
            );
        } 
        return (
            <div></div>
        )
    }

}

export default Auditapprove ;
