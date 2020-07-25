import React,{ Component } from "react";
import  * as ax  from '../../APIs/api';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import "./login.css"

class PasswordReset extends Component{
    constructor(props) {
        super(props);
    }

    password_reset(e) {
        e.preventDefault();
        let user = {}
        user.userName = document.getElementById('username').value
        ax.resetPassword(user).then((resp)=>{
            if(resp!==undefined){

                if(resp.status && (resp.status === 500 || resp.status === 400) ) {
                    alert(resp.data.message)
                }
                else {
                    alert("Email sent. Please follow the steps in it to reset your password!")
                    this.props.history.push({
                        pathname: '/'
                    });
                }

            }
            else{
                alert("login fail");
            }
        })
    }

    render(){
        return(
            <div>
                <div className="loginSignupForm">
                <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="email" id="username" placeholder="Enter email" />
                    </Form.Group>

                    <Button variant="primary" type="submit" onClick={(e)=>{this.password_reset(e)}}>
                        Send Password Reset link
                    </Button>
                </Form>
                </div>
            </div>
        )
    }
}

export default PasswordReset;