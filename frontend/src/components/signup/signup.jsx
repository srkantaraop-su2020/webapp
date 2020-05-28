import React,{ Component } from "react";
import  * as ax  from '../../APIs/api';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import "./signup.css"

class SignUp extends Component {

    signUpUser(e) {
        e.preventDefault();
        let user = {}
        user.userName = document.getElementById('userName').value
        user.password = document.getElementById('password').value
        let reTypedPassword = document.getElementById('retypePassword').value
        user.firstName = document.getElementById('firstname').value
        user.lastName = document.getElementById('lastname').value
        if(user.password === reTypedPassword) {
            ax.createUser(user).then(resp => {
                if(resp !== undefined) {
                    if(resp.status && (resp.status === 500 || resp.status === 400) ) {
                        alert(resp.data.message)
                    }
                    else {
                        alert("Registered successfully")
                        this.props.history.push({
                            pathname: '/'
                        });
                    }
                }
            })
        }
        else {
            alert("Passwords do not match!")
        }
    }

    render(){
        return(
            <div>
                <div className="loginSignupForm">
                <Form>
                   <Form.Group>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="email" id="userName" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>    

                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control id="password" type="password" placeholder="Password" />
                        <Form.Text className="text-muted">
                        Password should comply to all of the following rules: <br/>
                        1. Minimum length - 8 <br/>
                        2. Maximum length - 100 <br/>
                        3. Atleast 1 Upper case <br/>
                        4. Atleast 1 Lower case <br/>
                        5. Atleast 1 digit <br/>
                        6. No Spaces <br/>
                        7. Should not be Passw0rd or Password123 <br/>
                        8. Atleast 1 symbol <br/>
                        </Form.Text>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Re-enter Password</Form.Label>
                        <Form.Control id="retypePassword" type="password" placeholder="Password" />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" id="firstname" placeholder="Enter first name" />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" id="lastname" placeholder="Enter last name" />
                    </Form.Group> 
                    
                    <Button variant="primary" type="submit" onClick={(e)=>{this.signUpUser(e)}}>
                        SIGN UP
                    </Button>
                </Form> 
                </div> 
            </div> 
        )
    }
}

export default SignUp;