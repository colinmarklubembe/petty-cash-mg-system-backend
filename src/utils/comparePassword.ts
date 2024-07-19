import bcrypt from "bcryptjs";

const comparePassword = (password: string, hashedPassword: string): boolean => {
  return bcrypt.compareSync(password, hashedPassword);
};

export default { comparePassword };
