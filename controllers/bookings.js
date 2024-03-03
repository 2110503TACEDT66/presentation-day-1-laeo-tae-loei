const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');

exports.getBookings= async (req,res,next)=>{
    let query;

    //General users can see only their booking
    if(req.user.role != 'admin') {
        query = Booking.find({user:req.user.id}).populate({
            path: 'hotel',
            select: 'name address telephoneNumber'
        });
    } else { //Admin can see all
        if(req.params.hotelId) {
            console.log(req.params.hotelId);

            query = Booking.find({booking:req.params.hotelId}).populate({
                path: 'hotel',
                select: 'name address telephoneNumber'
            });
        } else {
            query = Booking.find().populate({
                path: 'hotel',
                select: 'name address telephoneNumber'
            });
        }
    }

    try {
        const bookings = await query;

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({
            success: false,
            message: "Cannot find Booking"
        });
    }
};