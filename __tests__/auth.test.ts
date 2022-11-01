import supertest from 'supertest'
import {createServer} from '../util/server'
import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import User, {UserSchema} from '../models/User';
import {Role} from '../dao/RoleEnum';
import {cookie} from 'request';
import {createJWT} from '../util/jwt';
import { authenticateUser } from '../middleware/authenticationMiddleware';
import {Request, Response, NextFunction} from 'express';
import { UnauthenticatedError } from '../error';

const cookieParser      = require('cookie-parser');

const app = createServer()
app.use(cookieParser())
const bodyParser        = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const agent =  supertest.agent(app);



describe('auth', () => {


    const validUser = {
        email: 'test@gmail.com',
        password: 'pass123',
        name: 'Test',
        verificationToken: 'random_value',
        role: 'user',
        isVerified: true
    }


    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()
        await mongoose.connect(mongoServer.getUri())
    })

    afterAll(async () => {
        await mongoose.disconnect()
        await mongoose.connection.close()
    })

    describe('login', () => {

        beforeEach(async () => {

            const user = await User.findOne({email: validUser.email})

            if (! user) 
                await User.create(validUser)

            

        })

        describe('given that the credentials are correct', () => {

            it('should return a 200 OK', async () => {
       

                const resp = await supertest(app).post("/api/login").send({email: validUser.email, password: validUser.password}).expect(200)

                const cookies = resp.headers['set-cookie']


            })


        })
    })

    describe('register', () => {


        describe('given that email IS NOT already registed', () => {


            it("should return a 201 created", async () => {
                const email = 'sadsabbs@gmail.com'
                const password = 'hlambolonibalala'
                const name = 'George'

                const payload = {
                    email,
                    password,
                    name
                }

                await supertest(app).post('/api/register').send(payload).expect(201)


            })
        })

        describe('given that email IS already registed', () => {

            beforeEach(async () => {

                const user = await User.findOne({email: validUser.email})

                if (! user) 
                    await User.create(validUser);
                
            })

            it("should return a 400 bad request", async () => {

                await supertest(app).post('/api/register').send(validUser).expect(400)

            })
        })

    })

    describe('profile', () => {
        describe('given that user is not logged in', () => {
            it('should return a 401 unauthorized', async () => {

                const {statusCode} = await supertest(app).get('/api/profile')

                expect(statusCode).toBe(401)
            })
        })

        describe('given that user is logged in', () => {

            beforeEach(async ()=>{

                const user = await User.findOne({email: validUser.email})

                if (! user) 
                    await User.create(validUser)

                
                const resp = await agent
                .post("/api/login")
                .send({email: validUser.email, password: validUser.password})

            })


            
            it('should return a 200 OK', async () => {
            

               const response = await agent
                .get('/api/profile')
                .send()
                .expect(200)
               
                expect(response.body.name).toBeDefined()
                expect(response.body.role).toBeDefined()
                expect(response.body.id).toBeDefined()



           
            })
        })

    })
    describe('middleware', ()=>{

        let mockRequest: Partial<Request>;
        
        let mockResponse: Partial<Response>;
        
        let nextFunction: NextFunction = jest.fn();

        describe('auth middleware', ()=>{

            
    
    
        const validUser = {
            email: 'test@gmail.com',
            password: 'pass123',
            name: 'Test',
            verificationToken: 'random_value',
            role: 'user',
            isVerified: true
        }
    
    
            describe('given that the jwt token is present',()=>{
    
    
    
 
    
                it("doesn't throw errors",async()=>{
    

                })
            })

            describe('given that the jwt token is not present',()=>{
    
    
    
                beforeEach(async ()=>{
    
                    const user = await User.findOne({email: validUser.email})
    
                    if (! user) 
                        await User.create(validUser)
    
                    
                    const resp = await agent
                    .post("/api/login")
                    .send({email: validUser.email, password: validUser.password})
    
                })
    
                it("throws errors",async()=>{
    
                const mock = {} as Request;

                    mock.signedCookies = ['accessToken=sdas']

                    let next: NextFunction = jest.fn();
                    expect(async ()=>{await authenticateUser(
                        mock,
                        mockResponse as Response,
                        next)})
                        .rejects
                        .toThrowError()

                })
            })
        })
    })
})

