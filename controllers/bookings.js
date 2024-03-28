const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const Payment = require('../models/Payment');

exports.getBookings= async (req,res,next)=>{
    let query;

    //General users can see only their booking
    if(req.user.role != 'admin') {
        query = Booking.find({user:req.user.id}).populate({
            path: 'user',
            select: 'name email telephoneNumber'
        }).populate('hotel');
    } else { //Admin can see all
        if(req.params.hotelId) {
            console.log(req.params.hotelId);

            query = Booking.find({hotel:req.params.hotelId}).populate({
                path: 'user',
                select: 'name telephoneNumber email'
            }).populate('hotel');

            } else {
            query = Booking.find().populate({
                path: 'user',
                select: 'name telephoneNumber email'
            }).populate('hotel');
        }
    }

    try {
        const bookings = await query;

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings,
            isAdmin: req.user.role === 'admin' ? true : false
        });
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({
            success: false,
            message: "Cannot find Booking"
        });
    }
};

exports.getBooking= async (req,res,next)=>{
    try {
        const booking = await Booking.findById(req.params.id).populate({
            path: 'user',
            select: 'name telephoneNumber email'
        }).populate('hotel');

        if(!booking) {
            return res.status(404).json({sucess: false, message: `No booking with the id of ${req.params.id}`});
        }
        
        //Make sure user is the booking owner
        if(booking.user.toString()!== req.user.id && req.user.role !== 'admin'){
		    return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to update this booking`});
	    }

        res.status(200).json({success: true,data: booking});
    } catch(error) {
        console.log(error.stack);
        return res.status(500).json({success: false, message: "Cannot find booking"});
    }
};

exports.createBooking = async (req,res,next)=>{
    try{
        req.body.hotel=req.params.hotelId;

        const hotel = await Hotel.findById(req.params.hotelId);
    
        if(!hotel){     
            return res.status(404).json({success:false,message: `No hotel with the id of ${req.params.hotelId}`});
        }

        //add user Id to req.body 
        req.body.user=req.user.id;

        //Check for existed booking
        const existedBookings = await Booking.find({user:req.user.id});

        //If the user is not an admin, they can only create 3 booking.
        if(existedBookings.length >= 3 && req.user.role !== 'admin'){
            return res.status(400).json({success:false, message:`The user with ID ${req.user.id} has already made 3 bookings`});
        }

        const booking = await Booking.create(req.body);

        let hotel_price = hotel.basePrice;

        if (req.body.roomType === 'Suite') {
            if (hotel.starRating === 5) hotel_price += 1000;
            else hotel_price += 600;
        }
        else if (req.body.roomType === 'Executive Suite') {
            hotel_price += 2000;
        }

        hotel_price = hotel_price * req.body.duration;

        const payment = await Payment.create({
            booking:booking._id, 
            amount:hotel_price,
            logs: [{
                amount: hotel_price,
                description: `User ${req.body.user} book hotel ${hotel._id} room type ${req.body.roomType} for ${req.body.duration} nights. Total price: ${hotel_price}`
            }]
        });

        res.status(200).json({
            success:true,
            data: booking,
            payment: payment
        });
    }   catch (error) {
            console.log(error.stack);
            return res.status(500).json({success:false,message:"Cannot create booking"});

    }
};

exports.updateBooking= async (req,res,next)=>{
	try {
		let booking = await Booking.findById(req.params.id);

		if (!booking){
			return res.status(404).json({success:false,message:`No booking with the id of ${req.params.id}`});
		}

        //Make sure user is the booking owner
	    if(booking.user.toString()!== req.user.id && req.user.role !== 'admin'){
		    return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to update this booking`});
	    }

        // let fee = 100;
        // let logDescription = 'Update booking';

        // Check if hotel has been changed
        // if (req.body.hotel && booking.hotel.toString() != req.body.hotel) {
        //     fee += 900; // Add fee for changing hotel
        //     logDescription += `Change hotel from ${booking.hotel} to ${req.body.hotel}. `;
        // }

		booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
			new:true,
			runValidators:true
		});

        // payment = await Payment.findOneAndUpdate(
        //     { booking: booking._id }, 
        //     { 
        //         $inc: { amount: fee },
        //         $push: { logs: { amount: fee, description: logDescription } }
        //     },
        //             {
        //         new: true,
        //         runValidators: true
        //     }
        // );		
        console.log(booking);

		res.status(200).json({
			success:true,
			data: booking,
		});

	} catch (error) {
		console.log(error.stack);
		return res.status(500).json({success:false,message:"Cannot update booking"});
	}
};

exports.deleteBooking=async (req,res,next)=>{
	try {
		const booking = await Booking.findById(req.params.id);
		
		if(!booking){
			return res.status(404).json({success:false,message:`No booking with the id of ${req.params.id}`});
		}

        //Make sure user is the booking owner
	    if(booking.user.toString()!== req.user.id && req.user.role !== 'admin'){
		    return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to delete this booking`});
	    }

		await booking.deleteOne();

		res.status(200).json({success:true, data: {}});

	} catch (error) {
		console.log(error.stack);
		return res.status(500).json({success:false,message:"Cannot delete booking"});
	}
};