const figlet = require('figlet');
const questions = require("./scripts/questions");


figlet('Employee CMS', function (err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
    questions.init();
});

console.log('Welcome to the Employee Database')




