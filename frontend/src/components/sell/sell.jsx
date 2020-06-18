import React,{ Component } from "react";
import  * as ax  from '../../APIs/api';
import Button from 'react-bootstrap/Button'
// import "./login.css"

class Sell extends Component{
    constructor(props) {
        super(props);
        this.state={
            books: []
         };
    }  

    componentDidMount() {
        if(sessionStorage.getItem("userName") === '' || sessionStorage.getItem("userName") === undefined || sessionStorage.getItem("userName") == null) {
            alert('You do not have permission to sell books, Please login!')
            window.location.href = '/'
        }
        else {
            ax.getBooks().then((response) => {
                if(response !== undefined) {
                    this.setState({
                        books: response
                    })
                }
            })
        }
    }

    createBook(e) {
        e.preventDefault();
        window.location.href = '/createBook'
    }

    deleteBook(e, bookId) {
        e.preventDefault();
       
        let decision = window.confirm("Are you sure you want to delete the book?");
        if (decision === true) {
            let req = {"bookId": bookId}
            console.log(req)
            ax.deleteBook(bookId).then((response) => {
                if(response !== undefined) {
                    alert("Successfully deleted the book!")
                   window.location.reload();
                }
            })
        } 
        else {
        
        }
    }

    render(){
        return(
            <div>
                You can sell books here
                <div>
                <Button variant="primary" type="submit" onClick={(e)=>{this.createBook(e)}}>
                        CREATE NEW BOOK
                </Button>
                </div>
                <table id="table-style">
                    <thead>
                        <tr>
                            <th>Book Id</th>
                            <th>Book Name</th>
                            <th>ISBN</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Update</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.books.map(( listValue, index ) => {
                            return (
                                <tr key={index}>
                                    <td>{listValue["id"]}</td>
                                    <td>{listValue["title"]}</td>
                                    <td>{listValue["isbn"]}</td>
                                    <td>${listValue["price"]}</td>
                                    <td>{listValue["quantity"]}</td>
                                    {listValue["seller_id"] == sessionStorage.getItem("userId") ? 
                                        <td><a href={"/updateBook?"+ listValue["id"]}>View/Edit</a></td>
                                    :
                                       <td> Not Allowed</td>
                                    }
                                    {listValue["seller_id"] == sessionStorage.getItem("userId") ? 
                                        <td><Button variant="danger" type="submit" onClick={(e)=>{this.deleteBook(e, listValue["id"])}}>DELETE</Button></td>
                                    :
                                       <td> Not Allowed</td>
                                    }                                    
                                </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Sell;