import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';

import EmployeeForm, { type EmployeeFormValues } from './EmployeeForm';

import { supabase } from '@/lib/supabase';

type EmployeeRow = {
  id: string;
  name: string;
  dept: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
};

async function fetchEmployee(id: string): Promise<EmployeeRow> {
  const { data, error } = await supabase
    .from('employees')
    .select('id,name,dept,email,created_at,updated_at')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data as EmployeeRow;
}

async function updateEmployee(id: string, values: EmployeeFormValues) {
  const { error } = await supabase
    .from('employees')
    .update(values)
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export default function EmployeeEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const {
    data,
    isLoading,
    error: loadError,
  } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => fetchEmployee(id!),
    enabled: !!id,
  });

  const {
    mutateAsync,
    isPending,
    error: saveError,
  } = useMutation({
    mutationFn: (v: EmployeeFormValues) => updateEmployee(id!, v),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ['employees'] }), // 一覧を最新化
        qc.invalidateQueries({ queryKey: ['employee', id] }), // 詳細を最新化
      ]);
      navigate(`/employees/${id}`);
    },
  });

  if (!id) return <div className="p-6">不正なID</div>;
  if (isLoading) return <div className="p-6">読み込み中...</div>;
  if (loadError)
    return (
      <div className="p-6 text-red-600">
        エラー: {(loadError as Error).message}
      </div>
    );
  if (!data) return <div className="p-6">データが見つかりません</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">社員 編集</h1>
      {saveError && (
        <div className="text-sm text-red-600">エラー: {saveError.message}</div>
      )}
      <EmployeeForm
        defaultValues={{
          name: data.name ?? '',
          dept: data.dept ?? '',
          email: data.email ?? '',
        }}
        submitLabel={isPending ? '更新中…' : '更新'}
        onSubmit={async (v) => await mutateAsync(v)}
        cancelHref={`/employees/${id}`}
      />
    </div>
  );
}
