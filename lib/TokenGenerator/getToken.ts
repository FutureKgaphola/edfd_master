import jwt from 'jsonwebtoken';
export const CreateToken = (id:string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET ?? "", { expiresIn: "2d" });
}