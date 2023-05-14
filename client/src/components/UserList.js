import {useUsers, useUserFullName} from "../providers/UserProvider";
import {useContext} from "react";
import {UserModalContext} from "./UserModal";
import {RelationsModalContext} from "./RelationsModal";
import {useUsersDispatch} from "../providers/UserProvider";
import axios from "axios";
import {FamilyTreeModalContext} from "./FamilyTreeModal";

function UserList() {
    const {users, loading, error} = useUsers();

    return (
        <div className="user-list">
            {loading ?
                <div className="user-list__loading">Loading users...</div> :
                (
                    error ?
                        <div className="user-list__error">There was an error while retrieving the users. Please reload
                            the page.</div> :
                        (
                            users ? <UsersContent users={users}></UsersContent> :
                                <div className="user-list__empty"></div>
                        )
                )
            }
        </div>
    );
}


function UsersContent({users}) {
    const {openModal} = useContext(UserModalContext);

    function handleOpenUserModal() {
        // open modal
        openModal();
    }


    return (
        <div className="user-list__content">
            <div className="user-list__header">
                {users.length === 0 &&
                    <div className="text-content">There are no users yet. Click on the button below to add a new
                        user.</div>
                }
                <div>
                    <button className="button" onClick={handleOpenUserModal}>Add a new user</button>
                </div>
                {users.length > 0 &&
                    <div className="text-content">Click on a user to view their family tree</div>
                }
            </div>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <UserItem data={user}></UserItem>
                    </li>
                ))}
            </ul>
        </div>
    )
}


function UserItem({data}) {
    const {openModal: openRelationsModal} = useContext(RelationsModalContext);
    const {openModal: openUserModal} = useContext(UserModalContext);
    const {openModal: openFamilyTreeModal} = useContext(FamilyTreeModalContext);
    const userName = useUserFullName();
    const dispatch = useUsersDispatch();

    function handleClick() {
        openFamilyTreeModal(data);
    }

    async function handleDelete(e) {
        e.stopPropagation();

        const result = window.confirm("Are you sure you want to delete the user and all their relations?");

        if (!result) {
            return;
        }

        const response = await axios.delete('/user/' + data.id);

        if (response.status === 200) {
            dispatch({type: 'DELETE_USER', payload: {id: data.id}});
        } else {
            console.error(response);
            alert("There was an error deleting the user");
        }
    }

    function handleRelations(e) {
        e.stopPropagation();

        openRelationsModal(data);
    }

    function handleEdit(e) {
        e.stopPropagation();

        openUserModal(data);
    }

    const itemClassName = [
        "user-item",
        (data.gender === 1 ? " user-item--male" : "user-item--female")
    ].join(" ");

    return (
        <div className={itemClassName} onClick={handleClick}>
            <span className="user-item__name">{userName(data)}</span>
            <span className="user-item__actions">
                <button onClick={handleRelations}>Relations</button>
                <button onClick={handleEdit}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
            </span>
        </div>
    );
}

export default UserList;