const express = require('express');

const {getBookings}
    = require('../controllers/bookings');

const router = express.Router({mergeParams:true});

const {protect, authorize} = require('../middleware/auth');

router.route('/')
    .get(protect, getBookings);

module.exports=router;