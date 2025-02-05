import React, { useCallback, useState, useEffect } from 'react';
import dicomParser from 'dicom-parser';
import { useDropzone } from 'react-dropzone';

function DicomHeader() {
    const [parseError, setParseError] = useState("");
    const [sopInstanceUid, setSopInstanceUid] = useState("");
    const [patientId, setPatientId] = useState("");
    const [patientName, setPatientName] = useState("");
    const [patientSex, setPatientSex] = useState("");
    const [patientBirthDate, setPatientBirthDate] = useState("");
    const [patientAge, setPatientAge] = useState("");
    const [patientWeight, setPatientWeight] = useState("");

    const onDrop = useCallback(acceptedFiles => {
        clearPage();
        loadFile(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    function clearPage() {
        setParseError('');
        setSopInstanceUid('');
        setPatientId('');
        setPatientName('');
        setPatientSex('');
        setPatientBirthDate('');
        setPatientAge('');
        setPatientWeight('');
    }

    function parseByteArray(byteArray) {
        try {
            const dataSet = dicomParser.parseDicom(byteArray);

            // 정보 파싱
            const sopInstanceUid = dataSet.string('x0020000d');
            setSopInstanceUid(sopInstanceUid);

            const patientId = dataSet.string('x00100020');
            if (patientId !== undefined) {
                setPatientId(patientId);
            } else {
                alert("Patient ID element has no data");
            }

            const patientName = dataSet.string('x00100010');
            if (patientName !== undefined) {
                setPatientName(patientName);
            } else {
                alert("Patient Name element has no data");
            }

            const patientSex = dataSet.string('x00100040');
            setPatientSex(patientSex || "N/A");

            const patientBirthDate = dataSet.string('x00100030');
            setPatientBirthDate(patientBirthDate || "N/A");

            const patientAge = dataSet.string('x00101010');
            setPatientAge(patientAge || "N/A");

            const patientWeight = dataSet.string('x00101030');
            setPatientWeight(patientWeight || "N/A");

        } catch (err) {
            setParseError(err.message);
        }
    }

    function loadFile(acceptedFiles) {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = function () {
            const arrayBuffer = reader.result;
            const byteArray = new Uint8Array(arrayBuffer);
            parseByteArray(byteArray);
        };
        reader.readAsArrayBuffer(file);
    }

    useEffect(() => {
        const patientData = {
            parseError,
            sopInstanceUid,
            patientId,
            patientName,
            patientSex,
            patientBirthDate,
            patientAge,
            patientWeight
        };

        console.log("Patient Data:", patientData);
    }, [parseError, sopInstanceUid, patientId, patientName, patientSex, patientBirthDate, patientAge, patientWeight])

    return (
        <div>
            <div className="column">
                <div className="col-md-12">
                    <div id="dropZone">
                        <div {...getRootProps()}>
                            <input key="dropzone-input" {...getInputProps()} />
                            {isDragActive ? (
                                <p>Drop the files here ...</p>
                            ) : (
                                <p>Drag and drop some files here, or click to select files</p>
                            )}
                        </div>
                    </div>

                    {/* 결과를 화면에 */}
                    <div>
                        <p>Parse Error: {parseError}</p>
                        <p>SopInstanceUid: {sopInstanceUid}</p>
                        <p>Patient ID: {patientId}</p>
                        <p>Patient Name: {patientName}</p>
                        <p>Patient Sex: {patientSex}</p>
                        <p>Patient Birth Date: {patientBirthDate}</p>
                        <p>Patient Age: {patientAge}</p>
                        <p>Patient Weight: {patientWeight}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DicomHeader;
