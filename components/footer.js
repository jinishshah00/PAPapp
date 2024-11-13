import React from 'react';
import { Button } from '@mui/material';
import { Phone } from '@mui/icons-material';

export default function Footer() {
    return (
        <div className='footer-con'>
            <h4>Copyright © 2024. All Rights Reserved.</h4>
            <Button
                startIcon={<Phone />}
                size='large'
                sx={{
                    color: 'var(--primary-color)',
                }}
            >
                Contact Us
            </Button>
        </div>
    );
}