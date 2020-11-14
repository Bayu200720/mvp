import mongoose from 'mongoose';

const KomplainSchema = mongoose.Schema(
    {
        judul: {
            type: String,
            required: false,
        },
        detail: {
            type: String,
            required: false,            
        },
        ss_gambar: {
            type: String,
            required: false,         
        },
        status: {
            type: String,
            required: true,   
        },
        id_pengirim: {
            type: String,
            required: true,         
        },
        id_penerima: {
            type: String,      
        },
        rating:{
            type:Number, 
            max:5,           
        },
        tindak_lanjut:{
            type:String, 
                  
        },
        id_komplain:{
            type:String, 
                  
        }
    },
    {
        timestamps: false,
    }
);

const Komplain = mongoose.model('Komplain', KomplainSchema);

export default Komplain;