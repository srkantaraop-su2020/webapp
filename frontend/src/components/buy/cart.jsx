import React,{ Component } from "react";
import  * as ax  from '../../APIs/api';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
// import "./login.css"

class Cart extends Component{
    constructor(props) {
        super(props);
        this.state={
            books: [],
            nonDeletedBooks: []
         };
    }  

    componentDidMount() {
        if(sessionStorage.getItem("userName") === '' || sessionStorage.getItem("userName") === undefined || sessionStorage.getItem("userName") == null) {
            alert('You do not have permission to buy books, Please login!')
            window.location.href = '/'
        }
        else {
            let nonDeletedBooksList = []
            ax.getCartItemsByBuyerId(sessionStorage.getItem("userId")).then((response) => {
                let totalCount = Object.values(response).length;
                if(response.status && (response.status === 500 || response.status === 400) ) {
                    alert(response.data.message)
                }
                else {
                    let count = 0;
                    response.forEach(item => {
                        count++;
                        ax.getBookById(item.book_id).then((resp) => {
                            if(resp != null) {
                                nonDeletedBooksList.push(item.book_id)
                            }
                            if(count == totalCount) {
                                this.setState({
                                    books: response,
                                    nonDeletedBooks: nonDeletedBooksList
                                })
                            }
                        })
                    });
                }
            })
        }
    }

    updateItem(event, cartId, bookId) {
        event.preventDefault();
        let book = {
            bookId: bookId,
            quantity: event.target.parentElement.parentElement.children[4].firstElementChild.value,
            oldQty: event.target.parentElement.parentElement.children[4].firstElementChild.id
        }
        ax.updateCartItem(cartId, book).then((response) => {
            if(response.status && (response.status === 500 || response.status === 400) ) {
                alert(response.data.message)
            }
            else {
                alert("Successfully updated the item!")
                window.location.reload();
            }
        })
    }

    checkIfItemExists(bookId) {
        ax.getBookById(bookId).then((response) => {
            if(response === "" || response === undefined || response == null) {
                return false
            }
            else {
                return true
            }
        })
        return true;
    }

    render(){
        return(
            <div>
                Items in your cart are displayed here
                <table id="table-style">
                    <thead>
                        <tr>
                            <th>Cart Id</th>
                            <th>Book Id</th>
                            <th>Book Name</th>
                            <th>Price</th>
                            <th>Quantity in Cart</th>
                            <th>Update</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.books.map(( listValue, index ) => {
                            return (
                                <tr key={index}>
                                    <td>{listValue["id"]}</td>
                                    <td>{listValue["book_id"]}</td>
                                    <td><a href={"/viewBook?"+ listValue["book_id"]}>{listValue["book_name"]}</a></td>
                                    <td>${listValue["price"]}</td>
                                    <td><Form.Control type="number" id={listValue["quantity"]} placeholder= {listValue["quantity"]}/></td>
                                    {this.state.nonDeletedBooks.indexOf(listValue["book_id"]) == -1 ? 
                                        <td>Sorry, this item has been removed by Seller</td>
                                    : 
                                        <td><Button variant="primary" type="submit" onClick={(e)=>{this.updateItem(e, listValue["id"], listValue["book_id"], listValue["available_quantity"])}}>UPDATE ITEM</Button></td>                                   
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

export default Cart;