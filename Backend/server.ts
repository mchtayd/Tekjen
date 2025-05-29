import express, { Request, Response } from 'express';
import sql, { MAX } from 'mssql';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const port = 5000;



// --- MIDDLEWARES ---
app.use(cors());
app.use(bodyParser.json());

// “Uploads” klasörünü yoksa oluştur
const uploadDir = path.join(__dirname, 'Uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Statik serve: http://localhost:5000/uploads/filename.pdf gibi erişim için
app.use('/uploads', express.static(uploadDir));

// --- MULTER CONFIG ---
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    // Çakışmayı önlemek için başına timestamp ekliyoruz
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // yalnızca PDF/JPEG/PNG’ye izin
  const allowed = ['application/pdf','image/jpeg','image/png'];
  if (allowed.includes(file.mimetype)) {
    // kabul et
    cb(null, true);
  } else {
    // reddet (hata fırlatmak yerine sadece false döndürür)
    cb(null, false);
  }
};

const upload = multer({ storage, fileFilter });

// --- MSSQL CONFIGURATION ---
const dbConfig: sql.config = {
  user: 'sa',
  password: '1',
  server: '192.168.5.11',
  database: 'DataTekjen',
  port: 1433,
  options: {
    trustedConnection: false,
    trustServerCertificate: true,
  },
};

let pool: sql.ConnectionPool;
sql.connect(dbConfig)
  .then((connection) => {
    pool = connection;
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });

// --- ROUTES ---

// 1) Personel liste
app.get('/api/data', async (_req: Request, res: Response) => {
  try {
    const result = await pool.request().query('exec EmployeeList');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching data');
  }
});

// 2) Personel ekle
app.post('/api/data', upload.single('file'), async (req: Request, res: Response) => {
  // debugger;
  // const filePath = req.file
  //     ? `/uploads/${req.file.filename}`
  //     : null;
  const {
    name, tc, insuranceNo, birthPlace, birthDate,
    sex, residenceAddress, maritalStatus, email, phone,
    startDate, title, department, manager,
    graduation, graduationDepartment,filePath
  } = req.body;
  try {
    const result = await pool
      .request()
      .input('name', sql.VarChar(50), name)
      .input('tc', sql.VarChar(50), tc)
      .input('insuranceNo', sql.VarChar(50), insuranceNo)
      .input('birthPlace', sql.VarChar(50), birthPlace)
      .input('birthDate', sql.Date, birthDate)
      .input('sex', sql.VarChar(50), sex)
      .input('residenceAddress', sql.VarChar(sql.MAX), residenceAddress)
      .input('maritalStatus', sql.VarChar(50), maritalStatus)
      .input('email', sql.VarChar(50), email)
      .input('phone', sql.VarChar(50), phone)
      .input('startDate', sql.Date, startDate)
      .input('title', sql.VarChar(50), title)
      .input('department', sql.VarChar(50), department)
      .input('manager', sql.VarChar(50), manager)
      .input('graduation', sql.VarChar(50), graduation)
      .input('graduationDepartment', sql.VarChar(100), graduationDepartment)
      .input('filePath', sql.VarChar(MAX), filePath)
      .execute('EmployeeAdd');

    res.status(201).json({ rowsAffected: result.rowsAffected });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding data');
  }
});

// 3) Personel güncelle
app.put('/api/data/:id', upload.single('file'), async (req: Request, res: Response) => {
  const {
    name, tc, insuranceNo, birthPlace, birthDate,
    sex, residenceAddress, maritalStatus, email, phone,
    startDate, title, department, manager,
    graduation, graduationDepartment,filePath
  } = req.body;
  const { id } = req.params;

  try {
    const result = await pool
      .request()
      .input('id', sql.Int, parseInt(id, 10))
      .input('name', sql.VarChar(50), name)
      .input('tc', sql.VarChar(50), tc)
      .input('insuranceNo', sql.VarChar(50), insuranceNo)
      .input('birthPlace', sql.VarChar(50), birthPlace)
      .input('birthDate', sql.Date, birthDate)
      .input('sex', sql.VarChar(50), sex)
      .input('residenceAddress', sql.VarChar(sql.MAX), residenceAddress)
      .input('maritalStatus', sql.VarChar(50), maritalStatus)
      .input('email', sql.VarChar(50), email)
      .input('phone', sql.VarChar(50), phone)
      .input('startDate', sql.Date, startDate)
      .input('title', sql.VarChar(50), title)
      .input('department', sql.VarChar(50), department)
      .input('manager', sql.VarChar(50), manager)
      .input('graduation', sql.VarChar(50), graduation)
      .input('graduationDepartment', sql.VarChar(100), graduationDepartment)
      .input('filePath', sql.VarChar(sql.MAX), filePath)
      .output('newId', sql.Int)
      .execute('EmployeeUpdate');

    res.json({ rowsAffected: result.rowsAffected });
    const newId = result.output.newId as number;
    res.status(201).json({ id: newId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating data');
  }
});

// 4) Evrak yükleme endpoint’i
//    “files” alanındaki tüm dosyaları Uploads klasörüne atar
//    ve kaydedilen dosya yollarını array olarak döner.
app.post(
  '/api/upload-docs',
  upload.array('files'),
  (req: Request, res: Response) => {
    // req.files tipini garanti altına alalım
    const files = Array.isArray(req.files) ? req.files : [];
    const uploadedPaths = files.map(f => `/uploads/${f.filename}`);
    res.json(uploadedPaths);
  }
);

// --- START SERVER ---
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
