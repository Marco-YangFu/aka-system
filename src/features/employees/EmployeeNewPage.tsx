import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import EmployeeForm, { type EmployeeFormValues } from './EmployeeForm';

import { supabase } from '@/lib/supabase';

async function createEmployee(values: EmployeeFormValues) {
  const { error } = await supabase.from('employees').insert(values);
  if (error) throw new Error(error.message);
}

export default function EmployeeNewPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: createEmployee,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['employees'] }); // 一覧を最新化
      navigate('/employees');
    },
  });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">社員 新規作成</h1>
      {error && (
        <div className="text-sm text-red-600">エラー: {error.message}</div>
      )}
      <EmployeeForm
        submitLabel={isPending ? '保存中' : '保存'}
        onSubmit={async (v) => await mutateAsync(v)}
        cancelHref="/employees"
      />
    </div>
  );
}
