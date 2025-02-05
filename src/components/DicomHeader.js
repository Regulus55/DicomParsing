// 'src/components/DicomHeader.js'

// Import React package...in order to use JSX
import React, { useCallback, useState } from 'react';
// Package that will be used to parse the DICOM images
import dicomParser from 'dicom-parser';
// Package that will be used to support the document uplaod feature
import {useDropzone} from 'react-dropzone';
import DisplayData from './DisplayData';



function DicomHeader() {

    // State varaibles that will be used to set and store the data
    // that we are parsing from the images 
    const [parseError, setParseError] = useState("");
    const [sopInstanceUid, setSopInstanceUid] = useState("");
    const [patientId, setPatientId] = useState("");
    const [otherPatientIds, setOtherPatientIds] = useState("");

    // Styling to make the text white
    const textStyle = {
        color: 'white'
    }

    // Called when an application is uploaded
    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
        clearPage();
        loadFile(acceptedFiles);
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    // Clears the data in the variables used to store the image data
    function clearPage() {
        setParseError('');
        setSopInstanceUid('');
        setPatientId('');
        setOtherPatientIds('');
    }

    // Function used to parse the data 
    function parseByteArray(byteArray)
    {
        // We need to setup a try/catch block because parseDicom will throw an exception
        // if you attempt to parse a non dicom part 10 file (or one that is corrupted)
        try{
            // parse byteArray into a DataSet object using the parseDicom library
            var dataSet = dicomParser.parseDicom(byteArray);
            // dataSet contains the parsed elements.  Each element is available via a property
            // in the dataSet.elements object.  The property name is based on the elements group
            // and element in the following format: xggggeeee where gggg is the group number
            // and eeee is the element number with lowercase hex characters.

            // To access the data for an element, we need to know its type and its tag.
            // We will get the sopInstanceUid from the file which is a string and
            // has the tag (0020,000D)
            var sopInstanceUid = dataSet.string('x0020000d');
            // Set data to state variable
            setSopInstanceUid(sopInstanceUid);
            // // Now that we have the sopInstanceUid, lets add it to the DOM
            // $('#sopInstanceUid').text(sopInstanceUid);

            // // Next we will get the Patient Id (0010,0020).  This is a type 2 attribute which means
            // // that the element must be present but it can be empty.  If you attempt to get the string
            // // for an element that has data of zero length (empty) , parseDicom will return
            // // undefined so we need to check for that to avoid a script error
            var patientId = dataSet.string('x00100020');
            if(patientId !== undefined)
            {
                // Set data to state variable
                setPatientId(patientId);
            }
            else
            {
                alert("element has no data");
            }

            // // Next we will try to get the Other Patient IDs Sequence (0010,1002).  This is a type 3 attribute
            // // which means it may or may not be present.  If you attempt to get the string
            // // for an element that is not present, parseDicom will return
            // // undefined so we need to check for that to avoid a script error

            var otherPatientIds = dataSet.string('x00101002');
            if(otherPatientIds !== undefined)
            {
                // Set data to state variable
                setOtherPatientIds(otherPatientIds);
            }
            else
            {
                // Set data to state variable
                setOtherPatientIds("element not present");
            }
        }
        catch(err)
        {
            // we catch the error and display it to the user
            // Set data to state variable
            setParseError(err);
        }
    }

    
    // load the file dropped on the element and then call parseByteArray with a
    // Uint8Array containing the files contents
    function loadFile(acceptedFiles)
    {
        var file = acceptedFiles[0];
        var reader = new FileReader();
        reader.onload = function(file) {
            var arrayBuffer = reader.result;
            // Here we have the file data as an ArrayBuffer.  dicomParser requires as input a
            // Uint8Array so we create that here
            var byteArray = new Uint8Array(arrayBuffer);
            parseByteArray(byteArray);
        }
        
        reader.readAsArrayBuffer(file);    

    }

    // Displaying the drop upload feature and the DisplayData component. Passing the image data as a object.
    return (
        <div style={textStyle}>
            <div class="column">
                <div class="col-md-12">
                    <div id="dropZone" >
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            {
                                isDragActive ?
                                <p>Drop the files here ...</p> :
                                <p>Drag and drop some files here, or click to select files</p>
                            }
                        </div>
                    </div>
                    <DisplayData image={{parseError,sopInstanceUid,patientId,otherPatientIds}}/>
                </div>
            </div>
        </div>
    )
}


// Export functional components
export default DicomHeader