import express, { Request, Response } from 'express';
import sql from 'mssql';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MSSQL Configuration
const dbConfig: sql.config = {
  user: 'sa',
  password: '1',
  server: '192.168.5.11', // Replace with your server
  database: 'DataTekjen',
  port:1433,
  options: {
        trustedConnection: false, // Set to true if using Windows Authentication
        trustServerCertificate: true, // Set to true if using self-signed certificates
  },
};

// Connect to Database
let pool: sql.ConnectionPool;

sql.connect(dbConfig)
  .then((connection) => {
    pool = connection;
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });

// API to Get Data
app.get('/api/data', async (req: Request, res: Response) => {
  try {
    const result = await pool.request().query('exec EmployeeList');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});

// API to Add Data
app.post('/api/data', async (req, res) => {
  const {
    name,
    tc,
    insuranceNo,
    birthPlace,
    birthDate,
    sex,
    residenceAddress,
    maritalStatus,
    email,
    phone,
    startDate,
    title,
    department,
    manager,
    graduation,
    graduationDepartment
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
      .execute('EmployeeAdd');            // ← burada SP tetikleniyor

    // dilersen sadece etkilenen satır sayısını dön:
    res.status(201).json({ rowsAffected: result.rowsAffected });
  } catch (error) {
    console.error('Error adding data:', error);
    res.status(500).send('Error adding data');
  }
});

app.put('/api/data/:id', async (req, res) => {
  const {
    name,
    tc,
    insuranceNo,
    birthPlace,
    birthDate,
    sex,
    residenceAddress,
    maritalStatus,
    email,
    phone,
    startDate,
    title,
    department,
    manager,
    graduation,
    graduationDepartment
  } = req.body;

  const { id } = req.params;
  try {
    const result = await pool
      .request()
      .input('id',sql.Int,id)
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
      .execute('EmployeeUpdate');            // ← burada SP tetikleniyor

    // dilersen sadece etkilenen satır sayısını dön:
    res.status(201).json({ rowsAffected: result.rowsAffected });
  } catch (error) {
    console.error('Error update data:', error);
    res.status(500).send('Error update data');
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
