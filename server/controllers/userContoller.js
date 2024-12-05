import userModel from "../Models/userModel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import razorpay from "razorpay"
import transactionModel from "../Models/transactionModel.js";


const registerUser = async(req,res) => {
    try {
        const {name,email,password} = req.body
        if(!name || !email || !password){
            return res.json({success:false,message:"Missing Details"})
        }

        const salt = await bcrypt.genSalt(10)
        const hasedPassword = await bcrypt.hash(password,salt)

        const userData = {
            name,
            email,
            password:hasedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET)

        res.json({success:true,token,user:{name:user.name}})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message}) 
    }
}

const loginUser = async(req,res) => {
    try {
        const {email,password} = req.body;
        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success:false,message:"User does not exist"})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(isMatch){
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.json({success:true,token,user:{name:user.name}})

        }else{
            return res.json({success:false,message:"Invalid Credentials"})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message}) 
    }
}


const userCredits = async(req,res) => {
    try {
        const {userId} = req.body

        const user = await userModel.findById(userId)
        res.json({success:true,credits:user.creditBalance,user:{name:user.name}})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message}) 
    }
}

const razorpayInstance = new razorpay({
    key_id:process.env.RAZOR_KEY_ID,
    key_secret:process.env.RAZOR_KEY_SECRET
})

const paymentRazorpay = async(req,res) => {
    try {
        const {userId,planId} = req.body

        const userData = await userModel.findById(userId)

        if(!userId,!planId){
            return res.json({success:false,message:"Missing Details"})
        } 

        let credits,plan,amount,date 

        switch (planId) {
            case "Basic":
                plan = "Basic"
                credits = 100 
                amount = 10
                break;

            case "Advanced":
                plan = "Advanced"
                credits = 500 
                amount = 50
                break;
            case "Business":
                plan = "Business"
                credits = 5000
                amount = 250
                break;
            default:
                return res.json({success:false,message:"plan not found"})
        }

        date = Date.now()

        const transactionData = {
            userId,amount,plan,credits,date
        }

        const newTransaction = await transactionModel.create(transactionData)

        const options = {
            amount:amount * 100,
            currency:process.env.CURRENCY,
            receipt:newTransaction._id
        }

        await razorpayInstance.orders.create(options, (error,order) => {
            if(error){
                console.log(error);
                return res.json({success:false,message:error})
            }
            res.json({success:true,order})
        })
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body;

        // Fetch order information from Razorpay
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        if (orderInfo.status === "paid") {
            // Fetch transaction data
            const transactionData = await transactionModel.findById(orderInfo.receipt);
            if (transactionData.payment) {
                return res.json({ success: false, message: "Payment already processed." });
            }

            // Fetch user data
            const userData = await userModel.findById(transactionData.userId);

            // Update user's credit balance
            const updatedCreditBalance = userData.creditBalance + transactionData.credits;
            await userModel.findByIdAndUpdate(userData._id, { creditBalance: updatedCreditBalance });

            // Mark transaction as paid
            await transactionModel.findByIdAndUpdate(transactionData._id, { payment: true });

            // Respond with success
            return res.json({ success: true, message: "Payment Successful" });
        } else {
            return res.json({ success: false, message: "Payment not completed. Status: " + orderInfo.status });
        }
    } catch (error) {
        console.error("Error in verifyRazorpay:", error);
        res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};


export {registerUser,loginUser,userCredits,paymentRazorpay,verifyRazorpay}
