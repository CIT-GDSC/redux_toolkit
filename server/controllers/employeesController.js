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

const updateEmployee = expressAsyncHandler(async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ "message": " ID parameter not passed, cannot proceed" });

    }
    const employeeToUpdate = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employeeToUpdate) {
        res.status(204).json({"message": `The parameters with ID ${req.body.id} did not match any records`})
    }
    if (req.body?.firstName) employeeToUpdate.firstName = req.body.firstName;
    if (req.body?.lastName) employeeToUpdate.lastName = req.body.lastName;
    const result = await employeeToUpdate.save();
    res.json(result);
});

