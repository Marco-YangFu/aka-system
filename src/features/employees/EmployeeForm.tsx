import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const employeeSchema = z.object({
  name: z.string().min(1, '氏名は必須です'),
  dept: z.string().min(1, '部署は必須です'),
  email: z.string().email('メール形式が不正です'),
});
export type EmployeeFormValues = z.infer<typeof employeeSchema>;

export default function EmployeeForm(props: {
  defaultValues?: Partial<EmployeeFormValues>;
  onSubmit: (v: EmployeeFormValues) => Promise<void> | void;
  submitLabel?: string;
  cancelHref?: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: { name: '', dept: '', email: '', ...props.defaultValues },
  });

  return (
    <form
      onSubmit={handleSubmit(props.onSubmit)}
      className="max-w-lg space-y-4"
      noValidate
    >
      <div>
        <label className="block text-sm font-medium mb-1">氏名</label>
        <input
          {...register('name')}
          className="w-full rounded border px-3 py-2"
        />
        {errors.name && (
          <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">部署</label>
        <input
          {...register('dept')}
          className="w-full rounded border px-3 py-2"
        />
        {errors.dept && (
          <p className="text-xs text-red-600 mt-1">{errors.dept.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">メール</label>
        <input
          type="email"
          inputMode="email"
          {...register('email')}
          className="w-full rounded border px-3 py-2"
        />
        {errors.email && (
          <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
        )}
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded border px-4 py-2 disabled:opacity-50"
        >
          {props.submitLabel ?? '保存'}
        </button>
        <a
          href={props.cancelHref ?? '/employees'}
          className="underline px-2 py-2"
        >
          キャンセル
        </a>
      </div>
    </form>
  );
}
