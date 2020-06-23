import React,{ Component } from "react";
import  * as ax  from '../../APIs/api';

class Logout extends Component{
    componentDidMount() {
        
        ax.logoutUser().then(resp => {
            if(resp!==undefined){
                sessionStorage.setItem('userName','')
                sessionStorage.setItem('userId','')
                alert("logged out successfully!")
                window.location.href="/"
            }
            else{
                alert("logout fail");
            }
        })
    }

    render(){
        return(
            <div></div>
        )
    }
}

export default Logout;