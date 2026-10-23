import { roadmaps } from "../data/roadmaps";

export const getStats = (progressList, id) => {
  const valid = new Set(roadmaps[id].nodes.map((n) => n.id));
  const p = progressList.find((x) => x.roadmapId === id);
  const done = p
    ? new Set(p.completedTopics.map((t) => t.topicId).filter((t) => valid.has(t))).size
    : 0;
  const total = roadmaps[id].nodes.length;
  return { done, total, pct: Math.min(100, Math.round((done / total) * 100)) };
};