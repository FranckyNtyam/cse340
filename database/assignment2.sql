--Assignment Tasks

-- 01 - Insert for table `account`
INSERT INTO account
(account_firstname, account_lastname, account_email, account_password)
VALUES
('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 02 - Update for table `account`
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 8;

-- 03 - Delete for table `account`
DELETE
FROM account
WHERE account_id = 8;

-- 04 - Update for table `inventory`
UPDATE inventory
SET
inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_id = 10;

-- 05 - Inner join for tables `inventory and classification`
SELECT inv_make, inv_model, classification_name
FROM
inventory INNER JOIN classification
ON classification.classification_id = 2;

-- 06 - Update columns for table `inventory`
UPDATE inventory
SET
inv_image = REPLACE(inv_image,'/images', '/images/vehicules'),
inv_thumbnail = REPLACE(inv_thumbnail,'/images', '/images/vehicules');