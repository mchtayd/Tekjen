import React, { useState, useEffect, useMemo, useRef } from 'react'
import '../css/EmployeeRegistration.css'
import { NavBar } from './NavBar'
import { Accordions } from './Accordions'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import PersonRemoveAlt1Icon from '@mui/icons-material/PersonRemoveAlt1';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import type { MRT_RowSelectionState } from 'material-react-table'
import { useSnackbar } from 'notistack';
import * as XLSX from 'xlsx';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import axios from 'axios'
import 'dayjs/locale/tr';
// import type { SelectChangeEvent } from '@mui/material/Select'
import { useTheme, useMediaQuery, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table'

dayjs.locale('tr'); 

interface DocEntry {
  typeValue: string;
  label: string;
  path: string;
}

// Personel tipi ve başlangıç objesi
type Personel = {
  id: number
  name: string
  tc: string
  insuranceNo: string
  birthPlace: string
  birthDate: Dayjs | null
  sex: string
  residenceAddress: string
  maritalStatus: string
  graduation: string
  graduationDepartment: string
  email: string
  phone: string
  startDate: Dayjs | null
  title: string
  department: string
  manager: string
  docs?: DocEntry[]
}


const initialPersonel: Personel = {
  id: 0,
  name: '',
  tc: '',
  insuranceNo: '',
  birthPlace: '',
  birthDate: dayjs(),
  sex: '',
  residenceAddress: '',
  maritalStatus: '',
  graduation: '',
  graduationDepartment: '',
  email: '',
  phone: '',
  startDate: dayjs(),
  title: '',
  department: '',
  manager: '',
}

type DocRow = {
  id: number
  type: string    // örn. "kimlik"
  label: string   // örn. "Kimlik Bilgileri"
  file: File
}

export const EmployeeRegistration = () => {
  // form state & validation errors
  const { enqueueSnackbar } = useSnackbar();
  const [post, setPost] = useState<Personel>(initialPersonel);
  const [errors, setErrors] = useState<Partial<Record<keyof Personel, boolean>>>({})
  const [data, setData] = useState<Personel[]>([])
  const [gridDisplayCase, setGridDisplayCase] = useState<string>('accordionClose');
  const [gridCount, setGridCount] = useState<number>(12);
  const theme = useTheme()
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'))
  const [dialogOpen, setDialogOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({})
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documentType, setDocumentType] = useState<string>('');
  const [documentError, setDocumentError] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingDocId, setEditingDocId] = useState<number | null>(null)
  const [uploadedDocs, setUploadedDocs] = useState<DocRow[]>([])
  const [missingDialogOpen, setMissingDialogOpen] = useState(false);
  const [missingDocs, setMissingDocs] = useState<string>('');

  const documentOptions = [
  { value: 'kimlik',    label: 'Kimlik Bilgileri' },
  { value: 'ehliyet',   label: 'Ehliyet Bilgileri' },
  { value: 'adli',      label: 'Adli Sicil Soruşturma Kaydı' },
  { value: 'mezuniyet',   label: 'Mezuniyet Belgesi' },
  { value: 'ikametgah',  label: 'İkametgah Belgesi' },
  { value: 'askerlik',  label: 'Askerlik Belgesi' },
  { value: 'fotograf',  label: 'Fotoğraf' },
  { value: 'diger',  label: 'Diğer' },
]

// const requiredTypes = documentOptions
//   .filter((o) => o.value !== 'diger')
//   .map((o) => o.value);

  //Başladııııığ

  // const [initialRowId, setInitialRowId] = useState<string | null>(null)
  // veri çekme
  const fetchData = async () => {
    try {
      const res = await axios.get<Personel[]>('http://localhost:5000/api/data')
      const normalized = res.data.map((row) => ({
        ...row,
        name: row.name?.toLocaleUpperCase('tr') ?? '',
        tc:row.tc?.toLocaleUpperCase('tr') ?? '',
        insuranceNo: row.insuranceNo?.toLocaleUpperCase('tr') ?? '',
        birthPlace:  row.birthPlace?.toLocaleUpperCase('tr') ?? '',
        sex:row.sex?.toLocaleUpperCase('tr') ?? '',
        residenceAddress: row.residenceAddress?.toLocaleUpperCase('tr') ?? '',
        maritalStatus:row.maritalStatus?.toLocaleUpperCase('tr') ?? '',
        graduation:row.graduation?.toLocaleUpperCase('tr') ?? '',
        graduationDepartment:
        row.graduationDepartment?.toLocaleUpperCase('tr') ?? '',
        email: row.email?.toLocaleLowerCase('tr') ?? '',
        phone: row.phone ?? '',
        title:row.title?.toLocaleUpperCase('tr') ?? '',
        department:row.department?.toLocaleUpperCase('tr') ?? '',
        manager:row.manager?.toLocaleUpperCase('tr') ?? '',
      // Tarihler hep Dayjs olsun, null’a izin vermeyin:
        birthDate: dayjs(row.birthDate),
        startDate: dayjs(row.startDate),

      }))
      setData(normalized)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files?.length) return;
  const file = files[0];

  // 1) Uzantı kontrolü
  const ext = file.name.split('.').pop()!.toLowerCase();
  const allowed = (docAcceptMap[documentType] || '')
    .split(',')
    .map((a) => a.replace('.', '').toLowerCase());
  if (!allowed.includes(ext)) {
    setFileError(
      `Lütfen ${allowed.map((x) => '.' + x).join(', ')} uzantılı dosya seçin.`
    );
    setSelectedFile(null);
    return;
  }

  // Geçerli dosya: önce hata mesajını temizle
  setFileError(null);
  setSelectedFile(file);

  // 2) Seçilen tipin label’ını bul
  const opt = documentOptions.find((o) => o.value === documentType)!;

  // 3) Ya ekle ya güncelle
  if (editingDocId != null) {
    // Güncelleme modu
    setUploadedDocs((prev) =>
      prev.map((doc) =>
        doc.id === editingDocId
          ? { ...doc, file, label: opt.label }
          : doc
      )
    );
    setEditingDocId(null);
  } else {
    // Yeni ekleme
    const newRow: DocRow = {
      id: uploadedDocs.length + 1,
      type: documentType,
      label: opt.label,
      file,
    };
    setUploadedDocs((prev) => [...prev, newRow]);
    setDocumentType('');
    setDocumentError(false);
  }

  // Aynı input’dan tekrar seçmesi için value’yu sıfırla
  e.target.value = '';
};

// const handleDocumentTypeChange = (e: SelectChangeEvent<string>) => {
//     setDocumentType(e.target.value)
//   };



  const handleUploadClick = () => {
  // eğer evrak türü seçilmediyse
  if (!documentType) {
    setDocumentError(true);
    return;             // buradan devam etme, file-picker'a geçme
  }
  // hata yoksa ancak bu satır çağrılacak
  fileInputRef.current?.click()
};

const handleReplaceClick = (id: number, typeValue: string) => {
  setEditingDocId(id);
  // ① documentType’ı da güncelle
  setDocumentType(typeValue);
  // ② accept ayarını input’a yine de yaz
  fileInputRef.current!.accept = docAcceptMap[typeValue];
  fileInputRef.current!.click();
};

const docAcceptMap: Record<string, string> = {
  kimlik:   '.pdf',
  ehliyet:  '.pdf',
  adli:     '.pdf',
  mezuniyet:'.pdf',
  ikametgah: '.pdf',
  askerlik: '.pdf',
  fotograf: '.png,.jpg,.jpeg',
  diger: '.pdf',
};


  
  // tablo kolonları
  const columns = useMemo<MRT_ColumnDef<Personel>[]>(
    () => [
      { accessorKey: 'id', header: 'ID', size: 50 },
      { accessorKey: 'name', header: 'Ad Soyad' },
      { accessorKey: 'tc', header: 'TC' },
      { accessorKey: 'insuranceNo', header: 'Sigorta Sicil No' },
      { accessorKey: 'birthPlace', header: 'Doğum Yeri' },
      { accessorKey: 'birthDate', header: 'Doğum Tarihi', size:150, Cell:({cell})=>{
        const raw = cell.getValue() as Date | string;
        const dt = raw instanceof Date ? raw : new Date(raw);
        return dt.toLocaleDateString('tr-TR'); // "22.5.2025" gibi
      } },
      { accessorKey: 'sex', header: 'Cinsiyet' },
      { accessorKey: 'residenceAddress', header: 'İkamet Adresi' },
      { accessorKey: 'maritalStatus', header: 'Medeni Durum' },
      { accessorKey: 'graduation', header: 'Mezuniyet' },
      { accessorKey: 'graduationDepartment', header: 'Mez. Bölüm' },
      { accessorKey: 'email', header: 'E-mail' },
      { accessorKey: 'phone', header: 'Telefon' },
      { accessorKey: 'startDate', header: 'Başlama Tarihi', size:150, Cell:({cell})=>{
        const raw = cell.getValue() as Date | string;
        const dt = raw instanceof Date ? raw : new Date(raw);
        return dt.toLocaleDateString('tr-TR'); // "22.5.2025" gibi
      }},
      { accessorKey: 'title', header: 'Ünvan' },
      { accessorKey: 'department', header: 'Departman' },
      { accessorKey: 'manager', header: 'Yönetici' },
      { accessorKey: 'docs', header: 'Dosya Yolu' },
    ],
    [],
  )

  const table = useMaterialReactTable<Personel>({
  columns,
  data,
  enableRowSelection: true,

  // üstteki seçili satır banner’ını kaldırıyoruz
  renderToolbarAlertBannerContent: () => null,

  // üst toolbar için senin yazdığın Düzenle / İşten Ayrılış / Dışa Aktar butonları
  renderTopToolbarCustomActions: ({ table }) => {
    const selectedCount = table.getSelectedRowModel().rows.length;
    if (selectedCount === 0) return null;
    const firstRow = table.getSelectedRowModel().rows[0];
    const rows = table.getSelectedRowModel().rows;

    const handleEdit = () => {
      if (rows.length > 1) {
        // iki veya daha fazla satır seçiliyse dialog aç
        setDialogOpen(true);
      } else {
        // tek satır seçildiyse formu doldur
        const original = firstRow.original;
        setPost(original);
        setErrors({});
        setIsEditing(true);
        setEditingId(original.id);
      }
    };

    const handleExport = () => {
  const selectedRows = table.getSelectedRowModel().rows;
  if (!selectedRows.length) return;

  const visibleColumns = table
    .getAllColumns()
    .filter((col) => col.getIsVisible() && col.id !== 'mrt-row-select');
  const headers = visibleColumns.map((col) => col.columnDef.header as string);

  // 1) Veriyi normalize ederken Dayjs objelerini JS Date objesine dönüştürüyoruz
  const dataToExport = selectedRows.map((row) => {
    const obj: Record<string, any> = {};
    visibleColumns.forEach((col) => {
      const key = col.id as keyof Personel;
      const val = row.original[key];
      // Eğer Dayjs objesi ise JS Date olarak yaz
      if (dayjs.isDayjs(val)) {
        obj[col.columnDef.header as string] = val.toDate();
      } else {
        obj[col.columnDef.header as string] = val;
      }
    });
    return obj;
  });

  // 2) Sheet ve Workbook oluştur
  const ws = XLSX.utils.json_to_sheet(dataToExport, {
    header: headers,
    cellDates: true,           // burada tarih objelerini Date olarak tut
    dateNF: 'dd.MM.yyyy',      // Excel'de biçim
  });

  // 3) Header'ları kalınlaştır (önceki cevapta gösterildi)
  headers.forEach((_, colIdx) => {
    const cell = XLSX.utils.encode_cell({ r: 0, c: colIdx });
    if (!ws[cell]) return;
    ws[cell].s = ws[cell].s || {};
    ws[cell].s.font = { bold: true };
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'SeçiliKayıtlar');
  XLSX.writeFile(wb, 'Seçili_Personel_Kayıtları.xlsx');
};

    return (
      <Box
        display="flex"
        flexDirection={{ md: 'row' }} // md ve üstü yatay, xs–sm hepsi aynı hizada
        alignItems="center"
        gap={1}
      >
        {isMdDown ? (
          <IconButton color="primary" onClick={handleEdit}>
            <EditNoteOutlinedIcon />
          </IconButton>
        ) : (
          <Button
            color="primary"
            variant="outlined"
            startIcon={<EditNoteOutlinedIcon />}
            onClick={handleEdit}
          >
            Düzenle
          </Button>
        )}

        {isMdDown ? (
          <IconButton
            color="error"
            onClick={() => {
              console.log('İşten ayrılacak satırlar:', rows);
            }}
          >
            <PersonRemoveAlt1Icon />
          </IconButton>
        ) : (
          <Button
            color="error"
            variant="outlined"
            startIcon={<PersonRemoveAlt1Icon />}
            onClick={() => {
              console.log('İşten ayrılacak satırlar:', rows);
            }}
          >
            İşten Ayrılış
          </Button>
        )}

        {isMdDown ? (
          <IconButton
            color="secondary"
            onClick={handleExport}
          >
            <FileDownloadOutlinedIcon />
          </IconButton>
        ) : (
          <Button
            color="secondary"
            variant="outlined"
            startIcon={<FileDownloadOutlinedIcon />}
            onClick={handleExport}
          >
            Dışa Aktar
          </Button>
        )}
      </Box>
    );
  },

  // **yenilik**: sayfanın en altındaki toolbar’a toplam kayıt sayısını yazdırıyoruz
  renderBottomToolbarCustomActions: ({ table }) => {
    // filtrelenmiş + pagination sonrası / tüm satır sayısı:
    const count = table.getFilteredRowModel().rows.length;
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          flex: '1 1 auto', // pagination’ı sıkıştırmadan yanına yerleşsin
        }}
      >
        <Typography variant="body1">
          Toplam Kayıt Sayısı: {count}
        </Typography>
      </Box>
    );
  },

  // row-selection state’i
  onRowSelectionChange: (newSelection) => {
    setRowSelection(newSelection);
    // eğer hiç seçim kalmadıysa formu resetle
    if (Object.keys(newSelection).length === 0) {
      setPost(initialPersonel);
      setErrors({});
      setIsEditing(false);
      setEditingId(null);
    }
  },
  state: { rowSelection },

  // pagination props’ları
  muiPaginationProps: {
    color: 'primary',
    shape: 'rounded',
    showRowsPerPage: false,
    variant: 'outlined',
  },
  paginationDisplayMode: 'pages',
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

  // alan değeri değiştiğinde güncelle
  const handleChange = <K extends keyof Personel>(
  key: K,
  value: Personel[K]
) => {
  const formatted = 
    typeof value === 'string'
      ? key === 'email'
        ? (value as string).toLocaleLowerCase('tr-TR')   // sadece email küçült
        : (value as string).toLocaleUpperCase('tr-TR')               // diğerleri olduğu gibi kalsın
      : value;                // Date vs.

  setPost(prev => ({ ...prev, [key]: formatted as Personel[K] }));
};
  // validasyon
  const validate = () => {
    const newErr: Partial<Record<keyof Personel, boolean>> = {
      name: post.name.trim() === '',
      tc: post.tc.trim() === '',
      insuranceNo: post.insuranceNo.trim() === '',
      birthPlace: post.birthPlace.trim() === '',
      birthDate: !dayjs(post.birthDate).isValid(),
      sex: post.sex.trim() === '',
      residenceAddress: post.residenceAddress.trim() === '',
      maritalStatus: post.maritalStatus.trim() === '',
      graduation: post.graduation.trim() === '',
      graduationDepartment: post.graduationDepartment.trim() === '',
      email: post.email.trim() === '',
      phone: post.phone.trim() === '',
      startDate: !dayjs(post.startDate).isValid(),
      title: post.title.trim() === '',
      department: post.department.trim() === '',
      manager: post.manager.trim() === '',
    }
    setErrors(newErr)
    return Object.values(newErr).every(err => err === false);
  }
  // form submit
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // 1) Personel form validasyonu
  if (!validate()) return;

  const normalizedPost: Personel = {
    ...post,
    name:              post.name.trim().toLocaleUpperCase('tr'),
    tc:                post.tc.trim(),
    insuranceNo:       post.insuranceNo.trim(),
    birthPlace:        post.birthPlace.trim().toLocaleUpperCase('tr'),
    birthDate:         post.birthDate,
    sex:               post.sex.trim(),
    residenceAddress:  post.residenceAddress.trim(),
    maritalStatus:     post.maritalStatus.trim(),
    graduation:        post.graduation.trim().toLocaleUpperCase('tr'),
    graduationDepartment: post.graduationDepartment.trim().toLocaleUpperCase('tr'),
    email:             post.email.trim(),
    phone:             post.phone.trim(),
    startDate:         post.startDate,
    title:             post.title.trim().toLocaleUpperCase('tr'),
    department:        post.department.trim().toLocaleUpperCase('tr'),
    manager:           post.manager.trim().toLocaleUpperCase('tr'),
    // ileride backend’in beklediği başka alanlar varsa onları da ekleyin
  };

  // 2) “Diğer” hariç tüm tipleri al
  const requiredTypes = documentOptions
    .filter((o) => o.value !== 'diger')
    .map((o) => o.value);

  // 3) Tabloya eklenen tiplerin listesi
  const addedTypes = uploadedDocs.map((d) => d.type);

  // 4) Eksikleri tespit et
  const missing = requiredTypes.filter((t) => !addedTypes.includes(t));
  if (missing.length > 0) {
    // eksik varsa dialog’ı aç
    setMissingDocs(
      documentOptions
        .filter((o) => missing.includes(o.value))
        .map((o) => o.label)
        .join(', ')
    );
    setMissingDialogOpen(false); // evrak kontrolü kapatıldı
    //return;
  }

  // 5) Tüm evrak tamamsa önce FormData ile dosyaları yükle
  try {
    const fd = new FormData();
    uploadedDocs.forEach((d, idx) => {
      fd.append('files', d.file, d.file.name);
      // metadata olarak tip ve label de ekleyelim
      fd.append(`meta[${idx}][type]`, d.type);
      fd.append(`meta[${idx}][label]`,   d.label);
    });
    // opsiyonel: personelId veya başka alanlar da ekleyebilirsiniz
    fd.append('personelId', String(editingId ?? 0));

    // dosyaları yükle, backend array<string> dönecek: ["uploads/kimlik.pdf", ...]
    const { data: uploadedPaths } = await axios.post<string[]>(
      'http://localhost:5000/api/upload-docs',
      fd,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    const docEntries: DocEntry[] = uploadedPaths.map((path, i) => ({
      typeValue: uploadedDocs[i].type,
      label:     uploadedDocs[i].label,
      path,
    }));

    const personelPayload: Personel = {
      ...normalizedPost,
      docs: docEntries,
    };

    // 7) Kayıt veya güncelleme isteği
    if (isEditing && editingId != null) {
      await axios.put(`/api/data/${editingId}`, personelPayload);
      enqueueSnackbar('Personel güncellendi!', { variant: 'success' });
    } else {
      await axios.post(`/api/data`, personelPayload);
      enqueueSnackbar('Personel oluşturuldu!',  { variant: 'success' });
    }

    // 8) Temizle, yenile, vs.
    setPost(initialPersonel);
    setUploadedDocs([]);
    setIsEditing(false);
    setEditingId(null);
    table.resetRowSelection?.();
    await fetchData();

  } catch (err) {
    console.error(err);
    enqueueSnackbar('Bir hata oluştu!', { variant: 'error' });
  }
};


  return (
    <div className='mainDiv'>
      <NavBar accordionClasss={accordionClasss} />
      <Box sx={{ flexGrow: 1, mt: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 2 }}>
            <Accordions accordionDisplay={gridDisplayCase} />
          </Grid>
          <Grid size={{ xs: 12, sm: 10, md: gridCount}}>
            <Typography variant='h6' className='mainHeader' sx={{ mb: 3 }}>
              Personel Kayıt
            </Typography>

            <form onSubmit={handleSubmit} className='formClass'>
              {/* Ad Soyad */}
              <TextField
                name='name'
                label='Ad Soyad'
                value={post.name ?? ''}
                onChange={(e) => handleChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name ? 'Zorunlu alan' : ''}
                sx={{ mb: 1.5, mr: 1.5, width: 220 }}
              />
              {/* TC No */}
              <TextField
                name='tc'
                label='TC No'
                value={post.tc ?? ''}
                onChange={(e) => handleChange('tc', e.target.value)}
                error={!!errors.tc}
                helperText={errors.tc ? 'Zorunlu alan' : ''}
                sx={{ mb: 1.5, mr: 1.5, width: 220 }}
              />
              {/* Sigorta Sicil No */}
              <TextField
                name='insuranceNo'
                label='Sigorta Sicil No'
                value={post.insuranceNo ?? ''}
                onChange={(e) => handleChange('insuranceNo', e.target.value)}
                error={!!errors.insuranceNo}
                helperText={errors.insuranceNo ? 'Zorunlu alan' : ''}
                sx={{ mb: 1.5, mr: 1.5, width: 220 }}
              />
              {/* Doğum Yeri */}
              <TextField
                name='birthPlace'
                label='Doğum Yeri'
                value={post.birthPlace ?? ''}
                onChange={(e) => handleChange('birthPlace', e.target.value)}
                error={!!errors.birthPlace}
                helperText={errors.birthPlace ? 'Zorunlu alan' : ''}
                sx={{ mb: 1.5, mr: 1.5, width: 220 }}
              />
              {/* Doğum Tarihi */}
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
                <DatePicker
                  label="Doğum Tarihi"
                  value={dayjs(post.birthDate ?? dayjs())}
                  onChange={(d) => handleChange('birthDate', d!)}
                  slots={{ textField: TextField }}
                  slotProps={{ textField: { error: !!errors.birthDate, helperText: errors.birthDate ? 'Zorunlu alan' : '', sx: { mb: 1.5, mr: 1.5, width: 220 },
                },
              }}
              />
              </LocalizationProvider>
              {/* Cinsiyet */}
              <FormControl sx={{ mb: 1.5, mr: 1.5, width: 220 }} error={!!errors.sex}>
                <InputLabel>Cinsiyet</InputLabel><Select
                  value={post.sex ?? ''}
                  label='Cinsiyet'
                  onChange={(e) => handleChange('sex', e.target.value)}>
                  <MenuItem value=''><em>Seçiniz</em></MenuItem>
                  <MenuItem value='ERKEK'>ERKEK</MenuItem>
                  <MenuItem value='KADIN'>KADIN</MenuItem>
                </Select><FormHelperText>{errors.sex ? 'Zorunlu alan' : ''}</FormHelperText>
              </FormControl>
              <TextField
                name='residenceAddress'
                label='İkamet Adresi'
                value={post.residenceAddress ?? ''}
                onChange={(e) => handleChange('residenceAddress', e.target.value)}
                error={!!errors.residenceAddress}
                helperText={errors.residenceAddress ? 'Zorunlu alan' : ''}
                sx={{ mb: 1.5, mr: 1.5, width: 220 }}
              />
              {/* Medeni Durum */}
              <FormControl sx={{ mb: 1.5, mr: 1.5, width: 220 }} error={!!errors.maritalStatus}>
                <InputLabel>Medeni Durum</InputLabel><Select
                  value={post.maritalStatus ?? ''}
                  label='Medeni Durum'
                  onChange={(e) => handleChange('maritalStatus', e.target.value)}>
                  <MenuItem value=''><em>Seçiniz</em></MenuItem>
                  <MenuItem value='BEKAR'>BEKAR</MenuItem>
                  <MenuItem value='EVLİ'>EVLİ</MenuItem>
                </Select><FormHelperText>{errors.maritalStatus ? 'Zorunlu alan' : ''}</FormHelperText>
              </FormControl>
              {/* Mezuniyet */}
              <FormControl sx={{ mb: 1.5, mr: 1.5, width: 220 }} error={!!errors.graduation}>
                <InputLabel>Mezuniyet</InputLabel><Select
                  value={post.graduation ?? ''}
                  label='Mezuniyet'
                  onChange={(e) => handleChange('graduation', e.target.value)}>
                  <MenuItem value=''><em>Seçiniz</em></MenuItem>
                  <MenuItem value='ORTA OKUL'>ORTA OKUL</MenuItem>
                  <MenuItem value='LİSE'>LİSE</MenuItem>
                  <MenuItem value='ÖNLİSANS'>ÖNLİSANS</MenuItem>
                  <MenuItem value='LİSANS'>LİSANS</MenuItem>
                  <MenuItem value='YÜKSEK LİSANS'>YÜKSEK LİSANS</MenuItem>
                  <MenuItem value='DOKTORA'>DOKTORA</MenuItem>
                </Select><FormHelperText>{errors.graduation ? 'Zorunlu alan' : ''}</FormHelperText>
              </FormControl>
              {/* Mezuniyet Bölüm */}
              <TextField
                name='graduationDepartment'
                label='Mezuniyet Bölüm'
                value={post.graduationDepartment ?? ''}
                onChange={(e) => handleChange('graduationDepartment', e.target.value)}
                error={!!errors.graduationDepartment}
                helperText={errors.graduationDepartment ? 'Zorunlu alan' : ''}
                sx={{ mb: 1.5, mr: 1.5, width: 220 }}
              />
              {/* Email */}
              <TextField
                name='email'
                label='E-mail'
                value={post.email ?? ''}
                onChange={(e) => handleChange('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email ? 'Zorunlu alan' : ''}
                sx={{ mb: 1.5, mr: 1.5, width: 220 }}
              />
              {/* Telefon */}
              <TextField
                name='phone'
                label='Telefon'
                value={post.phone ?? ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                error={!!errors.phone}
                helperText={errors.phone ? 'Zorunlu alan' : ''}
                sx={{ mb: 1.5, mr: 1.5, width: 220 }}
              />
              {/* İşe Başlama Tarihi */}
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
                <DatePicker
                  label='İşe Başlama Tarihi'
                   value={dayjs(post.startDate ?? dayjs())}
                  onChange={(d) => handleChange('startDate', d!)}
                  slots={{ textField: TextField }}
                  slotProps={{ textField: { error: !!errors.startDate, helperText: errors.startDate ? 'Zorunlu alan' : '', sx: { mb: 1.5, mr: 1.5, width: 220 }, 
                },
              }}
              />
              </LocalizationProvider>
              {/* Ünvan */}
              <FormControl sx={{ mb: 1.5, mr: 1.5, width: 220 }} error={!!errors.title}>
                <InputLabel>Ünvan</InputLabel><Select
                  value={post.title ?? ''}
                  label='Ünvan'
                  onChange={(e) => handleChange('title', e.target.value)}>
                  <MenuItem value=''><em>Seçiniz</em></MenuItem>
                  <MenuItem value='CEO'>CEO</MenuItem>
                  <MenuItem value='DİREKTÖR'>DİREKTÖR</MenuItem>
                  <MenuItem value='MÜDÜR'>MÜDÜR</MenuItem>
                  <MenuItem value='MÜDÜR YARDIMCISI'>MÜDÜR YARDIMCISI</MenuItem>
                  <MenuItem value='MÜHENDİS'>MÜHENDİS</MenuItem>
                  <MenuItem value='ŞEF'>ŞEF</MenuItem>
                  <MenuItem value='UZMAN'>UZMAN</MenuItem>
                  <MenuItem value='TEKNİKER'>TEKNİKER</MenuItem>
                  <MenuItem value='TEKNİSYEN'>TEKNİSYEN</MenuItem>
                  <MenuItem value='GÜVENLİK'>GÜVENLİK</MenuItem>
                  <MenuItem value='HİZMETLİ'>HİZMETLİ</MenuItem>
                  <MenuItem value='ŞOFÖR'>ŞOFÖR</MenuItem>
                  <MenuItem value='STAJYER'>STAJYER</MenuItem>
                </Select><FormHelperText>{errors.title ? 'Zorunlu alan' : ''}</FormHelperText>
              </FormControl>
              {/* Departman */}
              <FormControl sx={{ mb: 1.5, mr: 1.5, width: 220 }} error={!!errors.department}>
                <InputLabel>Departman</InputLabel><Select
                  value={post.department ?? ''}
                  label='Departman'
                  onChange={(e) => handleChange('department', e.target.value)}>
                  <MenuItem value=''><em>Seçiniz</em></MenuItem>
                  <MenuItem value='YÖNETİM'>YÖNETİM</MenuItem>
                  <MenuItem value='İNSAN KAYNAKLARI'>İNSAN KAYNAKLARI</MenuItem>
                  <MenuItem value='AR-GE'>AR-GE</MenuItem>
                  <MenuItem value='ÜRETİM'>ÜRETİM</MenuItem>
                  <MenuItem value='PAZARLAMA'>PAZARLAMA</MenuItem>
                  <MenuItem value='SATIN ALMA'>SATIN ALMA</MenuItem>
                  <MenuItem value='ATÖLYE'>ATÖLYE</MenuItem>
                  <MenuItem value='SAHA BAKIM ONARIM'>SAHA BAKIM ONARIM</MenuItem>
                  <MenuItem value='PLANLAMA VE ANALİZ'>PLANLAMA VE ANALİZ</MenuItem>
                  <MenuItem value='DEPO'>DEPO</MenuItem>
                  <MenuItem value='İDARİ İŞLER'>İDARİ İŞLER</MenuItem>
                  <MenuItem value='ULAŞTIRMA'>ULAŞTIRMA</MenuItem>
                </Select><FormHelperText>{errors.department ? 'Zorunlu alan' : ''}</FormHelperText>
              </FormControl>
              {/* Yönetici */}
              <FormControl sx={{ mb: 1.5, mr: 1.5, width: 220 }} error={!!errors.manager}>
                <InputLabel>Yönetici</InputLabel><Select
                  value={post.manager ?? ''}
                  label='Yönetici'
                  onChange={(e) => handleChange('manager', e.target.value)}>
                  <MenuItem value=''><em>Seçiniz</em></MenuItem>
                  <MenuItem value='İRFAN FAZLA'>İRFAN FAZLA</MenuItem>
                </Select><FormHelperText>{errors.manager ? 'Zorunlu alan' : ''}</FormHelperText>
              </FormControl>
              {/* Evrak Türü ve Dosya Yükleme - 2. Satır */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2,width: '100%'}}>
                <Box sx={{ width: 300 }}>
                  <FormControl fullWidth error={documentError}>
      <InputLabel id="doc-type-label">Evrak Türü</InputLabel>
      <Select
    labelId="doc-type-label"
    id="document-type"
    value={documentType}
    label="Evrak Türü"
    onChange={(e) => {
      setDocumentType(e.target.value)
      if (e.target.value) setDocumentError(false)
    }}
  >
    {documentOptions.map((opt) => {
      // tabloya ekli mi?
      const alreadyAdded = uploadedDocs.some(
        (doc) => doc.type === opt.value
      )
      // sadece 'diger' her zaman aktif kalsın
      const alwaysActive = opt.value === 'diger'
      return (
        <MenuItem
          key={opt.value}
          value={opt.value}
          disabled={alreadyAdded && !alwaysActive}
        >
          {opt.label}
        </MenuItem>
      )
    })}
  </Select>
      {documentError && (
    <FormHelperText>
      Lütfen öncelikle Evrak Türü seçiniz.
    </FormHelperText>
  )}
    </FormControl>
             <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
      <input
  type="file"
  
  ref={fileInputRef}
  accept={docAcceptMap[documentType] || ''}
  style={{ display: 'none' }}
  onChange={handleFileChange}
/>
      <label htmlFor="document-upload">
        <Button  startIcon={<AttachFileOutlinedIcon />} variant="outlined" component="span" onClick={handleUploadClick}>
          Evrak Yükle
        </Button>
      </label>
      {selectedFile && (
        <Typography sx={{ ml: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {selectedFile.name}
        </Typography>
      )}
    </Box>
                </Box>
              </Box>
              <TableContainer component={Paper} sx={{ mt: 3, width: 400, maxWidth: '100%', overflowX: 'auto'}} >
        <Table size="small" aria-label="uploaded docs table">
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Evrak Türü</TableCell>
              <TableCell>Görüntüle</TableCell>
              <TableCell>Değiştir</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
      {uploadedDocs.map((doc) => (
        <TableRow key={doc.id}>
          <TableCell sx={{ p: 0.5 }}>{doc.id}</TableCell>
          {/* Burada artık value değil, label gösteriyoruz */}
          <TableCell sx={{ p: 0.5 }}>{doc.label}</TableCell>
          <TableCell sx={{ p: 0.5 }}>
            <Button
              size="small"
              onClick={() => {
                // değiştirirken aynı label/value çiftini yeniden kullanabilirsiniz
                window.open(URL.createObjectURL(doc.file), '_blank')
              }}
            >
              Görüntüle
            </Button>
          </TableCell>
          <TableCell sx={{ p: 0.5 }}>
            <Button
              size="small"
              onClick={() => handleReplaceClick(doc.id, doc.type)}>
              DEĞİŞTİR
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
        </Table>
      </TableContainer>
              {/* Kaydet Butonu */}
              <Box sx={{ width: '100%', textAlign: 'center', mt: 2 }}>
                <Button type='submit' variant='contained' startIcon={<SaveOutlinedIcon/> } onClick={handleSubmit}>
                  Kaydet
                </Button>
                {/* Eksik evrak dialogu */}
                <Dialog
                  open={missingDialogOpen}
                  onClose={() => setMissingDialogOpen(false)}
                  >
                    <DialogTitle>Eksik Evrak</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Lütfen önce şu evrakları ekleyin: <b>{missingDocs}</b>
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={() => setMissingDialogOpen(false)}>Tamam</Button>
                          </DialogActions>
                          </Dialog>
                          </Box>
                          </form>
            {/* Tablo */}
            <Box sx={{ mt: 4 }}>  
              <MaterialReactTable table={table}/>
            </Box>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
              <DialogTitle>Seçim Hatası</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  İki veya daha fazla kayıt, düzenlenmek için aynı anda seçilemez.
                  Sadece bir kayıt seçerek işlemlerinize devam ediniz.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
              <Button
                onClick={() => {
            setDialogOpen(false)
            table.resetRowSelection();
            setPost(initialPersonel);
            setErrors({});
          }}
                  autoFocus
                  >
                    Tamam
              </Button>
              </DialogActions>
            </Dialog>
            <Dialog open={!!fileError} onClose={() => setFileError(null)}>
              <DialogTitle>Geçersiz Dosya</DialogTitle>
              <DialogContent>
                <DialogContentText>{fileError}</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setFileError(null)}>Tamam</Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
      </Box>
    </div>
  )
}
