require('./Approvercom.less');
import React from 'react'; 
import utilsFile from './../../utils/utils_file';
const { IMGCOMMONURI } = require(`config/develop.json`);



class Approvercom extends React.Component {
    constructor(props){
        super( props );
        this.state = { 
            data: [],
            isDetail: true
        };
    }
    componentWillReceiveProps () {
       this.setStateFn();
    }
    componentDidMount () {
       this.setStateFn();
    }
    setStateFn = () => {
        let type = this.props.type;
        this.setState({
            data: this.props.context.state[type],   
            isDetail: this.props.isDetail,
        })
    }
    delContact = (manState,emplId) => {
        utilsFile.delContact({
            context: this.props.context,
            manState: manState,
            emplId: emplId
        })
    }
    render() { 
        const { data , isDetail } = this.state; 

        let approverCom = data.map(v=>{
            return <div key={v.emplId} style={{margin: '5px 1.5vw'}}>
                        <div className="box_b manBox">
                            <p className="color_b">{v.name}</p>
                            <img className={isDetail ? 'isHide' : ''} src={`${IMGCOMMONURI}delete.png`} onClick={()=>this.delContact(this.props.type,v.emplId)} />
                        </div>
                    </div>
        });
        return (
            <div className="approvercom manArr">
                {approverCom}
            </div>
        );
    }
}

export default Approvercom ;