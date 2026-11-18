
import db from "../config/database.js";

export const findAllItems = ({ limit, offset }) => {
  const items = db.prepare(`
    SELECT
      i.id,
      i.type,
      i.title,
      i.source_url,
      i.status,
      i.created_at,
      COUNT(c.id) AS chunk_count
    FROM items i
    LEFT JOIN chunks c ON c.item_id = i.id
    GROUP BY i.id
    ORDER BY i.created_at DESC, i.id DESC
    LIMIT ? OFFSET ?
  `).all(limit, offset);

  const total = db.prepare(`
    SELECT COUNT(*) AS total
    FROM items
  `).get().total;

  return {
    items: items.map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      sourceUrl: item.source_url,
      status: item.status,
      createdAt: item.created_at,
      chunkCount: item.chunk_count
    })),
    total
  };
};
