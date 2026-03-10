import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const OUTPUT_PATH = path.join(__dirname, "..", "compatibilityData.json");

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("GEMINI_API_KEY not found in .env");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const MBTI_LIST = [
  "ISTJ","ISFJ","INFJ","INTJ",
  "ISTP","ISFP","INFP","INTP",
  "ESTP","ESFP","ENFP","ENTP",
  "ESTJ","ESFJ","ENFJ","ENTJ"
];

function buildPrompt(parent, child) {
  return `
너는 MBTI 인지기능 기반 부모-자녀 갈등 분석 전문가다. 최대한 핵심만 간결하고 빠르게 작성하라.

입력값:
- 부모 MBTI: ${parent}
- 자녀 MBTI: ${child}

출력 목표:
단순 성격 설명이 아니라, "인지 기능 충돌"을 기반으로 핵심 갈등 메커니즘과 대화 스크립트를 제공하라.

먼저 다음 로직에 따라 궁합 점수(1~5점)를 계산하여 최상단에 제시하라.
[점수 계산 로직]
1. 기본 점수 3점에서 시작
2. 주기능 정렬: 동일 주기능(+1), 같은 축(+0.5), 완전 반대 축(-1), 부모 1기능=자녀 4기능(-1)
3. 판단 축 정렬: 같은 판단 축(+0.5), 보완 관계(+0.5), 직접 충돌(-0.5)
4. 인식 축 정렬: 같은 인식 축(+0.5), 보완 관계(+0.5), 직접 충돌(-0.5)
5. 열등 기능 자극: 부모 1기능이 자녀 열등 기능 자극(-0.5), 부모 보조기능이 자녀 열등 기능 보완(+0.5)
6. 최종 점수는 1~5 사이로 보정 (반올림)

출력 형식은 반드시 아래 구조를 따를 것.

-------------------------------------

### 📊 궁합 점수: [계산된 점수] / 5
(점수에 대한 1~2줄의 짧은 해석)

### [1] 🔎 핵심 충돌 원인
(한 문단으로 짧게 요약)
- 부모/자녀 주기능 차이
- 충돌 지점 핵심 정의

### [2] 🎯 주요 갈등 상황 3가지
1. **공부/과제**: (1~2줄 설명)
2. **생활습관**: (1~2줄 설명)
3. **감정표현**: (1~2줄 설명)

### [3] 🧠 부모 행동 수정 가이드
**🚫 피해야 할 행동 2가지**
1. (내용)
2. (내용)

**✅ 추천하는 행동 2가지**
1. (내용)
2. (내용)

### [4] 💬 핵심 대화 스크립트 2개
(실제 대화처럼 작성: 부모 → 자녀 → 부모 대응)

**상황 1:**
- 부모: "..."
- 자녀: "..."
- 부모: "..."

**상황 2:**
- 부모: "..."
- 자녀: "..."
- 부모: "..."

-------------------------------------

톤:
전문적이되 과도하게 심리학적 용어 남발 금지.
구체적이고 실행 가능한 문장으로 핵심만 짧게 작성.
  `;
}

async function generateOne(parent, child) {
  const key = `${parent}_${child}`;
  const prompt = buildPrompt(parent, child);

  const result = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  return { key, text: result.text };
}

async function main() {
  let data = {};
  if (fs.existsSync(OUTPUT_PATH)) {
    try {
      data = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8"));
    } catch { data = {}; }
  }

  const total = MBTI_LIST.length * MBTI_LIST.length;
  let done = Object.keys(data).length;
  console.log(`Starting generation: ${done}/${total} already done.`);

  const CONCURRENCY = 5;

  for (let i = 0; i < MBTI_LIST.length; i++) {
    const parent = MBTI_LIST[i];
    for (let j = 0; j < MBTI_LIST.length; j += CONCURRENCY) {
      const batch = MBTI_LIST.slice(j, j + CONCURRENCY);
      const tasks = batch
        .filter(child => !data[`${parent}_${child}`])
        .map(child => generateOne(parent, child));

      if (tasks.length === 0) continue;

      try {
        const results = await Promise.all(tasks);
        for (const r of results) {
          data[r.key] = r.text;
          done++;
        }
        fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2), "utf-8");
        console.log(`[${done}/${total}] ${parent} batch done`);
      } catch (err) {
        console.error(`Error on ${parent} batch:`, err.message);
        fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2), "utf-8");
        await new Promise(r => setTimeout(r, 5000));
        for (const child of batch) {
          if (data[`${parent}_${child}`]) continue;
          try {
            const r = await generateOne(parent, child);
            data[r.key] = r.text;
            done++;
            fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2), "utf-8");
            console.log(`[${done}/${total}] ${parent}_${child} (retry ok)`);
          } catch (e2) {
            console.error(`Failed ${parent}_${child}:`, e2.message);
            await new Promise(r => setTimeout(r, 3000));
          }
        }
      }

      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log(`\nDone! Generated ${Object.keys(data).length}/${total} combinations.`);
  console.log(`Output: ${OUTPUT_PATH}`);
}

main().catch(console.error);
