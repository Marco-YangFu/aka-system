import Papa from 'papaparse';

import { employeeSchema } from '@/schemas/zodSchemas';
import { normalizeHeader, stripBOM } from '@/utils/csvUtils';

type RawRow = Record<string, string>;

export async function parseEmployees(file: File) {
  const text = await file.text(); // ブラウザは自動でUTF-8解釈する
  const safe = stripBOM(text); // BOMケア
  const { data, meta, errors } = Papa.parse<RawRow>(safe, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (h) => normalizeHeader(h) ?? h, // 未対応ヘッダはそのまま残す
  });

  if (errors.length) {
    // CSVフォーマット崩れのエラー（パース段階）
    return { ok: false as const, parseErrors: errors };
  }

  // 必須ヘッダがあるか軽くチェック
  const cols = meta.fields ?? [];
  const missing = ['name', 'dept', 'email'].filter((c) => !cols.includes(c));
  if (missing.length) {
    return { ok: false as const, headerErrors: missing };
  }

  // Zodで一行ずつ検証（CSV先頭行はヘッダなので +2 で実行行番）
  const valid: Array<{ name: string; dept: string; email: string }> = [];
  const rowErrors: Array<{ line: number; issues: string[] }> = [];

  data.forEach((row, i) => {
    const candidate = {
      name: (row.name ?? '').trim(),
      dept: (row.dept ?? '').trim(),
      email: (row.email ?? '').trim(),
    };
    const res = employeeSchema.safeParse(candidate);
    if (res.success) valid.push(res.data);
    else {
      rowErrors.push({
        line: i + 2,
        issues: res.error.issues.map(
          (it) => `${it.path.join('.')}: ${it.message}`
        ),
      });
    }
  });

  if (rowErrors.length) {
    return { ok: false as const, rowErrors, validPartial: valid };
  }
  return { ok: true as const, rows: valid };
}
