import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import {db} from '../firebase-config';
import { DataGrid } from '@mui/x-data-grid';
import { Switch, FormControlLabel, TextField, Button, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Orders() {
  const [contactId, setContactId] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(true);

  const [orders, setOrders] = useState([]);
  const [contacts, setContacts] = useState([]);
  const ordersCollectionRef = collection(db, 'orders');
  const contactsCollectionRef = collection(db, 'contacts');

  const navigate = useNavigate();

  const getOrders = async () => {
    const data = await getDocs(ordersCollectionRef);
    setOrders(data.docs.map((doc, index) => ({...doc.data(), id: doc.id, index})));
  };

  const createOrder = async () => {
    await addDoc(ordersCollectionRef, {contactId: contactId, description: description, status: status});
    getOrders();
  };

  const deleteOrder = async (id) => {
    const contactDoc = doc(db, "orders", id);
    await deleteDoc(contactDoc);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status: newStatus });
  };

  useEffect(() => {
    const getContacts = async () => {
        const data = await getDocs(contactsCollectionRef);
        setContacts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getOrders();
    getContacts();
  }, [orders, contactsCollectionRef]);

  const columns = [
    { field: 'index', headerName: 'No', flex: 0.5,
        renderCell: (params) => params.row.index + 1,
    },
    {
        field: 'contactId', // Changed field name
        headerName: 'Contact Name',
        flex: 0.5,
        valueGetter: (params) => {
            const contact = params ? contacts.find((c) => c.id === params) : null;
            return contact ? contact.name : 'N/A';
        },
    },
    { field: 'description', headerName: 'Description', flex: 0.5 },
    { 
        field: 'status',
        headerName: 'Status',
        flex: 0.5,
        renderCell: (params) => (
            <Switch checked={params.row.status} 
                onChange={async (event) => { // Updated to handle status change
                    const updatedStatus = event.target.checked;
                    await updateOrderStatus(params.row.id, updatedStatus);
                }}
            />
        )
    },
    {
        field: 'action',
        headerName: 'Action',
        flex: 0.5,
        renderCell: (params) => (
            <div>
                <Button variant="contained" color="error" size="small" onClick={() => deleteOrder(params.row.id)} sx={{marginX: 1}}>Delete</Button>
                <Button variant="contained" color="primary" size="small" onClick={() => navigate(`/orders/${params.row.id}`)}>View</Button>
            </div>
            
        ),
    },
];

  return (
    <div>
      <Select label="Contact" value={contactId} onChange={(e) => setContactId(e.target.value)} sx={{ margin: 2, minWidth: '150px'}} >
        {contacts.map((contact) => (
            <MenuItem key={contact.id} value={contact.id}>
                {contact.name}
            </MenuItem>
        ))}
      </Select>
      <TextField label="Description" variant="outlined" value={description} onChange={(e) => setDescription(e.target.value)} sx={{margin: 2}} />
      <FormControlLabel control={<Switch checked={status} onChange={(e) => setStatus(e.target.checked)} />} label="Status" sx={{ marginTop: 0 }} />
      

      <Button variant="contained" onClick={createOrder} sx={{marginTop: 0}}>Create Order</Button>
      <DataGrid
        rows={orders}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        sx={{marginX: 2}}
    />
    </div>
  );
}

export default Orders;
