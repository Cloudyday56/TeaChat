import jwt from "jsonwebtoken";
//create a token
export const generateToken= (userId,res) => {

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  //send the token in a cookie
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, //prevent XSS attacks
    sameSite: "strict", // Prevent CSRF attacks
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
  })

  return token;
}