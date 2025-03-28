import React from 'react'
import DepedLogo from "../assets/Images/depedlogo.png"
import '../style/Header.css'

const header = () => {
    return (
        <div className='container-fluid p-0 rounded-top' style={{
            backgroundColor: '#bacbe6',
            boxShadow: '4px -4px 10px -2px rgba(0,0,0,0.1), -4px 4px 10px -2px rgba(0,0,0,0.1), 0 -4px 10px -2px rgba(0,0,0,0.1)'
        }}>
            <div className="header">
                <div className='row'>
                    <div className='col-lg-3 col-sm-12 text-center'>
                        <img
                            src={DepedLogo}
                            alt="depedCabuyaoHeader"
                            style={{ width: "200px" }}
                            className="img"
                        />
                    </div>
                    <div className='col-lg-9 col-sm-12'>
                        <p className="sdo mt-3">
                            <b>SDO Cabuyao</b> Client Satisfaction Measurement (CSM) 2025
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default header;