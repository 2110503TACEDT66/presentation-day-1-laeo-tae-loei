const express = require('express');
const {getHotels, getHotel, createHotel, updateHotel, deleteHotel, getVacCenters} 
    = require('../controllers/hotels');

//Include other resource routers
const bookingRouter = require('./booking'); 

const router = express.Router();
const {protect, authorize} = require('../middleware/auth');

//Re-route into other resource routers
router.use('/:hotelId/booking/', bookingRouter);

router.route('/vacCenters').get(getVacCenters);

router.route('/')
    .get(getHotels)
    .post(protect, authorize('admin'), createHotel);
router.route('/:id')
    .get(getHotel)
    .put(protect, authorize('admin'), updateHotel)
    .delete(protect, authorize('admin'), deleteHotel);

module.exports=router;