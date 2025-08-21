const fs = require('fs');
const path = require('path');

// テストCSVデータの作成
const testCsvContent = `店舗名,URL,電話番号,住所,業種
テスト企業1,https://example.com,03-1234-5678,東京都渋谷区,IT
テスト企業2,https://google.com,03-9876-5432,東京都新宿区,サービス
テスト企業3,https://github.com,06-1111-2222,大阪府大阪市,IT`;

// テスト実行
async function runTest() {
  console.log('🧪 LINE Link Finder API テスト開始...\n');
  
  // テスト用CSVファイルの作成
  const testFilePath = path.join(__dirname, 'test-data.csv');
  fs.writeFileSync(testFilePath, testCsvContent);
  console.log('✅ テストCSVファイル作成完了');
  
  // APIエンドポイントのテスト（ローカル）
  const apiUrl = 'http://localhost:3000/api/scan';
  
  try {
    // FormDataの作成
    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', fs.createReadStream(testFilePath));
    
    console.log('📡 APIリクエスト送信中...');
    
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ APIレスポンス受信成功\n');
      console.log('検出結果:');
      console.log('=====================================');
      
      data.results.forEach((result, index) => {
        console.log(`\n企業 ${index + 1}: ${result.name}`);
        console.log(`  URL: ${result.url}`);
        console.log(`  LINE URLs: ${result.lineUrls?.length || 0}件`);
        console.log(`  LINE IDs: ${result.lineIds?.length || 0}件`);
        console.log(`  信頼度: ${Math.round((result.confidence || 0) * 100)}%`);
        
        if (result.error) {
          console.log(`  ⚠️ エラー: ${result.error}`);
        }
      });
      
      console.log('\n=====================================');
      console.log('🎉 テスト完了！');
      
      // 統計情報
      const totalCompanies = data.results.length;
      const detectedCompanies = data.results.filter(r => 
        (r.lineUrls?.length > 0 || r.lineIds?.length > 0)
      ).length;
      
      console.log(`\n📊 統計:`);
      console.log(`  総企業数: ${totalCompanies}`);
      console.log(`  LINE検出数: ${detectedCompanies}`);
      console.log(`  検出率: ${Math.round((detectedCompanies / totalCompanies) * 100)}%`);
      
    } else {
      console.error('❌ APIエラー:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('エラー詳細:', errorText);
    }
    
  } catch (error) {
    console.error('❌ テスト実行エラー:', error.message);
    console.log('\n💡 ヒント: サーバーが起動していることを確認してください');
    console.log('   npm run dev でサーバーを起動してから再実行してください');
  } finally {
    // クリーンアップ
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
      console.log('\n🧹 テストファイルをクリーンアップしました');
    }
  }
}

// 依存パッケージのチェック
function checkDependencies() {
  const requiredPackages = ['node-fetch', 'form-data'];
  const missingPackages = [];
  
  requiredPackages.forEach(pkg => {
    try {
      require.resolve(pkg);
    } catch (e) {
      missingPackages.push(pkg);
    }
  });
  
  if (missingPackages.length > 0) {
    console.log('📦 必要なパッケージをインストール中...');
    const { execSync } = require('child_process');
    execSync(`npm install ${missingPackages.join(' ')}`, { stdio: 'inherit' });
    console.log('✅ パッケージインストール完了\n');
  }
}

// メイン実行
console.log('===========================================');
console.log('   LINE Link Finder - 自動テストツール    ');
console.log('===========================================\n');

checkDependencies();
runTest();