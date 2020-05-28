import React,{ Component } from "react";
import  * as ax  from '../../APIs/api';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import "./profile.css"

class Profile extends Component{

    constructor(props) {
        super(props);
        this.state={
            editMode: false,
            userName: "",
            firstName: "",
            lastName: "",
            password: ""
         };
    } 

    componentDidMount() {
        if(sessionStorage.getItem("userName") === '' || sessionStorage.getItem("userName") === undefined || sessionStorage.getItem("userName") == null) {
            alert('You do not have permission to view Profile, Please login!')
            window.location.href = '/'
        }
        else {
            ax.getUser(sessionStorage.getItem("userName")).then((response) => {
                if(response !== undefined) {
                    this.setState({
                        userName: response.user_name,
                        firstName: response.first_name,
                        lastName: response.last_name
                    })
                }
            })
        }
    }

    updateUser(e) {
        e.preventDefault()
        let user = {}
        let password = document.getElementById('password').value
        let firstName = document.getElementById('firstname').value
        let lastName = document.getElementById('lastname').value
        if(!(password === "")) {
            user.password = password
        }
        if(!(firstName === "")) {
            user.first_name = firstName
        }
        if(!(lastName === "")) {
            user.last_name = lastName
        }
        if(!(JSON.stringify(user) === '{}')) {
            ax.updateUser(user, this.state.userName).then((resp)=> {
                if(resp!==undefined){
                    if(resp.status && (resp.status === 500 || resp.status === 400) ) {
                        alert(resp.data.message)
                    }
                    else {
                        alert("Updated user successfully!")
                        window.location.reload();
                    }
    
                }
                else{
                    alert("login fail");
                }
            })
        }
        else {
            alert("Nothing to update!")
        }
    }

    switchToEditMode(e) {
        e.preventDefault()
        this.setState({editMode: true})
    }

    switchToViewMode(e) {
        e.preventDefault()
        this.setState({editMode: false})
    }

    render(){
        return(
            <div>
                { this.state.userName === "" ? 
                <div></div> : 
                <div>

                    {!this.state.editMode ? 
                        <div className ="viewProfileForm">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Email Address</td>
                                        <td>{this.state.userName}</td>
                                    </tr>
                                    <tr>
                                        <td>First Name</td>
                                        <td>{this.state.firstName}</td>   
                                    </tr>
                                    <tr>
                                        <td>Last Name</td>
                                        <td>{this.state.lastName}</td>
                                    </tr>
                                </tbody>      
                            </table> 
                            <Form>
                                <Form.Group>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Text className="text-muted">
                                    For security purposes, you cannot view your password, you can only update it!
                                    </Form.Text>
                                </Form.Group>
                                
                                <Button variant="primary" type="submit" onClick={(e)=>{this.switchToEditMode(e)}}>
                                    EDIT
                                </Button>
                            </Form>
                    </div>   
                    :
                        <Form className= "editProfileForm">
                        <Form.Group>
                                <Form.Label>Email Address</Form.Label>
                                <div>
                                <Form.Label type="email" id="userName" placeholder="Enter email"> {this.state.userName} </Form.Label>
                                </div>
                                <Form.Text className="text-muted">
                                Username once created cannot be changed!
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
                                <Form.Label>First Name</Form.Label>
                                <Form.Control type="text" id="firstname" placeholder={this.state.firstName} />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control type="text" id="lastname" placeholder={this.state.lastName} />
                            </Form.Group> 
                            
                            <Button variant="primary" type="submit" onClick={(e)=>{this.updateUser(e)}}>
                                SAVE
                            </Button>
                            <Button className="cancelButton" variant="primary" type="submit" onClick={(e)=>{this.switchToViewMode(e)}}>
                                CANCEL
                            </Button>
                        </Form>
                    }
                </div>}

            </div>
        )
    }
}



export default Profile;