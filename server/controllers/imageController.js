import userModel from "../Models/userModel.js";
import FormData from "form-data";
import axios from "axios";

export const generateImage = async (req, res) => {
    try {
        const { userId, prompt } = req.body;

        // Validate user input
        if (!userId || !prompt) {
            return res.json({ success: false, message: "Missing Details" });
        }

        // Find user by ID
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.creditBalance <= 0) {
            return res.json({
                success: false,
                message: "No credits available",
                creditBalance: user.creditBalance,
            });
        }

        // Create form data
        const formData = new FormData();
        formData.append("prompt", prompt);

        // Make API request
        const { data } = await axios.post(
            "https://clipdrop-api.co/text-to-image/v1",
            formData,
            {
                headers: {
                    "x-api-key": process.env.CLIPDROP_API,
                    ...formData.getHeaders(),
                },
                responseType: "arraybuffer",
            }
        );

        // Convert image to base64
        const base64Image = Buffer.from(data).toString("base64");
        const resultImage = `data:image/png;base64,${base64Image}`;

        // Deduct one credit and update user
        const updatedUser = await userModel.findByIdAndUpdate(
            user._id,
            { creditBalance: user.creditBalance - 1 },
            { new: true }
        );

        // Send success response
        res.json({
            success: true,
            message: "Image Generated",
            creditBalance: updatedUser.creditBalance,
            resultImage,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to generate image",
            error: error.message,
        });
    }
};
