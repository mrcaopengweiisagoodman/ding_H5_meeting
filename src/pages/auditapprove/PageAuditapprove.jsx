require('./PageAuditapprove.less');
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
        mydingready.ddReady({pageTitle: '会议列表',ddApiState: 'getUser'});
    }
    componentDidMount () {
        this.getTenderingList({state: 0});

    }
  
    /**
    * 获取会议列表
    */
    getTenderingList = ({state ,searchWord }) => {
        let userId = mydingready.globalData.userId ? mydingready.globalData.userId 
                                                   : localStorage.getItem('userId');
        let url = `${AUTH_URL}meeting/mt-meeting/list?type=${state}&pageNum=1&pageSize=1000`
        fetch(url)
        .then(res => res.json())
        .then(data => {
           /* dd.device.notification.alert({
                message: "数据加载成功" + JSON.stringify(data),
                title: "警告",
                buttonName: "确定"
            });*/
            if (data.state == 'SUCCESS') {
                common.dispatchFn({context: this,val:{listData: data.values.list.list}});
                common.dispatchFn({context: this,val:{
                    pageInfo: {
                        pageNum: 1,
                        pageSize: 1000,
                        state: state,
                    },
                }});
                
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
    /* 删除会议 */
    delMeeting = (e,id) => {
        console.log('删除')
        e.stopPropagation();
        let userId = localStorage.getItem('userId');
        fetch(`${AUTH_URL}meeting/mt-meeting/delete/${id}?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
           /* dd.device.notification.alert({
                message: "数据加载成功" + JSON.stringify(data),
                title: "警告",
                buttonName: "确定"
            });*/
            if (data.state == 'SUCCESS') {
                dd.device.notification.alert({
                    message: "删除成功！",
                    title: "温馨提示",
                    buttonName: "确定"
                });
                this.getTenderingList({state: this.state.pageInfo.state});
                return
            }
            dd.device.notification.alert({
                message: data.info,
                title: "警告",
                buttonName: "确定"
            });
        })
    }
    goPage = (id,name) => {
        Control.go('/meetingadd',{meetingName: name,meetingId: id});
    }
    goDetail = (mtMeetingId,manIdStr) => {
        let arr = manIdStr.split(','),
            userId = localStorage.getItem('userId'),
            inx = arr.indexOf(userId);
       /* if (inx < 0) {
            dd.device.notification.alert({
                message: "您无权限查看！",
                title: "温馨提示",
                buttonName: "确定"
            });
            return
        }*/
        Control.go(`/detailauditapprove/${mtMeetingId}`);

    }
    render() {
        const { tabs , listData ,searchVal,approver} = this.state;
        let userId = localStorage.getItem("userId");
        /*let data1 = [{"name":"田ert帅","avatar":"","emplId":"0125056400964069"},{"name":"田帅2","avatar":"","emplId":"0121156400954069"}];
        let approverCom = data1.map(v=>{*/
       /* let approverCom = JSON.parse(listData.approver).map(v=>{
            return <div key={v.emplId}>
                        <div className="box_b manBox">
                            <div className="color_b">{v.name}</div>
                        </div>
                    </div>
        });*/

        const tabNode = tabs.forEach( (v,inx) => {
            return <span>{v.title}</span>
        })
        let listCom = listData.map(v => {
            let allowSee = v.meetingAttendpeopleId + v.meetingJoinpeopleId;
            let allowFlag;
            if (allowSee.indexOf(userId) > -1 || userId == v.meetingOriginatorId) {
                allowFlag = true;
            }
             return <div className={allowFlag ? "position_r" : 'isHide'}>
                    <div className="listBox" onClick={()=>this.goDetail(v.mtMeetingId,v.meetingAttendpeopleId + ',' + v.meetingJoinpeopleId)}>
                        <div className="flex_bc meetingName p_rl_3v">
                            <p>{v.meetingName}</p>
                            <p>议题数量:{v.meetingIssueNum}</p>
                        </div>
                        <div className="list meetingName flex_bc">
                            <p>{moment(v.createTime).format('YYYY.MM.DD HH:mm')}</p>
                        </div>
                    </div>
                    <div className={v.meetingOriginatorId == userId ? "btnArr flex" : "isHide"}>
                    {/*<div className="btnArr flex">*/}
                        <div className="del_btn btnRedShort m_r_2v" onClick={(e)=>this.delMeeting(e,v.mtMeetingId)}>删除</div>
                        <div className="addMeeting btnBlueShort" style={{height: '2.2rem',lineHeight: '2.2rem'}} onClick={()=>this.goPage(v.mtMeetingId,v.meetingName)}>添加议题</div>
                    </div>
                </div>
                 
        })
        return (
            <div className="auditapprove">
            	<Tabs tabs={tabs}
                    initialPage={0}
                    onChange={(tab, index) => this.getTenderingList({state: tab.state})}
                    onTabClick={(tab, index) => console.log(tab.state)}
                >
                    <div className="tabBody">
                       {/* <SearchBar className="searchBox" placeholder="审批人/投标名称" 
                            value={searchVal}
                            onSubmit={this.goSearch} 
                            onBlur={this.searchBlur}
                            onChange={this.searchChange}
                        /> */}

                        {listData.length ? listCom : <div className="no-date">暂无数据</div>}
                    </div>
                    <div className="tabBody">
                        {/*<SearchBar className="searchBox" placeholder="审批人/投标名称" 
                            value={searchVal}
                            onSubmit={this.goSearch} 
                            onBlur={this.searchBlur}
                            onChange={this.searchChange}
                        /> */}
                        <div>
                            {listData.length ? listCom : <div className="no-date">暂无数据</div>}
                        </div>
                    </div>
                    <div className="tabBody">
                        <SearchBar className="searchBox" placeholder="审批人/投标名称" 
                            value={searchVal}
                            onSubmit={this.goSearch}  
                            onBlur={this.searchBlur}
                            onChange={this.searchChange}
                        /> 
                        <div>
                            {listData.length ? listCom : ''}
                        </div>
                    </div>
                </Tabs>
                <Link type='img' src={`${IMGCOMMONURI}add_big.png`} className='addTenderingBtn' to={ '/addauditapprove' } />
            </div>
        );
    }

}

export default Auditapprove ;
