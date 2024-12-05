const mongoose = require('mongoose');
const Post = require('../../models/post'); 
const {likePost} = require('../../controllers/posts');
const request = require("supertest");
const JWT = require("jsonwebtoken");
const app = require("../../app");
require("../mongodb_helper");
const secret = process.env.JWT_SECRET;


describe ('likePost Functionality', () => {
    let testPost;
    let mockReq;
    let mockRes;
    
    beforeEach(async () => {
        testPost = new Post({
        _id: new mongoose.Types.ObjectId(),
        beans: [],
        message: "Please like my message about coffee",
        user: "hotcupofjoe"
        });
        await testPost.save();
    
        mockReq = {
        params: { post_id: testPost._id },
        username: 'hotcupofjoe'};
    
        mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()};
    });
    
    afterEach(async () => {
        await Post.deleteMany({});
    });
    
    test('adds username to beans array on bean/like', async () => {
        await likePost(mockReq, mockRes);
    
        const updatedPost = await Post.findById(testPost._id);
        expect(updatedPost.beans).toContain('hotcupofjoe');
    });

    test('removes username from beans array when you hit unbean/unlike', async () => {
        await likePost(mockReq, mockRes);
        await likePost(mockReq, mockRes);
    
        const updatedPost = await Post.findById(testPost._id);
        expect(updatedPost).not.toContain('hotcupofjoe');
    });

    test('multiple users can like the same post', async () => {
        mockReq.username = "mocchalover"
        await likePost(mockReq, mockRes);

        mockReq.username = "javajunkie"
        await likePost(mockReq, mockRes);

        const updatedPost = await Post.findById(testPost._id);
        expect(updatedPost.beans).toContain('mocchalover');
        expect(updatedPost.beans).toContain('javajunkie');
    
    });

    })