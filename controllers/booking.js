const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const mongoose = require('mongoose');
exports.createBooking = async (req,res,next)=>{
    try {
        const{bookDate, hotelId} = req.body;
         // Check if the hotelId is a valid ObjectId

        const hotel = await Hotel.findById(hotelId);
        if(!hotel){
            return res.status(404).json({
                success: false,
                message: `Hotel not found with id of ${hotelId}`
            });
        }
        existedBooking = await Booking.find({user: req.user.id});
        console.log(existedBooking);
        if(existedBooking.length >= 3){
            return res.status(400).json({
                success: false,
                message: `You can only book 3 nights`
            });
        }
        const booking = await Booking.create({
            bookDate: bookDate,
            hotel: hotelId,
            user: req.user.id
        });
        res.status(201).json({
            success: true,
            data: booking
        });
    }
    catch (err) {
        console.log(err.stack);
        return res.status(500).json({
            success: false,
            message: "Cannot create Booking"
        });
    }
}
