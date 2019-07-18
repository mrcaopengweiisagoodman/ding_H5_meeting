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

    getList = ({
        startTime,
        endTime,
        date,// 需要更新的state
        pageSize_,
        pageNum_,
        dataList_
    }) => {

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


        let userId = localStorage.getItem('userId');
        let { pageNum, pageSize , dataList , isDataChange } = this.state;
        if (pageNum_) pageNum = pageNum_;
        if (pageSize_) pageSize = pageSize_;
        fetch(`${AUTH_URL}meeting/mt-meeting/search/time?startTime=${startTime}&endTime=${endTime}&userId=${userId}&pageNum=${pageNum}&pageSize=${pageSize}`,{
            method: 'GET',
        })
        .then(res => res.json())
        .then(data => {
            if (data.state == 'SUCCESS') {
                // console.log('-----------',dataList.list)
                if (dataList_) {
                    data.values.list = dataList_.list.concat(data.values.list);
                } else {
                    data.values.list = dataList.list.concat(data.values.list);
                }
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
                message: data.info,
                title: '温馨提示',
                buttonName: "确定"
            });
        })
    }
    dateChange = (date,str) => {
        let { startTime , endTime } = this.state;
        common.dispatchFn({
            context: this,
            val: {
                [str]: date,
                dataList: {
                    list: [],
                    meetingCount: 0,
                    issueCount: 0
                },
            }   
        })
        // console.log('选取',date,str)
        if (startTime && str == 'endTime') {
            this.getList({
                startTime: startTime,
                endTime: date,
                dataList_: {
                    list: [],
                    meetingCount: 0,
                    issueCount: 0
                },
            });
            return
        }
        if (str == 'startTime' && endTime) {
            // this.getList(date,endTime,{[str]:date});
            this.getList({
                startTime: date,
                endTime: endTime,
                dataList_: {
                    list: [],
                    meetingCount: 0,
                    issueCount: 0
                },
            });
            return
        }
    }
    /*加载更多*/
    getMore = () => {
        let { pageNum , pageSize , startTime , endTime , dataList } = this.state;
        pageNum++;
        if (dataList.list.length == dataList.meetingCount) {
            common.dispatchFn({
                context: this,
                val: {
                    moreStr: '---我是有底线的---'
                }
            })
            return
        }
        this.getList({
            startTime: startTime,
            endTime: endTime,
            pageNum_: pageNum,
            pageSize_: pageSize,
            date: {pageNum: pageNum}
        });
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
                <div className={dataList.list.length ? "lh_4_4rem f_14 c_333 text_center" : "isHide"} onClick={this.getMore}>{moreStr}</div>
            </div>
        );
    }

}
export default StatisticalCom ;
