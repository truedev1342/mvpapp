import React from "react";
import "./header.css";

function Navbar() {
    return(
        <nav className="navbar">
            <ul className="navbar-list">
                <li className="navbar-item"><a href="/" className="navbar-link">Home</a></li>
                <li className="navbar-item"><a href="/contacts" className="navbar-link">Contacts</a></li>
                <li className="navbar-item"><a href="/orders" className="navbar-link">Orders</a></li>
            </ul>
        </nav>
    );
}

export default Navbar;