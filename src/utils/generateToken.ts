import jwt from "jsonwebtoken";

const generateToken = (tokenData: any) => {
  return jwt.sign(tokenData, process.env.JWT_SECRET!, {
    expiresIn: "48h",
  });
};

const generateEmailToken = (emailTokenData: any) => {
  return jwt.sign(emailTokenData, process.env.JWT_SECRET!, {
    expiresIn: "48h",
  });
};

export default { generateToken, generateEmailToken };
