import React from 'react'
import { AccordionSummary,Typography,Accordion } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useState } from 'react'
// import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { useNavigate } from 'react-router-dom'
import '../css/AccordionsMin.css'


export const AccordionsMin = () => {
    const [expanded, setExpanded] = useState<string | false>(false);
    const [className, setClassName] = useState('accordion');
    const handleChange = (panel:string) => (event:React.SyntheticEvent,isExpanded:boolean) => {
    setExpanded(isExpanded ? panel: false);
  };
  const handleClick = () => {
    setClassName(className==='accordion' ? 'accordionClose' : 'accordion');
  };
  const navigate = useNavigate();
  return (
    <div>
        <div className={className}>
      <Accordion expanded={expanded==='panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary 
        expandIcon={<ExpandMoreIcon />}>
          <Typography variant='h6'>İdari İşler</Typography>
        </AccordionSummary>
        <AccordionSummary className='menuItem' onClick={()=>{navigate('/employeeRegistration');}}>
          <Typography>Personel Kayıt</Typography>
        </AccordionSummary>
        <AccordionSummary className='menuItem'>
          <Typography>Kayıtlı Personeller</Typography>
        </AccordionSummary>
      </Accordion>
      <Accordion expanded={expanded==='panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary 
        expandIcon={<ExpandMoreIcon />}>
          <Typography variant='h6'>Geçici Kabul ve Ambar</Typography>
        </AccordionSummary>
        <AccordionSummary className='menuItem'>
          <Typography>Malzeme Kayıt</Typography>
        </AccordionSummary>
        <AccordionSummary className='menuItem'>
          <Typography>Kayıtlı Malzemeler</Typography>
        </AccordionSummary>
        <AccordionSummary className='menuItem'>
          <Typography>Stok Giriş / Çıkış</Typography>
        </AccordionSummary>
        <AccordionSummary className='menuItem'>
          <Typography>Stok Görüntüle</Typography>
        </AccordionSummary>
        <AccordionSummary className='menuItem'>
          <Typography>Depo Hareketleri</Typography>
        </AccordionSummary>
        <AccordionSummary className='menuItem'>
          <Typography>Depo Bilgileri Düzenle</Typography>
        </AccordionSummary>
      </Accordion>
      <Accordion expanded={expanded==='panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary 
        expandIcon={<ExpandMoreIcon />}>
          <Typography variant='h6'>Saha Bakım Onarım</Typography>
        </AccordionSummary>
        <AccordionSummary className='menuItem'>
          <Typography>Görev Oluştur</Typography>
        </AccordionSummary>
        <AccordionSummary className='menuItem'>
          <Typography>Görev Takibi</Typography>
        </AccordionSummary>
      </Accordion>
      </div>
    </div>
  )
}
