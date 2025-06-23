import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token_cookie;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      role: decoded.role
    };
    next();
  } catch (error) {
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Session expired. Please log in again' });
    }
    return res.status(401).json({ message: 'Invalid authentication token' });
  }
};