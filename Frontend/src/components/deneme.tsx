import React, { useMemo } from 'react'
import '../css/EmployeeRegistration.css'
import { NavBar } from './NavBar'
import { useState } from 'react'
import { Accordions } from './Accordions'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs' 
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
// import FormHelperText from '@mui/material/FormHelperText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Button from '@mui/material/Button';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import axios from 'axios';

import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';

type Personel = {
  id: number;
  name: string;
  tc:string;
  insuranceNo:string;
  birthPlace:string;
  birthDate: Date;
  sex:string;
  residenceAddress:string;
  maritalStatus:string;
  graduation:string;
  graduationDepartment:string;
  email:string;
  phone:string;
  startDate: Date;
  jobTitle:string;
  department: string;
  manager:string;
}

let data: Personel[] = [];

const fetchTasks = async () => {
  try {
    const response = await axios.get<Personel[]>('http://localhost:5000/api/data');
    data=response.data;
  }
  catch (error){
    console.error('Error fetching data:', error);
  }
}

await fetchTasks();

type Post = {
  id: number
  name: string
  tc: string
  insuranceNo: string
  birthPlace: string
  birthDate: Date
  sex: string
  residenceAddress: string
  maritalStatus: string
  email: string
  phone: string
  startDate: Date
  jobTitle: string
  department: string
  manager: string
  graduation:string
  graduationDepartment:string
}

const initialPost: Post = {
  id: 0,
  name: '',
  tc: '',
  insuranceNo: '',
  birthPlace: '',
  birthDate: new Date(),
  sex: '',
  residenceAddress: '',
  maritalStatus: '',
  email: '',
  phone: '',
  startDate: new Date(),
  jobTitle: '',
  department: '',
  manager: '',
  graduation:'',
  graduationDepartment:''
}

export const EmployeeRegistration = () => {

  const [post, setPost] = useState<Personel>((initialPost));
  const [errors, setErrors] = useState<Partial<Record<keyof Post, boolean>>>({})
  const [gridDisplayCase, setGridDisplayCase] = useState<string>('accordionClose');
  const [gridCount, setGridCount] = useState<number>(12);
  const [sex, setSex] = React.useState('');
  const [maritalStatus, setMaritalStatus] = React.useState('');
  const [jobTitle, setJobTitle] = React.useState('');
  const [graduation, setGraduation] = React.useState('');
  const [department, setDepartment] = React.useState('');
  const [manager, setManager] = React.useState('');
  // const [newData, setNewData] = useState({ column1: '', column2: 0 });
  // const [responseMessage, setResponseMessage] = useState('');
  

  //event:React.MouseEvent<HTMLElement>

  const validate = () => {
    const newErrors: Partial<Record<keyof Post, boolean>> = {
      name: post.name.trim() === '',
      tc: post.tc.trim() === '',
      insuranceNo: post.insuranceNo.trim() === '',
      birthPlace: post.birthPlace.trim() === '',
      // Tarih için DatePicker kullanıyorsan burada null veya invalid kontrolü yapabilirsin:
      birthDate: !(post.birthDate instanceof Date),
      sex: post.sex.trim() === '',
      residenceAddress: post.residenceAddress.trim() === '',
      maritalStatus: post.maritalStatus.trim() === '',
      email: post.email.trim() === '',
      phone: post.phone.trim() === '',
      startDate: !(post.startDate instanceof Date),
      jobTitle: post.jobTitle.trim() === '',
      department: post.department.trim() === '',
      manager: post.manager.trim() === '',
      graduation: post.manager.trim() === '',
      graduationDepartment: post.manager.trim() === '',
    };
  
    setErrors(newErrors);
    // eğer hiçbir value true değilse valid:
    return Object.values(newErrors).every(err => err === false);
  };

  const handleInput= async (event:React.ChangeEvent<HTMLInputElement>) => {
    setPost({...post, [event.target.name] : event.currentTarget.value});
    // console.log(post);
  }

  const handleSubmit = async () => {
    if (!validate()) {
      // bir veya birden fazla hata var, post etme
      return;
    }
  
    try {
      await axios.post('http://localhost:5000/api/data', post);
      // başarılıysa formu sıfırla
      setPost({ id:0, name:'', tc:'', insuranceNo:'', birthPlace:'', birthDate: new Date(),
                sex:'', residenceAddress:'', maritalStatus:'', email:'', phone:'',
                startDate: new Date(), jobTitle:'', department:'', manager:'',graduation:'', graduationDepartment:''});
      setErrors({});
      // dilersen fetchData();
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };

  const columns = useMemo<MRT_ColumnDef<Personel>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 150,
      },
      {
        accessorKey: 'name',
        header: 'Ad Soyad',
        size: 150,
      },
      {
        accessorKey: 'tc',
        header: 'TC',
        size: 150,
      },
      {
        accessorKey: 'insuranceNo',
        header: 'Sigorta Sicil No',
        size: 200,
      },
      {
        accessorKey: 'birthPlace',
        header: 'Doğum Yeri',
        size: 150,
      },
      {
        accessorKey: 'birthDate',
        header: 'Doğum Tarihi',
        size: 150,
      },
      {
        accessorKey: 'sex',
        header: 'Cinsiyet',
        size: 150,
      },
      {
        accessorKey: 'residenceAddress',
        header: 'İkamet Adresi',
        size: 150,
      },
      {
        accessorKey: 'maritalStatus',
        header: 'Medeni Durumu',
        size: 150,
      },
      {
        accessorKey: 'email',
        header: 'E-mail',
        size: 150,
      },
      {
        accessorKey: 'phone',
        header: 'Telefon',
        size: 150,
      },
      {
        accessorKey: 'startDate',
        header: 'İşe Başlama Tarihi',
        size: 150,
      },
      {
        accessorKey: 'jobTitle',
        header: 'Ünvanı',
        size: 150,
      },
      {
        accessorKey: 'department',
        header: 'Departman',
        size: 150,
      },
      {
        accessorKey: 'manager',
        header: 'Yöneticisi',
        size: 150,
      },
      {
        accessorKey: 'graduation',
        header: 'Yöneticisi',
        size: 150,
      },
      {
        accessorKey: 'graduationDepartment',
        header: 'Yöneticisi',
        size: 150,
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
    muiPaginationProps: {
      color: 'primary',
      shape: 'rounded',
      showRowsPerPage: false,
      variant: 'outlined',
    },
    paginationDisplayMode: 'pages', // graduationDepartment
  });

  const accordionClasss = (param:boolean) => {
    if(param==false){
      setGridDisplayCase('block');
      setGridCount(10);
    }
    else {
      setGridDisplayCase('accordionClose');
      setGridCount(12);
    }
  };
  const handleChangeSex = (event: SelectChangeEvent) => {
    setSex(event.target.value);
    {handleInput};
  };
  const handleChangeMaritalStatus = (event: SelectChangeEvent) => {
    setMaritalStatus(event.target.value);
    {handleInput};
  };
  const handleChangeJobTitle = (event: SelectChangeEvent) => {
    setJobTitle(event.target.value);
    {handleInput};
  };
  const handleChangeGraduation = (event: SelectChangeEvent) => {
    setGraduation(event.target.value);
    {handleInput};
  };
  const handleChangeDepartment = (event: SelectChangeEvent) => {
    setDepartment(event.target.value);
    {handleInput};
  };
  const handleChangeManager = (event: SelectChangeEvent) => {
    setManager(event.target.value);
    {handleInput};
  };

  return (
    <div className='mainDiv'>
      <NavBar accordionClasss={accordionClasss}/>
      <Box sx={{ flexGrow: 1, marginTop:'5px'}}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 2 }}>
            <Accordions accordionDisplay={gridDisplayCase}/>
          </Grid>
          <Grid size={{ xs: 12, md: gridCount }}>
            <div>
            <Typography gutterBottom variant="h6" component="div" className='mainHeader' sx={{cursor:'default', marginTop:'1rem', marginBottom:'2rem'}}>
                  Personel Kayıt
            </Typography>

            <form onSubmit={handleSubmit} className='formClass'>
              <TextField name="name" label="Ad Soyad" variant="outlined" sx={{marginBottom:'12px', marginRight:'15px', width:'220px'}} onChange={handleInput} error={!!errors.name}/>
              <TextField name="tc" label="TC No" variant="outlined" sx={{marginBottom:'12px', marginRight:'15px', width:'220px'}} onChange={handleInput} error={!!errors.tc}/>
              <TextField name='insuranceNo' label="Sigorta Sicil No" variant="outlined" sx={{marginBottom:'12px', marginRight:'15px', width:'220px'}} onChange={handleInput} error={!!errors.insuranceNo}/>
              <TextField name='birthPlace' label="Doğum Yeri" variant="outlined" sx={{marginBottom:'12px',marginRight:'15px', width:'220px'}} onChange={handleInput} error={!!errors.birthPlace}/>
              <div style={{marginBottom:'12px', marginRight:'15px',width:'220px'}} onChange={handleInput}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker name='birthDate' label={'Doğum Tarihi'} views={['year', 'month', 'day']}/>
                </LocalizationProvider>
              </div>
              <FormControl sx={{ minWidth: 80 ,size:'large'}}>
              <InputLabel id="sex">Cinsiyet</InputLabel>
              <Select
                labelId="sex"
                name='sex'
                id="selectSex"
                value={sex}
                onChange={handleChangeSex}
                error={!!errors.sex}
                autoWidth
                label="Cinsiyet"
                sx={{marginBottom:'12px',marginRight:'15px',width:'220px'}}>
              <MenuItem value="">
                <em>Hiçbiri</em>
              </MenuItem>
              <MenuItem value={1}>Erkek</MenuItem>
              <MenuItem value={2}>Kadın</MenuItem>
              </Select>
              </FormControl>
              <TextField id="filled-multiline-flexible" name='residenceAddress' label="İkamet Adresi" multiline rows={1} variant="outlined" sx={{marginBottom:'12px', marginRight:'15px',width:'220px'}} onChange={handleInput} error={!!errors.residenceAddress}/>
              <FormControl sx={{ minWidth: 80 ,size:'large'}}>
              <InputLabel id="maritalStatus">Medeni Durum</InputLabel>
              <Select
                labelId="maritalStatus"
                id="selectMaritalStatus"
                value={maritalStatus}
                name='maritalStatus'
                onChange={handleChangeMaritalStatus}
                error={!!errors.maritalStatus}
                autoWidth
                label="İkamet Adresi"
                sx={{marginBottom:'12px',marginRight:'15px',width:'220px'}}>
              <MenuItem value="">
                <em>Hiçbiri</em>
              </MenuItem>
              <MenuItem value={3}>Bekar</MenuItem>
              <MenuItem value={4}>Evli</MenuItem>
              </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 80,size:'large'}}>
              <InputLabel id="graduation">Mezuniyet</InputLabel>
              <Select
                labelId="graduation"
                name='graduation'
                id="selectGraduation"
                value={graduation}
                onChange={handleChangeGraduation}
                error={!!errors.graduation}
                autoWidth
                label="Mezuniyet"
                sx={{marginBottom:'12px',marginRight:'15px',width:'220px'}}>
              <MenuItem value="">
                <em>Hiçbiri</em>
              </MenuItem>
              <MenuItem value={1}>İlkokul</MenuItem>
              <MenuItem value={2}>Lise</MenuItem>
              <MenuItem value={3}>Önlisans</MenuItem>
              <MenuItem value={4}>Lisans</MenuItem>
              <MenuItem value={5}>Yüksek Lisans</MenuItem>
              </Select>
              </FormControl>
              <TextField name='graduationDepartment' label="Mezuniyet Bölüm" variant="outlined" sx={{marginBottom:'12px', marginRight:'15px',width:'220px'}} onChange={handleInput} error={!!errors.graduationDepartment}/>
              <TextField name='email' label="E-mail" variant="outlined" sx={{marginBottom:'12px', marginRight:'15px',width:'220px'}} onChange={handleInput} error={!!errors.email}/>
              {/* <InputMask mask="(0)999 999 99 99" value={phone} disabled={false} maskChar=" " > {() => <TextField />}</InputMask> */}
              <TextField name='phone' label="Telefon" variant="outlined" sx={{marginBottom:'12px', marginRight:'15px',width:'220px'}} onChange={handleInput} error={!!errors.phone}/>
              <div style={{marginBottom:'12px', marginRight:'15px',width:'220px'}} onChange={handleInput}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker name='startDate' label={'İşe Başlama Tarihi'} views={['year', 'month', 'day']}/>
                </LocalizationProvider>
              </div>
              <FormControl sx={{ minWidth: 80 ,size:'large'}}>
              <InputLabel id="jobTitle">Ünvanı</InputLabel>
              <Select
                labelId="jobTitle"
                id="selectJobTitle"
                name='jobTitle'
                value={jobTitle}
                onChange={handleChangeJobTitle}
                error={!!errors.jobTitle}
                autoWidth
                label="Ünvanı"
                sx={{marginBottom:'12px',marginRight:'15px',width:'220px'}}>
              <MenuItem value="">
                <em>Hiçbiri</em>
              </MenuItem>
              <MenuItem value={1}>CEO</MenuItem>
              <MenuItem value={2}>Direktör</MenuItem>
              <MenuItem value={3}>Müdür</MenuItem>
              <MenuItem value={4}>Lider Mühendis</MenuItem>
              <MenuItem value={5}>Mühendis</MenuItem>
              <MenuItem value={6}>Şef Teknisyen</MenuItem>
              <MenuItem value={7}>Teknisyen</MenuItem>
              <MenuItem value={8}>Veri Kayıt Sorumlusu</MenuItem>
              <MenuItem value={9}>Depo Sorumlusu</MenuItem>
              <MenuItem value={10}>Şoför</MenuItem>
              <MenuItem value={11}>Güvenlik Görevlisi</MenuItem>
              <MenuItem value={12}>Kat Hizmetlisi</MenuItem>
              <MenuItem value={13}>Stajyer</MenuItem>
              </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 80,size:'large'}}>
              <InputLabel id="department">Departman</InputLabel>
              <Select
                labelId="department"
                name='department'
                id="selectDepartment"
                value={department}
                onChange={handleChangeDepartment}
                error={!!errors.department}
                autoWidth
                label="Departman"
                sx={{marginBottom:'12px',marginRight:'15px',width:'220px'}}>
              <MenuItem value="">
                <em>Hiçbiri</em>
              </MenuItem>
              <MenuItem value={1}>Atölye</MenuItem>
              <MenuItem value={2}>Saha Bakım Onarım</MenuItem>
              <MenuItem value={3}>Geçici Kabul ve Ambar</MenuItem>
              <MenuItem value={4}>İdari ve Mali İşler</MenuItem>
              <MenuItem value={5}>Veri Kayıt</MenuItem>
              </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 80,size:'large'}}>
              <InputLabel id="manager">Yönetici</InputLabel>
              <Select
                labelId="manager"
                id="selectManager"
                name='manager'
                value={manager}
                onChange={handleChangeManager}
                error={!!errors.manager}
                autoWidth
                label="Yönetici"
                sx={{marginBottom:'12px',marginRight:'15px',width:'220px'}}>
              <MenuItem value="">
                <em>Hiçbiri</em>
              </MenuItem>
              <MenuItem value={1}>İrfan Fazla</MenuItem>
              </Select>
              </FormControl>
            </form>
            <div style={{display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'center', margin:'10px 0px'}}>
              <Button variant="contained" sx={{padding:'10px'}} endIcon={<SaveOutlinedIcon />} onClick={handleSubmit}>Kaydet</Button>
            </div>
            </div>
            <div>
            <MaterialReactTable table={table} />
            </div>
          </Grid>
        </Grid>
      </Box>
    </div>
    );
}