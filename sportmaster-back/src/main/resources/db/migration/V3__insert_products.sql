INSERT INTO products (name, brand, size, color, price, stock, category_id)
SELECT * FROM (VALUES
    ('Кроссовки Nike Air Max', 'Nike', '42', 'Черный', 9999.00, 10, (SELECT id FROM categories WHERE name = 'Обувь')),
    ('Беговые кроссовки Adidas', 'Adidas', '43', 'Белый', 8499.00, 15, (SELECT id FROM categories WHERE name = 'Обувь')),
    ('Футболка хлопковая', 'Puma', 'M', 'Синий', 2499.00, 25, (SELECT id FROM categories WHERE name = 'Одежда')),
    ('Спортивные шорты', 'Nike', 'L', 'Черный', 3499.00, 20, (SELECT id FROM categories WHERE name = 'Одежда')),
    ('Спортивная бутылка', 'CamelBak', 'Универсальный', 'Синий', 1299.00, 30, (SELECT id FROM categories WHERE name = 'Аксессуары')),
    ('Фитнес-браслет', 'Xiaomi', 'Универсальный', 'Черный', 2999.00, 12, (SELECT id FROM categories WHERE name = 'Аксессуары')),
    ('Йога-коврик', 'Decathlon', '183x61 см', 'Фиолетовый', 1599.00, 8, (SELECT id FROM categories WHERE name = 'Инвентарь')),
    ('Гантели 2 кг', 'Torres', '2 кг', 'Черный', 1899.00, 5, (SELECT id FROM categories WHERE name = 'Инвентарь'))
) AS products(name, brand, size, color, price, stock, category_id)
ON CONFLICT (name) DO NOTHING;