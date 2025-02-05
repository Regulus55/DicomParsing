// src/components/DisplayData.js

const DisplayData = ({ image }) => {
    return (
        <div>
            <p>Parse Error: {image.parseError}</p>
            <p>SopInstanceUid: {image.sopInstanceUid}</p>
            <p>Patient ID: {image.patientId}</p>
            <p>Patient Name: {image.patientName}</p>
            <p>Patient Sex: {image.patientSex}</p>
            <p>Patient Birth Date: {image.patientBirthDate}</p>
            <p>Patient Age: {image.patientAge}</p>
            <p>Patient Weight: {image.patientWeight}</p>
        </div>
    );
}

export default DisplayData;  // Default export
