import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HealingIcon from '@mui/icons-material/Healing';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('http://localhost:8529/api/users/profile', { withCredentials: true });
                setIsLoggedIn(true);
                setUserName(response.data.name);
            } catch (error) {
                setIsLoggedIn(false);
                setUserName('');
            }
        };
        
        checkLoginStatus();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8529/api/users/logout', {}, { withCredentials: true });
            setIsLoggedIn(false);
            setUserName('');
            router.push('/'); // Redirect to the homepage after logout
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

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

                {isLoggedIn ? (
                    <div className="nav-link user-menu">
                        <Typography component="h1" variant="h5">
                            {userName}
                        </Typography>
                        <ArrowDropDownIcon className="icon" onClick={() => setShowDropdown(!showDropdown)} />
                        
                        {showDropdown && (
                            <div className="dropdown">
                                <button onClick={() => router.push('/update-profile')}>Update Profile</button>
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <a href="/login" className="nav-link">
                        <AccountCircleIcon className="icon" />
                        Login/Register
                    </a>
                )}
            </nav>
        </header>
    );
}
