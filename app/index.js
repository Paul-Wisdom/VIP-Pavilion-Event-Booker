const app = require('./app');

const {serverPort} = require('./config/server.config')
const transporter = require('./utils/nodemailer-transporter');
const connectToDB = require('./utils/connectToDB');

connectToDB();
transporter.verify((error, success) => {
    if(error){
        console.log(error)
    }
    else{
        console.log(success);
        console.log("transporter is working")
    }
})

app.listen(serverPort, () => {
    console.log(`server running on port ${serverPort}`)
})

module.exports = app;

