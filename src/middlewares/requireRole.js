export const verifyAuth = (req,res,next) => {

    const checkUser =  req.session?.user || null;

    if(checkUser){
        return next();
    }

    if(!checkUser){
        return res.status(401).json({
            message: "User doesn't exist"
        })
    }

} 

export const requireRole = (allowedRoles) => {
    return (req,res,next) => {
        const userRole = req.session?.user?.role;

        if(!userRole || allowedRoles.include(userRole)){
            return res.status(403).json({
                success: false,
                message: "you do not have permission to perform this action"
            });
        }

        return next();
    };
};