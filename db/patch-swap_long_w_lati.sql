ALTER TABLE  `solar_prediction_coordinates` CHANGE  `longitude`  `longitude_temp` DOUBLE NOT NULL;
ALTER TABLE  `solar_prediction_coordinates` CHANGE  `latitude`  `longitude` DOUBLE NOT NULL;
ALTER TABLE  `solar_prediction_coordinates` CHANGE  `longitude_temp`  `latitude` DOUBLE NOT NULL;
