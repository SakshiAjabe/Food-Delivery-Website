
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing user order for frontend
const placeOrder = async (req, res) => {
  const frontend_url = "https://food-delivery-frontend-muat.onrender.com";

  try {
    // Ensure req.body is not undefined
    if (!req.body.userId || !req.body.items || !req.body.amount || !req.body.address) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({  
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log("Order Error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

const verifyOrder = async (req,res) =>{
  const {orderId,success} = req.body;
  
  try{
    if(success == "true"){
      await orderModel.findByIdAndUpdate(orderId,{payment:true});
      res.json({success:true, message:"paid"})
    }
    else{
      await orderModel.findByIdAndDelete(orderId);
      res.json({success:false,message:"Not paid"})
    }
  }catch(error){
    console.log(error);
    res.json({success:false, message:"Error"})
  }
}

//user orders for frontend
const userOrders = async (req,res) =>{
  try{
    const orders = await orderModel.find({userId:req.body.userId})
    res.json({success:true,data:orders})
  }
  catch(error){
    console.log(error);
    res.json({success:false,message:"Error"})
  }
}

// Listing orders for admin panel
const listOrders = async (req , res) =>{
  try{

    const orders = await orderModel.find({});
    res.json({success:true,data:orders})
  }
  catch(error){
    console.log(error);
    res.json({success:false , message:"Error"})
  }
}

//api for updating order status
const updateStatus  = async (req , res) =>{
  try{
    await orderModel.findByIdAndUpdate(req.body.orderId, {status:req.body.status});
    res.json({success:true, message:"status Updated"})
  }
  catch(error){
    console.log(error);
    res.json({success:false,message:"Error"})
  }
}

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
