import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  DialogTitle,
  CircularProgress,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { api } from 'src/api/url';
import { Iconify } from 'src/components/iconify';

const editableSections = {
  faq: 'FAQ',
  terms: 'Terms and Conditions',
  privacy: 'Privacy Policy',
};
const initialContent = {
  faq: 'Here are some frequently asked questions...',
  terms: 'These are the terms and conditions of our service...',
  privacy: 'This is the privacy policy of our website...',
};
type Section = keyof typeof initialContent;

export function SettingView() {
  const [openDialog, setOpenDialog] = useState(false);
  const [currentSection, setCurrentSection] = useState<Section | undefined>(undefined);
  const [sectionContent, setSectionContent] = useState<string>('');

  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [originalAdminName, setOriginalAdminName] = useState('');
  const [originalAdminEmail, setOriginalAdminEmail] = useState('');
  const [loadingAdmin, setLoadingAdmin] = useState(true);
  const [errorAdmin, setErrorAdmin] = useState('');
  const [savingAdmin, setSavingAdmin] = useState(false);

  const [newPassword, setNewPassword] = useState('');
const [passwordUpdated, setPasswordUpdated] = useState(false);
const [passwordError, setPasswordError] = useState('');

const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    const fetchAdmin = async () => {
      setLoadingAdmin(true);
      setErrorAdmin('');
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No auth token found');

        const response = await api.get('/admin/getAdmin', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data?.data;
        setAdminName(data.name || '');
        setAdminEmail(data.email || '');
        setOriginalAdminName(data.name || '');
        setOriginalAdminEmail(data.email || '');
      } catch (error: any) {
        setErrorAdmin(error.response?.data?.message || error.message || 'Failed to load admin data');
      } finally {
        setLoadingAdmin(false);
      }
    };

    fetchAdmin();
  }, []);

  const handleClickOpenDialog = (section: Section) => {
    setCurrentSection(section);
    setSectionContent(initialContent[section]);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveContent = () => {
    console.log(`Saving ${currentSection}:`, sectionContent);
    setOpenDialog(false);
  };

  const handleAdminNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setAdminName(e.target.value);
  const handleAdminEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setAdminEmail(e.target.value);

  const hasChanges =
    adminName !== originalAdminName ||
    adminEmail !== originalAdminEmail;

  const handleSaveAdminInfo = async () => {
    setSavingAdmin(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No auth token found');

      await api.put(
        '/admin/editAdmin',
        { name: adminName, email: adminEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // alert('Admin info updated successfully!');
      // Update original to current after save
      setOriginalAdminName(adminName);
      setOriginalAdminEmail(adminEmail);
    } catch (error: any) {
      alert(error.response?.data?.message || error.message || 'Failed to update admin info');
    } finally {
      setSavingAdmin(false);
    }
  };

  const handleUpdatePassword = async () => {
  setPasswordError('');
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No auth token found');

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }

    await api.put(
      '/admin/editAdmin',
      { password: newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setPasswordUpdated(true);
    setNewPassword('');
    setTimeout(() => setPasswordUpdated(false), 3000); // Reset message after 3s
  } catch (error: any) {
    setPasswordError(error.response?.data?.message || error.message);
  }
};

const handleTogglePasswordVisibility = () => {
  setShowPassword((prev) => !prev);
};


  return (
    <DashboardContent>
      <Box display="flex" flexDirection="column" alignItems="center" mb={5}>
        <Typography variant="h4" mb={3}>
          Settings
        </Typography>

        <Box
          sx={{
            width: 400,
            p: 2,
            mb: 4,
            borderRadius: 2,
            boxShadow: 2,
            backgroundColor: '#f9f9f9',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography variant="h6">Admin Info</Typography>
          {loadingAdmin ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={100}>
    <CircularProgress />
  </Box>
          ) : errorAdmin ? (
            <Typography color="error">{errorAdmin}</Typography>
          ) : (
            <>
              <TextField label="Name" value={adminName} fullWidth onChange={handleAdminNameChange} />
              <TextField label="Email" value={adminEmail} fullWidth onChange={handleAdminEmailChange} />
              {hasChanges && (
                <Button
                  variant="contained"
                  onClick={handleSaveAdminInfo}
                  disabled={savingAdmin}
                  sx={{ alignSelf: 'flex-end', mt: 1 }}
                >
                  {savingAdmin ? 'Saving...' : 'Save'}
                </Button>
              )}
              <Typography variant="subtitle1" mt={3}>
    Change Password
  </Typography>

  <TextField
  label="New Password"
  type={showPassword ? 'text' : 'password'}
  value={newPassword}
  onChange={(e) => setNewPassword(e.target.value)}
  fullWidth
  size="small"
  InputProps={{
    endAdornment: (
      <Button
        onClick={handleTogglePasswordVisibility}
        size="small"
        sx={{ minWidth: 'auto', ml: 1 }}
      >
        {showPassword ? (
          <Iconify icon="eva:eye-off-fill" width={20} />
        ) : (
          <Iconify icon="eva:eye-fill" width={20} />
        )}
      </Button>
    ),
  }}
/>


  {passwordError && (
    <Typography color="error" variant="body2">
      {passwordError}
    </Typography>
  )}

  {passwordUpdated && (
    <Typography color="success.main" variant="body2">
      Password updated successfully!
    </Typography>
  )}

  <Button
    variant="contained"
    size="small"
    sx={{ mt: 1 }}
    onClick={handleUpdatePassword}
    disabled={!newPassword}
  >
    Update Password
  </Button>
            </>
          )}
        </Box>

        {Object.entries(editableSections).map(([key, value]) => (
          <Box
            key={key}
            mb={2}
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              width: 250,
              height: 60,
              borderRadius: 2,
              boxShadow: 2,
              backgroundColor: '#f0f0f0',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
            }}
            onClick={() => handleClickOpenDialog(key as Section)}
          >
            <Typography variant="h6">{value}</Typography>
          </Box>
        ))}
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth sx={{ minHeight: '450px' }}>
        <DialogTitle>Edit {currentSection && editableSections[currentSection]}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label={`${editableSections[currentSection ?? 'faq'] || 'Unknown'} Content`}
            multiline
            rows={8}
            value={sectionContent}
            onChange={(e) => setSectionContent(e.target.value)}
            variant="outlined"
            sx={{ '& .MuiOutlinedInput-root': { height: 'auto' } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveContent} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
