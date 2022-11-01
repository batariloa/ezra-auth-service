import { Router } from 'express';
import { 
    login, 
    register, 
    logout, 
    verifyEmail,
    resetPassword,
    forgotPassword

} from '../controllers/authController';
import { authenticateUser } from '../middleware/authenticationMiddleware';
 const authRouter = Router();

authRouter.post('/login', login)
authRouter.post('/register', register)
authRouter.get('/logout', authenticateUser ,logout)
authRouter.post('/verify', verifyEmail)
authRouter.post('/forgot-password', forgotPassword)
authRouter.post('/reset-password', resetPassword)


export const AuthRouter = authRouter