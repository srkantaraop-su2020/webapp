import React,{ Component } from "react";
import  * as ax  from '../../APIs/api';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
// import "./signup.css"

class CreateBook extends Component {

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
                    ax.createAuthor(author).then(resp => {
                        if(resp !== undefined) {
                            if(resp.status && (resp.status === 500 || resp.status === 400) ) {
                                alert(resp.data.message)
                            }
                            else {
                                alert("Created Book successfully")
                                window.location.href = '/sell'
                            }
                        }
                    })
                }
            }
        })
    }

    render(){
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