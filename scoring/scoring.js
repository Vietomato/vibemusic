// ================================================
// VIBE MUSIC - Scoring Algorithm (Implicit Feedback)
// Author: Nguyen
// ================================================

const SCORE_CONFIG = {
  PLAY: [
    { minRatio: 0.8,  score: 4 },
    { minRatio: 0.5,  score: 2 },
    { minRatio: 0.2,  score: 1 },
    { minRatio: 0,    score: 0 },
  ],
  PAUSE: [
    { minRatio: 0.5,  score: 2 },
    { minRatio: 0,    score: 0 },
  ],
  PREV: [
    { minRatio: 0.5,  score: 5 },
    { minRatio: 0,    score: 1 },
  ],
  NEXT: [
    { minRatio: 0.5,  score: 0  },
    { minRatio: 0.2,  score: -1 },
    { minRatio: 0,    score: -2 },
  ],
};

// --- TÍNH ĐIỂM 1 INTERACTION ---
function calcInteractionScore(action_type, played_duration_ms, track_duration_ms) {
  const tiers = SCORE_CONFIG[action_type];
  if (!tiers) return 0;

  const ratio = track_duration_ms > 0 ? played_duration_ms / track_duration_ms : 0;

  for (const tier of tiers) {
    if (ratio >= tier.minRatio) return tier.score;
  }
  return 0;
}

// --- TÍNH ĐIỂM TỔNG THEO TỪNG BÀI ---
function calcTrackScores(interactions, tracks) {
  const trackMap = {};
  for (const t of tracks) trackMap[t.track_id] = t;

  const scoreMap = {};
  for (const row of interactions) {
    const { user_id, track_id, action_type, played_duration_ms } = row;
    const track = trackMap[track_id];
    if (!track) continue;

    const key = `${user_id}__${track_id}`;
    if (!scoreMap[key]) {
      scoreMap[key] = {
        user_id,
        track_id,
        title: track.title,
        artist: track.artist,
        score: 0,
        interaction_count: 0
      };
    }
    scoreMap[key].score += calcInteractionScore(action_type, played_duration_ms, track.duration_ms);
    scoreMap[key].interaction_count += 1;
  }

  return Object.values(scoreMap).sort((a, b) => b.score - a.score);
}

// --- TOP N BÀI CHO 1 USER ---
function getTopTracksForUser(user_id, interactions, tracks, topN = 10) {
  const userInteractions = interactions.filter(i => i.user_id === user_id);
  return calcTrackScores(userInteractions, tracks).slice(0, topN);
}

module.exports = { calcInteractionScore, calcTrackScores, getTopTracksForUser, SCORE_CONFIG };