import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import CsvImportButton from '@/components/csv/CsvImportButton';
import { validateRows } from '@/components/csv/validateCsv';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabase';
import { downloadEmployeeCsv, EmployeeRow } from '@/utils/exportCsv';

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

async function deleteEmployee(id: string) {
  const { error } = await supabase.from('employees').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export default function EmployeesPage() {
  const [data, setData] = useState<Employee[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const qc = useQueryClient();

  const { mutate: remove, isPending } = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: (_data, id) => {
      // サーバー削除成功 ⇒ 画面からも同時に消去
      setData((prev) => (prev ? prev.filter((e) => e.id !== id) : prev));
      // キャッシュも無効化（他画面との整合）
      qc.invalidateQueries({ queryKey: ['employees'] });
    },
  });

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
      <div className="flex items-center justify-end gap-2">
        <CsvImportButton
          onLoaded={(rows) => {
            const { ok, ng } = validateRows(rows);
            console.log('OK(先頭3)', ok.slice(0, 3));
            console.table(ng);
            alert(`検証結果: OK ${ok.length} / NG ${ng.length}`);
            // 次ステップで: NG一覧をUI表示にする
          }}
        />
        <button
          className="px-3 py-2 rounded border"
          onClick={() => {
            // Employee -> EmployeeRow へ最小マッピング
            const rows: EmployeeRow[] = (data ?? []).map((e) => ({
              id: e.id,
              name: e.name,
              dept: e.dept ?? '',
              email: e.email ?? '',
              created_at: e.created_at,
            }));
            downloadEmployeeCsv(rows);
          }}
        >
          CSV出力（表示中）
        </button>
      </div>
      <div className="grid gap-2">
        {data.map((e) => {
          const url = getAvatarUrl(e.avatar_path);
          return (
            <div key={e.id} className="border rounded p-3 bg-card">
              <div className="flex items-center gap-3">
                <Avatar style={{ width: 48, height: 48 }} className="shrink-0">
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
                {/* ボタン群を右端に配置 */}
                <div className="flex gap-2">
                  <a href={`/employees/${e.id}`} className="underline text-sm">
                    詳細
                  </a>
                  <a
                    href={`/employees/${e.id}/edit`}
                    className="underline text-sm"
                  >
                    編集
                  </a>
                  <button
                    onClick={() => {
                      if (!confirm('本当に削除しますか？')) return;
                      remove(e.id);
                    }}
                    disabled={isPending}
                    className="text-red-600 underline text-sm disabled:opacity-50"
                  >
                    削除
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
