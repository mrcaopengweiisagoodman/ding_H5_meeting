// 添加招标
require('./PageStatistical.less');
import logic from './PageLogic';
import { Component, LogicRender } from 'refast';  
import {
    DatePicker,
    List 
} from 'antd-mobile';
import { Link,Control } from 'react-keeper';
import moment from 'moment';

import common from './../../utils/common';
import utilsFile from './../../utils/utils_file';
import mydingready from './../../dings/mydingready';

const { AUTH_URL, IMGCOMMONURI,CONFIG_APP_URL } = require(`config/develop.json`);

class StatisticalCom extends Component {
    constructor(props) { 
        super(props, logic);     
        mydingready.ddReady({pageTitle: '统计'});
    }

    getList = (startTime,endTime,date) => {
        let startTime_1 ,endTime_1;
        if (!startTime) {
            dd.device.notification.alert({
                message: '请选择开始时间！',
                title: '温馨提示',
                buttonName: "确定"
            });
            return
        }
        if (!endTime) {
            dd.device.notification.alert({
                message: '请选择结束时间！',
                title: '温馨提示',
                buttonName: "确定"
            });
            return
        }
        if (startTime > endTime) {
            startTime_1 = endTime;
            endTime_1 = startTime;
        } else {
            startTime_1 = startTime;
            endTime_1 = endTime;
        }
        startTime = common.formatTime({
            date: startTime_1,
            str_ymd: '-',
            str_dm: 'T',
            str_hms: ':'
        });
        endTime = common.formatTime({
            date: endTime_1,
            str_ymd: '-',
            str_dm: 'T',
            str_hms: ':'
        });

        fetch(`${AUTH_URL}meeting/mt-meeting/search/time?startTime=${startTime}&endTime=${endTime}`,{
            method: 'GET',
        })
        .then(res => res.json())
        .then(data => {
            if (data.state == 'SUCCESS') {
                common.dispatchFn({
                    context: this,
                    val: {
                        dataList: data.values,
                        date
                    }
                })
                return
            }
            dd.device.notification.alert({
                message: data.values.msg,
                title: '温馨提示',
                buttonName: "确定"
            });
        })
    }
    dateChange = (date,str) => {
        common.dispatchFn({
            context: this,
            val: {
                [str]: date
            }   
        })
        let { startTime , endTime } = this.state;
        if (startTime && 'endTime') {
            this.getList(startTime,date,{[str]:date});
            return
        }
        if (str == 'startTime' && endTime) {
            this.getList(date,endTime,{[str]:date});
        }
    }
    render() {
        const { startTime, endTime ,dataList ,moreStr} = this.state; 

        const listCom = dataList.list.map(v=>{
            let time = v.meetingTime.split('T').join(' ');
            return  <Link to={`/detailauditapprove/${v.mtMeetingId}`} className="border_gray">
                        <div className="lh_4_4rem flex_bc">
                            <div className="">{v.meetingName}</div>
                            <div className="">{time}</div>
                        </div>
                        <div className="lh_4_4rem">议题数量：{v.meetingIssueNum}</div>
                    </Link>
        })


        return (
            <div className="addauditapprove addcontract statistical">
                <div className="flex_ac">
                    <DatePicker
                        minDate={new Date('2017-01-01 00:00:00')}
                        extra="开始时间"
                        mode="datetime"
                        value={startTime}
                        onChange={(date) => {this.dateChange(date,'startTime')}}
                    >
                        <List.Item arrow="horizontal" className="f_16"></List.Item>
                    </DatePicker>
                    <DatePicker
                        minDate={new Date('2017-01-01 00:00:00')}
                        mode="datetime"
                        extra="结束时间"
                        value={endTime}
                        onChange={(date) => {this.dateChange(date,'endTime')}}
                    >
                        <List.Item arrow="horizontal" className="f_16"></List.Item>
                    </DatePicker>
                </div>
                <div className="line_gray"></div>
                <div className="flex_bc f_15 lh_4_4rem p_rl_3v">
                    <div>会议总数：{dataList.meetingCount}</div>
                    <div>议题总数：{dataList.issueCount}</div>
                </div>
                <div className="line_box"></div>
                <div className="p_rl_3v">
                    {listCom}
                </div>
                <div className={dataList.list.length ? "isHide" : "lh_4_4rem f_14 c_333 text_center"}>暂无数据</div>
                {/*<div className="lh_4_4rem f_14 c_333 text_center">{moreStr}</div>*/}
            </div>
        );
    }

}
export default StatisticalCom ;
