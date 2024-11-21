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

export default function Header({ onAuthChange }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState(''); // Store the user's role (shelterOwner, etc.)
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile`, { withCredentials: true });
                setIsLoggedIn(true);
                setUserName(response.data.user.name);
                setUserRole(response.data.user.role);
                onAuthChange(true, response.data.user.role);
            } catch (error) {
                setIsLoggedIn(false);
                setUserName('');
                setUserRole('');
                onAuthChange(false, '');
            }
        };

        checkLoginStatus();
    }, [onAuthChange]);

    const handleLogout = async () => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/logout`, {}, { withCredentials: true });
            setIsLoggedIn(false);
            setUserName('');
            setUserRole('');
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
                        <a className="nav-link" onClick={() => setShowDropdown(!showDropdown)}>
                            {userName}
                            <ArrowDropDownIcon className="icon" />
                        </a>
                        {showDropdown && (
                            <div className="dropdown">
                                <button onClick={() => router.push('/updateProfile')}>Update Profile</button>
                                {userRole === 'shelterOwner' && (
                                    <button onClick={() => router.push('/managePets')}>Manage Pets</button>
                                )}
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
