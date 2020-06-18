
import React,{ Component } from "react";
import  * as ax  from '../../APIs/api';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
// import "./signup.css"

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
                                a.appendChild(y)
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
                                    window.location.reload();
                                }
                            }
                        })

                    }
                    else {
                        alert("Updated Book successfully")
                        window.location.reload();
                    }
                }
            }
        })
    }

    render(){
        return(
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
                        <Form.Control type="date" id="pubDate" placeholder="" onFocus="(this.type='date')"/>
                    </Form.Group> 

                    <Form.Group>
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control type="number" id="quantity" placeholder={this.state.book.quantity} />
                    </Form.Group> 

                    <Form.Group>
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" step="0.01" id="price" placeholder={this.state.book.price} />
                    </Form.Group> 
                    
                    <Button variant="primary" type="submit" onClick={(e)=>{this.updateBook(e)}}>
                        UPDATE
                    </Button>
                </Form> 
                <div id ="images"></div>
                </div> 
            </div> 
        )
    }
}

export default UpdateBook;