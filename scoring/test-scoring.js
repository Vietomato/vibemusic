// ================================================
// TEST - Scoring Algorithm (dùng mock data Excel)
// Chạy: node test-scoring.js
// ================================================

const XLSX = require('xlsx');
const path = require('path');
const { calcInteractionScore, calcTrackScores, getTopTracksForUser } = require('./scoring');

function loadExcel(filename) {
  const wb = XLSX.readFile(path.join(__dirname, filename));
  const ws = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(ws);
}

const interactions = loadExcel('Interactions.xlsx');
const tracks       = loadExcel('Tracks.xlsx');

console.log(`Đã load ${interactions.length} interactions, ${tracks.length} tracks\n`);

// --- TEST LOGIC TỪNG TRƯỜNG HỢP ---
console.log('====== TEST calcInteractionScore ======');
console.log('PLAY  ≥80%:', calcInteractionScore('PLAY',  200000, 240000)); // kỳ vọng: 4
console.log('PLAY  50%: ', calcInteractionScore('PLAY',  120000, 240000)); // kỳ vọng: 2
console.log('PLAY  20%: ', calcInteractionScore('PLAY',   50000, 240000)); // kỳ vọng: 1
console.log('PLAY  <20%:', calcInteractionScore('PLAY',   10000, 240000)); // kỳ vọng: 0
console.log('PAUSE ≥50%:', calcInteractionScore('PAUSE', 130000, 240000)); // kỳ vọng: 2
console.log('PAUSE <50%:', calcInteractionScore('PAUSE',  50000, 240000)); // kỳ vọng: 0
console.log('PREV  ≥50%:', calcInteractionScore('PREV',  130000, 240000)); // kỳ vọng: 5
console.log('PREV  <50%:', calcInteractionScore('PREV',   50000, 240000)); // kỳ vọng: 1
console.log('NEXT  ≥50%:', calcInteractionScore('NEXT',  130000, 240000)); // kỳ vọng: 0
console.log('NEXT  20%: ', calcInteractionScore('NEXT',   50000, 240000)); // kỳ vọng: -1
console.log('NEXT  <20%:', calcInteractionScore('NEXT',   10000, 240000)); // kỳ vọng: -2

// --- TOP 10 TOÀN HỆ THỐNG ---
console.log('\n====== TOP 10 BÀI ĐƯỢC YÊU THÍCH NHẤT (toàn hệ thống) ======');
const allScores = calcTrackScores(interactions, tracks);
allScores.slice(0, 10).forEach((t, i) => {
  console.log(`#${i+1} [${t.score} điểm] ${t.title} - ${t.artist}`);
});

// --- TOP 5 USER U001 ---
console.log('\n====== TOP 5 BÀI CỦA USER U001 ======');
getTopTracksForUser('U001', interactions, tracks, 5).forEach((t, i) => {
  console.log(`#${i+1} [${t.score} điểm] ${t.title} - ${t.artist}`);
});