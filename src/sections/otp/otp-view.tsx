/* eslint-disable */
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button'; // ✅ Added

import { useRouter } from 'src/routes/hooks';
import { api } from 'src/api/url';

export function OtpView() {
  const router = useRouter();

  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = useCallback(async () => {
    setOtpError('');
    setGlobalError('');

    if (!otp) {
      setOtpError('OTP is required');
      return;
    }

    setLoading(true);

    const id = localStorage.getItem('_id');
    console.log(id)
    try {
      const response = await api.post(`/admin/verifyLoginOtp?id=${id}&otp=${otp}`);

      const { token } = response.data.data;
      console.log(response.data)
      localStorage.setItem('token', token);
      router.push('/dashboard');
    } catch (error) {
      const message = error?.response?.data?.message || 'Verification failed';
      if (message.toLowerCase().includes('otp')) {
        setOtpError(message);
      } else {
        setGlobalError(message);
      }
    } finally {
      setLoading(false);
    }
  }, [otp, router]);

  const handleBack = () => {
    router.push('/');
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" maxWidth={400} mx="auto" marginTop={25}>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Admin OTP Login
      </Typography>

      <TextField
        fullWidth
        label="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        error={!!otpError}
        helperText={otpError}
        sx={{ mb: 3 }}
      />

      {globalError && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {globalError}
        </Typography>
      )}

      <LoadingButton
        fullWidth
        variant="contained"
        loading={loading}
        onClick={handleVerifyOtp}
        sx={{ mb: 2 }}
      >
        Verify OTP
      </LoadingButton>

      {/* ✅ Go Back Button */}
      <Button fullWidth variant="outlined" onClick={handleBack}>
        Go Back
      </Button>
    </Box>
  );
}
