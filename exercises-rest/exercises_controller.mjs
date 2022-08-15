import 'dotenv/config';
import * as exercises from './exercises_model.mjs';
import express from 'express';

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

function isDateValid(date) {
    const format = /^\d\d-\d\d-\d\d$/;
    return format.test(date);
}

/**
 * 
 * validate reps/weight value
 * Have to convert from string because html inputs automatically make it a string. 
 */
function isValidNum(value) {
    if(isNaN(value)) {
        return false;
    }
    
    const number = Number.parseFloat(value);
    if(!Number.isInteger(number)) {
        return false;
    }
    return number > 0;
}

function isValidName(name) {
    if(typeof(name) !== "string") {
        return false;
    }
    else if(name === null) {
        return false;
    }
    return name.length > 0;
}

function isValidUnit(unit) {
    const units = {'kgs': 0, 'lbs': 0}
    return unit in units;
}

/**
 * Create a new exercise with the  provided in the body
 */
app.post('/exercises', (req, res) => {
    exercises.createExercise(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
        .then(exercise => {
            res.status(201).json(exercise);
        })
        .catch(error => {
            console.error(error);
            // In case of an error, send back status code 400 in case of an error.
            // A better approach will be to examine the error and send an
            // error status code corresponding to the error.
            res.status(400).json({ Error: 'Invalid request' });
        });
});

/**
 * Retrieve exercises. 
 * 
 */
 app.get('/exercises', (req, res) => {
    const filter = {};
    exercises.findExercise(filter, '', 0)
        .then(exercises => {
            res.send(exercises);
        })
        .catch(error => {
            console.error(error);
            res.send({ Error: 'Request failed' });
        });

});

/**
 * Retrive the exercise corresponding to the ID provided in the URL.
 */
 app.get('/exercises/:_id', (req, res) => {
    const exerciseId = req.params._id;
    exercises.findExerciseById(exerciseId)
        .then(exercise => { 
            if (exercise !== null) {
                res.json(exercise);
            } else {
                res.status(404).json({ Error: "Not found" });
            }         
         })
        .catch(error => {
            res.status(400).json({ Error: "Invalid request" });
        });
});

/**
 * Update the exercise
 */
 app.put('/exercises/:_id', (req, res) => {

    let isValid = (isValidUnit(req.body.unit) && isValidName(req.body.name) && isDateValid(req.body.date) 
    && isValidNum(req.body.reps) && isValidNum(req.body.weight));
    
    if(isValid === false) {
        res.status(400).json({ Error: 'Invalid request' });
    }

    else {
        exercises.replaceExercise(req.params._id, req.body.name, req.body.reps, req.body.weight, req.body.unit,
            req.body.date)
            .then(numUpdated => {
                if (numUpdated === 1) {
                    res.json({ _id: req.params._id, name: req.body.name, reps: req.body.reps, 
                        weight: req.body.weight, unit: req.body.unit, date: req.body.date })
                } else {
                    res.status(404).json({ Error: 'Not found' });
                }
            })
            .catch(error => {
                console.error(error);
                res.status(400).json({ Error: 'Invalid request' });
            });
        }
});

/**
 * Delete the exercise whose id is provided in the query parameters
 */
 app.delete('/exercises/:_id', (req, res) => {
    exercises.deleteById(req.params._id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'Not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ error: 'Request failed' });
        });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});