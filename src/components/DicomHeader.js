import React, { useCallback, useState } from 'react';
import dicomParser from 'dicom-parser';
import { useDropzone } from 'react-dropzone';
import DisplayData from './DisplayData';

function DicomHeader() {
    const [parseError, setParseError] = useState("");
    const [sopInstanceUid, setSopInstanceUid] = useState("");
    const [patientId, setPatientId] = useState("");
    const [otherPatientIds, setOtherPatientIds] = useState("");

    const onDrop = useCallback(acceptedFiles => {
        clearPage();
        loadFile(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    function clearPage() {
        setParseError('');
        setSopInstanceUid('');
        setPatientId('');
        setOtherPatientIds('');
    }

    function parseByteArray(byteArray) {
        try {
            const dataSet = dicomParser.parseDicom(byteArray);

            const sopInstanceUid = dataSet.string('x0020000d');
            setSopInstanceUid(sopInstanceUid);

            const patientId = dataSet.string('x00100020');
            if (patientId !== undefined) {
                setPatientId(patientId);
            } else {
                alert("element has no data");
            }

            const otherPatientIds = dataSet.string('x00101002');
            if (otherPatientIds !== undefined) {
                setOtherPatientIds(otherPatientIds);
            } else {
                setOtherPatientIds("element not present");
            }
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

    return (
        <div >
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
                    <DisplayData image={{ parseError, sopInstanceUid, patientId, otherPatientIds }} />
                </div>
            </div>
        </div>
    );
}

export default DicomHeader;
