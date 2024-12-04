const mongoose = require('mongoose');
const Post = require('../../models/post'); 
const {deletePostId} = require('../../controllers/posts');
const request = require("supertest");
const JWT = require("jsonwebtoken");
const app = require("../../app");
require("../mongodb_helper");
const secret = process.env.JWT_SECRET;


describe ('deletePostId Functionality', () => {
    let testPost;
    let mockReq;
    let mockRes;
    
    beforeEach(async () => {
        testPost = new Post({
        _id: new mongoose.Types.ObjectId(),
        beans: [],
        message: "Message I would like to delete",
        user: "cheekycoffee"
        });
        await testPost.save();
    
        mockReq = {
        params: { post_id: testPost._id },
        body: {isYours: true},
        username: 'cheekycoffee'};
    
        mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()};
    });
    
    afterEach(async () => {
        await Post.deleteMany({});
    });
    
    test('deletes a post when isYours is true', async () => {
        await deletePostId(mockReq, mockRes);
    
        const deletedPost = await Post.findById(testPost._id);
        expect(deletedPost).toBeNull();
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith( expect.objectContaining({ message: "Post deleted", token: expect.any(String) })
        );

    });

    test('doesnt deletes a post when isYours is false', async () => {
        mockReq.body.isYours = false
        await deletePostId(mockReq, mockRes);
    
        const unchangedPost = await Post.findById(testPost._id);
        expect(unchangedPost.message).toBe("Message I would like to delete");
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Not your post can't delete" })
          );
        

    });

})
