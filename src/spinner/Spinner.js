import React from 'react';
import './Spinner.css';
import ClipLoader from "react-spinners/ClipLoader";


export const Spinner = () => {
    return (
        <div className="spinner-wrapper show-spinner">
            <div className="spinner">
                <ClipLoader size={150} />
            </div>
        </div>
    );
}
