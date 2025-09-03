import { z } from 'zod';

function toISOOrInvalid(s?: string | null) {
  if (!s) return null;
  const t = s.trim();
  if (!t) return null;
  // 例：2025/09/03 19:00:00 ⇒ 2025-09-03 19:00:00
  const normalized = t.replace(/[./]/g, '-');
  const d = new Date(normalized);
  return isNaN(d.getTime()) ? '__INVALID__' : d.toISOString();
}

export type ImportedRow = {
  id?: string; // "" or 数字文字列 or 未設定
  name?: string; // 必須
  dept?: string; // 任意
  email?: string; // 任意（空OK／あったらemail形式）
  created_at?: string; // 任意（空OK／あったら日付で解釈）
};

const RowSchema = z.object({
  id: z.string().trim().optional().or(z.literal('')),
  name: z.string().trim().min(1, '氏名は必須です'),
  dept: z.string().trim().optional().default(''),
  email: z
    .string()
    .trim()
    .email('メール形式が不正です')
    .optional()
    .or(z.literal('')),
  created_at: z.string().trim().optional().or(z.literal('')),
});

export type EmployeeValidated = {
  id: number | string | null;
  name: string;
  dept: string;
  email: string;
  created_at: string | null; // ISO or null
};

export function validateRows(rows: ImportedRow[]) {
  const ok: EmployeeValidated[] = [];
  const ng: { index: number; errors: string[]; row: ImportedRow }[] = [];

  rows.forEach((raw, i) => {
    const rowNum = i + 2; // 1行目ヘッダー想定で +1 更に人間の数え方で +1
    const parsed = RowSchema.safeParse(raw);

    if (!parsed.success) {
      ng.push({
        index: rowNum,
        errors: parsed.error.issues.map((e) => e.message),
        row: raw,
      });
      return;
    }

    const d = parsed.data;

    const id = !d.id
      ? null
      : /^\d+$/.test(d.id) // 数値
        ? Number(d.id)
        : /^[0-9a-fA-F-]{10,}$/.test(d.id) // UUIDっぽい文字列
          ? d.id
          : NaN;

    // 日付: 空ならnull、読めればISO、読めなければエラー
    const createdISO = toISOOrInvalid(d.created_at);

    const errors: string[] = [];
    if (d.id && Number.isNaN(id))
      errors.push('IDは数値またはUUIDにしてください');
    if (createdISO === '__INVALID__')
      errors.push('作成日が読めません（YYYY-MM-DD など）');

    if (errors.length) {
      ng.push({ index: rowNum, errors, row: raw });
      return;
    }

    ok.push({
      id,
      name: d.name,
      dept: d.dept ?? '',
      email: d.email ?? '',
      created_at: createdISO,
    });
  });

  return { ok, ng };
}
