import '../css/Main.css'
import { NavBar } from './NavBar'
import { useState } from 'react'
import { Accordions } from './Accordions'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Announcement } from './Announcement'


export const Main = () => {
  const [gridDisplayCase, setGridDisplayCase] = useState<string>('accordionClose');
  const [gridCount, setGridCount] = useState<number>(12);

  const accordionClasss = (param:boolean) => {
    if(param==false){
      setGridDisplayCase('block');
      setGridCount(10);
    }
    else {
      setGridDisplayCase('accordionClose');
      setGridCount(12);
    }
  }
  return (
    <div className='mainDiv'>
      <NavBar accordionClasss={accordionClasss}/>
      <Box sx={{ flexGrow: 1, marginTop:'5px'}}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 2 }}>
            <Accordions accordionDisplay={gridDisplayCase}/>
          </Grid>
          <Grid size={{ xs: 12, md: gridCount }}>
            <Announcement />
          </Grid>
        </Grid>
      </Box>
    </div>
    );
}
