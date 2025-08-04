-- Migration: Create shared_lists table
-- This table stores shareable task lists for Phase 3 features

CREATE TABLE IF NOT EXISTS shared_lists (
  id SERIAL PRIMARY KEY,
  token VARCHAR(255) UNIQUE NOT NULL,
  task_ids INTEGER[] DEFAULT '{}', -- Array of task IDs
  expires_at TIMESTAMP,
  password_hash VARCHAR(255), -- Optional password protection
  access_count INTEGER DEFAULT 0, -- Track how many times accessed
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shared_lists_token ON shared_lists(token);
CREATE INDEX IF NOT EXISTS idx_shared_lists_expires_at ON shared_lists(expires_at);
CREATE INDEX IF NOT EXISTS idx_shared_lists_created_at ON shared_lists(created_at);

-- Create GIN index for task_ids array
CREATE INDEX IF NOT EXISTS idx_shared_lists_task_ids ON shared_lists USING GIN(task_ids);

-- Create trigger to update updated_at timestamp
DROP TRIGGER IF EXISTS update_shared_lists_updated_at ON shared_lists;
CREATE TRIGGER update_shared_lists_updated_at 
    BEFORE UPDATE ON shared_lists 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to clean up expired shared lists
CREATE OR REPLACE FUNCTION cleanup_expired_shared_lists()
RETURNS void AS $$
BEGIN
    DELETE FROM shared_lists 
    WHERE expires_at < NOW() 
    AND expires_at IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- Note: In production, you might want to set up a scheduled job to run this cleanup function
-- periodically, e.g., using pg_cron or a similar scheduling tool.
