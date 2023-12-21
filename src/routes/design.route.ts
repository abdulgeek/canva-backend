// Importing Libraries
import express from 'express';

// Importing dependencies
import { authMiddleware } from '../middleware/auth';
import { addUserImage, addUserTemplate, createUserDesign, deleteUserImage, getBackgroundImage, getInitialImage, getTemplates, getUserDesign, getUserDesigns, getUserImage, updateUserDesign } from '../controllers/design.controller';

const designRoute = express.Router();

/**
 * @swagger
 * /design/design/create-user-design:
 *   post:
 *     summary: Create a new design for the user
 *     tags: [Design]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file for the design
 *               design:
 *                 type: string
 *                 description: JSON string of design components
 *     responses:
 *       201:
 *         description: Design created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
designRoute.post('/create-user-design', authMiddleware, createUserDesign);

/**
 * @swagger
 * /design/user-design/{design_id}:
 *   get:
 *     summary: Fetch a specific user design by ID
 *     tags: [Design]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: design_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The design ID
 *     responses:
 *       200:
 *         description: Successfully fetched the user design
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 components:
 *                   type: array
 *                   items:
 *                     type: object
 *                 image_url:
 *                   type: string
 *       404:
 *         description: Design not found
 *       500:
 *         description: Server error
 */
designRoute.get('/user-design/:design_id', authMiddleware, getUserDesign);


/**
 * @swagger
 * /design/update-user-design/{design_id}:
 *   put:
 *     summary: Update a user's design
 *     tags: [Design]
 *     parameters:
 *       - in: path
 *         name: design_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The design ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               design:
 *                 type: string
 *                 description: JSON string of design components
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file
 *     responses:
 *       200:
 *         description: Design updated successfully
 *       404:
 *         description: Design not found
 *       500:
 *         description: Server error
 */
designRoute.put('/update-user-design/:design_id', authMiddleware, updateUserDesign);

/**
 * @swagger
 * /design/add-user-image:
 *   post:
 *     summary: Add a user image
 *     tags: [Image]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       201:
 *         description: User image added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 user_id:
 *                   type: string
 *                 image_url:
 *                   type: string
 *       500:
 *         description: Server error
 */
designRoute.post('/add-user-image', authMiddleware, addUserImage);

/**
 * @swagger
 * /design/get-user-image:
 *   get:
 *     summary: Fetches images for the authenticated user
 *     tags: [Design]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched user images
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The image ID
 *                   user_id:
 *                     type: string
 *                     description: The user ID
 *                   image_url:
 *                     type: string
 *                     description: URL of the image
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Date of creation
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Date of last update
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       500:
 *         description: Server error
 */
designRoute.get('/get-user-image', authMiddleware, getUserImage);

/**
 * @swagger
 * /design/design-images:
 *   get:
 *     summary: Retrieves initial design images
 *     tags: [Design]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of initial design images.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The image ID.
 *                   url:
 *                     type: string
 *                     description: URL of the image.
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date when the image was created.
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date when the image was last updated.
 *       500:
 *         description: Server error
 */
designRoute.get('/design-images', authMiddleware, getInitialImage);

/**
 * @swagger
 * /design/background-images:
 *   get:
 *     summary: Retrieve a list of background images
 *     tags: [BackgroundImage]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of background images.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The image ID.
 *                   url:
 *                     type: string
 *                     description: The URL of the image.
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date when the image was added.
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date when the image was last updated.
 *       500:
 *         description: Server error
 */
designRoute.get('/background-images', authMiddleware, getBackgroundImage);

/**
 * @swagger
 * /design/design/user-designs:
 *   get:
 *     summary: Fetches all designs created by the logged-in user
 *     tags: [Design]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched all user designs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Design'
 *       401:
 *         description: Unauthorized, valid token required
 *       500:
 *         description: Server error
 */

designRoute.get('/user-designs', authMiddleware, getUserDesigns);

/**
 * @swagger
 * /design/design/delete-user-image/{design_id}:
 *   put:
 *     summary: Delete a user's design image
 *     tags: [Design]
 *     parameters:
 *       - in: path
 *         name: design_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The design ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Design image successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: design delete success!!
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
designRoute.put('/delete-user-image/:design_id', authMiddleware, deleteUserImage);

/**
 * @swagger
 * /design/templates:
 *   get:
 *     summary: Retrieve a list of templates
 *     tags: [Template]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of templates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Template'
 *                 message:
 *                   type: string
 *                   example: Fetched Templates Success!!
 *       500:
 *         description: Server error
 *
 * components:
 *   schemas:
 *     Template:
 *       type: object
 *       required:
 *         - name
 *         - details
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the template
 *         details:
 *           type: string
 *           description: Detailed description of the template
 */
designRoute.get('/templates', authMiddleware, getTemplates)

/**
 * @swagger
 * /design/add-user-template/{template_id}:
 *   get:
 *     summary: Add a user template
 *     tags: [Design]
 *     parameters:
 *       - in: path
 *         name: template_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The template ID
 *     responses:
 *       200:
 *         description: The user template was successfully added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 user_id:
 *                   type: string
 *                 components:
 *                   type: array
 *                   items:
 *                     type: object
 *                 image_url:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
designRoute.get('/add-user-template/:template_id', authMiddleware, addUserTemplate);


export default designRoute;



