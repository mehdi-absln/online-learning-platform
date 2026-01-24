CREATE TABLE blogs (
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       title TEXT NOT NULL,
                       slug TEXT NOT NULL UNIQUE,
                       content TEXT NOT NULL,
                       excerpt TEXT,
                       cover_image TEXT,
                       status TEXT NOT NULL DEFAULT 'draft',
                       author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                       published_at INTEGER,
                       created_at INTEGER NOT NULL,
                       updated_at INTEGER NOT NULL
);

CREATE INDEX blogs_slug_idx ON blogs(slug);
CREATE INDEX blogs_author_id_idx ON blogs(author_id);
CREATE INDEX blogs_status_idx ON blogs(status);
