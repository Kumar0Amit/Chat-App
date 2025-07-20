import Message from "../models/message.models.js";
import Conversation from "../models/conversation.model.js"


const sendMessage = async (req,res) => {
   try {

    // what we are doing here is that we are extracting the body of message and the id which is ours the sender and also extracting userid using middlewre so that we can send this message to the userid along with the id which we have and the message body

    const {message} = req.body;

    const {id: receiverId } = req.params;

    const senderId = req.user._id;  // this will not work because we have not added such thing in request so for this we will use middleware and put it in routes file before we run this sendMessage routes controller
   
    let conversation  = await Conversation.findOne({
      participants : { $all : [senderId,receiverId]},

    })

    if(!conversation){
      conversation = await Conversation.create({
         participants : [senderId,receiverId],
      })
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    })

   

    if(newMessage){
      conversation.messages.push(newMessage._id);
    }
    
   //  await conversation.save();
   //  await newMessage.save();

   //these will run in parallel
    await Promise.all([conversation.save(),newMessage.save()]);

    res.status(201).json(newMessage);
    
   } catch (error) {
        console.log("Error in sendMessage controller: ",error.message);
        res.status(500).json({error : "Interval server error"});
   }
};

export default sendMessage;