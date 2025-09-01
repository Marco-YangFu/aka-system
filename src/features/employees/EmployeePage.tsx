import { useEffect, useState } from 'react';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabase';

type Employee = {
  id: string;
  name: string;
  dept: string | null;
  email: string | null;
  created_at: string;
  avatar_path: string | null;
};

const getAvatarUrl = (path?: string | null) =>
  path
    ? supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl
    : null;
const initials = (name: string) => name.slice(0, 2); // 和文は先頭2文字で簡易に表記

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
        .select('id,name,dept,email,created_at,avatar_path')
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
        {data.map((e) => {
          const url = getAvatarUrl(e.avatar_path);
          return (
            <div key={e.id} className="border rounded p-3 bg-card">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 shrink-0">
                  {url ? (
                    <AvatarImage
                      src={url}
                      alt={e.name}
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="text-xs">
                      {initials(e.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <div className="font-medium">{e.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {e.dept ?? '部署無し'} ・ {e.email ?? '-'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
