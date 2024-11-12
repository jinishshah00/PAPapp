// components/Header.js
import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HealingIcon from '@mui/icons-material/Healing';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Header() {
    return (
        <header className="header">
            <nav className="navbar">
                <a href="/" className="nav-link">
                    <HomeIcon className="icon" />
                    Home
                </a>
                <a href="/adopt" className="nav-link">
                    <FavoriteIcon className="icon" />
                    Adopt Now
                </a>
                <a href="/vitals" className="nav-link">
                    <HealingIcon className="icon" />
                    Vitals
                </a>
                <a href="/contact" className="nav-link">
                    <ContactPhoneIcon className="icon" />
                    Contact Us
                </a>
                <a href="/login" className="nav-link">
                    <AccountCircleIcon className="icon" />
                    Login/Register
                </a>
            </nav>
        </header>
    );
}
