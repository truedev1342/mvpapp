import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {db, serverTimestamp} from '../firebase-config';
import { collection, getDocs, doc, getDoc, query, where, addDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Button, IconButton, Stack, Box, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function OrderDetails() {
    const { id } = useParams();
    const [teyt, setTeyt] = useState("");
    const [price, setPrice] = useState(0.0);
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [orderInfo, setOrderInfo] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const itemCollectionRef = collection(db, "order_detail");
    const [imageUrl, setImageUrl] = useState("");

    const getOrderInfo = async () => {
        try {
            const orderRef = doc(db, "orders", id);
            const orderSnapshot = await getDoc(orderRef);
            if (orderSnapshot.exists()) {
                setOrderInfo(orderSnapshot.data());
            } else {
                setOrderInfo(null);
                console.log("No such document!");
            }
        } catch (err) {
            console.error("Error fetching order: ", err);
            setOrderInfo(null);
        }
    };

    const getOrderItems = async (orderId) => {
        try {
            const q = query(itemCollectionRef, where("orderId", "==", orderId));
            const data = await getDocs(q);
            setOrderItems(data.docs.map((doc, index) => ({...doc.data(), id: doc.id, index})));    
        } catch (error) {
            console.error("Error fetching order items:", error);
            setOrderItems([]);
        }
    }

    const createItem = async () => {
        try {
            let downloadURL = "";
            if (image) {
                const storageRef = ref(storage, `order_images/${image.name + serverTimestamp()}`); // Unique filename
                const uploadTask = uploadBytesResumable(storageRef, image);
                await new Promise((resolve, reject) => {
                    uploadTask.on('state_changed',
                        (snapshot) => { },
                        (error) => reject(error),
                        () => {
                            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                                downloadURL = url;
                                resolve();
                            });
                        }
                    );
                });
                setImageUrl(downloadURL);
            }

            await addDoc(itemCollectionRef, {teyt, price, description, imageUrl, orderId: id});
            setTeyt("");
            setPrice(0.0);
            setDescription("");
            setImage(null);
            setImageUrl("");
            setImagePreview(null);
            getOrderItems(id);
        } catch (err) {
            console.error("Error adding item: ", err);
        }
        
    };

    const deleteItem = async (itemId) => {
        try {
            const itemDoc = doc(db, "order_detail", itemId);
            await deleteDoc(itemDoc);
            getOrderItems(id);
        } catch (error) {
            console.error("Error deleting order item:", error);
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setImage(null);
            setImagePreview(null);
        }
    };

    useEffect(() => {
        getOrderInfo();
        getOrderItems(id);
    }, [id]);
    const columns = [
        { field: 'index', headerName: 'No', flex: 0.5,
            renderCell: (params) => params.row.index + 1,
        },
        { field: 'teyt', headerName: 'Teyt', flex: 0.5 },
        { field: 'price', headerName: 'Price', flex: 0.5 },
        { field: 'description', headerName: 'Description', flex: 0.5 },
        { field: 'imageUrl', headerName: 'Image', flex: 0.5,
            renderCell: (params) => {
                return params.value ? <img src={params.value} alt="Item Image" style={{ maxWidth: '100%', maxHeight: '100%' }} /> : ""
            }
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 0.5,
            renderCell: (params) => (
                <div>
                    <Button variant="contained" color="error" size="small" onClick={() => deleteItem(params.row.id)} sx={{marginX: 1}}>Delete</Button>
                </div>
                
            ),
        },
    ];
    return (
        <div>
            <h1 style={{color:"green"}}>Order Items for : {orderInfo === null ? "" : orderInfo.description}</h1>
            <Box sx={{display: "inline-flex" }}>
                <TextField label="Teyt" variant="outlined" value={teyt} onChange={(e) => setTeyt(e.target.value)} sx={{margin: 2}} />
                <TextField type="number" label="Price" variant="outlined" value={price} onChange={(e) => setPrice(e.target.value)} sx={{margin: 2}} />
                <TextField label="Description" variant="outlined" value={description} onChange={(e) => setDescription(e.target.value)} sx={{margin: 2}} />
                <Stack alignItems="center" sx={{margin: 2}}>
                    <label htmlFor="image-upload" style={{ display: 'block', cursor: 'pointer' }}>
                        <Box
                            component="span"
                            sx={{
                                width: 100,
                                height: 100,
                                border: '1px dashed #ccc',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 1,
                            }}
                        >
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                            ) : (
                                <Typography variant="body2">Select Image</Typography>
                            )}
                        </Box>
                    </label>
                    <input type="file" accept="image/*" id="image-upload" onChange={handleImageChange} style={{ display: 'none' }} />
                    {image && (
                        <IconButton onClick={() => { setImage(null); setImagePreview(null); }}>
                            <DeleteIcon />
                        </IconButton>
                    )}
                </Stack>
                <Button variant="contained" onClick={createItem} sx={{marginTop: 3, height: 40}}>Add Item</Button>
            </Box>
            
            <DataGrid
                rows={orderItems}
                columns={columns}
                pageSize={5}
                rowHeight={100}
                rowsPerPageOptions={[5]}
                sx={{marginX: 2}}
            />
        </div>
    )
}

export default OrderDetails;
