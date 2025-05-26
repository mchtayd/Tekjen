import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FilledInput from '@mui/material/FilledInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Button } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// import dayjs from 'dayjs';

import '../css/Login.css' 


export default function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [registry, setRegistry] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [open, setOpen] = React.useState(false);
  
  const handleClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleClick = () => {
    if(registry===''){
      return setOpen(true);
    }
    if(password===''){
      return setOpen(true);
    }
    navigate('/main');
  };
  return (
    <>
    {/* <NavBar loginCase={false}/> */}
    <Box sx={{ flexWrap: 'wrap', width:'100%', height: '100vh' }}>
      <div className='loginMainDiv'>
        <div className='logoDiv'></div>
        <FormControl sx={{ mb: 2, width: '38ch',zIndex:5}} variant="filled">
        <InputLabel>Sicil No</InputLabel>
        <FilledInput
            onChange={(e) => setRegistry(e.target.value)}
            value={registry}
            id="filled-adornment-password"
            type={'text'}
            endAdornment={
              <InputAdornment position="end">
                <AccountCircle />
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl sx={{ mb: 3, width: '38ch', color:'white' }} variant="filled">
          <InputLabel>Parola</InputLabel>
          <FilledInput
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            id="filled-adornment-password"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? 'hide the password' : 'display the password'
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <Button variant='contained' size="medium" endIcon={<LoginIcon />} sx={{width: '38ch', height:'6ch' }} onClick={handleClick}>GİRİŞ</Button>
        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Kullanıcı Girişi Hatası"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Lütfen Sicil No ve Parola bilgilerinizi eksiksiz ve doğru bir şekilde doldurunuz!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Anladım
          </Button>
        </DialogActions>
      </Dialog>
      </div>
    </Box>
    </>
  );
}