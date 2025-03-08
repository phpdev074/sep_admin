import { useState, useCallback,ChangeEvent } from 'react';

// import Box from '@mui/material/Box';
// import Avatar from '@mui/material/Avatar';
// import Popover from '@mui/material/Popover';
// import TableRow from '@mui/material/TableRow';
// import Checkbox from '@mui/material/Checkbox';
// import MenuList from '@mui/material/MenuList';
// import TableCell from '@mui/material/TableCell';
// import IconButton from '@mui/material/IconButton';
// import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
// // import { ShowToast } from '../../helpers/ToastService';
// import { Label } from 'src/components/label';
// import { Iconify } from 'src/components/iconify';
// import { toast } from 'react-toastify';
// import { api, deleteUser } from 'src/api/url';
// ----------------------------------------------------------------------

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import { Iconify } from 'src/components/iconify';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { api } from 'src/api/url';


interface Post {
    _id: string;
    userId: string;
    categoryId: string;
    postReport: string;
    userReport: string;
    content: string;
    files: File[];
    fileType: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    options: any[];
    votes: any[];
    location: {
        type: string;
        coordinates: [number, number];
    };
    selected: boolean;
    onModification:any
}


export type UserProps = {
    _id: string;
    image: string;
    title: string;
    description: string;
    price: string;
    // avatarUrl: string;
    // isVerified: boolean; 
    email: string;
    gender: string;
};

type UserTableRowProps = {
    row: UserProps;
    selected: boolean;
    onSelectRow: () => void;
    onModification:any;
};





export function ProductTableRow({ row, selected, onSelectRow,onModification }: UserTableRowProps) {
    const [loading, setLoading] = useState(false);
    const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [formData, setFormData] = useState<{ image:string,title: string; price: string; description: string }>({
        image:'',
        title: '',
        price: '',
        description: '',
    });

    const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setOpenPopover(event.currentTarget);
    }, []);
    

    const handleClosePopover = useCallback(() => {
        setOpenPopover(null);
    }, []);

    const handleOpenModal = () => {
        setFormData({ image: row.image,title: row.title, price: row.price, description: row.description });
        setOpenModal(true);
        handleClosePopover();
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await api.put(`/api/product?id=${row._id}`, formData);
    
            if (response.status === 200) {
                // alert('Product updated successfully');
                onModification();    
                handleCloseModal();
            } else {
                // alert('Failed to update product. Please try again.');
            }
        } catch (error) {
            console.error('Update failed', error);
            alert('An error occurred while updating the product.');
        } finally {
            setLoading(false);
        }
    };
    

    const handleDelete = useCallback(async (id: string) => {
        const confirmed = window.confirm("Are you sure you want to delete ?")
        if (confirmed) {
            const response = await api.delete(`/api/product?id=${id}`);
            // console.log("@@@@@", response?.data?.data)`
            
        }
        setOpenPopover(null);
    }, []);
    
    return (
          <>
<Modal open={openModal} onClose={handleCloseModal}>
    <Box
        sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
        }}
    >
        <h2>Edit Product</h2>

        <Box display="flex" justifyContent="center" mb={2}>
            <img 
                src={formData.image || 'https://via.placeholder.com/150'} 
                alt="Product"
                style={{ width: '70%', height: 'auto', borderRadius: 8 }}
            />
        </Box>



        <input
    type="file"
    accept="image/*"
    onChange={(e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string; 
                setFormData((prev) => ({ ...prev, image: result }));
            };
            reader.readAsDataURL(file);
        }
    }}
/>

        <TextField
            label="Title"
            name="title"
            fullWidth
            margin="normal"
            value={formData.title}
            onChange={handleChange}
        />
        <TextField
            label="Price"
            name="price"
            fullWidth
            margin="normal"
            value={formData.price}
            onChange={handleChange}
        />
        <TextField
            label="Description"
            name="description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
        />
        <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
                Save
            </Button>
            <Button variant="outlined" onClick={handleCloseModal}>
                Cancel
            </Button>
        </Box>
    </Box>
</Modal>
   
   




            <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
                <TableCell padding="checkbox">
                    {/* <Checkbox disableRipple checked={selected} onChange={onSelectRow} /> */}
                </TableCell>

                <TableCell component="th" scope="row">
                    <Box gap={2} display="flex" alignItems="center">
                        <Avatar alt={row.image} src={row.image} />
                        {/* {row.image} */}
                    </Box>
                </TableCell>

                <TableCell>{row.title}</TableCell>

                <TableCell>{row.price}</TableCell>

                <TableCell align="center">
                    {row.description}
                </TableCell>

                {/* <TableCell>
          <Label color={(row.status === 'banned' && 'error') || 'success'}>{row.status}</Label>
        </TableCell> */}

                <TableCell align="right">
                    <IconButton onClick={handleOpenPopover}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>


            <Popover
                open={!!openPopover}
                anchorEl={openPopover}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuList
                    disablePadding
                    sx={{
                        p: 0.5,
                        gap: 0.5,
                        width: 140,
                        display: 'flex',
                        flexDirection: 'column',
                        [`& .${menuItemClasses.root}`]: {
                            px: 1,
                            gap: 2,
                            borderRadius: 0.75,
                            [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
                        },
                    }}
                >
                    <MenuItem onClick={handleOpenModal}>
                        <Iconify icon="solar:pen-bold" />
                        Edit
                    </MenuItem>

                    <MenuItem
                        onClick={() => handleDelete(row?._id)}
                    >
                        <Iconify icon="solar:trash-bin-trash-bold" />
                        Delete
                    </MenuItem>
                    {/* <MenuItem onClick={handleClosePopover} sx={{ color: 'error.main' }}>
          <Iconify icon="mdi:block" />
            Block 
          </MenuItem> */}
                </MenuList>
            </Popover>

        </>
    );
}
