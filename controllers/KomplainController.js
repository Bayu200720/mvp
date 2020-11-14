import Komplain from './../models/komplain.js';
import express from 'express';
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import Conf from '../config.js';
import User from '../models/user.js';

var komplainRoute = express.Router();

komplainRoute.use(bodyParser.urlencoded({ extended: false }));
komplainRoute.use(bodyParser.json());

//CREATE komplain role custamer
komplainRoute.post('/create', async (req,res) => {

     //header apabila akan melakukan akses
     var token = req.headers['x-access-token'];
     if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
     
     //verifikasi jwt
     jwt.verify(token, Conf.secret, async function(err, decoded) {
         if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
         const user = await User.findById(decoded.id);
         
             if(user.kategori_user === 2){
                 const id=user._id
                console.log(id)
                try {
                    const {judul, detail, ss_gambar} = req.body;
            
                    const komplain = new Komplain({
                        judul,
                        detail,
                        ss_gambar,
                        status:0,
                        id_pengirim:id,
                        id_penerima:"",
                        rating:"",
                    });
            
                    const createKomplain = await komplain.save();
            
                    res.status(201).json(createKomplain);
                } catch (err) {
                    console.log(err)
                    res.status(500).json({ error: 'Komplain creation failed'});
                }   
             } else {
                 
                 res.status(500).send(` Tidak Memiliki Wewenang`);
             }
         })


    
});

//READ Komplain by id user role custamer
komplainRoute.get('/getKomplain', async (req,res) => {
     //header apabila akan melakukan akses
     var token = req.headers['x-access-token'];
     if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
     
     //verifikasi jwt
     jwt.verify(token, Conf.secret, async function(err, decoded) {
         if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
         const user = await User.findById(decoded.id);
             if( user.kategori_user === 2){
                const komplain =  await Komplain.find({"id_user":user._id});

                if(komplain && komplain.length !== 0) {
                    res.json(komplain)
                } else {
                    res.status(404).json({
                        message: 'Komplain not found'
                    });
                }        
             } else {
                 
                 res.status(500).send(`Tidak Memiliki Wewenang`);
             }
         })

   
});


//read komplain status 0 role CS
komplainRoute.get('/komplainDiajukan', async (req,res) => {

    //header apabila akan melakukan akses
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, async function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
          const user = await User.findById(decoded.id);
             if( user.kategori_user === 1){
                const komplain =  await Komplain.find({"status":"0"});

                if(komplain && komplain.length !== 0) {
                    res.json(komplain)
                } else {
                    res.status(404).json({
                        message: 'komplain not found'
                    });
                }
            } else {
                
                res.status(500).send(` Tidak Memiliki Wewenang`);
            }
        })
});


//selesaikan komplain role CS
komplainRoute.put('/baca/:id', async (req,res) => {

    //header apabila akan melakukan akses
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, async function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        const user = await User.findById(decoded.id);
        
            if(user.kategori_user == 1){
               
                    const komplain = await Komplain.findById(req.params.id);
                
                    if (komplain) {
                        komplain.status = 1;
                        komplain.id_penerima = user._id;
                        const updateDatakomplain = await komplain.save()
                        res.send(updateDatakomplain);
                    } else {
                        res.status(404).json({
                            message: 'komplain not found'
                        })
                    }
            } else {
                res.status(500).send(` Tidak Memiliki Wewenang`);
            }
        })
    })

    //Memberi rating ke CS role custamer
komplainRoute.put('/rating/:id', async (req,res) => {

    //header apabila akan melakukan akses
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, async function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        const user1 = await User.findById(decoded.id);
       
            if(user1.kategori_user == 2){
               // console.log(komplain[0].status)
               const komplain = await Komplain.findById(req.params.id);
               console.log(komplain)
                if(komplain.status == 2){
                    const {rating} = req.body;
                
                    if (komplain) {
                        komplain.rating = rating;
                        komplain.id_penerima = user1._id;
                        const updateDatakomplain = await komplain.save()
                        res.send(updateDatakomplain);
                    } else {
                        res.status(404).json({
                            message: 'komplain not found'
                        })
                    }
                }else{
                    res.status(201).send(` Komplain belom selesai`);
                }
            } else {
                res.status(500).send(` Tidak Memiliki Wewenang`);
            }
        })
    })


//CREATE respon kompline role CS
komplainRoute.post('/TLCS/:id_komplain', async (req,res) => {

    //header apabila akan melakukan akses
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, async function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        const user = await User.findById(decoded.id);
        
            if(user.kategori_user === 1){
                const id=user._id
               console.log(id)
               try {
                   const {tindak_lanjut} = req.body;
           
                   const komplain = new Komplain({
                       id_komplain: req.params.id_komplain,
                       status:2,
                       tindak_lanjut:tindak_lanjut,
                       id_pengirim:id,
                       id_penerima:"",
                       rating:"",
                   });
           
                   const createKomplain = await komplain.save();
           
                   res.status(201).json(createKomplain);
               } catch (err) {
                   console.log(err)
                   res.status(500).json({ error: 'Respon creation failed'});
               }   
            } else {
                
                res.status(500).send(` Tidak Memiliki Wewenang`);
            }
        })


   
});


//read Rating CS role SPV
komplainRoute.get('/getRatingCS', async (req,res) => {

    //header apabila akan melakukan akses
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, async function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
          const user = await User.findById(decoded.id);
             if( user.kategori_user === 0){
                const komplain =  await Komplain.find({});

                if(komplain && komplain.length !== 0) {
                    res.json(komplain)
                } else {
                    res.status(404).json({
                        message: 'komplain not found'
                    });
                }
            } else {
                
                res.status(500).send(` Tidak Memiliki Wewenang`);
            }
        })
});


//read Rating by id CS role CS
komplainRoute.get('/getRatingById', async (req,res) => {

    //header apabila akan melakukan akses
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    //verifikasi jwt
    jwt.verify(token, Conf.secret, async function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
          const user = await User.findById(decoded.id);
             if( user.kategori_user === 1){
                const komplain =  await Komplain.find({"id_pengirim":user._id});

                if(komplain && komplain.length !== 0) {
                    res.json(komplain)
                } else {
                    res.status(404).json({
                        message: 'komplain not found'
                    });
                }
            } else {
                
                res.status(500).send(` Tidak Memiliki Wewenang`);
            }
        })
});

    
    



// // Konfirmasi surat
// docRouter.put('/all/update/:id', function (req, res) {
//     //header apabila akan melakukan akses
//     var token = req.headers['x-access-token'];
//     if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
//     //verifikasi jwt
//     jwt.verify(token, Conf.secret, async function(err, decoded) {
//         if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
//         const jabatan = decoded.user.jabatan;
//             if( jabatan == '0'){
//                 const {kategori, nomer, redaksi, tujuan, tanggal,status,keterangan} = req.body;
//                 const doc = await Doc.findById(req.params.id);
                
//                 if (doc.status == 1) {
//                     console.log(doc.status)
//                     res.status(500).send(`Tidak bisa diubah karena Sudah Disetujui`);

//                 } else {
//                     doc.kategori = kategori;
//                     doc.nomer = nomer;
//                     doc.redaksi = redaksi;
//                     doc.tanggal = tanggal
//                     doc.tujuan = tujuan;
//                     doc.status = status;
//                     doc.keterangan = keterangan;
//                     const updateStatus = await doc.save()

//                     res.send(updateStatus);
//                 }
//             } else {
//                 const {kategori, nomer, redaksi, tujuan, tanggal,keterangan} = req.body;
//                 const doc = await Doc.findById(req.params.id);

//                 if (doc.status == 1) {
//                     console.log(doc.status)
//                     res.status(500).send(`Tidak bisa diubah karena Sudah Disetujui`);

//                 } else {
//                     doc.kategori = kategori;
//                     doc.nomer = nomer;
//                     doc.redaksi = redaksi;
//                     doc.tanggal = tanggal
//                     doc.tujuan = tujuan;
//                     doc.keterangan = keterangan;
//                     const updateStatus = await doc.save()

//                     res.send(updateStatus);
//                 }
//             }
//     })
// });

// //Delete doc By ID
// docRouter.delete('/all/:id', async (req,res) => {

//     //header apabila akan melakukan akses
//     var token = req.headers['x-access-token'];
//     if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

//     //verifikasi jwt
//     jwt.verify(token, Conf.secret, async function(err, decoded) {
//         if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
//         const jabatan = decoded.user.jabatan;
//             if( jabatan !== ''){

//     const doc = await Doc.findById(req.params.id);

//     if (doc) {
//         await doc.remove();
//         res.json({
//             message: 'Doc removed'
//         })
//     } else {
//         res.status(404).json({
//             message: 'Doc not found' 
//         })       
//     }
//     }
// })
// });

export default komplainRoute;