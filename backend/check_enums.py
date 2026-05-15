"""Quick check: do the enum values exist in the database?"""
from sqlalchemy import text
from database.connection import engine

conn = engine.connect()

# Check source_type enum
try:
    r = conn.execute(text("SELECT enumlabel FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'sourcetype')"))
    vals = [row[0] for row in r]
    print(f"source_type enum values: {vals}")
    if 'youtube_ai' not in vals:
        conn.execute(text("ALTER TYPE sourcetype ADD VALUE IF NOT EXISTS 'youtube_ai'"))
        print("  -> Added 'youtube_ai' to sourcetype enum")
except Exception as e:
    print(f"source_type check: {e}")

# Check recipe_status enum
try:
    r = conn.execute(text("SELECT enumlabel FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'recipestatus')"))
    vals = [row[0] for row in r]
    print(f"recipe_status enum values: {vals}")
except Exception as e:
    print(f"recipe_status check: {e}")

# Check ai_job_status enum  
try:
    r = conn.execute(text("SELECT enumlabel FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'aijobstatus')"))
    vals = [row[0] for row in r]
    print(f"ai_job_status enum values: {vals}")
except Exception as e:
    print(f"ai_job_status check: {e}")

conn.commit()
conn.close()
print("\nEnum check complete!")
