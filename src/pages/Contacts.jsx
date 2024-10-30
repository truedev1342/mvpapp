import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import {db} from '../firebase-config';
import { DataGrid } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function Contacts() {
  const [newName, setNewName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState(0);
  const [country, setCountry] = useState("");

  const [contacts, setContacts] = useState([]);
  const contactsCollectionRef = collection(db, 'contacts');

  const getContacts = async () => {
    const data = await getDocs(contactsCollectionRef);
    setContacts(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
  };

  const createContact = async () => {
    await addDoc(contactsCollectionRef, {name: newName, firstName: firstName, middleName: middleName, email: email, street: street, city: city, zipcode: zipcode, country: country});
    getContacts();
  };

  const deleteContact = async (id) => {
    const contactDoc = doc(db, "contacts", id);
    await deleteDoc(contactDoc);
  };

  useEffect(() => {
    getContacts();
  }, [contacts]);

  const columns = [
    { field: 'name', headerName: 'Name', flex: 0.5 },
    { field: 'firstName', headerName: 'First Name', flex: 0.5 },
    { field: 'middleName', headerName: 'Middle Name', flex: 0.5 },
    { field: 'email', headerName: 'Email', flex: 0.5 },
    { field: 'street', headerName: 'Street', flex: 0.5 },
    { field: 'city', headerName: 'City', flex: 0.5 },
    { field: 'zipcode', headerName: 'Zipcode', flex: 0.5 },
    { field: 'country', headerName: 'Country', flex: 0.5 },
    {
        field: 'action',
        headerName: 'Action',
        flex: 0.5,
        renderCell: (params) => (
            <Button variant="contained" color="error" size="small" onClick={() => deleteContact(params.row.id)}>Delete</Button>
        ),
    },
];

  return (
    <div>
      <TextField label="Name" variant="outlined" value={newName} onChange={(e) => setNewName(e.target.value)} sx={{margin: 2}} />
      <TextField label="First Name" variant="outlined" value={firstName} onChange={(e) => setFirstName(e.target.value)} sx={{margin: 2}} />
      <TextField label="Middle Name" variant="outlined" value={middleName} onChange={(e) => setMiddleName(e.target.value)} sx={{margin: 2}} />
      <TextField type="email" label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} sx={{margin: 2}} />
      <TextField label="Street" variant="outlined" value={street} onChange={(e) => setStreet(e.target.value)} sx={{margin: 2}} />
      <TextField label="City" variant="outlined" value={city} onChange={(e) => setCity(e.target.value)} sx={{margin: 2}} />
      <TextField type="number" label="Zipcode" variant="outlined" value={zipcode} onChange={(e) => setZipcode(e.target.value)} sx={{margin: 2}} />
      <TextField label="Country" variant="outlined" value={country} onChange={(e) => setCountry(e.target.value)} sx={{margin: 2}} />

      <Button variant="contained" onClick={createContact} sx={{marginTop: 3}}>Create Contact</Button>
      <DataGrid
        rows={contacts}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        sx={{marginX: 2}}
    />
    </div>
  );
}

export default Contacts;
