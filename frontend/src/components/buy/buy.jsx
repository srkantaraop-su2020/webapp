import React,{ Component } from "react";
import  * as ax  from '../../APIs/api';
import Button from 'react-bootstrap/Button';
// import "./login.css"

class Buy extends Component{
    constructor(props) {
        super(props);
        this.state={
            books: []
         };
    }  

    componentDidMount() {
        if(sessionStorage.getItem("userName") === '' || sessionStorage.getItem("userName") === undefined || sessionStorage.getItem("userName") == null) {
            alert('You do not have permission to buy books, Please login!')
            window.location.href = '/'
        }
        else {
            ax.getBooks().then((response) => {
                if(response.status && (response.status === 500 || response.status === 400) ) {
                    alert(response.data.message)
                }
                else {
                    let listOfBooks = []
                    response.forEach(book => {
                        if(book.seller_id != sessionStorage.getItem("userId") && book.quantity > 0) {
                            listOfBooks.push(book)
                        }
                    });
                    this.setState({
                        books: listOfBooks
                    })
                }
            })
        }
    }

    addToCart(event, bookId, title, availableQty, price) {
        event.preventDefault();
        let item = {
            bookId: bookId,
            quantity: 1,
            availableQuantity: availableQty,
            price: price,
            buyerId: sessionStorage.getItem("userId"),
            title: title
        }
        ax.addItemToCart(item).then((response) => {
            if(response.status && (response.status === 500 || response.status === 400) ) {
                alert(response.data.message)
            }
            else {
                alert("Added book to the cart!")
                window.location.reload();
            }
        })
    }

    viewCart() {
        window.location.href= "/viewCart"
    }

    render(){
        return(
            <div>
                You can buy books here
                <div>
                <Button variant="info" type="submit" onClick={(e)=>{this.viewCart()}}>VIEW MY CART</Button>
                </div>
                <table id="table-style">
                    <thead>
                        <tr>
                            <th>Book Id</th>
                            <th>Book Name</th>
                            <th>ISBN</th>
                            <th>Price</th>
                            <th>Available Quantity</th>
                            <th>Shop</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.books.map(( listValue, index ) => {
                            return (
                                <tr key={index}>
                                    <td>{listValue["id"]}</td>
                                    <td><a href={"/viewBook?"+ listValue["id"]}>{listValue["title"]}</a></td>
                                    <td>{listValue["isbn"]}</td>
                                    <td>${listValue["price"]}</td>
                                    <td>{listValue["quantity"]}</td>
                                    <td><Button variant="primary" type="submit" onClick={(e)=>{this.addToCart(e, listValue["id"], listValue["title"], listValue["quantity"], listValue["price"])}}>ADD TO CART</Button></td>                                   
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

export default Buy;