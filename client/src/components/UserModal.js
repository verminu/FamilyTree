import ReactModal from "react-modal";
import {createContext, useEffect, useState} from "react";
import {useForm, Controller} from 'react-hook-form';
import {
    RadioGroup,
    FormControlLabel,
    Radio,
    FormControl,
    FormLabel,
    TextField,
    FormHelperText
} from '@material-ui/core';
import axios from "axios";
import {useUserFullName, useUsersDispatch} from "../providers/UserProvider";

export function UserModal(props) {
    const {
        control,
        register: registerField,
        handleSubmit,
        formState: {errors},
        setError,
        reset: resetForm,
        setValue: setFieldValue
    } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState(props.user); // this is the user that is being edited
    const dispatch = useUsersDispatch();
    const userFullName = useUserFullName();

    const hasUser = !!props.user;

    useEffect(() => {
        if (props.isOpen) {
            if (!props.user) {
                resetForm();
            } else {
                setUser(props.user);
                setFieldValue('first_name', props.user.first_name);
                setFieldValue('middle_name', props.user.middle_name);
                setFieldValue('last_name', props.user.last_name);
                setFieldValue('gender', props.user.gender.toString());
            }
        } else {
            // Reset the form when the modal is closed
            setUser(null);
            resetForm();
        }
    }, [props.isOpen, props.user, resetForm, hasUser]);

    function handleClose() {
        props.onRequestClose();
        resetForm();
    }

    async function submitForm(data) {
        setIsSubmitting(true);

        try {
            let response;
            if (hasUser) {
                response = await axios.put('/user/' + user.id, data);
            } else {
                response = await axios.post('/user', data);
            }


            if (response.status === 200) {
                handleClose();

                // update the user list by using userDispatchContext
                if (hasUser) {
                    dispatch({
                        type: 'UPDATE_USER',
                        payload: response.data
                    });
                } else {
                    dispatch({
                        type: 'ADD_USER',
                        payload: response.data
                    });
                }
            } else {
                console.error(response);
                alert("There was an error adding the user");
            }
        } catch (err) {
            if (err.response?.status === 422 && err.response?.data?.errors) {

                err.response.data.errors.forEach((error) => {
                    setError(error.path, {
                        type: 'server',
                        message: error.msg
                    });
                })


            } else {
                console.error(err);
                alert("There was an error adding the user");
            }
        } finally {
            setIsSubmitting(false);
        }

    }


    return (
        <ReactModal
            style={{content: {maxWidth: '400px', minHeight: 400, margin: '0 auto', paddingBottom: 70}}}
            {...props}>
            <h3>
                {hasUser ? 'Edit ' + userFullName(props.user) + ' personal data' : 'Add a new user'}
            </h3>
            <button className="close-button" onClick={handleClose}>Close</button>

            <form onSubmit={handleSubmit(submitForm)}>
                <FormControl>
                    <FormLabel>First name</FormLabel>
                    <TextField
                        type="text"
                        {...registerField('first_name', {required: "First name is required"})}
                        defaultValue={user?.first_name}
                        value={user?.first_name} // Pre-fill the input field if editing, otherwise empty
                        onChange={(e) => setUser({...user, first_name: e.target.value})}
                        error={!!errors.first_name}
                        helperText={errors.first_name?.message || ''}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Middle name</FormLabel>
                    <TextField
                        type="text"
                        {...registerField('middle_name', {required: false})}
                        value={user?.middle_name} // Pre-fill the input field if editing, otherwise empty
                        onChange={(e) => setUser({...user, middle_name: e.target.value})}
                        error={!!errors.middle_name}
                        helperText={errors.middle_name?.message || ''}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Last name</FormLabel>
                    <TextField
                        type="text"
                        {...registerField('last_name', {required: "Last name is required"})}
                        value={user?.last_name} // Pre-fill the input field if editing, otherwise empty
                        onChange={(e) => setUser({...user, last_name: e.target.value})}
                        error={!!errors.last_name}
                        helperText={errors.last_name?.message || ''}
                    />
                </FormControl>

                <Controller
                    name="gender"
                    control={control}
                    defaultValue={user?.gender?.toString()}
                    rules={{required: 'Please select a gender'}}
                    render={({field}) => (
                        <FormControl component="fieldset" error={!!errors.gender}>
                            <FormLabel component="legend">Gender</FormLabel>
                            <RadioGroup {...field}>
                                <FormControlLabel value="1" control={<Radio/>} label="Male"/>
                                <FormControlLabel value="2" control={<Radio/>} label="Female"/>
                            </RadioGroup>
                            {errors.gender && <FormHelperText>{errors.gender.message}</FormHelperText>}
                        </FormControl>
                    )}
                />


                <div>
                    <button type="submit" disabled={isSubmitting}>Save</button>
                </div>
            </form>


        </ReactModal>
    )
}

export const UserModalContext = createContext();

export function UserModalProvider({children}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState(null);

    const openModal = (user) => {
        setIsModalOpen(true);
        setUser(user);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <UserModalContext.Provider value={{isModalOpen, openModal, closeModal}}>
            <UserModal isOpen={isModalOpen} onRequestClose={closeModal} user={user}/>
            {children}
        </UserModalContext.Provider>
    )
}