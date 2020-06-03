import React,{ Component } from "react";
import  * as ax  from '../../APIs/api';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import "./login.css"

class Login extends Component{
    constructor(props) {
        super(props);
        this.state={
            fullName: null,
            userId: 0
         };
    }  

    authenticate_user(e){
        e.preventDefault();
        let user = {}
        user.userName = document.getElementById('username').value
        user.password = document.getElementById('password').value
        ax.authenticateUser(user).then((resp)=>{
            if(resp!==undefined){

                if(resp.status && (resp.status === 500 || resp.status === 400) ) {
                    alert(resp.data.message)
                }
                else {
                    sessionStorage.setItem("userName",resp['user_name']);
                    sessionStorage.setItem("userId",resp['id']);
                    this.props.history.push({
                        pathname: '/profile'
                    });
                }

            }
            else{
                alert("login fail");
            }
        })
    }

    gotoSignUp(){
        this.props.history.push({
            pathname: '/signUp'
        });
    }

    render(){
        return(
            <div>
                <div className="loginSignupForm">
                <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="email" id="username" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control id="password" type="password" placeholder="Password" />
                    </Form.Group>

                    <Button variant="primary" type="submit" onClick={(e)=>{this.authenticate_user(e)}}>
                        LOGIN
                    </Button>

                    <Button className="signup" variant="primary" type="button" onClick={(e)=>{this.gotoSignUp()}}>
                    Not a Registered User? Click here
                    </Button>
                </Form>
                </div>
            </div>
        )
    }
}

export default Login;