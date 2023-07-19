const { validationResult, matchedData } = require('express-validator');
const { findAllPolicyholders, findPolicyholderById, insertPolicyholder } = require('./db.js');

function getAllPolicyholders(_req, res) {
  const policyholders = findAllPolicyholders();
  return res.json(policyholders);
}

function createPolicyholder(req, res) {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(400).json(validation.array());
  }
  const newPolicyholder = matchedData(req); // req.body validado

  if (findPolicyholderById(newPolicyholder.id)) {
    return res.status(400).json([
      {
        type: 'field',
        value: newPolicyholder.id,
        path: 'policyholderId',
        msg: `Policyholder with id=${newPolicyholder.id} already created`,
        location: 'params',
      },
    ]);
  }

  const createdPolicyholder = insertPolicyholder(newPolicyholder);
  return res.status(201).json(createdPolicyholder);
}

function getPolicyholderById(req, res) {
  console.log('req')
  console.log(req.params)

  const newPolicyholder = matchedData(req);
  const policyholders = findPolicyholderById(newPolicyholder.policyholderId);

  if (!policyholders) {
    return res.status(404).json();
  }

  
  console.log(policyholders)

  
  return res.json(policyholders);
}

module.exports = {
  getAllPolicyholders,
  getPolicyholderById,
  createPolicyholder,
};
