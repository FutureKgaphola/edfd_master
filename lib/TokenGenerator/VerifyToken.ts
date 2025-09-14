import jwt from "jsonwebtoken";

export const VerifyToken = (token: string) => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT secret is not defined in environment variables.");
    }
    
    // Verify the token
    const decoded = jwt.verify(token, secret);
    return { valid: decoded ? true : false, decoded };
  } catch (error: any) {
    // Handle verification errors
    return { valid: false, error: error.message };
  }
};
