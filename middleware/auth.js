const { UNAUTHORIZED } = require("../helpers/status-code");

async function verifyToken(req, reply) {
    try {
        const accessorEmail = req.headers.userName || ""
        const decoded = await req.jwtVerify();
        // if(accessorEmail === decoded.email ){
        //     reply.code(401).send({ 
        //         code : UNAUTHORIZED,
        //         Message : "Invaild Token...!"}) 
        // }
        // console.log(decoded.email)
        await req.jwtVerify()
        return { success : true}
    } catch (error) {
        reply.code(401).send({ 
            code : UNAUTHORIZED,
            Message : "Access Denied...!"}) 
    }
}

module.exports = {
    verifyToken,
  };