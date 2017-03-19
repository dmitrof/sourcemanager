/**
 * Created by Дмитрий on 18.03.2017.
 */
const assert = require('assert');

function resolveAfter1Seconds(x) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(x);
        }, 1000);
    });
}

function rejectResult() {
    return new Promise((resolve, reject) => {
       reject('aaaa');
    });
}

async function giveResult() {
    return await rejectResult;

}

async function getResult() {
    try {
        var result = await rejectResult();
        console.log(result);
    }
    catch (err) {
        console.log(err);
    }
}

async function awaitResultAndReturn(x) {
    var result = await resolveAfter1Seconds(x);
    if (result > 0) {
        return true;
    }
    if (result < 0) {
    }
    return false;

}

async function biggerThanNull() {
    var result = await awaitResultAndReturn(1);
    console.log(result);
    var result2 = await awaitResultAndReturn(-1);
    console.log(result2);
    var [result3, result4] = await Promise.all([awaitResultAndReturn(-5), awaitResultAndReturn(6)])
    console.log(result3); console.log(result4);

}

//getResult();
biggerThanNull();