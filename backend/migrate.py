"""
One-time migration script to add missing columns to existing tables.
Run this once: python migrate.py
"""
from sqlalchemy import text
from database.connection import engine

migrations = [
    # ── ai_jobs table: Add new columns ──
    "ALTER TABLE ai_jobs ADD COLUMN IF NOT EXISTS video_title VARCHAR(500)",
    "ALTER TABLE ai_jobs ADD COLUMN IF NOT EXISTS video_description TEXT",
    "ALTER TABLE ai_jobs ADD COLUMN IF NOT EXISTS video_thumbnail TEXT",
    "ALTER TABLE ai_jobs ADD COLUMN IF NOT EXISTS video_duration_seconds INTEGER",
    "ALTER TABLE ai_jobs ADD COLUMN IF NOT EXISTS transcript TEXT",
    "ALTER TABLE ai_jobs ADD COLUMN IF NOT EXISTS raw_ai_response TEXT",
    "ALTER TABLE ai_jobs ADD COLUMN IF NOT EXISTS confidence_score NUMERIC(3,2)",
    "ALTER TABLE ai_jobs ADD COLUMN IF NOT EXISTS tokens_used INTEGER",
    "ALTER TABLE ai_jobs ADD COLUMN IF NOT EXISTS error_message TEXT",
    "ALTER TABLE ai_jobs ADD COLUMN IF NOT EXISTS recipe_id VARCHAR",

    # ── recipes table: Add AI tracking columns ──
    "ALTER TABLE recipes ADD COLUMN IF NOT EXISTS youtube_url TEXT",
    "ALTER TABLE recipes ADD COLUMN IF NOT EXISTS field_confidence JSONB",
    "ALTER TABLE recipes ADD COLUMN IF NOT EXISTS confidence_score NUMERIC(3,2)",

    # ── recipe_ingredients table: Add AI columns ──
    "ALTER TABLE recipe_ingredients ADD COLUMN IF NOT EXISTS confidence JSONB",
    "ALTER TABLE recipe_ingredients ADD COLUMN IF NOT EXISTS ai_note TEXT",

    # ── recipe_steps table: Add AI columns ──
    "ALTER TABLE recipe_steps ADD COLUMN IF NOT EXISTS confidence JSONB",
    "ALTER TABLE recipe_steps ADD COLUMN IF NOT EXISTS estimated_time_minutes INTEGER",

    # ── Make quantity nullable (was NOT NULL before) ──
    "ALTER TABLE recipe_ingredients ALTER COLUMN quantity DROP NOT NULL",
]

def run_migrations():
    with engine.connect() as conn:
        for sql in migrations:
            try:
                conn.execute(text(sql))
                print(f"  [OK] {sql[:60]}...")
            except Exception as e:
                print(f"  [SKIP] {sql[:60]}... -> {e}")
        conn.commit()
    print("\nAll migrations complete!")

if __name__ == "__main__":
    run_migrations()
