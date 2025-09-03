import Papa from 'papaparse';

export type EmployeeRow = {
  id: number | string;
  name: string;
  dept: string;
  email: string;
  created_at: string; // ISO文字列
};

export function downloadEmployeeCsv(
  rows: EmployeeRow[],
  filename = 'employees.csv'
) {
  // 表示ヘッダーと並び順を固定
  const header = ['ID', '氏名', '部署', 'メール', '作成日'];
  const body = rows.map((r) => [
    String(r.id),
    r.name ?? '',
    r.dept ?? '',
    r.email ?? '',
    // Excelで読んで分かりやすい和暦ではなく、まずは日本ロケールの日時を
    new Date(r.created_at).toLocaleString('ja-JP'),
  ]);

  // ヘッダー行 + データ行を配列の配列で渡すと並びが安定
  const csvCore = Papa.unparse([header, ...body], {
    quotes: true, // 日本語やカンマを安全に
    delimiter: ',',
    newline: '\r\n', // Excel互換
  });

  // 先頭にBOMを付加してExcelの文字化け回避
  const csvWithBom = '\uFEFF' + csvCore;

  const blob = new Blob([csvWithBom], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}
