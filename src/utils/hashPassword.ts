import bcrypt from "bcryptjs";

const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export default hashPassword;
