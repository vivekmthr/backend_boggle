var boggle = require('node-boggle-solver');

var solver = boggle();

const solve = (bgrid) => {
    return solver.solve(bgrid.join(""), function(err, result) {
        return result.list;
    });
}

const five_and_up_solve = (bgrid) => {
    let five_and_up = [];

    const push = (results) => {
        for (let i = 0; i < results.length; i++) {
            five_and_up.push(results[i])
        }
    }

    solver.solve(bgrid.join(""), function(err, result) {
        push(result.lengthOf(5))
        push(result.lengthOf(6))
        push(result.lengthOf(7))
        push(result.lengthOf(8))
    });

    return five_and_up;
}



module.exports = {
    solve: solve,
    five_and_up_solve: five_and_up_solve,
};