import React from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormInput,
    CFormLabel,
    CRow
} from '@coreui/react'
import DateTimePicker from 'react-datetime-picker';
import { toast } from 'react-toastify';

export const AddShiftData = () => {

    const [data, setData] = React.useState({ "startTime": new Date(), "endTime": new Date() });

    const handleInputChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log(data);
        // axios.post('http://localhost:5000/police/add', data);
        toast.success("Shift added successfully");
    }

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Enter new Police Shift Details</strong>
                    </CCardHeader>
                    <CCardBody>
                        <CForm onSubmit={handleFormSubmit}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="number">Police ID</CFormLabel>
                                <CFormInput
                                    type="number"
                                    id="number"
                                    placeholder="Eg. 1111"
                                    name='_id'
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <CFormLabel htmlFor="latitude">Latitude</CFormLabel>
                                <CFormInput
                                    type="text"
                                    id="latitude"
                                    placeholder="Eg. 19.27923873"
                                    name='latitude'
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <CFormLabel htmlFor="longitude">Longitude</CFormLabel>
                                <CFormInput
                                    type="text"
                                    id="longitude"
                                    placeholder="Eg. 72.874637"
                                    name='longitude'
                                    onChange={handleInputChange}
                                />
                            </div>
                            {/* <div className="mb-3">
                                <DateTimePicker value={data.startTime} />
                            </div> */}
                            <div className="mb-3">
                                <CFormLabel htmlFor="start-time">Start Time</CFormLabel>
                                <CFormInput
                                    type="text"
                                    id="start-time"
                                    placeholder="02:17 AM"
                                    name='startTime'
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <CFormLabel htmlFor="end-time">End Time</CFormLabel>
                                <CFormInput
                                    type="text"
                                    id="end-time"
                                    placeholder="02:17 PM"
                                    name='endTime'
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <CFormLabel htmlFor="radius">Distance Radius (in meters)</CFormLabel>
                                <CFormInput
                                    type="number"
                                    id="radius"
                                    placeholder="500"
                                    name='radius'
                                    onChange={handleInputChange}
                                />
                            </div>
                            <CButton type="submit">Submit</CButton>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}