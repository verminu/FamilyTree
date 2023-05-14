import ReactModal from "react-modal";
import {createContext, useState} from "react";
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
import {useUsersDispatch, useUserFullName} from "../providers/UserProvider";
import {useEffect} from "react";
import Select from 'react-select';


export function RelationsModal(props) {
    const {
        control,
        register: registerField,
        handleSubmit,
        formState: {errors},
        reset: resetForm
    } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useUsersDispatch();
    const [motherSuggestions, setMotherSuggestions] = useState([]);
    const [fatherSuggestions, setFatherSuggestions] = useState([]);
    const [mother, setMother] = useState(null);
    const [father, setFather] = useState(null);
    const [selectedMother, setSelectedMother] = useState(null);
    const [selectedFather, setSelectedFather] = useState(null);
    const [fatherDisplayName, setFatherDisplayName] = useState('');
    const [motherDisplayName, setMotherDisplayName] = useState('');
    const [children, setChildren] = useState([]);
    const userFullName = useUserFullName();
    const [submitError, setSubmitError] = useState(null);

    const fetchParents = async () => {
        // Reset state variables before making the API call
        setMother(null);
        setSelectedMother(null);
        setMotherSuggestions([]);
        setFather(null);
        setSelectedFather(null);
        setFatherSuggestions([]);
        setMotherDisplayName(null);
        setFatherDisplayName(null);
        setChildren([]);

        const relations = await axios.get('/relation/' + props.user.id);

        if (relations.data.mother) {
            setMother(relations.data.mother);
        } else {
            setMotherSuggestions(parseUserForSelect(relations.data.motherSuggestions));
        }

        if (relations.data.father) {
            setFather(relations.data.father);
        } else {
            setFatherSuggestions(parseUserForSelect(relations.data.fatherSuggestions));
        }

        setChildren(relations.data.children);
    }

    useEffect(() => {
        if (props.isOpen) {
            fetchParents();
        }

    }, [props.user.id, props.isOpen]);

    const user = props.user;

    function handleClose() {
        props.onRequestClose();
        resetForm();
    }

    function parseUserForSelect(users) {
        return users.map((user) => {
            return {
                value: user.id,
                label: userFullName(user)
            }
        });
    }

    async function submitForm() {
        setIsSubmitting(true);

        const data = {
            user_id: user.id,
            mother_id: selectedMother?.value,
            father_id: selectedFather?.value
        }

        const response = await axios.post('/relation', data);
        setIsSubmitting(false);

        if (response.status === 200) {
            if (selectedMother) {
                setMotherDisplayName(selectedMother.label);
                setMother(true);
                setSelectedMother(null);
            }

            if (selectedFather) {
                setFatherDisplayName(selectedFather.label);
                setFather(true);
                setSelectedFather(null);
            }
        } else {
            console.error(response);
            alert("There was an error adding the relation");
        }
    }


    async function reloadMotherSuggestions(selectedOption) {
        const response = await axios.get('/relation/' + user.id + (selectedOption ? '/' + selectedOption?.value : ''));

        if (response.status === 200) {
            const suggestions = parseUserForSelect(response.data.motherSuggestions);
            setMotherSuggestions(suggestions);

            // check if the current selection is still valid
            if (selectedMother && !suggestions.find((suggestion) => suggestion.value === selectedMother.value)) {
                setSelectedMother(null);
            }
        }
    }

    async function reloadFatherSuggestions(selectedOption) {
        const response = await axios.get('/relation/' + user.id + (selectedOption ? '/' + selectedOption?.value : ''));

        if (response.status === 200) {
            const suggestions = parseUserForSelect(response.data.fatherSuggestions);
            setFatherSuggestions(suggestions);

            // check if the current selection is still valid
            if (selectedFather && !suggestions.find((suggestion) => suggestion.value === selectedFather.value)) {
                setSelectedFather(null);
            }
        }
    }

    function handleMotherChange(selectedOption) {
        setSelectedMother(selectedOption);

        // if the user doesn't have a father yet, reload the father suggestions
        if (!father) {
            reloadFatherSuggestions(selectedOption);
        }

    }

    function handleFatherChange(selectedOption) {
        setSelectedFather(selectedOption);

        // if the user doesn't have a mother yet, reload the mother suggestions
        if (!mother) {
            reloadMotherSuggestions(selectedOption);
        }
    }

    async function handleDeleteRelations() {
        const result = window.confirm("Are you sure you want to delete all user's relations with parents and children?");

        if (!result) {
            return;
        }

        setIsSubmitting(true);
        const response = await axios.delete('/relation/' + user.id);
        setIsSubmitting(false);

        if (response.status === 200) {
            fetchParents();

        } else {
            console.error(response);
            alert("There was an error deleting the relation");
        }
    }

    function noSelectedParents() {
        return (father || fatherDisplayName || !selectedFather) &&
            (mother || motherDisplayName || !selectedMother);
    }

    function hasRelations() {
        return father || mother || children.length > 0;
    }

    return (
        <ReactModal
            style={{content: {maxWidth: '400px', minHeight: 400, margin: '0 auto', paddingBottom: 70}}}
            {...props}>
            <h3>Define relations for {userFullName(user)}</h3>
            <button className="close-button" onClick={handleClose}>Close</button>

            <h4>
                {user.gender === 1 ? 'Son of:' : 'Daughter of:'}
            </h4>

            <form onSubmit={handleSubmit(submitForm)}>
                <Controller
                    name="mother_id"
                    control={control}
                    defaultValue={null}
                    rules={{}}
                    render={({field}) => (
                        <FormControl>
                            <FormLabel>Mother</FormLabel>
                            {mother || motherDisplayName ? (
                                <div className="parent-name">
                                    {motherDisplayName ? motherDisplayName : userFullName(mother)}
                                </div>
                            ) : (
                                <Select
                                    {...field}
                                    options={motherSuggestions}
                                    value={selectedMother}
                                    isClearable
                                    classNamePrefix="react-select"
                                    placeholder="Select the mother"
                                    onChange={handleMotherChange}
                                    isSearchable
                                />
                            )}
                        </FormControl>
                    )}
                />

                <Controller
                    name="mother_id"
                    control={control}
                    defaultValue={null}
                    rules={{}}
                    render={({field}) => (
                        <FormControl>
                            <FormLabel>Father</FormLabel>
                            {father || fatherDisplayName ? (
                                <div className="parent-name">
                                    {fatherDisplayName ? fatherDisplayName : userFullName(father)}
                                </div>
                            ) : (
                                <Select
                                    {...field}
                                    options={fatherSuggestions}
                                    value={selectedFather}
                                    isClearable
                                    classNamePrefix="react-select"
                                    placeholder="Select the father"
                                    onChange={handleFatherChange}
                                    isSearchable
                                />
                            )}
                        </FormControl>
                    )}
                />

                <div>
                    {children.length > 0 && (
                        <>
                            <h4>{user.gender === 1 ? 'Father of:' : 'Mother of:'}</h4>

                            <ul className="children-list">
                                {children.map((child) => {
                                        return <li className="children-list__item" key={child.id}>{userFullName(child)}</li>
                                    }
                                )}
                            </ul>
                        </>
                    )}
                </div>

                {submitError && <FormHelperText error>{submitError}</FormHelperText>}

                <div>
                    {(!mother || !father) &&
                        <button type="submit" disabled={isSubmitting || noSelectedParents()}>Save parents</button>}

                    <button type="button" disabled={isSubmitting || !hasRelations()}
                            onClick={handleDeleteRelations}>Delete relations
                    </button>
                </div>
            </form>


        </ReactModal>
    )
}

export const RelationsModalContext = createContext();

export function RelationsModalProvider({children}) {
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
        <RelationsModalContext.Provider value={{isModalOpen, openModal, closeModal}}>
            {user && <RelationsModal isOpen={isModalOpen} onRequestClose={closeModal} user={user}/>}
            {children}
        </RelationsModalContext.Provider>
    )
}