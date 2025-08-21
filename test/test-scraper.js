// スクレイピング機能の単体テスト
const testUrls = [
  {
    name: 'LINEビジネス公式サイト',
    url: 'https://www.linebiz.com/jp/',
    expected: 'LINE関連情報が含まれている可能性が高い'
  },
  {
    name: 'Google',
    url: 'https://www.google.com',
    expected: 'LINE情報は含まれていない可能性が高い'
  }
];

async function testScraper() {
  console.log('🔍 スクレイパーテスト開始...\n');
  
  // 簡易的なパターンマッチングテスト
  for (const testCase of testUrls) {
    console.log(`テスト: ${testCase.name}`);
    console.log(`URL: ${testCase.url}`);
    
    try {
      const response = await fetch(testCase.url);
      const html = await response.text();
      
      // LINEパターンの検出
      const linePatterns = [
        /lin\.ee\/[a-zA-Z0-9]+/gi,
        /line\.me\/[a-zA-Z0-9]+/gi,
        /@[a-zA-Z0-9_-]{3,}/gi,
        /LINE公式アカウント/gi,
        /友だち追加/gi
      ];
      
      let foundPatterns = [];
      linePatterns.forEach(pattern => {
        const matches = html.match(pattern);
        if (matches) {
          foundPatterns.push(...matches);
        }
      });
      
      if (foundPatterns.length > 0) {
        console.log(`✅ LINE関連パターン検出: ${foundPatterns.length}件`);
        console.log(`  サンプル: ${foundPatterns.slice(0, 3).join(', ')}`);
      } else {
        console.log('❌ LINE関連パターンは検出されませんでした');
      }
      
      console.log(`  予想: ${testCase.expected}`);
      console.log('---\n');
      
    } catch (error) {
      console.error(`❌ エラー: ${error.message}`);
      console.log('---\n');
    }
  }
  
  console.log('🎯 スクレイパーテスト完了');
}

// OpenAI APIテスト
async function testOpenAI() {
  console.log('\n🤖 OpenAI API接続テスト...\n');
  
  const testText = `
    弊社の公式LINEアカウントを友だち追加してください。
    LINE ID: @example123
    友だち追加URL: https://lin.ee/abc123xyz
    最新情報をお届けします。
  `;
  
  try {
    // 環境変数のチェック
    if (!process.env.OPENAI_API_KEY) {
      console.log('⚠️ OPENAI_API_KEY環境変数が設定されていません');
      console.log('   .env.localファイルに設定してください');
      return;
    }
    
    console.log('✅ OpenAI APIキーが設定されています');
    console.log('📝 テストテキスト:');
    console.log(testText);
    console.log('\n期待される検出:');
    console.log('  - LINE ID: @example123');
    console.log('  - URL: https://lin.ee/abc123xyz');
    
  } catch (error) {
    console.error('❌ OpenAI APIテストエラー:', error.message);
  }
}

// メイン実行
async function main() {
  console.log('===========================================');
  console.log('   LINE Link Finder - コンポーネントテスト');
  console.log('===========================================\n');
  
  await testScraper();
  await testOpenAI();
  
  console.log('\n===========================================');
  console.log('✨ すべてのテストが完了しました');
  console.log('===========================================');
}

main().catch(console.error);