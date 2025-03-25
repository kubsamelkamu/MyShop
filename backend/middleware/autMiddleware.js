import jwt from 'jsonwebtoken';

const protect = (req,res,next)=>{

    const  token = req.headers.authorization?.split(' ')[1];
    if(!token){
        res.status(401).json({message: 'Unauthorized , no token provided'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({message:'Invalid  or Token Expired'});
    }
};

export default protect;