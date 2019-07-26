require('./Enclosurecom.less');
import React from 'react'; 
import mydingready from './../../dings/mydingready';
import utilsFile from './../../utils/utils_file';

const { IMGCOMMONURI } = require(`config/develop.json`);


class Enclosurecom extends React.Component {
    constructor(props){
        super( props );
        this.state = { data: [] ,isDetail: 'true'};
    }
    // 組件接收到新的props后被調用，初始化时不调用
    componentWillReceiveProps (newProps) {
        this.setStateFn();
    }
    componentDidMount () {
        this.setStateFn();
    }
    setStateFn = () => {
        this.setState({
            data: this.props.context.state.enclosure,   
            isDetail: this.props.isDetail
        })
    }
    /*
    * 删除文件
    * @param [String] fileId 文件Id
    *
    */
    delFile = (e,fileId) => {
        e.stopPropagation();
        utilsFile.delFile({
            context: this.props.context,
            fileId: fileId
        })
    }
    /**
    * 预览文件
    * @param [String] ddApiState  钉钉状态值
    * @param [Object] fileInfo    要预览文件的信息
    */
    previewFile = (ddApiState,fileInfo) => {
        mydingready.ddReady({
            context: this.props.context,
            ddApiState: ddApiState,
            otherData: fileInfo
        });
    }
    render() { 
        const { data , isDetail} = this.state; 
        
        let enclosureCom = data.map(v => {
            let fileTypeImg, 
                fileTypeImgArr = ['ppt.png','ppt.png','excel.png','excel.png','word.png','word.png'];
            let i = ['ppt','pptx','xls','xlsx','doc','docx'].indexOf(v.fileType);
            i != -1 ? fileTypeImg = fileTypeImgArr[i] : fileTypeImg = 'unknown.png';
            return <div className="file" onClick={() => this.previewFile('previewFile',v)}>
                        <img className="fileIcon" src={`${IMGCOMMONURI}${fileTypeImg}`} />
                        <p className="textOverflow_1">{v.fileName}</p>
                        <div className={isDetail ? "isHide" : "closeBtn"} onClick={(e) => this.delFile(e,v.fileId)}>
                            <img src={`${IMGCOMMONURI}delete.png`} />
                        </div>
                    </div>
        })
        return (
            <div className="enclosurecom fileBox">
                {enclosureCom}
                <div className={isDetail ? 'isHide' : "file"} onClick={() => this.props.context.toDdJsApi('uploadFile')}>
                    <img className="fileIcon selectedBtn" src={`${IMGCOMMONURI}z z.png`} />
                    <p>上传附件</p>
                </div>
            </div>
        );
    }
}

export default Enclosurecom ;