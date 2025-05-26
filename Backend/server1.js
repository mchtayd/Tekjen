const express = require('express');
const sql = require('mssql/msnodesqlv8');
const cors = require('cors');



const app= express();
app.use(cors());

const db = {
    server:"192.168.5.11",
    user:"sa",
    password:"1",
    database:"DataTekjen",
    port:"1433",
    options: {
        trustedConnection: false, // Set to true if using Windows Authentication
        trustServerCertificate: true, // Set to true if using self-signed certificates
        IntegratedSecurity: false,
        PersistSecurityInfo:true
      },
      driver: "msnodesqlv8", // Required if using Windows Authentication
};

(async () => {
    try {
        app.get('/',(re,res) => {
            return res.json('From Backend Side');
        });

        app.get('/users',async (req,res) =>{
            const connection = await sql.connect(db);
            //const result =  await connection.query(`select * from PERSONEL_KAYIT`);
            const result =  await connection.query(`exec EmployeeList`);
            return res.json(result.recordset);
        });

        app.post('/users',async (req,res) =>{
            // const connection = await sql.connect(db);
            console.log(req.bady);
            //const result =  await connection.query(`select * from PERSONEL_KAYIT`);
            // const result =  await connection.query(`exec EmployeeList`);
            // return res.json(result.recordset);
        });

    } catch (err) {
        console.log(err);
        return;
    }

   })()

app.listen(8081, () => {
    console.log('listening');
});
