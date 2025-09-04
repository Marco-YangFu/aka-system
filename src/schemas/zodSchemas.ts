import { z } from 'zod';

export const employeeSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  dept: z.string().min(1, '部署は必須です'),
  email: z.string().email('メールアドレスの形式が不正です'),
});

// 型推論で便利に使える
export type Employee = z.infer<typeof employeeSchema>;
