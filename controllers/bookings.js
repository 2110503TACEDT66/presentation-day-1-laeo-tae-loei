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

            query = Booking.find({hotel:req.params.hotelId}).populate({
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

exports.getBooking= async (req,res,next)=>{
    try {
        const booking = await Booking.findById(req.params.id).populate({
            path: 'hotel',
            select: 'name address telephoneNumber'
        });

        if(!booking) {
            return res.status(404).json({sucess: false, message: `No booking with the id of ${req.params.id}`});
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

        res.status(200).json({
            success:true,
            data: booking
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
		
		booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
			new:true,
			runValidators:true
		});
		
		res.status(200).json({
			success:true,
			data: booking
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