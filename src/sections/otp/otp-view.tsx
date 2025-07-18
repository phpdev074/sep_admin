/* eslint-disable */
import { useState, useRef, useCallback } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';

import { useRouter } from 'src/routes/hooks';
import { api } from 'src/api/url';

export function OtpView() {
  const router = useRouter();

  const [otpDigits, setOtpDigits] = useState(Array(6).fill(''));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [otpError, setOtpError] = useState('');
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
  const value = e.target.value.replace(/[^0-9]/g, '');
  const newOtp = [...otpDigits];

  if (value) {
    newOtp[index] = value[0];
    setOtpDigits(newOtp);

    if (index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  } else {
    newOtp[index] = '';
    setOtpDigits(newOtp);
  }
};



  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
  if (e.key === 'Backspace') {
    const newOtp = [...otpDigits];

    if (otpDigits[index]) {
      newOtp[index] = '';
      setOtpDigits(newOtp);
    } else if (index > 0) {
      inputRefs.current[index - 1]?.focus();
      newOtp[index - 1] = '';
      setOtpDigits(newOtp);
    }
  }
};



  const handleVerifyOtp = useCallback(async () => {
    setOtpError('');
    setGlobalError('');

    const otp = otpDigits.join('');
    if (!otp || otp.length < 6) {
      setOtpError('Please enter a 6-digit OTP');
      return;
    }

    setLoading(true);
    const id = localStorage.getItem('_id');

    try {
      const response = await api.post(`/admin/verifyLoginOtp?id=${id}&otp=${otp}`);
      const { token } = response.data.data;
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
  }, [otpDigits, router]);

  const handleBack = () => {
    router.push('/');
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" maxWidth={400} mx="auto" marginTop={25}>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Admin OTP Login
      </Typography>

      <Box display="flex" gap={1} justifyContent="center" sx={{ mb: 3 }}>
        {otpDigits.map((digit, index) => (
          <TextField
            key={index}
            inputRef={(el) => (inputRefs.current[index] = el)}
            value={digit}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOtpChange(e, index)}
  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, index)}
            autoComplete="off"
            inputProps={{
              maxLength: 1,
              inputMode: 'numeric',
              style: {
                textAlign: 'center',
                fontSize: '1.2rem',
                width: '2.5rem',
                height: '2.5rem',
                padding: 0,
              },
            }}
            error={!!otpError}
          />
        ))}
      </Box>

      {otpError && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {otpError}
        </Typography>
      )}

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

      <Button fullWidth variant="outlined" onClick={handleBack}>
        Go Back
      </Button>
    </Box>
  );
}
