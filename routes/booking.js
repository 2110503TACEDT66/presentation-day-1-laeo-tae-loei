const express = require('express');

const {getBookings,createBooking}
    = require('../controllers/booking');

const router = express.Router({mergeParams:true});

const {protect, authorize} = require('../middleware/auth');

router.route('/')
    .get(protect, getBookings)
    .post(protect, createBooking);

module.exports=router;