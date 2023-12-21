// Importing Libraries
import cloudinary from 'cloudinary';
import formidable from 'formidable'
import mongoose from 'mongoose';
import { Response } from 'express';
import expressAsyncHandler from 'express-async-handler';

// Importing dependencies
import { UserImage } from '../models/UserImage';
import Api, { Message } from '../utils/helper';
import { Design } from '../models/Design';
import { DesignImage } from '../models/DesignImage';
import { BackgroundImage } from '../models/BackgroundImage';
import { Template } from '../models/Template';

/**
 * @description - To Create User Design
 **/
export const createUserDesign = expressAsyncHandler(async (req: any, res: Response) => {
    const form = formidable({});
    const { _id } = req.user;

    try {

        const [fields, files] = await form.parse(req);
        const { image } = files;
        cloudinary.v2.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_API_SECRET,
        })

        const { url } = await cloudinary.v2.uploader.upload(image[0].filepath);

        const design = await Design.create({
            user_id: _id,
            components: [JSON.parse(fields.design[0])],
            image_url: url,
        });

        return Api.created(res, design, 'Design created successfully!!')
    } catch (error) {
        console.log(error);
        return Api.serverError(req, res, error, Message.ServerError);

    }
});

/**
 * @description - To Update User Design
 **/
export const updateUserDesign = expressAsyncHandler(async (req: any, res: Response) => {
    const form = formidable({});
    const { design_id } = req.params
    try {
        const [fields, files] = await form.parse(req);
        const { image } = files
        const components = JSON.parse(fields.design[0]).design

        const old_design = await Design.findById(design_id)
        cloudinary.v2.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_API_SECRET,
        })

        if (old_design) {
            if (old_design.image_url) {
                const splitImage = old_design.image_url.split('/')
                const imageFile = splitImage[splitImage.length - 1]
                const imageName = imageFile.split('.')[0]
                await cloudinary.v2.uploader.destroy(imageName)
            }

            const { url } = await cloudinary.v2.uploader.upload(image[0].filepath)

            const data = await Design.findByIdAndUpdate(design_id, {
                image_url: url,
                components
            })

            return Api.ok(res, data, "image save success")
        } else {
            return Api.notFound(req, res, "Design not found")

        }
    } catch (error) {
        return Api.serverError(req, res, error, Message.ServerError);
    }
})

/**
 * @description - To Get User Design
 **/
export const getUserDesign = expressAsyncHandler(async (req: any, res: Response) => {
    const { design_id } = req.params

    try {
        const design = await Design.findById(design_id)
        return Api.ok(res, design, "Fetched User Design")
    } catch (error) {
        return Api.serverError(req, res, error, Message.ServerError);
    }
})

/**
 * @description - To Add User Image
 **/
export const addUserImage = expressAsyncHandler(async (req: any, res: Response) => {

    const { _id } = req.user

    const form = formidable({});

    try {
        const [_, files] = await form.parse(req);
        const { image } = files
        cloudinary.v2.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_API_SECRET,
        })

        const { url } = await cloudinary.v2.uploader.upload(image[0].filepath)

        const userImage = await UserImage.create({
            user_id: _id,
            image_url: url
        })
        return Api.created(res, userImage, 'Added User Image successfully!!')
    } catch (error) {
        return Api.serverError(req, res, error, Message.ServerError);
    }
})

/**
 * @description - To Get User Image
 **/
export const getUserImage = expressAsyncHandler(async (req: any, res: Response) => {
    const { _id } = req.user
    try {
        const images = await UserImage.find({ user_id: new mongoose.Types.ObjectId(_id) })
        return Api.ok(res, images, "Fetched User Image Successfully!!")
    } catch (error) {
        return Api.serverError(req, res, error, Message.ServerError);
    }
})

/**
 * @description - To Get Initial Image
 **/
export const getInitialImage = expressAsyncHandler(async (req: any, res: Response) => {
    try {
        const images = await DesignImage.find({})
        return Api.ok(res, images, "Fetched Initial Image Successfully!!")
    } catch (error) {
        return Api.serverError(req, res, error, Message.ServerError);
    }
})

/**
 * @description - To Background Image
 **/
export const getBackgroundImage = expressAsyncHandler(async (req: any, res: Response) => {
    try {
        const images = await BackgroundImage.find({})
        return Api.ok(res, images, "Fetched Background Image Successfully!!")
    } catch (error) {
        return Api.serverError(req, res, error, Message.ServerError);
    }
})


/**
 * @description - To Get User Designs
 **/
export const getUserDesigns = expressAsyncHandler(async (req: any, res: Response) => {
    const { _id } = req.user
    try {
        const designs = await Design.find({ user_id: new mongoose.Types.ObjectId(_id) }).sort({ createdAt: -1 })
        return Api.ok(res, designs, "Fetched User Designs Successfully!!")
    } catch (error) {
        return Api.serverError(req, res, error, Message.ServerError);
    }
})

/**
 * @description - To Delete User Image
 **/
export const deleteUserImage = expressAsyncHandler(async (req: any, res: Response) => {
    const { design_id } = req.params;
    try {
        await Design.findByIdAndDelete(design_id)
        return Api.ok(res, '', "design delete success!!")
    } catch (error) {
        return Api.serverError(req, res, error, Message.ServerError);
    }
})

/**
 * @description - To Get Templates
 **/
export const getTemplates = expressAsyncHandler(async (req: any, res: Response) => {
    try {
        const templates = await Template.find({}).sort({ createdAt: -1 })
        return Api.ok(res, templates, "Fetched Templates Success!!")
    } catch (error) {
        return Api.serverError(req, res, error, Message.ServerError);
    }
})

/**
 * @description - To Add User Template
 **/
export const addUserTemplate = expressAsyncHandler(async (req: any, res: Response) => {

    const { template_id } = req.params;
    const { _id } = req.user
    try {
        const template = await Template.findById(template_id)
        const design = await Design.create({
            user_id: _id,
            components: template.components,
            image_url: template.image_url
        })
        return Api.ok(res, design, "Added User Templates Success!!")
    } catch (error) {
        return Api.serverError(req, res, error, Message.ServerError);
    }
})