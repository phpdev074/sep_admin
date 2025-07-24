/* eslint-disable */
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
  Tabs,
  Tab,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { api } from 'src/api/url';
import { Iconify } from 'src/components/iconify';

const editableSections = {
  faq: 'FAQ',
  terms: 'Terms and Conditions',
  privacy: 'Privacy Policy',
} as const;
const initialContent = {
  faq: 'Here are some frequently asked questions...',
  terms: 'These are the terms and conditions of our service...',
  privacy: 'This is the privacy policy of our website...',
};
type Section = keyof typeof initialContent;

export function SettingView() {
  // Track current tab ('settings' | 'charges')
  const [tab, setTab] = useState<'settings' | 'charges'>('settings');

  // Settings states
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
  const [loading, setLoading] = useState(false);

  // Charges states
  const [commissionCharge, setCommissionCharge] = useState<number>(30);
  const [transactionCharge, setTransactionCharge] = useState<number>(5);
  const [initialCommissionCharge, setInitialCommissionCharge] = useState<number>(30);
  const [initialTransactionCharge, setInitialTransactionCharge] = useState<number>(5);
  const [loadingCharges, setLoadingCharges] = useState(false);
  const [savingCharges, setSavingCharges] = useState(false);
  const [errorCharges, setErrorCharges] = useState('');

  // Fetch admin info on mount
  useEffect(() => {
    const fetchAdmin = async () => {
      setLoadingAdmin(true);
      setErrorAdmin('');
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No auth token found');

        const response = await api.get('/admin/getAdmin', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data?.data;
        setAdminName(data.name || '');
        setAdminEmail(data.email || '');
        setOriginalAdminName(data.name || '');
        setOriginalAdminEmail(data.email || '');
        setCommissionCharge(data?.commission ?? 30);
        setTransactionCharge(data?.transactionCharge ?? 5);
        setInitialCommissionCharge(data?.commission ?? 30);
        setInitialTransactionCharge(data?.transactionCharge ?? 5);
      } catch (error: any) {
        setErrorAdmin(
          error.response?.data?.message || error.message || 'Failed to load admin data'
        );
      } finally {
        setLoadingAdmin(false);
      }
    };

    fetchAdmin();
  }, []);

  // Fetch charges info when tab switches to "charges"
  useEffect(() => {
    if (tab === 'charges') {
      const fetchCharges = async () => {
        setLoadingCharges(true);
        setErrorCharges('');
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error('No auth token found');

          const response = await api.get('/admin/getCharges', {
            headers: { Authorization: `Bearer ${token}` },
          });

          const data = response.data?.data;
          setCommissionCharge(data?.commission ?? 30);
          setTransactionCharge(data?.transactionCharge ?? 5);
          setInitialCommissionCharge(data?.commission ?? 30);
          setInitialTransactionCharge(data?.transactionCharge ?? 5);
        } catch (error: any) {
          setErrorCharges(
            error.response?.data?.message || error.message || 'Failed to load charges'
          );
        } finally {
          setLoadingCharges(false);
        }
      };

      fetchCharges();
    }
  }, [tab]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: 'settings' | 'charges') => {
    setTab(newValue);
  };

  // Save Charges handler
  const handleSaveCharges = async () => {
    setSavingCharges(true);
    setErrorCharges('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No auth token found');

      await api.put(
        '/admin/editAdmin',
        {
          commission: commissionCharge,
          transactionCharge: transactionCharge,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update initial values after save to disable button
      setInitialCommissionCharge(commissionCharge);
      setInitialTransactionCharge(transactionCharge);
      // Optionally notify success here
    } catch (error: any) {
      setErrorCharges(error.response?.data?.message || error.message || 'Failed to update charges');
    } finally {
      setSavingCharges(false);
    }
  };

  // Determine if charges values have changed
  const chargesChanged =
    commissionCharge !== initialCommissionCharge || transactionCharge !== initialTransactionCharge;

  // Render Charges Tab content
  const renderChargesTab = () => (
    <Box
      sx={{
        width: 400,
        p: 3,
        borderRadius: 2,
        boxShadow: 2,
        backgroundColor: '#f9f9f9',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        marginLeft: '371px',
      }}
    >
      <Typography variant="h6" mb={1}>
        Charges Settings
      </Typography>

      {loadingCharges ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={100}>
          <CircularProgress />
        </Box>
      ) : errorCharges ? (
        <Typography color="error">{errorCharges}</Typography>
      ) : (
        <>
          <TextField
            label="Commission Charge (%)"
            type="number"
            inputProps={{ min: 0, max: 100, step: 0.1 }}
            value={commissionCharge}
            onChange={(e) => setCommissionCharge(parseFloat(e.target.value) || 0)}
            fullWidth
          />
          <Typography variant="body2" color="text.secondary">
            Commission charge applied on each transaction
          </Typography>

          <TextField
            label="Transaction Charge (%)"
            type="number"
            inputProps={{ min: 0, max: 100, step: 0.1 }}
            value={transactionCharge}
            onChange={(e) => setTransactionCharge(parseFloat(e.target.value) || 0)}
            fullWidth
          />
          <Typography variant="body2" color="text.secondary">
            Transaction charge applied on each withdrawal
          </Typography>

          <Button
            variant="contained"
            onClick={handleSaveCharges}
            disabled={savingCharges || !chargesChanged}
            sx={{ alignSelf: 'flex-end', width: '350px' }}
          >
            {savingCharges ? 'Saving...' : 'Save Charges'}
          </Button>
        </>
      )}
    </Box>
  );

  return (
    <DashboardContent>
      <Box sx={{ width: '100%', mb: 3 }}>
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab label="Settings" value="settings" />
          <Tab label="Charges" value="charges" />
        </Tabs>
      </Box>

      {tab === 'settings' ? (
        <Box display="flex" flexDirection="column" alignItems="center" mb={5}>
          {/* Your existing Settings content here */}
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
                <TextField
                  label="Name"
                  value={adminName}
                  fullWidth
                  onChange={(e) => setAdminName(e.target.value)}
                />
                <TextField
                  label="Email"
                  value={adminEmail}
                  fullWidth
                  onChange={(e) => setAdminEmail(e.target.value)}
                />
                {(adminName !== originalAdminName || adminEmail !== originalAdminEmail) && (
                  <Button
                    variant="contained"
                    onClick={async () => {
                      setSavingAdmin(true);
                      try {
                        const token = localStorage.getItem('token');
                        if (!token) throw new Error('No auth token found');
                        await api.put(
                          '/admin/editAdmin',
                          { name: adminName, email: adminEmail },
                          { headers: { Authorization: `Bearer ${token}` } }
                        );
                        setOriginalAdminName(adminName);
                        setOriginalAdminEmail(adminEmail);
                        // alert('Admin info updated successfully!');
                      } catch (error: any) {
                        alert(
                          error.response?.data?.message ||
                            error.message ||
                            'Failed to update admin info'
                        );
                      } finally {
                        setSavingAdmin(false);
                      }
                    }}
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
                        onClick={() => setShowPassword((prev) => !prev)}
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
                  onClick={async () => {
                    setPasswordError('');
                    setLoading(true);
                    try {
                      const token = localStorage.getItem('token');
                      if (!token) throw new Error('No auth token found');

                      if (!newPassword || newPassword.length < 6) {
                        setPasswordError('Password must be at least 6 characters long.');
                        setLoading(false);
                        return;
                      }

                      await api.put(
                        '/admin/editAdmin',
                        { password: newPassword },
                        { headers: { Authorization: `Bearer ${token}` } }
                      );

                      setPasswordUpdated(true);
                      setNewPassword('');
                      setTimeout(() => setPasswordUpdated(false), 3000);
                    } catch (error: any) {
                      setPasswordError(error.response?.data?.message || error.message);
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={!newPassword || loading}
                >
                  {loading ? <CircularProgress size={20} color="inherit" /> : 'Update Password'}
                </Button>
              </>
            )}
          </Box>

          <Box
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            gap={2}
            flexWrap="wrap"
            mb={4}
          >
            {Object.entries(editableSections).map(([key, value]) => (
              <Box
                key={key}
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
                onClick={() => {
                  setCurrentSection(key as Section);
                  setSectionContent(initialContent[key as Section]);
                  setOpenDialog(true);
                }}
              >
                <Typography variant="h6">{value}</Typography>
              </Box>
            ))}
          </Box>

          <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            maxWidth="lg"
            fullWidth
            sx={{ minHeight: '450px' }}
          >
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
              <Button onClick={() => setOpenDialog(false)} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  console.log(`Saving ${currentSection}:`, sectionContent);
                  setOpenDialog(false);
                }}
                color="primary"
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      ) : (
        renderChargesTab()
      )}
    </DashboardContent>
  );
}
