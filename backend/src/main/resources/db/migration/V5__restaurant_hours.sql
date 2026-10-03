-- nullable on purpose - a restaurant that hasnt set hours yet just doesnt show any,
-- rather than forcing every future insert to guess a default.
alter table restaurants add column opens_at time;
alter table restaurants add column closes_at time;

update restaurants set opens_at = '11:00', closes_at = '22:30' where id = '11111111-1111-1111-1111-111111111102'; -- Tandoor & Vine
update restaurants set opens_at = '11:30', closes_at = '23:00' where id = '22222222-2222-2222-2222-222222222202'; -- Bella Cucina
