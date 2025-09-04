export const stripBOM = (s: string) => s.replace(/^\uFEFF/, '');

const headerMap: Record<string, 'name' | 'dept' | 'email'> = {
  name: 'name',
  氏名: 'name',
  名前: 'name',
  dept: 'dept',
  部署: 'dept',
  課: 'dept',
  email: 'email',
  メール: 'email',
  メールアドレス: 'email',
};

// ヘッダ候補を正規化（例："メール" ⇒ email）
export function normalizeHeader(
  h: string
): 'name' | 'dept' | 'email' | undefined {
  const key = stripBOM(h.trim().toLowerCase());
  return headerMap[key];
}
