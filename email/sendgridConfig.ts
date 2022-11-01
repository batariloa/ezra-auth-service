
require('dotenv').config()
const sendgrid = require('@sendgrid/mail')

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
const FRONTEND_URL = "localhost:4200"

sendgrid.setApiKey(SENDGRID_API_KEY)

export async function sendVerificationEmail(to:string, verificationToken:string, origin:string){

const link = `http://${origin}/user/verify?token=${verificationToken}&email=${to}}`

const email = {
    from: 'batarilocore@gmail.com',
    to: to,
    subject: 'Verification Email',
    text: 'Click the following link to verify your Erza email: ',
    html: `<h1>SendGrid Test</h1><p>Click the <a href="${link}"> following link </a>to verify your Erza email!</p>`
}

sendgrid.send(email)
.then((response:any) => {
    console.log('SendGrid Email sent: ' + response)
})
.catch((error:any) => {
    console.error(error)
})

}


export async function sendResetPasswordEmail(name:string, to:string, token:string, origin:string){
    const resetLink = `http://${FRONTEND_URL}/reset-password?email=${to}&token=${token}`
    const message = `<p>Please reset password by clicking on the following link: 
    <a href="${resetLink}">Reset password</a></p>`   

    const email = {
        from: 'batarilocore@gmail.com',
        to: to,
        subject: 'Verification Email',
        text: 'Click the following link to reset password: ',
        html: `<h1>Reset password</h1><p>Click the <a href="${resetLink}"> following link </a>to reset your password!</p>`
    }

    sendgrid.send(email)
.then((response:any) => {
    console.log('SendGrid Email sent: ' + response)
})
.catch((error:any) => {
    console.error(error)
})

}