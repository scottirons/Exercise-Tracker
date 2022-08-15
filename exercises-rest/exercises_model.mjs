import mongoose from 'mongoose';
import 'dotenv/config';

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);


// Connect to to the database
const db = mongoose.connection;
// The open event is called when the database connection successfully opens
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

/**
 * Define the schema
 */
const exerciseSchema = mongoose.Schema({
    name: { type: String, required: true, minLength: 1 },
    reps: { type: Number, required: true, min: 1 }, 
    weight: { type: Number, required: true, min: 1 },
    unit: { type: String, required: true, enum: ['kgs', 'lbs'] },
    date: { type: String, required: true, validate: {
        validator: function(v) {
          return /^\d\d-\d\d-\d\d$/.test(v);
        }}}
});

/**
 * Compile the model from the schema. This must be done after defining the schema.
 */
const Exercise = mongoose.model("Exercise", exerciseSchema);

const createExercise = async (name, reps, weight, unit, date) => {
    const exercise = new Exercise({ name: name, reps: reps, weight: weight, unit: unit, date: date });
    return exercise.save();
}

const findExercise = async (filter) => {
    const query = Exercise.find(filter);
    return query.exec();
}

const findExerciseById = async (_id) => {
    const query = Exercise.findById(_id);
    return query.exec();
}

const replaceExercise = async (_id, name, reps, weight, unit, date) => {
    const result = await Exercise.replaceOne({ _id: _id }, { name: name, reps: reps, weight: weight, unit: unit,
    date: date });
    return result.modifiedCount;
}

const deleteById = async (_id) => {
    const result = await Exercise.deleteMany({_id});
    return result.deletedCount;
}

export { createExercise, findExercise, findExerciseById, replaceExercise, deleteById }