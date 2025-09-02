import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';

import { supabase } from '@/lib/supabase';

type EmployeeRow = {
  id: number;
  name: string;
  dept: string;
  email: string;
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

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => fetchEmployee(id!),
    enabled: !!id,
  });

  if (!id) return <div className="p-6">不正なID</div>;
  if (isLoading) return <div className="p-6">読み込み中...</div>;
  if (error)
    return (
      <div className="p-6 text-red-600">エラー: {(error as Error).message}</div>
    );
  if (!data) return <div className="p-6">データが見つかりません</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">社員情報</h1>
        <div className="space-x-3">
          {/** 編集ページは後のステップで実装予定。現在ダミー遷移 */}
          <button
            className="underline disabled:opacity-50"
            disabled
            title="編集は次ステップで実装する"
          >
            編集
          </button>
          <button onClick={() => navigate('/employees')} className="underline">
            一覧へ
          </button>
        </div>
      </div>
      <div className="grid gap-2 text-sm">
        <div>
          <span className="font-semibold">ID:</span>
          {data.id}
        </div>
        <div>
          <span className="font-semibold">氏名:</span>
          {data.name}
        </div>
        <div>
          <span className="font-semibold">部署:</span>
          {data.dept}
        </div>
        <div>
          <span className="font-semibold">メール:</span>
          {data.email}
        </div>
        <div>
          <span className="font-semibold">作成日:</span>
          {new Date(data.created_at).toLocaleString()}
        </div>
        <div>
          <span className="font-semibold">更新日:</span>
          {new Date(data.updated_at).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
