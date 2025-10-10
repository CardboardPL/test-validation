import { validateDataType } from "./helper/dataType.js";
import { isArray } from './helper/isArray.js';

const dict = {
    dataType: validateDataType,
    isArray: isArray,
};

function validate(paramObjArr, checkAllParams = false) {
    if (!Array.isArray(paramObjArr)) throw new Error('paramObjArr must be an array');
    if (typeof checkAllParams !== 'boolean') throw new Error('checkAllParams must be a boolean');

    const results = [];
    for (let i = 0; i < paramObjArr.length; i++) {
        const paramObj = paramObjArr[i];
        const checked = new Map();
        results[i] = { status: true, errors: {} };

        if (typeof paramObj.params !== 'object' || Array.isArray(paramObj.params)) throw new Error('paramObj.params must be an object');
        for (const param in paramObj.params) {
            const handlerFunc = dict[param];
            if (!handlerFunc) throw new Error(`${param} is an invalid parameter`);

            let isParamValid = true;
            const result = handlerFunc(paramObj.value, paramObj.params[param], checked);
            if (!result.status) {
                results[i].status = false;
                results[i].errors[param] = { param, message: result.message};
                isParamValid = false;
            }
            checked.set(param, isParamValid);

            if (!checkAllParams) break;
        }
    }

    return results;
}

/* Sample paramObjArr
[{
  value,
  params: {
    param1: val
  }
}]
*/