const express = require('express');
const {getHospital,getHospitals,createHospital,updateHospital,deleteHospital,getVacCenters} = require('../controllers/hospitals');

//Include other resource routers
const appointmentRouter = require('./appointment');

const router = express.Router();
const {protect, authorize} = require('../middleware/auth');

//Re-route into other resource routers
router.use('/:hospitalId/appointments', appointmentRouter);
router.route('/vacCenters').get(getVacCenters);

router.route('/').get(getHospitals).post(protect, authorize('admin'), createHospital);
router.route('/:id')
    .get(getHospital)
    .put(protect, authorize('admin'), updateHospital)
    .delete(protect, authorize('admin'), deleteHospital);

module.exports = router;

/**
*   @swagger
*   components: 
*       schemas:
*           Hospital:
*               type: object
*               required:
*                   - name
*                   - address
*               properties:
*                   id:
*                       type: string
*                       format: uuid
*                       description: The auto-generated id of the hospital
*                       example: 65d46f3e9c40319080ae5ea1
*                   name:
*                       type: string
*                       description: The name of the hospital
*                   address:
*                       type: string
*                       description: House No., Street, Road
*                   district:
*                       type: string
*                       description: District
*                   province:
*                       type: string
*                       description: Province
*                   postalcode:
*                       type: string
*                       description: 5-digit postal Code
*                   tel:
*                       type: string
*                       description: Telephone number
*                   region:
*                       type: string
*                       description: region
*               example:
*                   id: 65d46f3e9c40319080ae5ea1
*                   name: "Happy Hospital"
*                   address: "121 ถ.สุขุมวิท"
*                   district: "บางนา"
*                   province: "กรุงเทพมหานคร"
*                   postalcode: "10110"
*                   tel: "0112345678"
*                   region: "กรุงเทพมหานคร (Bangkok)" 
*/
/**
*   @swagger
*   tags:
*       name: Hospitals
*       description: The hospitals managing API
 */

/**
 *  @swagger
 *  /hospitals/:
 *    get:
 *      summary: Returns the list of all the hospitals
 *      tags: [Hospitals]
 *      responses:
 *        200:
 *          description: The list of the hospitals
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Hospital'
 */

/**
 * @swagger
 * /hospitals:
 *   post:
 *     summary: Create a new hospital
 *     tags: [Hospitals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hospital'
 *     responses:
 *       201:
 *         description: The hospital was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hospital'
 *       500:
 *        description: Some server error
 */

/**
 *  @swagger
 *  /hospitals/{id}:
 *    get:
 *      summary: Get the hospital by id
 *      tags: [Hospitals]
 *      parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The hospital id
 *      responses:
 *        200:
 *          description: The hospital description by id
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Hospital'
 *        404:
 *          description: The hospital was not found
 */

/**
 *  @swagger
 *  /hospitals/{id}:
 *    put:
 *      summary: Update the hospital by id
 *      tags: [Hospitals]
 *      parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The hospital id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Hospital'
 *      responses:
 *        200:
 *          description: The hospital was updated
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Hospital'
 *        404:
 *          description: The hospital was not found
 *        500:
 *          description: Some error happened
 */

/**
 *  @swagger
 *  /hospitals/{id}:
 *    delete:
 *      summary: Remove the hospital by id
 *      tags: [Hospitals]
 *      parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The hospital id
 *      responses:
 *        200:
 *          description: The hospital was deleted
 *        404:
 *          description: The hospital was not found
 */

