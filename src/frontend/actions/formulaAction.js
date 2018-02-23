//formulaAction.js
import axios from 'axios';
import * as genericActions from './genericCrudAction'
//All the methods return the response on successful completion

const baseUrl = '/formulas';
const property = 'formula'; 

/* add one formula
 * formula: JSON object
 * sessionId: string, id of the current session
 */
async function addFormula(formula, sessionId, callback) {
	//return await genericActions.create(baseUrl,formula,sessionId);
	genericActions.create(baseUrl,formula,sessionId, function(res){
	    callback(res);
	})
};

/* 
 * get all formulas
 * deprecated, use getAllFormulasAsync instead
 */
 /*
function getAllFormulas() {
	return genericActions.getAll(baseUrl);
	
};
*/

/* 
 * get all formulas
 * sessionId: string, id of the current session
 */
async function getAllFormulasAsync(sessionId){
	return await genericActions.getAllAsync(baseUrl, sessionId);
};
/* 
 * get one formula
 * deprecated, use getFormulaAsync instead
 * formulaId: string, the id of the formula
 */
 /*
function getFormula(formulaId) {
	return genericActions.getById(formulaId, baseUrl.concat(property).concat('/'));
};
*/

/* 
 * get one formula
 * formulaId: string, the id of the formula
 * sessionId: string, id of the current session
 */
async function getFormulaAsync(formulaId, sessionId){
	return await genericActions.getByIdAsync(baseUrl, property, formulaId, sessionId);
};

/* 
 * update one formula
 * formulaId: string, the id of the formula
 * sessionId: string, id of the current session
 * formula: JSON object representing the updated info about the formula
 */
async function updateFormula(formulaId, sessionId, formula, callback) {
	//return await genericActions.updateById(baseUrl, property, formulaId, sessionId, formula);
	genericActions.updateById(baseUrl, property, formulaId, sessionId, formula, function(res){
	    callback(res);
	});
};

/* 
 * delete one existing formula
 * formulaId: string, the id of the formula
 * sessionId: string, id of the current session
 */
async function deleteFormula(formulaId, sessionId) {
	return await genericActions.deleteById(baseUrl, property, formulaId, sessionId);
};

async function checkoutFormula(formulaId, quantity, sessionId) {
	const checkoutSegment = '/checkout';
    //return await genericActions.deleteAll(baseUrl, checkoutSegment, sessionId);
    const res = await axios.delete(baseUrl+checkoutSegment+'/formula/'+formulaId+'/amount/'+quantity+'/user/'+sessionId);
    const result = res.data;
    console.log(result);
    return result;
};

//export functions above for use by other modules
export { addFormula, getAllFormulasAsync, getFormulaAsync, updateFormula, deleteFormula, checkoutFormula};