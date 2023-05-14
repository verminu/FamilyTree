import '../styles/App.css';
import UserList from './UserList';
import {UsersProvider} from '../providers/UserProvider';
import {UserModalProvider} from "./UserModal";
import ReactModal from 'react-modal';
import {RelationsModalProvider} from "./RelationsModal";
import {FamilyTreeModalProvider} from "./FamilyTreeModal";

ReactModal.setAppElement('#root');

function App() {
    return (
        <UsersProvider>
            <UserModalProvider>
                <RelationsModalProvider>
                    <FamilyTreeModalProvider>
                        <div className="App">
                            <header className="App-header">
                                Family tree
                            </header>

                            <main>
                                <UserList></UserList>
                            </main>
                        </div>
                    </FamilyTreeModalProvider>
                </RelationsModalProvider>
            </UserModalProvider>
        </UsersProvider>
    );
}

export default App;
