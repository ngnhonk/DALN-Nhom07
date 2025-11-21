import jwt from "jsonwebtoken";
import { env } from "@/common/utils/envConfig";

const { JWT_SECRET, JWT_TIME } = env;

export interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export const createJwtToken = (information: UserData): string => {
  return jwt.sign(information, JWT_SECRET, {
    expiresIn: Number(JWT_TIME) * 60 * 60,
  });
};

export const verifyJwtToken = (jwtToken: string): UserData => {
  const decoded = jwt.verify(jwtToken, JWT_SECRET) as {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
  };

  const result: UserData = {
    id: decoded.id,
    name: decoded.name,
    email: decoded.email,
    phone: decoded.phone,
    role: decoded.role,
  };

  return result;
};
