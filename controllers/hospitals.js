const Hospital = require('../models/Hospital');

//@desc     Get all hospitals
//@route    GET /api/v1/hospitals
//@access   Public
exports.getHospitals = async (req, res, next) => {
    try {
        let query;

        //Copy req.query
        const reqQuery = { ...req.query };

        //Fields to exclude
        const removeFields = ['select', 'sort'];

        //Loop over removeFields and delete them from reqQuery
        removeFields.forEach(param => delete reqQuery[param]);
        console.log(reqQuery);

        //Create query string
        let queryString = JSON.stringify(req.query);
        queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        
        //Finding resource
        query = Hospital.find(JSON.parse(queryString));

        //Select Fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        //Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }
        else {
            query = query.sort('-createdAt');
        }


        const hospitals = await query;

        res.status(200).json({ success: true, count: hospitals.length, data: hospitals });
    }
    catch(err) {
        res.status(400).json({ success: false });
    }
};

//@desc     Get single hospitals
//@route    GET /api/v1/hospitals/:id
//@access   Public
exports.getHospital = async (req, res, next) => {
    try {
        const hospital = await Hospital.findById(req.params.id);
        if (!hospital) {
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: hospital });
    }
    catch (err) {
        res.status(400).json({ success: false });
    }
};

//@desc     Create hospital
//@route    POST /api/v1/hospitals
//@access   Private
exports.createHospital = async (req, res, next) => {
    try {
        const hospital = await Hospital.create(req.body);
        res.status(201).json({ success: true, data: hospital });
    }
    catch (err) {
        res.status(400).json({ success: false });
    }
};
  
//@desc     Update single hospital
//@route    PUT /api/v1/hospitals/:id
//@access   Private
exports.updateHospital = async (req, res, next) => {
    try {
        const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!hospital) {
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: hospital });
    }
    catch (err) {
        res.status(400).json({ success: false });
    }
};

//@desc     Delete single hospital
//@route    DELETE /api/v1/hospitals/:id
//@access   Private
exports.deleteHospital = async (req, res, next) => {
    try {
        const hospital = await Hospital.findByIdAndDelete(req.params.id);
        if (!hospital) {
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} });
    }
    catch (err) {
        res.status(400).json({ success: false });
    }
};