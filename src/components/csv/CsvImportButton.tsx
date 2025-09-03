import Papa from 'papaparse';
import { useRef } from 'react';

type RawRow = Record<string, string | undefined>;

// 見出しの正規化マップ
const HEADER_MAP: Record<
  string,
  'id' | 'name' | 'dept' | 'email' | 'created_at'
> = {
  ID: 'id',
  id: 'id',
  氏名: 'name',
  name: 'name',
  部署: 'dept',
  dept: 'dept',
  メール: 'email',
  email: 'email',
  作成日: 'created_at',
  created_at: 'created_at',
};

function normalizeRow(r: Record<string, string | undefined>) {
  return {
    id: r.id ?? '',
    name: r.name ?? '',
    dept: r.dept ?? '',
    email: r.email ?? '',
    created_at: r.created_at ?? '',
  };
}

export default function CsvImportButton({
  onLoaded,
}: {
  onLoaded?: (rows: Array<ReturnType<typeof normalizeRow>>) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePick = () => inputRef.current?.click();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse<RawRow>(file, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: (h) => {
        const cleaned = h.replace(/^\uFEFF/, '').trim(); // 先頭BOM除去
        return HEADER_MAP[cleaned] ?? cleaned;
      },
      complete: (res) => {
        const rows = res.data
          .map(normalizeRow)
          .filter((r) => r.name || r.email || r.dept);
        console.log('[CSV] loaded (first 5):', rows.slice(0, 5));
        console.log('[CSV] total:', rows.length);
        onLoaded?.(rows);
        alert(`CSV読み込み: ${rows.length}件`);
        e.target.value = ''; // 同じファイルを連続選択できるようにクリア
      },
      error: (err) => {
        console.error(err);
        alert('CSVの読み込みに失敗しました');
        e.target.value = '';
      },
    });
  };

  return (
    <>
      <input
        type="file"
        className="hidden"
        ref={inputRef}
        accept=".csv,text/csv"
        onChange={handleFile}
      />
      <button onClick={handlePick} className="px-3 py-2 rounded border">
        CSVインポート（読み込み）
      </button>
    </>
  );
}
