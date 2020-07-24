
import React,{ Component } from "react";
import  * as ax  from '../../APIs/api';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import axios from 'axios';

class UpdateBook extends Component {

    listOfSources = []
    constructor(props) {
        super(props);
        this.state={
            book: [],
            authors: ""
         };
    }  

    componentDidMount() {
        if(sessionStorage.getItem("userName") === '' || sessionStorage.getItem("userName") === undefined || sessionStorage.getItem("userName") == null) {
            alert('You do not have permission to update book details, Please login!')
            window.location.href = '/'
        }
        else {
            let bookId = window.location.href.split('?')[1]
            ax.getBookById(bookId).then((response) => {
                if(response !== undefined) {
                    let authorNameList = ""
                    let authors = response.authors
                    authors.forEach(author => {
                        authorNameList = authorNameList + author.author_name + ","
                    });
                    ax.getImagesOfBook(response.seller_id, bookId).then(resp => {
                        if(resp != undefined) {
                            for(var i=0;i<resp.data.listOfSources.length;i++){
                                let  imgdata = resp.data.listOfSources[i]
                                let  imgName = resp.data.listOfImageNames[i]
                                  
                                var a = document.createElement("div");
                                var x = document.createElement("img");
                                let srcc= "data:image/png;base64,"+imgdata;
                                x.setAttribute("src",srcc );
                      
                                var y = document.createElement("button");
                                y.setAttribute("id",imgName+'#'+bookId);
                                y.innerHTML="Delete Image"
                                y.addEventListener("click", this.deleteImage);
                                a.appendChild(x)
                                if(sessionStorage.getItem('userId') == this.state.book.seller_id){
                                    a.appendChild(y)
                                }
                                document.getElementById("images").appendChild(a);
                            }
                        }
                    })
                    this.setState({
                        book: response,
                        authors: authorNameList
                    })
                }
            })
        }
    }

    deleteImage(event) {
        event.preventDefault();
        let fileName = event.target.id.split('#')[0]
        let bookId = event.target.id.split('#')[1]
        ax.deleteImage(fileName, bookId).then(resp => {
            if(resp != undefined) {
                alert("Successfully deleted the image")
                window.location.reload()
            }
            else {
                alert("Failed to delete the image")
            }
        })
    }

    updateBook(e) {
        e.preventDefault();
        let book = {}
        book.id = this.state.book.id
        let isbn = document.getElementById('isbn').value
        let title = document.getElementById('title').value
        let publicationDate = document.getElementById('pubDate').value
        let quantity = document.getElementById('quantity').value
        let price = document.getElementById('price').value

        if(isbn!=="") {
            book.isbn = isbn
        }

        if(title!=="") {
            book.title = title
        }

        if(publicationDate!=="") {
            book.publicationDate = publicationDate
        }

        if(quantity!=="") {
            book.quantity = quantity
        }

        if(price!=="") {
            book.price = price
        }

        ax.updateBook(book).then(resp => {
            if(resp !== undefined) {
                if(resp.status && (resp.status === 500 || resp.status === 400) ) {
                    alert(resp.data.message)
                }
                else {
                    let authorNames = document.getElementById('authors').value
                    if(authorNames !== "") {
                        
                        let author = {};
                        author.bookId = this.state.book.id
                        author.authorNames = authorNames

                        ax.updateAuthor(author).then(resp => {
                            if(resp !== undefined) {
                                if(resp.status && (resp.status === 500 || resp.status === 400) ) {
                                    alert(resp.data.message)
                                }
                                else {
                                    alert("Updated Book with Author successfully")
                                }
                            }
                        })
                    }
                    if(document.getElementById("file_uploader").files.length > 0) {
                        let imageCount = 0;
                        Object.values(document.getElementById("file_uploader").files).map((file)=>{
                            imageCount++
                            let fileName = file.name;
                            let fileType = file.type;
                            console.log("Preparing the upload");
                            axios.post("http://"+window.location.hostname+":8080/v1/image",{
                                fileName : fileName,
                                fileType : fileType,
                                bookId : this.state.book.id
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

                                    axios.post("http://"+window.location.hostname+":8080/v1/bookImage",{
                                        fileName : fileName,
                                        ownerId : this.state.book.seller_id,
                                        bookId : this.state.book.id
                                    }).then(() => {
                                        if(document.getElementById("file_uploader").files.length === imageCount) {
                                            alert("Updated book and uploaded new image successfully")
                                            window.location.reload()
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
                }
            }
        })
    }

    render(){
        return(
            <div>
                {sessionStorage.getItem('userId') == this.state.book.seller_id ? 
                    <div>
                        <h4>Update Book here</h4>
                        <div className="loginSignupForm">
                        <Form>
                            <Form.Group>
                                <Form.Label>ISBN</Form.Label>
                                <Form.Control type="text" id="isbn" placeholder={this.state.book.isbn} />
                                <Form.Text className="text-muted">
                                Ex: 9780133387520
                                </Form.Text>
                            </Form.Group>    

                            <Form.Group>
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" id="title" placeholder={this.state.book.title} />
                                <Form.Text className="text-muted">
                                Ex: Cloud Computing: Concepts, Technology & Architecture
                                </Form.Text>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Authors</Form.Label>
                                <Form.Control type="text" id="authors" placeholder={this.state.authors} />
                                <Form.Text className="text-muted">
                                Ex: Thomas Erl, Ricardo Puttini, Zaigham Mahmood
                                </Form.Text>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Publication Date</Form.Label>
                                <Form.Control type="text" id="pubDate" placeholder={this.state.book.publication_date} onFocus="(this.type='date')"/>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control type="number" id="quantity" placeholder={this.state.book.quantity} />
                            </Form.Group> 

                            <Form.Group>
                                <Form.Label>Price</Form.Label>
                                <Form.Control type="number" step="0.01" id="price" placeholder={this.state.book.price} />
                            </Form.Group> 
                            
                            <Form.Group>
                                <input id="file_uploader" type="file" multiple/>
                            </Form.Group>

                            <Button variant="primary" type="submit" onClick={(e)=>{this.updateBook(e)}}>
                                UPDATE
                            </Button>
                        </Form> 
                        <div id ="images"></div>
                        </div>
                    </div> 
                    : 
                    <div> 
                        <h4>View Book details here</h4>
                        <div className="loginSignupForm">
                        <Form>
                        <Form.Group>
                                <Form.Label>ISBN</Form.Label>
                                <Form.Control disabled type="text" id="isbn" placeholder={this.state.book.isbn} />
                            </Form.Group>    

                            <Form.Group>
                                <Form.Label>Title</Form.Label>
                                <Form.Control disabled type="text" id="title" placeholder={this.state.book.title} />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Authors</Form.Label>
                                <Form.Control disabled type="text" id="authors" placeholder={this.state.authors} />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Publication Date</Form.Label>
                                <Form.Control disabled type="text" id="pubDate" placeholder={this.state.book.publication_date}/>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control disabled type="number" id="quantity" placeholder={this.state.book.quantity} />
                            </Form.Group> 

                            <Form.Group>
                                <Form.Label>Price</Form.Label>
                                <Form.Control disabled type="number" step="0.01" id="price" placeholder={this.state.book.price} />
                            </Form.Group>
                        </Form> 
                        <div id ="images"></div>
                        </div>
                    </div> 
                }
                 
            </div> 
        )
    }
}

export default UpdateBook;