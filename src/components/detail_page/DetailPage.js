require('./DetailPage.less');
import React from 'react'; 
import { WhiteSpace, WingBlank, List,  } from "antd-mobile"; 

/*  import DetailPage  from 'components/detail_page';
    <DetailPage attribute={  } attribute={  } attribute={  }  /> 
    
    attribute: 说明

    https://mobile.ant.design/components/detail_page
*/ 

const Item = List.Item;

class DetailPage extends React.Component {
    constructor(props){super( props );
        this.state = { value:this.props.defaultValue, };
        this.handleChange = this.handleChange.bind(this);        
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange(val){
        this.setState({ value:val });
    }

    handleClick(val){
        this.setState({ value:val });
    }

    render() { 
        const {{ value }} = this.state; 
        const {{ keyname, title, data, defaultValue, extra, only=true, onChange }} = this.props; 

        return (
            <div className="detail_page ">
                component detail_page 
            </div>
        );
    }
}

export default DetailPage ;