-- bcrypt hash gerado em Node.js para "admin123456"
-- você pode substituir por outro, se estiver usando rounds diferentes
DO $$
DECLARE
  loja_row RECORD;
  senha_hash TEXT := '$2b$10$WIa5Gh8YkSKrGbsAi.lE6OJbdZNHqzYIQaxIWVQzAtHs9sHUvmHlS'; --admin123456
BEGIN
  FOR loja_row IN SELECT * FROM "Loja" LOOP
    IF NOT EXISTS (
      SELECT 1 FROM "Usuario" 
      WHERE loja_id = loja_row.id AND is_admin = true
    ) THEN
      INSERT INTO "Usuario" (id, loja_id, nome, email, senha_hash, is_admin)
      VALUES (
        gen_random_uuid(),
        loja_row.id,
        'admin' || replace(loja_row.nome, ' ', ''),
        'admin@' || replace(lower(loja_row.nome), ' ', '') || '.com',
        senha_hash,
        true
      );
    END IF;
  END LOOP;
END $$;
