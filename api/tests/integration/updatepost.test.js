const mongoose = require('mongoose');
const Post = require('../../models/post'); 
const {updatePost} = require('../../controllers/posts');
const request = require("supertest");
const JWT = require("jsonwebtoken");
const app = require("../../app");
require("../mongodb_helper");
const secret = process.env.JWT_SECRET;


describe ('updatePost Functionality', () => {
    let testPost;
    let mockReq;
    let mockRes;
    
    beforeEach(async () => {
        testPost = new Post({
        _id: new mongoose.Types.ObjectId(),
        beans: [],
        message: "Original message",
        user: "cheekycoffee"
        });
        await testPost.save();
    
        mockReq = {
        params: { post_id: testPost._id },
        body: {
            message:"This is the edited message",
            isYours: true
        },
        username: 'cheekycoffee'};
    
        mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()};
    });
    
    afterEach(async () => {
        await Post.deleteMany({});
    });
    
    test('updates a post with an edited message when isYours is true', async () => {
        await updatePost(mockReq, mockRes);
    
        const updatedPost = await Post.findById(testPost._id);
        expect(updatedPost.message).toContain("This is the edited message");
    });

    test('doesnt update a post with an edited message when isYours is false', async () => {
        mockReq.body.isYours = false
        await updatePost(mockReq, mockRes);
    
        const updatedPost = await Post.findById(testPost._id);
        expect(updatedPost.message).toContain("Original message");
    });

    })