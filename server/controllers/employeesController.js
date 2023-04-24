const Employee = require('../model/Employee');
const expressAsyncHandler = require('express-async-handler');

//handle getAllEmployees
const getAllEmployees = expressAsyncHandler(async (req, res) => {
    const employees = await Employee.find();
    if (!employees) return res.status(204).json({ "message": " Request returned no data, add employees to database and try again" });
    res.json(employees);
});


//handle new employees
const createNewEmployee = expressAsyncHandler(async (req, res) => {
    If(!req?.body?.firstName || !req.body?.lastName); {
        return res.status(400).json({ "message": " Empty fields detected! cannot proceed" });
        try {
            const result = await Employee.create({ firstName: req.body.firstName, lastName: req.body.lastName });
            result ? res.status(201).json(result) : res.status(500);
        } catch (err) {
            throw new Error(err);
        }
    }
});



