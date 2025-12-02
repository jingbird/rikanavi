// Vercel Serverless Function for Chat API
// POST /api/chat

export default async function handler(req, res) {
  // CORSヘッダー
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONSリクエスト（プリフライト）
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POSTメソッドのみ許可
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, progress, quizResults } = req.body;

    // リクエストのバリデーション
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // APIキーの取得
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY is not set');
      return res.status(500).json({ error: 'API key not configured' });
    }

    // システムプロンプトの生成
    const systemPrompt = generateSystemPrompt(progress, quizResults);

    // Claude APIを呼び出し
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API Error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: 'Claude API request failed',
        details: errorText 
      });
    }

    const data = await response.json();
    const assistantMessage = data.content[0].text;

    // レスポンスを返す
    return res.status(200).json({ message: assistantMessage });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

// システムプロンプトを生成する関数
function generateSystemPrompt(progress, quizResults) {
  // 完了済みの章とテスト結果を取得
  const completedChapters = [];
  const testResults = [];

  if (progress) {
    Object.keys(progress).forEach(chapterId => {
      if (progress[chapterId]) {
        completedChapters.push(chapterId);
      }
    });
  }

  if (quizResults) {
    Object.keys(quizResults).forEach(chapterId => {
      const result = quizResults[chapterId];
      testResults.push(`${chapterId}: ${result.score}点`);
    });
  }

  // 全章のリスト（カリキュラムデータ）- ページ情報付き
  const allChapters = [
    // 1年生 (13章)
    '1-1-1 第1章　生物の観察と分類のしかた（1年生・生命）【P.13～26】',
    '1-1-2 第2章　植物の分類（1年生・生命）【P.27～44】',
    '1-1-3 第3章　動物の分類（1年生・生命）【P.45～61】',
    '1-2-1 第1章　身のまわりの物質とその性質（1年生・粒子）【P.75～92】',
    '1-2-2 第2章　気体の性質（1年生・粒子）【P.93～102】',
    '1-2-3 第3章　水溶液の性質（1年生・粒子）【P.103～116】',
    '1-2-4 第4章　物質の姿と状態変化（1年生・粒子）【P.117～133】',
    '1-3-1 第1章　光の世界（1年生・エネルギー）【P.145～162】',
    '1-3-2 第2章　音の世界（1年生・エネルギー）【P.163～170】',
    '1-4-1 第3章　力の世界（1年生・エネルギー）【P.171～185】',
    '1-4-2 第1章　火を吹く大地（1年生・地球）【P.199～212】',
    '1-4-3 第2章　動き続ける大地（1年生・地球）【P.213～224】',
    '1-4-4 第3章　地層から読み取る大地の変化（1年生・地球）【P.225～241】',

    // 2年生 (15章)
    '2-1-1 第1章 物質のなり立ち（2年生・粒子）【P.15-34】',
    '2-1-2 第2章 物質どうしの化学変化（2年生・粒子）【P.35-48】',
    '2-1-3 第3章 酸素がかかわる化学変化（2年生・粒子）【P.49-62】',
    '2-1-4 第4章 化学変化と物質の質量（2年生・粒子）【P.63-72】',
    '2-1-5 第5章 化学変化とその利用（2年生・粒子）【P.73-79】',
    '2-2-1 第1章 生物と細胞（2年生・生命）【P.91-108】',
    '2-2-2 第2章 植物のからだのつくりとはたらき（2年生・生命）【P.109-128】',
    '2-2-3 第3章 動物のからだのつくりとはたらき（2年生・生命）【P.129-148】',
    '2-2-4 第4章 刺激と反応（2年生・生命）【P.149-160】',
    '2-3-1 第1章　気象の観測（2年生・地球）【P.173-196】',
    '2-3-2 第2章　雲のでき方と前線（2年生・地球）【P.197-208】',
    '2-3-3 第3章　大気の動きと日本の天気（2年生・地球）【P.209-225】',
    '2-4-1 第1章 静電気と電流（2年生・エネルギー）【P.237-248】',
    '2-4-2 第2章 電流の性質（2年生・エネルギー）【P.249-272】',
    '2-4-3 第3章 電流と磁界（2年生・エネルギー）【P.273-289】',

    // 3年生 (18章)
    '3-1-1 第1章 水溶液とイオン（3年生・粒子）【P.11-28】',
    '3-1-2 第2章 酸，アルカリとイオン（3年生・粒子）【P.29-46】',
    '3-1-3 第3章 化学変化と電池（3年生・粒子）【P.47-65】',
    '3-2-1 第1章 生物の成長と生殖（3年生・生命）【P.77-94】',
    '3-2-2 第2章 遺伝の規則性と遺伝子（3年生・生命）【P.95-108】',
    '3-2-3 第3章 生物の多様性と進化（3年生・生命）【P.109-121】',
    '3-3-1 第1章 物体の運動（3年生・エネルギー）【P.133-146】',
    '3-3-2 第2章 力のはたらき方（3年生・エネルギー）【P.147-162】',
    '3-3-3 第3章 エネルギーと仕事（3年生・エネルギー）【P.163-183】',
    '3-4-1 プロローグ 星空をながめよう（3年生・地球）【P.194-200】',
    '3-4-2 第1章 地球の運動と天体の動き（3年生・地球）【P.201-222】',
    '3-4-3 第2章 月と金星の見え方（3年生・地球）【P.223-234】',
    '3-4-4 第3章 宇宙の広がり（3年生・地球）【P.235-243】',
    '3-5-1 第1章 自然のなかの生物（3年生・地球）【P.255-268】',
    '3-5-2 第2章 自然環境の調査と保全（3年生・地球）【P.269-278】',
    '3-5-3 第3章 科学技術と人間（3年生・地球）【P.279-296】',
    '3-5-4 地域とつながる　自然災害と地域のかかわりを学ぶ（3年生・地球）【P.297-300】',
    '3-5-5 終章 持続可能な社会をつくるために（3年生・地球）【P.301-309】',
  ];

  return `あなたは中学理科の学習ガイド「りかナビ先生」です。生徒の学習を優しくサポートしてください。

【あなたの役割】
1. 学校での学習進度（教科書のページ番号など）を聞いて、該当する章を提案する
2. 理科に関する質問に答える（わかりやすく、中学生レベルで）
3. 次に学習すべき内容をアドバイスする
4. 興味を持ったことについて一緒に考える

【学習進捗】
完了済みの章: ${completedChapters.length > 0 ? completedChapters.join(', ') : 'まだありません'}
確認テスト結果: ${testResults.length > 0 ? testResults.join(', ') : 'まだありません'}

【全カリキュラム（中学理科）】
${allChapters.join('\n')}

【会話のコツ】
- 親しみやすく、絵文字も使ってOK
- 長すぎない回答を心がける（3-5行程度）
- 必要に応じて、りかナビの機能（確認テスト、動画など）を勧める
- 「〜章の内容を学習してみましょう」と具体的に提案する
- 生徒の自主性を尊重し、押し付けにならないように`;
}
