const express = require('express');
const {getHotels, getHotel, createHotel, updateHotel, deleteHotel} 
    = require('../controllers/hotels');

//Include other resource routers
//const bookingRouter = require('./booking'); 

const router = express.Router();
const {protect, authorize} = require('../middleware/auth');

//Re-route into other resource routers
//router.use('/:hotelId/booking/', bookingRouter);

router.route('/')
    .get(getHotels)
    .post(createHotel);
router.route('/:id')
    .get(getHotel)
    .put(updateHotel)
    .delete(deleteHotel);

module.exports=router;