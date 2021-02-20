-- STEP 1
DROP DATABASE IF EXISTS foodfy;

-- STEP 2
CREATE DATABASE foodfy;

-- STEP 3
-- Access foodfy database and then execute the Step 4

-- STEP 4
CREATE TABLE files (
  id SERIAL PRIMARY KEY,
  name TEXT,
  path TEXT NOT NULL
);

CREATE TABLE chefs (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  file_id INT REFERENCES files (id),
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW()),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW())
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  reset_token TEXT,
  reset_token_expires TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW()),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW())
);

CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  chef_id INT NOT NULL REFERENCES chefs (id),
  user_id INT NOT NULL REFERENCES users (id),
  title TEXT NOT NULL,
  ingredients TEXT[],
  preparation TEXT[],
  information TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW()),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW())
);

CREATE TABLE recipe_files (
  id SERIAL PRIMARY KEY,
  recipe_id INT NOT NULL REFERENCES recipes (id),
  file_id INT NOT NULL REFERENCES files (id)
);

ALTER TABLE recipe_files DROP CONSTRAINT recipe_files_recipe_id_fkey;
ALTER TABLE recipe_files ADD CONSTRAINT recipe_files_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE;

ALTER TABLE recipe_files DROP CONSTRAINT recipe_files_file_id_fkey;
ALTER TABLE recipe_files ADD CONSTRAINT recipe_files_file_id_fkey FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE;

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = NOW();
	RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp BEFORE UPDATE ON chefs FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp BEFORE UPDATE ON recipes FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();