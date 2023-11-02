import bcrypt from 'bcrypt';

// Function to hash a password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

// Function to compare a raw password with its hashed version
export async function comparePassword(rawPassword: string, hashedPassword: string): Promise<boolean> {
  const match = await bcrypt.compare(rawPassword, hashedPassword);
  return match;
}

