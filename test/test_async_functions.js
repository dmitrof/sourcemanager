/**
 * Created by Дмитрий on 18.03.2017.
 */
const assert = require('assert');

function resolveAfter2Seconds(x) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(x);
        }, 2000);
    });
}

async function getAsync() {
    var a = await resolveAfter2Seconds(10);
    console.log(a);
    return a;
}

var asyncResult = getAsync();
