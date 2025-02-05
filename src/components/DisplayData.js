import React from 'react'

const DisplayData = ({ image }) => {
    
    return (
        <div >
            <p>Parse Error: {image.parseError}</p>
            <p>SopInstanceUid: {image.sopInstanceUid}</p>
            <p>Patient ID: {image.patientId}</p>
            <p>Other Patient ID'S: {image.otherPatientIds}</p>
        </div>
    )
}

export default DisplayData
