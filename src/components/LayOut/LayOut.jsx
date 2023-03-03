import React from 'react'
import { Outlet } from 'react-router-dom';
import MainNavbar from '../MainNavbar/MainNavbar';


const LayOut = () => {
    return (
        <>
            <MainNavbar />
            <div style={{ minHeight: '90vh' }}>
                <Outlet></Outlet>
            </div>
        </>
    )
}

export default LayOut