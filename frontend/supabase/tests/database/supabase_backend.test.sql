begin;
select plan(2); -- only one statement to run

select has_table('users'); #checks if there is a users table

select has_table('tasks'); #checks if there is a tasks table

select has_column( 'tasks', 'id' );  # test that the "id" column exists in the "users" table
select col_is_pk( 'tasks', 'id' );   # test that the "id" column is a primary key
select col_is_fk( 'tasks', 'user_id' );   # test that the "user_id" column is a foreign key


select * from finish();
rollback;