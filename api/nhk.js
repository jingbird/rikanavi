// Vercel Serverless Function for NHK for School API Proxy
// GET /api/nhk?cscode=XXXXXXXXXXXXXXXX

export default async function handler(req, res) {
  // CORSヘッダー
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONSリクエスト（プリフライト）
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GETメソッドのみ許可
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cscode } = req.query;

    // リクエストのバリデーション
    if (!cscode) {
      return res.status(400).json({ error: 'cscode parameter is required' });
    }

    // cscodeが16桁の数字かどうか確認
    if (!/^\d{16}$/.test(cscode)) {
      return res.status(400).json({ error: 'Invalid cscode format. Must be 16 digits.' });
    }

    // APIキーの取得
    const apiKey = process.env.NHK_API_KEY;
    if (!apiKey) {
      console.error('NHK_API_KEY is not set');
      return res.status(500).json({ error: 'API key not configured' });
    }

    // NHK for School APIを呼び出し
    const url = `https://api.nhk.or.jp/school/v2/nfsvideos/cscode/${cscode}?apikey=${apiKey}&perpage=10`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NHK API Error:', response.status, errorText);
      return res.status(response.status).json({
        error: 'NHK API request failed',
        details: errorText
      });
    }

    const data = await response.json();

    // レスポンスを返す
    return res.status(200).json(data);

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}
