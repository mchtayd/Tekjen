import React from 'react'
import {AppBar, Toolbar, IconButton, Typography, Menu, MenuItem,Box} from '@mui/material'
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import '../css/NavBar.css'
import { useNavigate } from 'react-router-dom'

export const NavBar = ({accordionClasss}:{accordionClasss:Function}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [accordionClass, setMinAccordionClass] = React.useState<Boolean>(false);
  const navigate = useNavigate();
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
 
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setMinAccordionClass(accordionClass==true ? false:true )
    accordionClasss(accordionClass);
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1}}>
      <AppBar position="static">
        <Toolbar>
        <div className='buttonClass'>
          <IconButton
            onClick={handleClick}
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          </div>
          {/* <div className='buttonClass'>
          <Stack>
            <Button  sx={{backgroundColor:'#E38E49', padding:'10px 0px'}} variant="contained" endIcon={<MenuOpenIcon className="svg_icons"/> } onClick={handleClick}></Button>
          </Stack>
          </div> */}
          <div className='menuIcon'>
          <IconButton
            onClick={handleClick}
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            {/* <MenuIcon /> */}
          </IconButton>
          </div>
          <Typography onClick={() => {navigate('/main')}} variant="h5" component="div" sx={{ flexGrow: 1 }} className='logo'>Tekjen</Typography>
          <div className='avatar'>
              {/* <Button variant='outlined' sx={{color:'white', backgroundColor:'#1F509A'}}>Yönetim</Button>
              <Button variant='outlined' sx={{color:'white', backgroundColor:'#1F509A'}}>Ayarlar</Button>
              <Button variant='outlined' sx={{color:'white', backgroundColor:'#1F509A'}}>Dosya</Button> */}
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Typography className='userName'>Mücahit Aydemir</Typography>
                <AccountCircle className='user'/>
                
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profil</MenuItem>
                <MenuItem onClick={handleClose}>Benim Sayfam</MenuItem>
                <MenuItem onClick={handleClose}>Oturumu Kapat</MenuItem>
              </Menu>
            </div>
        </Toolbar>
      </AppBar>
    </Box>
    {/* {accordionClass==='accordionMin' ? <AccordionsMin /> : <div className='accs'><div className='menuAccordion'><Accordions /></div></div>} */}
    </div>
  )
}
