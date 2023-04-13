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
    CRow,
} from '@coreui/react'
import { toast } from 'react-toastify';

export const AddPoliceData = () => {

    const [data, setData] = React.useState({});

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
        toast.success("Police data added successfully!");
    }

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Enter new Police Details</strong>
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
                                <CFormLabel htmlFor="name">Police Name</CFormLabel>
                                <CFormInput
                                    type="text"
                                    id="name"
                                    placeholder="Jane Doe"
                                    name='policeName'
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <CFormLabel htmlFor="phone">Police Phone Number</CFormLabel>
                                <CFormInput
                                    type="number"
                                    id="phone"
                                    placeholder="9988776655"
                                    name='policeNumber'
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