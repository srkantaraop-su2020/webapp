import React,{ Component } from "react";
import  * as ax  from '../../APIs/api';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import axios from 'axios';

class CreateBook extends Component {

    constructor(props){
        super(props);
        this.state = {
          success : false,
          file: ""
        }
      }
      
    handleChange = (event) => {
        this.setState({
            success: false,
            file: URL.createObjectURL(event.target.files[0])
        });       
        console.log(event.target.files)
      //  console.log(this.uploadInput.files)
    }

    createBook(e) {
        e.preventDefault();
        let book = {}
        book.isbn = document.getElementById('isbn').value
        book.title = document.getElementById('title').value
        book.publicationDate = document.getElementById('pubDate').value
        book.quantity = document.getElementById('quantity').value
        book.price = document.getElementById('price').value
        book.sellerId = sessionStorage.getItem("userId")


        ax.createBook(book).then(resp => {
            if(resp !== undefined) {
                if(resp.status && (resp.status === 500 || resp.status === 400) ) {
                    alert(resp.data.message)
                }
                else {
                    let author = {};
                    author.bookId = resp.id;
                    author.authorNames = document.getElementById('authors').value
                    let imageCount = 0;
                    ax.createAuthor(author).then(authorResp => {
                        if(authorResp !== undefined) {
                            if(authorResp.status && (authorResp.status === 500 || authorResp.status === 400) ) {
                                alert(authorResp.data.message)
                            }
                            else {
                                if(document.getElementById("file_uploader").files.length > 0) {
                                    Object.values(document.getElementById("file_uploader").files).map((file)=>{
                                        imageCount++
                                        let fileName = file.name;
                                        let fileType = file.type;
                                        console.log("Preparing the upload");
                                        axios.post("http://localhost:8080/v1/image",{
                                            fileName : fileName,
                                            fileType : fileType,
                                            bookId : resp.id
                                        })
                                        .then(response => {
                                            var returnData = response.data.data.returnData;
                                            var signedRequest = returnData.signedRequest;
                                            var url = returnData.url;
                                            this.setState({url: url})
                                            console.log("Recieved a signed request " + signedRequest);
                                            
                                            // Put the fileType in the headers for the upload
                                            var options = {
                                                headers: {
                                                'Content-Type': fileType
                                                }
                                            };
                                            axios.put(signedRequest,file,options)
                                            .then(result => {
                                                console.log("Response from s3")
                                                this.setState({success: true});

                                                axios.post("http://localhost:8080/v1/bookImage",{
                                                    fileName : fileName,
                                                    ownerId : resp.seller_id,
                                                    bookId : resp.id
                                                }).then(() => {
                                                    if(document.getElementById("file_uploader").files.length === imageCount) {
                                                        alert("Created Book and uploaded image successfully")
                                                        window.location.href = '/sell'
                                                    } 
                                                })
                                            })
                                            .catch(error => {
                                                alert("ERROR " + JSON.stringify(error));
                                            })
                                        })
                                        .catch(error => {
                                            alert(JSON.stringify(error));
                                        })
                                    });  
                                }
                                else {
                                    alert("Created Book successfully")
                                    window.location.href = '/sell'
                                }
                            }
                        }
                    })
                }
            }
        })
    }

    render(){
        const Success_message = () => (
            <div style={{padding:50}}>
              <h3 style={{color: 'green'}}>SUCCESSFUL UPLOAD</h3>
              <br/>
            </div>
          )
        return(
            <div>
                <h4>Create a new Book here</h4>
                <div className="loginSignupForm">
                <Form>
                   <Form.Group>
                        <Form.Label>ISBN</Form.Label>
                        <Form.Control type="text" id="isbn" placeholder="Enter ISBN" />
                        <Form.Text className="text-muted">
                        Ex: 9780133387520
                        </Form.Text>
                    </Form.Group>    

                    <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" id="title" placeholder="Enter title" />
                        <Form.Text className="text-muted">
                        Ex: Cloud Computing: Concepts, Technology & Architecture
                        </Form.Text>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Authors</Form.Label>
                        <Form.Control type="text" id="authors" placeholder="Enter Authors" />
                        <Form.Text className="text-muted">
                        Ex: Thomas Erl, Ricardo Puttini, Zaigham Mahmood
                        </Form.Text>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Publication Date</Form.Label>
                        <Form.Control type="date" id="pubDate" placeholder="Select date" />
                    </Form.Group> 

                    <Form.Group>
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control type="number" id="quantity" placeholder="Enter quantity" />
                    </Form.Group> 

                    <Form.Group>
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" step="0.01" id="price" placeholder="Enter price" />
                    </Form.Group>

                    {this.state.success ? <Success_message/> : null}
                    <Form.Group>
                        <input onChange={this.handleChange} id="file_uploader" type="file" multiple/>
                    </Form.Group>
                    <img src={this.state.file}/>

                    <Button variant="primary" type="submit" onClick={(e)=>{this.createBook(e)}}>
                        CREATE
                    </Button>                    
                    
                </Form> 
                </div> 
            </div> 
        )
    }
}

export default CreateBook;