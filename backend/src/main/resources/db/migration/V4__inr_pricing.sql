-- menu was seeded in USD-scale numbers by mistake, this is Rupees. update not insert since
-- V2 already ran wherever this has actually been deployed.

update menu_items set price = 120.00 where id = '11111111-1111-1111-1111-111111111105'; -- Vegetable Samosa
update menu_items set price = 220.00 where id = '11111111-1111-1111-1111-111111111106'; -- Chicken Tikka
update menu_items set price = 320.00 where id = '11111111-1111-1111-1111-111111111107'; -- Butter Chicken
update menu_items set price = 280.00 where id = '11111111-1111-1111-1111-111111111108'; -- Paneer Tikka Masala
update menu_items set price = 180.00 where id = '22222222-2222-2222-2222-222222222205'; -- Bruschetta
update menu_items set price = 220.00 where id = '22222222-2222-2222-2222-222222222206'; -- Caprese Salad
update menu_items set price = 340.00 where id = '22222222-2222-2222-2222-222222222207'; -- Spaghetti Carbonara
update menu_items set price = 310.00 where id = '22222222-2222-2222-2222-222222222208'; -- Pappardelle al Funghi
