import { createUser, findUserByEmail, verifyPassword } from '../models/userModel';
import { generateToken } from '../utils/generateToken';

export const registerUser = async (name: string, email: string, password: string, role: 'uploader' | 'signer') => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) throw new Error('User already exists');

  const user = await createUser(name, email, password, role);
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user.id.toString())
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error('Invalid email or password');

  const valid = await verifyPassword(password, user.password);
  if (!valid) throw new Error('Invalid email or password');

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user.id.toString())
  };
};
