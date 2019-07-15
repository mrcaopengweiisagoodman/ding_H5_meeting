require('./PageExportword.less');
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
        mydingready.ddReady({pageTitle: '会议记录预览'});
    }
    componentDidMount () {
        this.getTenderingList({state: 0,type: 0});
    }
  
    /**
    * 获取对应议题列表信息
    */
    getTenderingList = ({state ,searchWord,type }) => {
        let userId = mydingready.globalData.userId ? mydingready.globalData.userId 
                                                   : localStorage.getItem('userId');
        let url = `${AUTH_URL}meeting/mt-meeting/word/export?meetingId=${this.props.params.id}&userId=${userId}&type=${type}`
        fetch(url,{
            method: 'POST'
        })
        .then(res => res.json())
        .then(data => {
       
            if (data.state == 'SUCCESS') {
                if (type == 1) {
                    // word文档导出
                    dd.device.notification.alert({
                        message: '请在钉消息中查看！',
                        title: "温馨提示",
                        buttonName: "确定"
                    });
                    let timer = setTimeout(function(){
                        Control.go(-1);
                        clearTimeout(timer);
                    },2000);
                    return
                }
                common.dispatchFn({context: this,val:{dataHistory: data.values.map}});
                
                
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
    exportWord = () => {
        this.getTenderingList({type: 1});
    }
    render() {
        const { dataHistory } = this.state;
        let userId = localStorage.getItem("userId");

        if (dataHistory) {
            let historyCom = dataHistory.list.map(v => {
                return <div className="">
                            <div className="lh_4_4rem p_rl_3v f_16 c_333 f_wei">{v.issueName}</div>
                            <div className="lh_4_4rem p_rl_6v f_14 c_333">出席人：</div>
                            <div className="lh_4_4rem p_rl_3v f_14 c_333">
                                {
                                    v.joinInfo.map( el => {
                                        return (
                                            <div className="lh_4_4rem p_rl_6v f_14 c_333">
                                                {el.username}：{el.message} &nbsp;&nbsp;&nbsp;&nbsp;
                                                描述：{el.content == "undefined" ? '同意' : el.content} 
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="lh_4_4rem p_rl_6v f_14 c_333">列席人：</div>
                            <div className="lh_4_4rem p_rl_3v f_14 c_333">
                                {
                                    v.attend.map( el => {
                                        if (el.content && el.content != '无') {
                                            return (
                                                <div className="lh_4_4rem p_rl_6v f_14 c_333">
                                                    {el.username}：{el.message} &nbsp;&nbsp;&nbsp;&nbsp;
                                                    描述：{el.content == "undefined" ? '同意' : el.content} 
                                                </div>
                                            )
                                        } 
                                    })
                                }
                            </div>
                    </div>
                     
            })
            return (
                <div className="auditapprove">
                    <div className="lh_4_4rem p_rl_4v f_16 c_333">会议名称：{dataHistory.meetingName}</div>
                    <div className="line_gray"></div>
                    <div className="lh_4_4rem p_rl_4v f_16 c_333">会议时间：{dataHistory.meetingTime}</div>
                    <div className="line_gray"></div>
                    <div className="lh_4_4rem p_rl_4v f_16 c_333">出席人：{dataHistory.meetingJoinPeople}</div>
                    <div className="line_gray"></div>
                    <div className="lh_4_4rem p_rl_4v f_16 c_333">列席人：{dataHistory.meetingAttendPeople}</div>
                    <div className="line_box"></div>
                    <div className="p_b_4_4rem">
                        <div className=""></div>
                	    { historyCom }
                    </div>
                    <div className="btnBlueLong position_f_0_0" style={{width: '100%',borderRadius: '0px'}} onClick={this.exportWord}>导出word</div>
                </div>
            );
        } 
        return (
            <div></div>
        )
    }

}

export default Auditapprove ;
