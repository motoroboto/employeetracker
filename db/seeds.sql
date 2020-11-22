INSERT INTO department (name) values ('Science'); -- 1
INSERT INTO department (name) values ('Janitorial'); --  2
INSERT INTO department (name) values ('R&D'); --  3

INSERT INTO job (title, salary, department_id) values ('Head Scientist', 100000, 1); -- 1
INSERT INTO job (title, salary, department_id) values ('Lab Assistant', 40000, 1); -- 2
INSERT INTO job (title, salary, department_id) values ('Head of Sanitation', 35000, 2); -- 3
INSERT INTO job (title, salary, department_id) values ('Temp', 25000, 2); -- 4
INSERT INTO job (title, salary, department_id) values ('Pilot', 50000, 2); -- 5
INSERT INTO job (title, salary, department_id) values ('Research Assistant', 45000, 3); -- 6

INSERT INTO employee (first_name, last_name, job_id) values ('Clayton', 'Forrester', 1); 
INSERT INTO employee (first_name, last_name, job_id) values ('Joel', 'Robinson', 3); 
INSERT INTO employee (first_name, last_name, job_id, manager_id) values ('Frank', 'Conniff', 2, 1); 
INSERT INTO employee (first_name, last_name, job_id, manager_id) values ('Mike', 'Nelson', 4, 2); 
INSERT INTO employee (first_name, last_name, job_id, manager_id) values ('Jonah', 'Heston', 5, 2); 
INSERT INTO employee (first_name, last_name, job_id, manager_id) values ('Tom', 'Servo', 6, 2); 
INSERT INTO employee (first_name, last_name, job_id, manager_id) values ('Crow', 'Robot', 6, 2); 
