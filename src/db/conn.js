const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/registraionForm",{

}).then(() => {
    console.log("Databsase connection sucessful.. ");
}).catch((e) => {
    console.log(e);
})