import mongoose from "mongoose"

const connectDB = async () => {

    mongoose.connection.on("connected", () => {
        console.log("Database Connected");
    })
    await mongoose.connect("mongodb+srv://sundaramsoma539:8778354283@cluster0.jje7afv.mongodb.net/imagify?retryWrites=true&w=majority&appName=Cluster0")
}

export default connectDB