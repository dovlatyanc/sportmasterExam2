
INSERT INTO roles (name) VALUES
    ('ADMIN'),
    ('USER')
ON CONFLICT (name) DO NOTHING;

-- Категории
INSERT INTO categories (name) VALUES
    ('Обувь'),
    ('Одежда'),
    ('Аксессуары'),
    ('Инвентарь')
ON CONFLICT (name) DO NOTHING;