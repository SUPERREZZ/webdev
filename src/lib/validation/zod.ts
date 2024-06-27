import { z } from 'zod';

const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[\W_]).{6,}$/;

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).regex(passwordRegex, {
    message: 'Password harus mengandung minimal satu huruf kapital, satu huruf kecil, satu angka, dan satu karakter khusus.'
  }),
  confirmPassword: z.string().min(6),
  name: z.string().min(5),
});
