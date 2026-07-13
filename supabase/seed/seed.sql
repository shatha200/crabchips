-- AUTO-GENERATED from crabchips/src/lib/site-data.ts — do not hand edit.

insert into public.restaurants (id, slug, name, description, address, phone, whatsapp, instagram, maps_url, rating, review_count)
values (
  '00000000-0000-0000-0000-000000000001',
  'crab-and-chips',
  'Crab & Chips',
  'Fruits de mer, pizzas et grillades — Tunis',
  'Tunisie',
  '+216 24 483 600',
  'https://wa.me/21624483600',
  'https://www.instagram.com/crab.and.chips/',
  'https://maps.app.goo.gl/7EnNBAMpAB87TkTu5',
  4.7,
  142
)
on conflict (id) do nothing;

insert into public.categories (id, restaurant_id, name, sort_order)
values ('00000000-0000-0000-0000-0000000001', '00000000-0000-0000-0000-000000000001', 'Entrées Chaudes', 0)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-001001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000001', 'Brik thon', 'بريك تن', NULL, 6, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-001002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000001', 'Brik fruits de mer', 'بريك بغلال البحر', NULL, 7.5, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-001003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000001', 'Tchich fruits de mer', 'تشيش بغلال البحر', NULL, 12, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-001004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000001', 'Bisque de crabes et de crevettes', 'بيسك سلطعون وجمبري', NULL, 12, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-001005', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000001', 'Chorba fruits de mer', NULL, NULL, 24, true)
on conflict (id) do nothing;

insert into public.categories (id, restaurant_id, name, sort_order)
values ('00000000-0000-0000-0000-0000000002', '00000000-0000-0000-0000-000000000001', 'Entrées Froides et Salades', 1)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-002001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000002', 'Salade de crevettes sautées', 'سلطة جمبري', 'Mesclun de salade, crevettes sautées, fromage, betteraves, graines de chia', 26, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-002002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000002', 'Salade César aux crevettes panées', 'سلطة سيزار بالجمبري', 'Mesclun de salade, crevettes panées, fromage, croûtons, sauce César', 28, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-002003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000002', 'Carpaccio poulpe', 'كارباتشيو الأخطبوط', NULL, 32, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-002004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000002', 'Salade Océana', 'سلطة غلال البحر', 'Sauce du chef, mesclun de salade, fruits de mer, persil, poivrons', 32, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-002005', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000002', 'Salade poulpe', 'سلطة الأخطبوط', 'Sauce du chef, mesclun de salade, poulpe, persil, poivrons', 45, true)
on conflict (id) do nothing;

insert into public.categories (id, restaurant_id, name, sort_order)
values ('00000000-0000-0000-0000-0000000003', '00000000-0000-0000-0000-000000000001', 'Box Tapas', 2)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-003001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000003', 'Box calamars panés', 'كالماري ذهبي', 'Calamars panés, riz parfumé, sauces, frites', 25, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-003002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000003', 'Box fish and chips', 'فيليه سمك وشيبس', 'Bâtonnets de merlan, riz parfumé, sauces, frites', 28, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-003003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000003', 'Box crevettes panées', 'جمبري مقرمش', 'Crevettes panées, riz parfumé, sauces, frites', 28, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-003004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000003', 'Cocotte moules et frites', 'كوكوت بلح البحر', NULL, 32, true)
on conflict (id) do nothing;

insert into public.categories (id, restaurant_id, name, sort_order)
values ('00000000-0000-0000-0000-0000000004', '00000000-0000-0000-0000-000000000001', 'Grillades', 3)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-004001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000004', 'Poisson complet grillé', 'سمكة مشوية', NULL, 29, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-004002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000004', 'Calamars grillés', 'كالمار مشوي', NULL, 38, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-004003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000004', 'Crevettes royales grillées', 'جمبري جمبو مشوي', NULL, 47, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-004004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000004', 'Grillades mixtes', 'مشاوي مشكلة', 'Calamars, poisson, moules et crevettes', 65, true)
on conflict (id) do nothing;

insert into public.categories (id, restaurant_id, name, sort_order)
values ('00000000-0000-0000-0000-0000000005', '00000000-0000-0000-0000-000000000001', 'Piano du Chef', 4)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-005001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000005', 'Gratin aux fruits de mer', 'جراتان بغلال البحر', NULL, 38, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-005002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000005', 'Saumon à la crème', 'سلمون بالصلصة البيضاء', NULL, 45, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-005003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000005', 'Crab and Chips', NULL, 'Crevettes, poisson, pinces de crabes et calamars panés', 65, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-005004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000005', 'Symphonie Kerkennaise', 'غلال البحر مشوح بالثوم', 'Fruits de mer sautés à l''ail', 79, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-005005', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000005', 'Stal Chi5a Duo', 'سطل شيخة', 'Crevettes, crabes, moules, seiches façon seafood boil', 89, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-005006', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000005', 'Sinia BaHar Duo', 'صينية البحار', 'Dorades, crevettes grillées sautées et panées, calamars panés, crabes et riz basmati', 120, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-005007', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000005', 'Stal Chi5a Familiale', 'سطل شيخة عائلية', 'Crevettes, crabes, moules, seiches crémés', 159, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-005008', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000005', 'Sinia Rais Familiale', 'صينية الريس', 'Poissons panés, crevettes panées grillées et sautées, crabes et klaya Kerkennaise', 220, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-005009', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000005', 'Sinia Jazira Duo', 'صينية الجزيرة', 'Poisson, calamars et crevettes grillés', 149, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-005010', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000005', 'Sinia Crab & Chips', 'صينية رويال', 'Royal platter à la demande, poissons panés, crevettes panées grillées et sautées, crabes, langouste 0.5kg et plus, et klaya Kerkennaise', 400, true)
on conflict (id) do nothing;

insert into public.categories (id, restaurant_id, name, sort_order)
values ('00000000-0000-0000-0000-0000000006', '00000000-0000-0000-0000-000000000001', 'Pasta', 5)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-006001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000006', 'Pasta Marina', 'باستا بغلال البحر', 'Spaghetti, sauce tomate, fruits de mer', 38, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-006002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000006', 'Paella Del Mare', 'بيلا بغلال البحر', 'Riz basmati, fruits de mer', 38, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-006003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000006', 'Pasta Boutargue', NULL, 'Tagliatelles, seiche et boutargue', 43, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-006004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000006', 'Pasta Rosa', 'باستا سلمون وجمبري', 'Pasta, sauce rosée, chair de crabe, saumon et crevettes', 47, true)
on conflict (id) do nothing;

insert into public.categories (id, restaurant_id, name, sort_order)
values ('00000000-0000-0000-0000-0000000007', '00000000-0000-0000-0000-000000000001', 'Pizzas Classiques', 6)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-007001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000007', 'Margherita', NULL, 'Sauce tomate, mozzarella, tomates séchées, huile d''olive', 17, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-007002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000007', 'Végétarienne', NULL, 'Sauce tomate, mozzarella, légumes sautés, roquette, champignons', 19, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-007003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000007', 'Sicilienne', NULL, 'Sauce tomate, mozzarella, anchois, citron, tomates séchées, oignons', 20, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-007004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000007', 'Pepperoni', NULL, 'Sauce tomate, mozzarella, pepperoni', 20, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-007005', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000007', 'Altuno', NULL, 'Sauce tomate, mozzarella, thon, câpre, oignons', 20, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-007006', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000007', 'Suprême', NULL, 'Sauce au choix, mozzarella, suprême poulet, champignon', 23, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-007007', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000007', 'Picante', NULL, 'Sauce tomate, poivrons, mozzarella, huile piquante, chorizo', 23, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-007008', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000007', '5 Fromages', NULL, 'Sauce blanche, gruyère, fromage bleu, parmesan, mozzarella, pistaches, gouda', 28, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-007009', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000007', 'Bresaola', NULL, 'Sauce tomate, mozzarella, bresaola, tomates séchées', 28, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-007010', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000007', 'Mexicano', NULL, 'Sauce tomate, mozzarella, viande hachée, poivrons', 31, true)
on conflict (id) do nothing;

insert into public.categories (id, restaurant_id, name, sort_order)
values ('00000000-0000-0000-0000-0000000008', '00000000-0000-0000-0000-000000000001', 'Pizzas Spécialités', 7)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-008001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000008', 'Crevetta', NULL, 'Sauce blanche, crevettes, champignons, gruyère', 29, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-008002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000008', 'L''océan', NULL, 'Sauce tomate, mozzarella, seiche, calamars, crevettes, moules', 32, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-008003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000008', 'Kerkennaise', NULL, 'Sauce maison, klaya aux fruits de mer', 42, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-008004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000008', 'L''octopus', NULL, 'Sauce pesto, mozzarella, burrata, poulpe', 45, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-008005', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000008', 'Pizza Roulette Terre et Mer Familiale', NULL, 'Crevettes, pepperoni, mélange de 5 fromages, thon', 85, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-008006', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000008', 'Crab and Chips Familiale', NULL, 'Sauce tomate, fruits de mer, klaya Kerkennaise', 99, true)
on conflict (id) do nothing;

insert into public.categories (id, restaurant_id, name, sort_order)
values ('00000000-0000-0000-0000-0000000009', '00000000-0000-0000-0000-000000000001', 'Boissons et Desserts', 8)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-009001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000009', 'Eau minérale', NULL, NULL, 3, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-009002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000009', 'Boisson gazeuse en canette', NULL, NULL, 3.5, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-009003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000009', 'Jus', NULL, NULL, 5, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-009004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000009', 'Parfait amande', NULL, NULL, 12, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-009005', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000009', 'Parfait citron', NULL, NULL, 12, true)
on conflict (id) do nothing;

insert into public.dishes (id, restaurant_id, category_id, name, name_ar, description, price, is_available)
values ('00000000-0000-0000-0001-009006', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000009', 'Sorbet citron', NULL, 'Deux boules de glace', 7, true)
on conflict (id) do nothing;

