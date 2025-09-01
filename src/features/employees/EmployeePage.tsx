import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';

type Employee = {
  id: string;
  name: string;
  dept: string | null;
  email: string | null;
  created_at: string;
};

export default function EmployeesPage() {
  const [data, setData] = useState<Employee[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('employees')
        .select('id,name,dept,email,created_at')
        .order('created_at', { ascending: false });
      if (error) setError(error.message);
      setData(data ?? null);
      setLoading(false);
    })();
  }, []);

  if (loading)
    return <p className="text-sm text-muted-foreground">読み込み中...</p>;
  if (error)
    return <p className="text-sm text-destructive">エラー： {error}</p>;
  if (!data?.length)
    return (
      <p className="text-sm text-muted-foreground">社員データがありません。</p>
    );

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">社員</h2>
      <div className="grid gap-2">
        {data.map((e) => (
          <div key={e.id} className="border rounded p-3 bg-card">
            <div className="font-medium">{e.name}</div>
            <div className="text-sm text-muted-foreground">
              {e.dept ?? '所属無し'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
