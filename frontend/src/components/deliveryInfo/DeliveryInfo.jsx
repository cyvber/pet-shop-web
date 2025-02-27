import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { TextField, Autocomplete, Box } from '@mui/material';
import axios from 'axios';
import './DeliveryInfo.css';

const DeliveryInfo = forwardRef((_, ref) => {
    const [formData, setFormData] = useState({
        customer_name: '',
        phone_number: '',
        email: '',
        city: '',
        address: '',
        zip_code: '',
        delivery_instructions: '',
    });

    const [errors, setErrors] = useState({});
    const [cities, setCities] = useState([]); // Store the list of Israeli cities

    // Fetch cities from the URL
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get(
                    'https://data.gov.il/api/action/datastore_search?resource_id=b7cf8f14-64a2-4b33-8d4b-edb286fdbd37&limit=1500'
                );
                const cityNames = response.data.result.records.map((item) => item["שם_ישוב"]);
                setCities(cityNames);
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        };

        fetchCities();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear error messages while typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleCityChange = (_, value) => {
        setFormData({ ...formData, city: value || '' });
    };

    const validateFields = () => {
        const newErrors = {};

        // Required fields
        if (!formData.customer_name.trim()) newErrors.customer_name = 'נא להזין שם מלא';
        if (!formData.city.trim()) newErrors.city = 'נא להזין עיר';
        if (!formData.address.trim()) newErrors.address = 'נא להזין כתובת';

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'נא להזין כתובת דוא״ל';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'נא להזין דוא״ל חוקי';
        }

        // Phone number validation
        const phoneRegex = /^[0-9]+$/;
        if (!formData.phone_number.trim()) {
            newErrors.phone_number = 'נא להזין מספר טלפון';
        } else if (!phoneRegex.test(formData.phone_number)) {
            newErrors.phone_number = 'מספר טלפון צריך להכיל רק ספרות';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    useImperativeHandle(ref, () => ({
        validate: validateFields,
        getFormData: () => formData
    }));
    

    const textFieldStyles = {
        '& .MuiInputLabel-root': {
            textAlign: 'right',
            right: 0,
            transformOrigin: 'top right',
        },
        '& .MuiInputBase-input': {
            textAlign: 'right',
        },
    };

    return (
        <Box
            className="checkout-customer-details"
            component="form"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '80%',
                margin: '0 auto',
                mb: 10,
            }}
        >
            <TextField
                name="customer_name"
                label="שם מלא"
                variant="standard"
                value={formData.customer_name}
                onChange={handleInputChange}
                fullWidth
                sx={textFieldStyles}
                error={!!errors.customer_name}
                helperText={errors.customer_name}
            />
            <TextField
                name="phone_number"
                label="טלפון"
                variant="standard"
                value={formData.phone_number}
                onChange={handleInputChange}
                fullWidth
                sx={textFieldStyles}
                error={!!errors.phone_number}
                helperText={errors.phone_number}
            />
            <TextField
                name="email"
                label="דוא״ל"
                variant="standard"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                sx={textFieldStyles}
                error={!!errors.email}
                helperText={errors.email}
            />
            <Autocomplete
                options={cities}
                value={formData.city}
                onChange={handleCityChange}
                disableClearable // Removes the "X" button
                disableOpenOnFocus // Prevents the dropdown arrow from being visible
                renderInput={(params) => (
                    <TextField
                        {...params}
                        name="city"
                        label="עיר"
                        variant="standard"
                        fullWidth
                        sx={textFieldStyles}
                        error={!!errors.city}
                        helperText={errors.city}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: null, // Removes the dropdown arrow
                            style: { paddingRight: 0 }, // Removes reserved space for the dropdown arrow
                        }}
                    />
                )}
            />


            <TextField
                name="address"
                label="כתובת"
                variant="standard"
                value={formData.address}
                onChange={handleInputChange}
                fullWidth
                sx={textFieldStyles}
                error={!!errors.address}
                helperText={errors.address}
            />
            <TextField
                name="zip_code"
                label="מיקוד"
                variant="standard"
                value={formData.zip_code}
                onChange={handleInputChange}
                fullWidth
                sx={textFieldStyles}
            />
            <TextField
                name="delivery_instructions"
                label="הוראות"
                variant="standard"
                value={formData.delivery_instructions}
                onChange={handleInputChange}
                multiline
                rows={4}
                fullWidth
                sx={textFieldStyles}
            />
        </Box>
    );
});

export default DeliveryInfo;
