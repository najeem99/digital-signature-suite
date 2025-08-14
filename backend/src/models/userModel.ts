import bcrypt from 'bcryptjs';
import prisma from '../prismaClient';

export const createUser = async (name: string, email: string, password: string, role: 'uploader' | 'signer') => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role
    }
  });
};

export const findUserByEmail = (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const verifyPassword = async (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};

export const findUsersByRole = async (role: 'uploader' | 'signer') => {
  return await prisma.user.findMany({
    where: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  });
};