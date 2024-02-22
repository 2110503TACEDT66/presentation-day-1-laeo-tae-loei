const Appointment = require('../models/Appointment');
const Hospital = require('../models/hospital');

//@desc     Get all appointments
//@route    GET /api/v1/appointments
//@access   Public
exports.getAppointments = async (req, res, next) => {
    let query;
    //General users can see only their appointments!
    if (req.user.role !== 'admin') {
        query = Appointment.find({ user: req.user.id }).populate({
            path: 'hospital',
            select: 'name province tel'
        });
    } else { // If you are admin, you can see all appointments!
        query = Appointment.find().populate({
            path: 'hospital',
            select: 'name province tel'
        });
    }
    try {
        const appointments = await query;

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: "Cannot find appointment" });
    }
};

// @desc     Get single appointment
// @route    GET /api/v1/appointments/:id
// @access   Public
exports.getAppointment = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate({
            path: 'hospital',
            select: 'name province tel'
        });
        
        if (!appointment) {
            return res.status(404).json({ success: false, msg: `No appointment with the ID of ${id} found.` });
        }

        res.status(200).json({ success: true, data: appointment });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
    }
};

// @desc     Add appointment
// @route    POST /api/v1/hospitals/:hospitalId/appointments
// @access   Private
exports.addAppointment = async (req, res, next) => {
    try {
        req.body.user = req.user.id;
        req.body.hospital = req.params.hospitalId;

        const exisedAppointment = await Appointment.find({user:req.user.id});
        if (exisedAppointment.length >= 3 && req.user.role !== 'admin') {
            return res.status(400).json({ success: false, msg: `The user with id ${userId} has already made 3 appointments.` });
        }

        const hospital = await Hospital.findById(req.params.hospitalId);

        if (!hospital) {
            return res.status(404).json({ success: false, msg: `No hospital with the ID of ${id} found.` }); 
        }

        const appointment = await Appointment.create(req.body);

        res.status(200).json({ success: true, data: appointment });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: "Cannot add appointment" });
    }
};

//@desc     Update appointment
//@route    PUT /api/v1/appointments/:id
//@access   Private
exports.updateAppointment = async (req, res, next) => {
    try {
        let appointment = await Appointment.findById(req.params.id);
    
        if (!appointment) { 
            return res.status(404).json({ success: false, msg: `No appointment with the ID of ${id} found.` });
        }

        if (appointment.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, msg: `User ${req.user.id} is not authorized to update this appointment` });
        }

        appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: appointment });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: "Cannot update appointment" });
    }
};

//@desc    Delete appointment
//@route   DELETE /api/v1/appointments/:id
//@access  Private
exports.deleteAppointment = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ success: false, msg: `No appointment with the ID of ${id} found.` });
        }

        if (appointment.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, msg: `User ${req.user.id} is not authorized to delete this appointment` });
        }

        await appointment.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: "Cannot delete appointment" });
    }
};