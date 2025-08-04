-- Migration: Create tasks table
-- This table stores all user tasks with full feature support

CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  is_completed BOOLEAN DEFAULT FALSE,
  due_date TIMESTAMP,
  order_index INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}', -- Array of tag strings
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_title ON tasks(title);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_is_completed ON tasks(is_completed);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_category_id ON tasks(category_id);
CREATE INDEX IF NOT EXISTS idx_tasks_order_index ON tasks(order_index);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);

-- Create GIN index for tags array for better search performance
CREATE INDEX IF NOT EXISTS idx_tasks_tags ON tasks USING GIN(tags);

-- Create trigger to update updated_at timestamp
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON tasks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample tasks for development
INSERT INTO tasks (title, description, priority, is_completed, due_date, tags, category_id, order_index) VALUES 
  (
    'Complete project documentation', 
    'Write comprehensive documentation for the todo app project', 
    'high', 
    FALSE, 
    '2025-08-05 10:00:00',
    ARRAY['documentation', 'project'],
    (SELECT id FROM categories WHERE name = 'Work' LIMIT 1),
    0
  ),
  (
    'Buy groceries', 
    'Get vegetables, fruits, and dairy products', 
    'medium', 
    FALSE, 
    '2025-08-02 18:00:00',
    ARRAY['shopping', 'food'],
    (SELECT id FROM categories WHERE name = 'Shopping' LIMIT 1),
    1
  ),
  (
    'Morning exercise', 
    'Go for a 30-minute jog in the park', 
    'high', 
    FALSE, 
    '2025-08-01 07:00:00',
    ARRAY['exercise', 'health'],
    (SELECT id FROM categories WHERE name = 'Health' LIMIT 1),
    2
  ),
  (
    'Call family', 
    'Catch up with parents and siblings', 
    'medium', 
    TRUE, 
    NULL,
    ARRAY['family', 'personal'],
    (SELECT id FROM categories WHERE name = 'Personal' LIMIT 1),
    3
  ),
  (
    'Review code', 
    'Review pull requests and provide feedback', 
    'high', 
    FALSE, 
    '2025-08-01 16:00:00',
    ARRAY['code', 'review', 'urgent'],
    (SELECT id FROM categories WHERE name = 'Work' LIMIT 1),
    4
  )
ON CONFLICT DO NOTHING;
