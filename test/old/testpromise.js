/**
 * Created by Дмитрий on 11.03.2017.
 */
var returnpromise = function(i) {
    return new Promise((resolve, reject) => {
        if (i == 1)
            resolve('yes');
        else reject('no');
    })
};


promises = [];
promises.push(returnpromise(2)); promises.push(returnpromise(1)); promises.push(returnpromise(1));


Promise.all(promises).then(resolve => {
    if (resolve)
    console.log(resolve);
}, reject => console.log(reject)
);
