import React from 'react';
import './App.css';
import { Route, Switch } from "react-router-dom";
import Login from '../src/components/login/login';
import { Navbar, Nav} from 'react-bootstrap';
import "react-bootstrap/dist/react-bootstrap.min.js";
import SignUp from "../src/components/signup/signup";
import Logout from "../src/components/login/logout";
import Profile from "../src/components/profile/profile";
import Buy from "../src/components/buy/buy";
import Sell from "../src/components/sell/sell";
import CreateBook from "../src/components/sell/createBook";
import UpdateBook from "../src/components/sell/updateBook";
import Cart from "../src/components/buy/cart";
require('dotenv').config({path:'~/.env'})
function App() {
  return (
    <div className="container-fluid">
      
      <Navbar  sticky="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="/">Cloud Assignment 1</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/">Home</Nav.Link>            
            {(sessionStorage.getItem('userName') === '' || sessionStorage.getItem('userName') === undefined || sessionStorage.getItem('userName') == null) ? 
            <Nav.Link href="/signUp">SignUp</Nav.Link>
            :
            <Nav.Link href="/logout">Logout</Nav.Link>
            }
            <Nav.Link href="/profile">Profile</Nav.Link>
            <Nav.Link href="/buy">Buy</Nav.Link>
            <Nav.Link href="/sell">Sell</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Switch>
        <Route path="/signUp" component={SignUp} />
        <Route path="/logout" component={Logout} />
        <Route path="/profile" component={Profile} />
        <Route path="/buy" component={Buy} />
        <Route path="/sell" component={Sell} />
        <Route path="/createBook"component={CreateBook} />
        <Route path="/updateBook"component={UpdateBook} />
        <Route path="/viewBook"component={UpdateBook} />
        <Route path="/viewCart"component={Cart} />
        <Route path="/" exact component={Login} />
      </Switch>
    </div>
  );
}

export default App;
