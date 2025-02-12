import mongoose from "mongoose"


export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://sakshiajabe:sakshiajabe@cluster0.jpgoc.mongodb.net/Food_delivery_Project').then(()=>console.log("DB Connected"));
}



