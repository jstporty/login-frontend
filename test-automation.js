/**
 * 🤖 로그인/회원가입 자동화 테스트
 * 엑셀 파일에서 테스트 케이스를 읽어 실제 브라우저에서 실행
 * 결과를 엑셀 파일로 저장
 */
import { chromium } from 'playwright';
import XLSX from 'xlsx';
import fs from 'fs';

// 설정
const EXCEL_PATH = '/Users/mz02-horang/c드라이브/test-cases.xlsx';
const BASE_URL = 'http://localhost:5173';
const SLOW_MO = 500; // 각 동작 사이 딜레이 (밀리초)
const RESULTS_EXCEL = '/Users/mz02-horang/c드라이브/test-results.xlsx';
const RESULTS_JSON = '/Users/mz02-horang/c드라이브/test-results.json';

// 색상 출력
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

// 엑셀 파일 읽기
function readTestCases() {
  console.log(`${colors.cyan}📂 엑셀 파일 읽는 중: ${EXCEL_PATH}${colors.reset}\n`);
  
  const workbook = XLSX.readFile(EXCEL_PATH);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);
  
  console.log(`${colors.green}✅ ${data.length}개의 테스트 케이스 발견${colors.reset}\n`);
  return data;
}

// 대기 함수
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 회원가입 테스트
async function testRegister(page, testCase, index) {
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.magenta}🧪 테스트 #${index + 1}: REGISTER${colors.reset}`);
  console.log(`📝 설명: ${testCase.Description}`);
  console.log(`👤 Username: ${testCase.Username}`);
  console.log(`📧 Email: ${testCase.Email}`);
  console.log(`🔑 Password: ${testCase.Password}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  try {
    console.log('🌐 회원가입 페이지로 이동 중...');
    await page.goto(`${BASE_URL}/register`);
    await sleep(1000);

    console.log('⌨️  Username 입력 중...');
    await page.fill('input[name="username"]', String(testCase.Username));
    await sleep(300);

    console.log('⌨️  Email 입력 중...');
    await page.fill('input[name="email"]', String(testCase.Email));
    await sleep(300);

    console.log('⌨️  Password 입력 중...');
    await page.fill('input[name="password"]', String(testCase.Password));
    await sleep(300);

    console.log('⌨️  Password 확인 입력 중...');
    await page.fill('input[name="confirmPassword"]', String(testCase.Password));
    await sleep(500);

    console.log('🖱️  회원가입 버튼 클릭...');
    await page.click('button[type="submit"]');
    await sleep(2000);

    const currentUrl = page.url();
    const isSuccess = currentUrl.includes('/dashboard');
    
    let errorMessage = null;
    try {
      const errorElement = await page.$('[class*="errorBox"], [class*="errorText"]');
      if (errorElement) {
        errorMessage = await errorElement.textContent();
      }
    } catch (e) {}

    const result = {
      testNumber: index + 1,
      type: 'REGISTER',
      description: testCase.Description,
      username: testCase.Username,
      email: testCase.Email,
      expectedStatus: testCase.ExpectedStatus,
      expectedResult: testCase.ExpectedResult,
      actualResult: isSuccess ? 'SUCCESS' : 'FAIL',
      currentUrl,
      errorMessage,
      passed: (testCase.ExpectedResult === 'SUCCESS' && isSuccess) || 
              (testCase.ExpectedResult === 'FAIL' && !isSuccess),
      timestamp: new Date().toISOString(),
    };

    if (result.passed) {
      console.log(`${colors.green}✅ PASSED - 예상대로 동작함${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ FAILED - 예상과 다른 결과${colors.reset}`);
    }

    if (errorMessage) {
      console.log(`${colors.yellow}⚠️  에러 메시지: ${errorMessage}${colors.reset}`);
    }

    console.log(`🔗 현재 URL: ${currentUrl}\n`);
    
    return result;

  } catch (error) {
    console.log(`${colors.red}❌ 테스트 실행 중 오류: ${error.message}${colors.reset}\n`);
    return {
      testNumber: index + 1,
      type: 'REGISTER',
      description: testCase.Description,
      error: error.message,
      passed: false,
      timestamp: new Date().toISOString(),
    };
  }
}

// 로그인 테스트
async function testLogin(page, testCase, index) {
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.magenta}🧪 테스트 #${index + 1}: LOGIN${colors.reset}`);
  console.log(`📝 설명: ${testCase.Description}`);
  console.log(`👤 Username: ${testCase.Username}`);
  console.log(`🔑 Password: ${testCase.Password}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  try {
    console.log('🌐 로그인 페이지로 이동 중...');
    await page.goto(`${BASE_URL}/login`);
    await sleep(1000);

    console.log('⌨️  Username 입력 중...');
    await page.fill('input[name="username"]', String(testCase.Username));
    await sleep(300);

    console.log('⌨️  Password 입력 중...');
    await page.fill('input[name="password"]', String(testCase.Password));
    await sleep(500);

    console.log('🖱️  로그인 버튼 클릭...');
    await page.click('button[type="submit"]');
    await sleep(2000);

    const currentUrl = page.url();
    const isSuccess = currentUrl.includes('/dashboard');
    
    let errorMessage = null;
    try {
      const errorElement = await page.$('[class*="errorBox"]');
      if (errorElement) {
        errorMessage = await errorElement.textContent();
      }
    } catch (e) {}

    const result = {
      testNumber: index + 1,
      type: 'LOGIN',
      description: testCase.Description,
      username: testCase.Username,
      expectedStatus: testCase.ExpectedStatus,
      expectedResult: testCase.ExpectedResult,
      actualResult: isSuccess ? 'SUCCESS' : 'FAIL',
      currentUrl,
      errorMessage,
      passed: (testCase.ExpectedResult === 'SUCCESS' && isSuccess) || 
              (testCase.ExpectedResult === 'FAIL' && !isSuccess),
      timestamp: new Date().toISOString(),
    };

    if (result.passed) {
      console.log(`${colors.green}✅ PASSED - 예상대로 동작함${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ FAILED - 예상과 다른 결과${colors.reset}`);
    }

    if (errorMessage) {
      console.log(`${colors.yellow}⚠️  에러 메시지: ${errorMessage}${colors.reset}`);
    }

    console.log(`🔗 현재 URL: ${currentUrl}\n`);
    
    return result;

  } catch (error) {
    console.log(`${colors.red}❌ 테스트 실행 중 오류: ${error.message}${colors.reset}\n`);
    return {
      testNumber: index + 1,
      type: 'LOGIN',
      description: testCase.Description,
      error: error.message,
      passed: false,
      timestamp: new Date().toISOString(),
    };
  }
}

// 메인 실행 함수
async function runTests() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`${colors.cyan}🚀 자동화 테스트 시작${colors.reset}`);
  console.log(`${'='.repeat(60)}\n`);

  const testCases = readTestCases();
  
  console.log(`${colors.cyan}🌐 크롬 브라우저 실행 중...${colors.reset}\n`);
  const browser = await chromium.launch({
    headless: false,
    slowMo: SLOW_MO,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  
  const page = await context.newPage();
  
  const results = [];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    let result;

    if (testCase.TestType === 'REGISTER') {
      result = await testRegister(page, testCase, i);
    } else if (testCase.TestType === 'LOGIN') {
      result = await testLogin(page, testCase, i);
    }

    results.push(result);
    await sleep(1500);
  }

  // 결과 저장 - JSON
  console.log(`${colors.cyan}💾 테스트 결과 저장 중...${colors.reset}`);
  fs.writeFileSync(RESULTS_JSON, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`${colors.green}✅ JSON 저장 완료: ${RESULTS_JSON}${colors.reset}`);

  // 결과 저장 - 엑셀
  const excelResults = results.map((r) => ({
    '테스트번호': r.testNumber,
    '테스트타입': r.type,
    '설명': r.description,
    '사용자명': r.username || '-',
    '이메일': r.email || '-',
    '예상결과': r.expectedResult || '-',
    '실제결과': r.actualResult || '-',
    '통과여부': r.passed ? 'PASS' : 'FAIL',
    '에러메시지': r.errorMessage || r.error || '-',
    '최종URL': r.currentUrl || '-',
    '실행시간': r.timestamp,
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(excelResults);
  
  const colWidths = [
    { wch: 10 },
    { wch: 12 },
    { wch: 35 },
    { wch: 18 },
    { wch: 25 },
    { wch: 12 },
    { wch: 12 },
    { wch: 10 },
    { wch: 40 },
    { wch: 35 },
    { wch: 25 },
  ];
  worksheet['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, '테스트결과');
  XLSX.writeFile(workbook, RESULTS_EXCEL);
  console.log(`${colors.green}✅ 엑셀 저장 완료: ${RESULTS_EXCEL}${colors.reset}\n`);

  // 요약 출력
  console.log(`\n${'='.repeat(60)}`);
  console.log(`${colors.cyan}📊 테스트 결과 요약${colors.reset}`);
  console.log(`${'='.repeat(60)}\n`);

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  console.log(`${colors.green}✅ PASSED: ${passed}${colors.reset}`);
  console.log(`${colors.red}❌ FAILED: ${failed}${colors.reset}`);
  console.log(`📝 총 테스트: ${results.length}\n`);

  if (failed > 0) {
    console.log(`${colors.yellow}⚠️  실패한 테스트:${colors.reset}`);
    results
      .filter(r => !r.passed)
      .forEach(r => {
        console.log(`  - 테스트 #${r.testNumber}: ${r.description}`);
        if (r.error) console.log(`    에러: ${r.error}`);
        if (r.errorMessage) console.log(`    메시지: ${r.errorMessage}`);
      });
    console.log('');
  }

  console.log(`${colors.cyan}🎬 5초 후 브라우저를 종료합니다...${colors.reset}`);
  await sleep(5000);

  await browser.close();
  console.log(`${colors.green}✅ 테스트 완료!${colors.reset}\n`);
}

// 실행
runTests().catch(error => {
  console.error(`${colors.red}❌ 치명적 오류:${colors.reset}`, error);
  process.exit(1);
});

